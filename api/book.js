import TelegramBot from 'node-telegram-bot-api';

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../src/services/firebase.js';

const token = process.env.TELEGRAM_BOT_TOKEN || '8675852989:AAENDceZl9_kqhseO0k2s_5N8aMf9i6Lemk';
const bot = new TelegramBot(token, { polling: false });

// Hardcoded translations for backend since we don't have i18next initialized here
const translate = (key, lang, params = {}) => {
  const dictionary = {
    uz: {
      book_msg: "🚨 MIJOZDAN YANGI BAND QILISH SO'ROVI!\n\nManzil: {{city}}, {{street}}\nNarxi: ${{price}}/kun\nXonalar: {{rooms}} xona\nUy raqami (ID): {{id}}\n\nKirish sanasi: {{checkInDate}}\nChiqish sanasi: {{checkOutDate}}\nJami kun: {{totalDays}} kun\nUmumiy summa: ${{totalSum}}{{negotiable}}\n\nShu uy bo'shmi?",
      negotiable: " (Kelishiladi)",
      unknown: "Noma'lum"
    },
    ru: {
      book_msg: "🚨 НОВЫЙ ЗАПРОС НА БРОНИРОВАНИЕ!\n\nАдрес: {{city}}, {{street}}\nЦена: ${{price}}/день\nКомнаты: {{rooms}} комн.\nНомер квартиры (ID): {{id}}\n\nДата заезда: {{checkInDate}}\nДата выезда: {{checkOutDate}}\nВсего дней: {{totalDays}} дн.\nОбщая сумма: ${{totalSum}}{{negotiable}}\n\nКвартира свободна?",
      negotiable: " (Договорная)",
      unknown: "Неизвестно"
    },
    en: {
      book_msg: "🚨 NEW BOOKING REQUEST!\n\nAddress: {{city}}, {{street}}\nPrice: ${{price}}/day\nRooms: {{rooms}} rooms\nProperty ID: {{id}}\n\nCheck-in: {{checkInDate}}\nCheck-out: {{checkOutDate}}\nTotal days: {{totalDays}} days\nTotal sum: ${{totalSum}}{{negotiable}}\n\nIs this property available?",
      negotiable: " (Negotiable)",
      unknown: "Unknown"
    }
  };
  const t = dictionary[lang] || dictionary['en'];
  let text = t[key] || "";
  Object.keys(params).forEach(k => {
    text = text.replace(`{{${k}}}`, params[k]);
  });
  return text;
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { property, userId, checkInDate, checkOutDate, language = 'uz' } = req.body;

      // Save to Firestore
      let bookingId = null;
      try {
        const docRef = await addDoc(collection(db, 'bookings'), {
          propertyId: property.id,
          userId: String(userId),
          checkInDate: checkInDate || new Date().toISOString().split('T')[0],
          checkOutDate: checkOutDate || new Date().toISOString().split('T')[0],
          status: 'pending',
          createdAt: new Date().toISOString()
        });
        bookingId = docRef.id;
      } catch (dbError) {
        console.error("Firestore save failed:", dbError);
      }
      
      // ADMIN_CHAT_ID needs to be set in Vercel environment variables.
      const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID; 

      if (!ADMIN_CHAT_ID) {
        return res.status(500).json({ success: false, error: "Vercel da ADMIN_CHAT_ID sozlanmagan!" });
      }

      console.log("Sending booking notification to:", ADMIN_CHAT_ID);
      const specs = [
        `📏 Maydon: ${property.area} m²`,
        `🏢 Qavat: ${property.floor}/${property.total_floors}`,
        `💡 Xonalar: ${property.rooms}`,
        `💻 Yotoqxonalar: ${property.bedrooms}`,
        `🛌 Karavotlar: ${property.beds}`,
        `🚽 Sanuzel: ${property.bathrooms}`
      ].join('\n');

      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end - start;
      const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalSum = totalDays > 0 ? totalDays * property.price : 0;
      
      const unk = translate('unknown', language);
      const neg = property.isNegotiable ? translate('negotiable', language) : '';

      const text = translate('book_msg', language, {
        city: property.city,
        street: property.street,
        price: property.price,
        rooms: property.rooms,
        id: property.id,
        checkInDate: checkInDate || unk,
        checkOutDate: checkOutDate || unk,
        totalDays: totalDays > 0 ? totalDays : unk,
        totalSum: totalSum,
        negotiable: neg
      }) + `\n\n${specs}\nUser ID: ${userId || unk}`;
      
      const replyMarkup = {
        inline_keyboard: [
          [
            { text: "✅ Ha (Band qilish)", callback_data: `book_${property.id}_${userId || '0'}_${bookingId || '0'}` },
            { text: "❌ Yo'q (Bekor qilish)", callback_data: `cancel_${property.id}_${userId || '0'}_${bookingId || '0'}` }
          ]
        ]
      };

      try {
        const imageUrl = (property.images && property.images.length > 0) ? property.images[0] : 'https://via.placeholder.com/600';

        await bot.sendPhoto(ADMIN_CHAT_ID, imageUrl, {
          caption: text,
          reply_markup: replyMarkup
        });
      } catch (photoError) {
        console.error("sendPhoto failed, trying sendMessage:", photoError);
        // Fallback to text if photo fails - but THIS TIME WITH BUTTONS!
        await bot.sendMessage(ADMIN_CHAT_ID, text + "\n\n(Rasm yuborib bo'lmadi)", {
          reply_markup: replyMarkup
        });
      }

      res.status(200).json({ success: true });
    } catch (e) {
      console.error("Booking api generic error:", e);
      res.status(500).json({ 
        success: false, 
        error: e.message,
        details: "Bot orqali xabar yuborishda xatolik yuz berdi. ADMIN_CHAT_ID va Bot Tokenni tekshiring."
      });
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
