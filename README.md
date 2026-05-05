# Rent House Bot - Telegram Mini App 🏠

A premium Real Estate Rental Mini App built for Telegram, allowing users to browse, search, and book properties directly within their favorite messaging app.

## 🚀 Live Demo

- **Telegram Bot**: [@premium_houses_bot](https://t.me/premium_houses_bot)
- **Web Version**: [mini-app-pink-six.vercel.app](https://mini-app-pink-six.vercel.app)

## ✨ Features

- 📱 **Telegram Mini App Integration**: Seamless experience inside Telegram.
- 🔍 **Advanced Filtering**: Search properties by category, price, and location.
- 🌍 **Multilingual Support**: Available in Uzbek, Russian, and English.
- 📅 **Booking System**: Users can request bookings directly through the app.
- 👤 **User Profiles**: Manage bookings and personal settings.
- 🔐 **Admin Dashboard**: Specialized interface for property management and booking approvals.
- ⚡ **Real-time Updates**: Powered by Firebase Firestore.

## 🛠️ Tech Stack

- **Frontend**: React.js + Vite
- **Styling**: Vanilla CSS (Premium Custom Design)
- **Backend/Database**: Firebase (Firestore & Storage)
- **Bot Engine**: Node.js (Telegraf)
- **Deployment**: Vercel
- **Localization**: i18next

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Firebase Project
- Telegram Bot Token (from @BotFather)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AmirTursunov/rent-house-bot.git
   cd rent-house-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Create a `.env.local` file in the root and add your Firebase and Bot configurations:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   BOT_TOKEN=your_telegram_bot_token
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📦 Deployment

This project is optimized for deployment on **Vercel**. 
Simply connect your GitHub repository to Vercel and it will automatically handle the build and deployment process.

---
Developed by [Amir Tursunov](https://github.com/AmirTursunov)
