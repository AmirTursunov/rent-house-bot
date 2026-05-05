const TelegramBot = require('node-telegram-bot-api');

// O'zingizning BotFather orqali olgan tokeningizni shu yerga qo'yasiz
const token = '8675852989:AAENDceZl9_kqhseO0k2s_5N8aMf9i6Lemk';
const bot = new TelegramBot(token, {polling: true});

// Vercel yoki biron joyga yuklangan ushbu loyihaning ssilkasi
const webAppUrl = 'https://mini-app-pink-six.vercel.app'; 

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if(text === '/start') {
    try {
      await bot.setChatMenuButton({
        chat_id: chatId,
        menu_button: {
          type: "web_app",
          text: "Mini App 🏠",
          web_app: { url: webAppUrl }
        }
      });
    } catch (e) {
      console.error("Menu button error:", e);
    }

    await bot.sendMessage(chatId, "Assalomu alaykum! Ijaraga uy qidirish uchun quyidagi tugmani bosing \ud83d\udc47", {
      reply_markup: {
        keyboard: [
          [{text: 'Uylarni Ko\'rish \ud83c\udfd8', web_app: {url: webAppUrl}}]
        ]
      }
    });

    // Inline button sifatida jo'natish xohlasangiz:
    // await bot.sendMessage(chatId, "Yoki bu tugma orqali:", {
    //   reply_markup: {
    //     inline_keyboard: [
    //       [{text: 'Mini Appga kirish', web_app: {url: webAppUrl}}]
    //     ]
    //   }
    // });
  }
});

console.log("Bot ishga tushdi...");
