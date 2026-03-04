// config.js
const CONFIG = {
    // Цвета в стиле BTC Shop
    colors: {
        primary: '#f7931a',      // Bitcoin orange
        primaryDark: '#e8830d',
        secondary: '#1a1f2e',    // Dark blue
        accent: '#00d4aa',       // Teal
        success: '#00c853',
        error: '#ff5252',
        warning: '#ffb300',
        bg: '#0f1419',
        card: '#1a1f2e',
        text: '#ffffff',
        textSecondary: '#8b949e'
    },

    // API настройки
    api: {
        botToken: '8768027801:AAE-nFdnWkLLAVrjLIL5DGN_HIRz8k7JZ8o',
        baseUrl: 'https://api.telegram.org/bot'
    },

    // Настройки модальных окон
    modals: {
        animationDuration: 300,
        autoCloseDelay: 3000
    },

    // Лимиты
    limits: {
        maxFriends: 120,
        minInterval: 1,
        maxInterval: 60
    }
};

// Пользовательские данные (заполняется при запуске)
let userData = {
    telegramId: null,
    username: null,
    role: 'client', // 'operator' или 'client'
    linkedOperator: null,
    linkedClient: null,
    chatId: null
};