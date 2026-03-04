// config.js

const CONFIG = {
    colors: {
        primary: '#f7931a',
        primaryDark: '#e8830d',
        secondary: '#1a1f2e',
        accent: '#00d4aa',
        success: '#00c853',
        error: '#ff5252',
        warning: '#ffb300',
        bg: '#0f1419',
        card: '#1a1f2e',
        text: '#ffffff',
        textSecondary: '#8b949e'
    },

    api: {
        botToken: '8768027801:AAE-nFdnWkLLAVrjLIL5DGN_HIRz8k7JZ8o',
        baseUrl: 'https://api.telegram.org/bot'
    },

    modals: {
        animationDuration: 300,
        autoCloseDelay: 3000
    },

    limits: {
        maxFriends: 120,
        minInterval: 1,
        maxInterval: 60
    }
};

// ✅ userData объявляем ТОЛЬКО здесь
var userData = {
    telegramId: null,
    username: null,
    role: 'client',
    linkedOperator: null,
    linkedClient: null,
    chatId: null
};