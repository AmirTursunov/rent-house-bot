import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TelegramRedirectModal = () => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if we are NOT inside Telegram WebApp
        // window.Telegram.WebApp.initData is empty when opened in a regular browser
        const isTelegram = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData;
        
        if (!isTelegram) {
            setIsVisible(true);
        }
    }, []);

    if (!isVisible) return null;

    return (
        <div className="tg-modal-overlay">
            <style>{`
                .tg-modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                    animation: fadeIn 0.3s ease-out;
                }
                .tg-modal-content {
                    background: var(--card-bg, rgba(30, 30, 40, 0.95));
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 24px;
                    padding: 40px 30px;
                    max-width: 400px;
                    width: 100%;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                }
                .tg-icon-circle {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #0088cc 0%, #00a2ff 100%);
                    border-radius: 50%;
                    margin: 0 auto 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 20px rgba(0, 136, 204, 0.3);
                }
                .tg-icon-circle svg {
                    width: 40px;
                    height: 40px;
                    fill: white;
                }
                .tg-modal-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: #fff;
                }
                .tg-modal-text {
                    font-size: 16px;
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 30px;
                }
                .tg-modal-btn {
                    display: block;
                    width: 100%;
                    padding: 16px;
                    background: #0088cc;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 14px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.2s ease;
                    border: none;
                    cursor: pointer;
                }
                .tg-modal-btn:hover {
                    background: #00a2ff;
                    transform: translateY(-2px);
                }
                .tg-modal-close {
                    margin-top: 15px;
                    background: transparent;
                    border: none;
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 14px;
                    cursor: pointer;
                    text-decoration: underline;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>
            
            <div className="tg-modal-content">
                <div className="tg-icon-circle">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.42-1.37-.89.03-.25.38-.51 1.03-.78 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.18z"/>
                    </svg>
                </div>
                <h3 className="tg-modal-title">Telegram Mini App</h3>
                <p className="tg-modal-text">
                    Ushbu ilova Telegram ichida ishlashga mo'ljallangan. 
                    Barcha imkoniyatlardan foydalanish uchun botimizga kiring.
                </p>
                <a href="https://t.me/premium_houses_bot" className="tg-modal-btn">
                    Botga o'tish
                </a>
            </div>
        </div>
    );
};

export default TelegramRedirectModal;
