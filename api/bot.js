import TelegramBot from 'node-telegram-bot-api';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../src/services/firebase.js';

const token = process.env.TELEGRAM_BOT_TOKEN || '8675852989:AAENDceZl9_kqhseO0k2s_5N8aMf9i6Lemk';
const bot = new TelegramBot(token, { polling: false });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message, callback_query } = req.body;

    if (message && message.text === '/start') {
      const webAppUrl = 'https://mini-app-pink-six.vercel.app';

      let text = "Assalomu alaykum! Ijaraga uy qidirish uchun quyidagi tugmani bosing \ud83d\udc47\n\n";
      text += `\ud83d\udee0 ADMIN ESLATMA: Sizning ID raqamingiz: ${message.chat.id}\n(Shu raqamni Vercel ADMIN_CHAT_ID ga kiritishingiz kerak)`;

      try {
        await bot.setChatMenuButton({
          chat_id: message.chat.id,
          menu_button: {
            type: "web_app",
            text: "Mini App 🏠",
            web_app: { url: webAppUrl }
          }
        });
      } catch (e) {
        console.error("Set chat menu button error:", e);
      }

      await bot.sendMessage(message.chat.id, text, {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Uylarni Ko\'rish \ud83c\udfd8', web_app: { url: webAppUrl } }]
          ]
        }
      });
    }

    if (callback_query) {
      const data = callback_query.data;
      const chatId = callback_query.message.chat.id;
      const messageId = callback_query.message.message_id;

      // Data format: action_propertyId_userId_bookingId
      const parts = data.split('_');
      const action = parts[0];
      const propertyId = parts[1];
      const customerId = parts[2];
      const bookingId = parts[3];

      const updateStatusMessage = async (newText) => {
        try {
          if (callback_query.message.photo) {
            await bot.editMessageCaption(newText, {
              chat_id: chatId,
              message_id: messageId
            });
          } else {
            await bot.editMessageText(newText, {
              chat_id: chatId,
              message_id: messageId
            });
          }
        } catch (e) {
          console.error("Edit message failed:", e);
        }
      };

      if (action === 'book') {
        try {
          // 1. Update property status
          const propRef = doc(db, 'properties', propertyId);
          await updateDoc(propRef, { isBooked: true });

          // 2. Update booking status if bookingId exists
          if (bookingId && bookingId !== '0') {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { status: 'approved' });
          }

          await updateStatusMessage("\u2705 Uy muvaffaqiyatli BAND QILINDI! (Mijozga xabar yuborildi)");

          // Mijozga (Userga) xabar yuborish
          if (customerId && customerId !== '0') {
            await bot.sendMessage(customerId, "🏠 Tabriklaymiz! Siz tanlagan uy muvaffaqiyatli band qilindi. Ilovada 'Mening buyurtmalarim' bo'limidan ko'rishingiz mumkin.");
          }
        } catch (err) {
          console.error("Firebase update failed:", err);
          await bot.sendMessage(chatId, "Xatolik yuz berdi: " + err.message);
        }
      }

      if (action === 'cancel') {
        try {
          // Update booking status if bookingId exists
          if (bookingId && bookingId !== '0') {
            const bookingRef = doc(db, 'bookings', bookingId);
            await updateDoc(bookingRef, { status: 'cancelled' });
          }

          await updateStatusMessage("\u274c Bu uy band qilinmadi (Bekor qilindi).");

          // Mijozga (Userga) rad etilgani haqida xabar
          if (customerId && customerId !== '0') {
            await bot.sendMessage(customerId, "😔 Uzr, siz so'ragan uy hozircha band qilib bo'linmadi. Boshqa uylarni ko'rishingiz mumkin.");
          }
        } catch (err) {
          console.error("Firebase update failed:", err);
        }
      }

      try {
        await bot.answerCallbackQuery(callback_query.id);
      } catch (e) { }
    }

    res.status(200).send('OK');
  } else {
    res.status(200).send('Bot xizmati Vercel Serverda ishlashga tayyor!');
  }
}
