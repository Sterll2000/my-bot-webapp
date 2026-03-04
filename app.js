// app.js

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Глобальные переменные
let currentModal = null;

// Пользовательские данные
let userData = {
    telegramId: null,
    username: null,
    role: 'client',
    linkedOperator: null,
    linkedClient: null,
    chatId: null
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    createParticles();
    loadUserData();
});

// Инициализация
function initApp() {
    // Раскрыть на весь экран
    tg.expand();
    
    // Настройка Main Button
    tg.MainButton.setText("ВЫПОЛНИТЬ");
    tg.MainButton.setParams({
        color: '#f7931a',
        text_color: '#ffffff'
    });
    
    // Настройка цветов под тему Telegram
    if (tg.colorScheme === 'dark') {
        document.documentElement.style.setProperty('--bg', '#0f1419');
        document.documentElement.style.setProperty('--card', '#1a1f2e');
        document.documentElement.style.setProperty('--text', '#ffffff');
    } else {
        document.documentElement.style.setProperty('--bg', '#f0f2f5');
        document.documentElement.style.setProperty('--card', '#ffffff');
        document.documentElement.style.setProperty('--text', '#000000');
    }
    
    // Установка данных пользователя
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        userData.telegramId = tg.initDataUnsafe.user.id;
        userData.username = tg.initDataUnsafe.user.username;
        document.getElementById('userId').textContent = '@' + (userData.username || userData.telegramId);
    }
    
    // ✅ ИСПРАВЛЕНО: Правильный console.log
    console.log('Web App initialized');
    console.log('User ID:', userData.telegramId);
    console.log('Username:', userData.username);
    console.log('Platform:', tg.platform);
    
    // Готово
    tg.ready();
}

// Создание частиц фона
function createParticles() {
    const container = document.querySelector('.particles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        container.appendChild(particle);
    }
}

// Загрузка данных пользователя
function loadUserData() {
    showNotification('Добро пожаловать! 🎀', 'success');
}

// ✅ ОТПРАВКА КОМАНДЫ В БОТА
function sendCommand(command) {
    // ✅ ИСПРАВЛЕНО: Правильный console.log
    console.log('Sending command:', command);
    
    // Показываем уведомление
    showNotification('Отправка: ' + command, 'success');
    
    // ОТПРАВЛЯЕМ ДАННЫЕ БОТУ
    tg.sendData(command);
    
    // Закрываем Web App через 500мс
    setTimeout(() => {
        tg.close();
    }, 500);
}

// Обработчики кнопок
function openModal(type) {
    currentModal = type;
    
    switch(type) {
        case 'stop':
            showStopModal();
            break;
        case 'friends':
            showFriendsModal();
            break;
        case 'balance':
            showBalanceModal();
            break;
        case 'camp':
            showCampModal();
            break;
        case 'hunt':
            showHuntModal();
            break;
        default:
            sendCommand('!' + type);
    }
}

// МОДАЛЬНОЕ ОКНО: СТОП
function showStopModal() {
    const html = `
        <div class="modal-header">
            <h2>🛑 Стоп Бот</h2>
            <p>Укажите длительность паузы</p>
        </div>
        <div class="input-group">
            <label>Секунды остановки</label>
            <input type="number" id="stopSeconds" placeholder="Например: 60" min="1" max="3600">
        </div>
        <div class="modal-buttons">
            <button class="modal-btn modal-btn-cancel" onclick="closeModal()">Отмена</button>
            <button class="modal-btn modal-btn-confirm" onclick="executeStop()">Выполнить</button>
        </div>
    `;
    
    showModal(html);
    
    tg.MainButton.onClick(() => {
        executeStop();
    });
    tg.MainButton.show();
}

function executeStop() {
    const seconds = document.getElementById('stopSeconds').value;
    
    if (!seconds || seconds < 1) {
        showNotification('Введите корректное число секунд!', 'error');
        return;
    }
    
    const command = '!stop ' + seconds;
    sendCommand(command);
    
    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// МОДАЛЬНОЕ ОКНО: ДРУЖИМ
function showFriendsModal() {
    const html = `
        <div class="modal-header">
            <h2>🤝 Дружим</h2>
            <p>Настройка авто-дружбы</p>
        </div>
        <div class="input-group">
            <label>Количество ручек (макс. 120)</label>
            <input type="number" id="friendsCount" placeholder="Например: 50" min="1" max="120">
        </div>
        <div class="input-group">
            <label>Интервал между ручками (сек)</label>
            <input type="number" id="friendsInterval" placeholder="Рекомендуется: 2" min="1" max="60" value="2">
        </div>
        <div class="modal-buttons">
            <button class="modal-btn modal-btn-cancel" onclick="closeModal()">Отмена</button>
            <button class="modal-btn modal-btn-confirm" onclick="executeFriends()">Выполнить</button>
        </div>
    `;
    
    showModal(html);
    
    tg.MainButton.onClick(() => {
        executeFriends();
    });
    tg.MainButton.show();
}

function executeFriends() {
    const count = document.getElementById('friendsCount').value;
    const interval = document.getElementById('friendsInterval').value || 2;
    
    if (!count || count < 1 || count > 120) {
        showNotification('Количество должно быть от 1 до 120!', 'error');
        return;
    }
    
    if (interval < 1 || interval > 60) {
        showNotification('Интервал должен быть от 1 до 60 секунд!', 'error');
        return;
    }
    
    const command = '!spam ' + count + ' ' + interval;
    sendCommand(command);
    
    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// МОДАЛЬНОЕ ОКНО: БАЛАНС
function showBalanceModal() {
    const html = `
        <div class="modal-header">
            <h2>💵 Баланс</h2>
            <p>Выберите тип баланса</p>
        </div>
        <div class="modal-buttons" style="flex-direction: column; gap: 15px;">
            <button class="modal-btn modal-btn-confirm" onclick="checkBalance('personal')">
                👤 Личный баланс
            </button>
            <button class="modal-btn modal-btn-confirm" onclick="checkBalance('bank')">
                🏦 Общий баланс банка
            </button>
            <button class="modal-btn modal-btn-cancel" onclick="closeModal()">
                Закрыть
            </button>
        </div>
    `;
    
    showModal(html);
}

function checkBalance(type) {
    const command = type === 'personal' ? '!bal' : '!bankbal';
    sendCommand(command);
}

// МОДАЛЬНОЕ ОКНО: ЛАГЕРЬ
function showCampModal() {
    const html = `
        <div class="modal-header">
            <h2>⛺ Лагерь</h2>
            <p>Укажите координаты</p>
        </div>
        <div class="input-group">
            <label>Координата X</label>
            <input type="number" id="campX" placeholder="Например: 100">
        </div>
        <div class="input-group">
            <label>Координата Y</label>
            <input type="number" id="campY" placeholder="Например: 200">
        </div>
        <div class="modal-buttons">
            <button class="modal-btn modal-btn-cancel" onclick="closeModal()">Отмена</button>
            <button class="modal-btn modal-btn-confirm" onclick="executeCamp()">Выполнить</button>
        </div>
    `;
    
    showModal(html);
    
    tg.MainButton.onClick(() => {
        executeCamp();
    });
    tg.MainButton.show();
}

function executeCamp() {
    const x = document.getElementById('campX').value;
    const y = document.getElementById('campY').value;
    
    if (!x || !y) {
        showNotification('Введите обе координаты!', 'error');
        return;
    }
    
    const command = '!camp ' + x + ' ' + y;
    sendCommand(command);
    
    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// МОДАЛЬНОЕ ОКНО: ОХОТА
function showHuntModal() {
    const html = `
        <div class="modal-header">
            <h2>🎯 Охота</h2>
            <p>Укажите координаты для охоты</p>
        </div>
        <div class="input-group">
            <label>Координата X</label>
            <input type="number" id="huntX" placeholder="Например: 150">
        </div>
        <div class="input-group">
            <label>Координата Y</label>
            <input type="number" id="huntY" placeholder="Например: 250">
        </div>
        <div class="modal-buttons">
            <button class="modal-btn modal-btn-cancel" onclick="closeModal()">Отмена</button>
            <button class="modal-btn modal-btn-confirm" onclick="executeHunt()">Выполнить</button>
        </div>
    `;
    
    showModal(html);
    
    tg.MainButton.onClick(() => {
        executeHunt();
    });
    tg.MainButton.show();
}

function executeHunt() {
    const x = document.getElementById('huntX').value;
    const y = document.getElementById('huntY').value;
    
    if (!x || !y) {
        showNotification('Введите обе координаты!', 'error');
        return;
    }
    
    const command = '!hunt ' + x + ' ' + y;
    sendCommand(command);
    
    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// Показать модальное окно
function showModal(html) {
    const overlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = html;
    overlay.classList.add('active');
}

// Закрыть модальное окно
function closeModal() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    currentModal = null;
    
    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// Показать уведомление
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Экспорт функций для HTML
window.sendCommand = sendCommand;
window.openModal = openModal;
window.closeModal = closeModal;
window.executeStop = executeStop;
window.executeFriends = executeFriends;
window.checkBalance = checkBalance;
window.executeCamp = executeCamp;
window.executeHunt = executeHunt;
