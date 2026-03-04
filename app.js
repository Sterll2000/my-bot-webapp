// app.js

// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();

// Глобальные переменные
let currentModal = null;
let pendingCommand = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    createParticles();
    loadUserData();
});

// Инициализация
function initApp() {
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
    userData.telegramId = tg.initDataUnsafe?.user?.id;
    userData.username = tg.initDataUnsafe?.user?.username;

    console.log('User:', userData);

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
async function loadUserData() {
    try {
        // Здесь можно загрузить данные с сервера о привязке оператор-клиент
        // Пока используем заглушку
        showNotification('Добро пожаловать! 🎀', 'success');
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Обработчики кнопок
function sendCommand(command) {
    showNotification(`Отправка: ${command}`, 'success');
    tg.sendData(command);
    setTimeout(() => tg.close(), 1000);
}

function openModal(type) {
    currentModal = type;

    switch (type) {
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
            sendCommand(`!${type}`);
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
}

function executeStop() {
    const seconds = document.getElementById('stopSeconds').value;

    if (!seconds || seconds < 1) {
        showNotification('Введите корректное число секунд!', 'error');
        return;
    }

    const command = `!stop ${seconds}`;
    executeCommandWithResponse(command, 'stop');
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

    const command = `!spam ${count} ${interval}`;
    executeCommandWithResponse(command, 'friends');
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
        <div id="balanceResult" class="result-box" style="display: none;"></div>
    `;

    showModal(html);
}

async function checkBalance(type) {
    const command = type === 'personal' ? '!bal' : '!bankbal';

    // Показываем загрузку
    const resultBox = document.getElementById('balanceResult');
    resultBox.style.display = 'block';
    resultBox.innerHTML = `
        <h3>⏳ Загрузка...</h3>
        <div class="loading-spinner"></div>
    `;

    // Отправляем команду и ждём ответ
    await executeCommandWithResponse(command, 'balance', resultBox);
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
}

function executeCamp() {
    const x = document.getElementById('campX').value;
    const y = document.getElementById('campY').value;

    if (!x || !y) {
        showNotification('Введите обе координаты!', 'error');
        return;
    }

    const command = `!camp ${x} ${y}`;
    executeCommandWithResponse(command, 'camp');
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
}

function executeHunt() {
    const x = document.getElementById('huntX').value;
    const y = document.getElementById('huntY').value;

    if (!x || !y) {
        showNotification('Введите обе координаты!', 'error');
        return;
    }

    const command = `!hunt ${x} ${y}`;
    executeCommandWithResponse(command, 'hunt');
}

// Выполнение команды с ответом
async function executeCommandWithResponse(command, type, resultElement = null) {
    try {
        // Отправляем команду боту
        tg.sendData(command);

        // Показываем уведомление
        showNotification('Команда отправлена! ⏳', 'success');

        // Для команд с ответом ждём данные от бота
        if (['balance', 'stop', 'friends', 'camp', 'hunt'].includes(type)) {
            // Здесь должна быть логика ожидания ответа от бота
            // В реальном приложении ответ придёт через WebSocket или polling

            setTimeout(() => {
                if (resultElement) {
                    resultElement.innerHTML = `
                        <h3>✅ Успешно!</h3>
                        <pre>Команда: ${command}\nСтатус: Выполняется...</pre>
                    `;
                }
                showNotification('Команда выполнена! ✨', 'success');
            }, 2000);
        }

        closeModal();

    } catch (error) {
        console.error('Error executing command:', error);
        showNotification('Ошибка выполнения команды!', 'error');
    }
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
}

// Показать уведомление
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Обработка данных от бота
tg.onEvent('mainButtonClicked', () => {
    console.log('Main button clicked');
});

// Получение данных от бота (ответы на команды)
window.addEventListener('message', (event) => {
    if (event.origin === 'https://t.me') {
        const data = event.data;
        console.log('Received from bot:', data);

        // Обработка ответа от бота
        if (data.type === 'command_response') {
            handleBotResponse(data.command, data.response);
        }
    }
});

// Обработка ответа от бота
function handleBotResponse(command, response) {
    console.log('Bot response:', command, response);

    // Обновляем результат в модальном окне
    const resultBox = document.getElementById('balanceResult');
    if (resultBox && command.includes('bal')) {
        resultBox.innerHTML = `
            <h3>✅ Ответ бота:</h3>
            <pre>${response}</pre>
        `;
    }

    showNotification('Ответ получен! ✅', 'success');
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