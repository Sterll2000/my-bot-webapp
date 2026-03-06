// app.js

// Инициализация Telegram Web App
var tg = window.Telegram.WebApp;

// Глобальные переменные
var currentModal = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function () {
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

    // ✅ Уведомление при запуске
    showNotification('Web App запущен! 🎀', 'success');

    console.log('Web App initialized');
    console.log('User ID:', userData.telegramId);
    console.log('Platform:', tg.platform);

    // Готово
    tg.ready();
}

// Создание частиц фона
function createParticles() {
    var container = document.querySelector('.particles');
    if (!container) return;

    for (var i = 0; i < 50; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        container.appendChild(particle);
    }
}

// Загрузка данных пользователя
function loadUserData() {
    // Пустая функция
}

// ✅ ОТПРАВКА КОМАНДЫ В БОТА (НЕ ЗАКРЫВАЕТ WEB APP)
function sendCommand(command) {
    console.log('=== SEND COMMAND ===');
    console.log('Command:', command);

    // ✅ Показываем уведомление
    showNotification('📤 Отправка: ' + command, 'info');

    // ✅ Проверка перед отправкой
    if (typeof tg.sendData === 'function') {
        tg.sendData(command);

        // ✅ Уведомление об успехе (НЕ закрываем Web App!)
        setTimeout(function () {
            showNotification('✅ Команда отправлена!', 'success');
        }, 300);

        // ❌ УБРАЛИ tg.close() - Web App НЕ закрывается!
    } else {
        showNotification('❌ Ошибка: tg.sendData не доступен!', 'error');
        console.error('tg.sendData is not a function!');
    }
}

// Обработчики кнопок
function openModal(type) {
    currentModal = type;

    console.log('=== OPEN MODAL ===');
    console.log('Modal type:', type);

    showNotification('📋 Открываю: ' + type, 'info');

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
            sendCommand('!' + type);
    }
}

// МОДАЛЬНОЕ ОКНО: СТОП
function showStopModal() {
    var html = '<div class="modal-header"><h2>🛑 Стоп Бот</h2><p>Укажите длительность паузы</p></div>' +
        '<div class="input-group"><label>Секунды остановки</label>' +
        '<input type="number" id="stopSeconds" placeholder="Например: 60" min="1" max="3600"></div>' +
        '<div class="modal-buttons">' +
        '<button class="modal-btn modal-btn-cancel" onclick="closeModal()">Отмена</button>' +
        '<button class="modal-btn modal-btn-confirm" onclick="executeStop()">Выполнить</button></div>';

    showModal(html);

    tg.MainButton.onClick(function () {
        executeStop();
    });
    tg.MainButton.show();
}

function executeStop() {
    var seconds = document.getElementById('stopSeconds').value;

    console.log('=== EXECUTE STOP ===');
    console.log('Seconds:', seconds);

    if (!seconds || seconds < 1) {
        showNotification('⚠️ Введите число от 1 до 3600!', 'error');
        return;
    }

    var command = '!stop ' + seconds;
    sendCommand(command);

    // ✅ Закрываем модальное окно, НЕ Web App
    closeModal();

    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// МОДАЛЬНОЕ ОКНО: ДРУЖИМ
function showFriendsModal() {
    var html = '<div class="modal-header"><h2>🤝 Дружим</h2><p>Настройка авто-дружбы</p></div>' +
        '<div class="input-group"><label>Количество ручек (макс. 120)</label>' +
        '<input type="number" id="friendsCount" placeholder="Например: 50" min="1" max="120"></div>' +
        '<div class="input-group"><label>Интервал между ручками (сек)</label>' +
        '<input type="number" id="friendsInterval" placeholder="Рекомендуется: 2" min="1" max="60" value="2"></div>' +
        '<div class="modal-buttons">' +
        '<button class="modal-btn modal-btn-cancel" onclick="closeModal()">Отмена</button>' +
        '<button class="modal-btn modal-btn-confirm" onclick="executeFriends()">Выполнить</button></div>';

    showModal(html);

    tg.MainButton.onClick(function () {
        executeFriends();
    });
    tg.MainButton.show();
}

function executeFriends() {
    var count = document.getElementById('friendsCount').value;
    var interval = document.getElementById('friendsInterval').value || 2;

    console.log('=== EXECUTE FRIENDS ===');
    console.log('Count:', count, 'Interval:', interval);

    if (!count || count < 1 || count > 120) {
        showNotification('⚠️ Количество: 1-120!', 'error');
        return;
    }

    if (interval < 1 || interval > 60) {
        showNotification('⚠️ Интервал: 1-60 сек!', 'error');
        return;
    }

    var command = '!spam ' + count + ' ' + interval;
    sendCommand(command);

    closeModal();

    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// МОДАЛЬНОЕ ОКНО: БАЛАНС
function showBalanceModal() {
    var html = '<div class="modal-header"><h2>💵 Баланс</h2><p>Выберите тип баланса</p></div>' +
        '<div class="modal-buttons" style="flex-direction: column; gap: 15px;">' +
        '<button class="modal-btn modal-btn-confirm" onclick="checkBalance(\'personal\')">👤 Личный баланс</button>' +
        '<button class="modal-btn modal-btn-confirm" onclick="checkBalance(\'bank\')">🏦 Общий баланс банка</button>' +
        '<button class="modal-btn modal-btn-cancel" onclick="closeModal()">Закрыть</button></div>';

    showModal(html);
}

function checkBalance(type) {
    var command = type === 'personal' ? '!bal' : '!bankbal';
    console.log('=== CHECK BALANCE ===');
    console.log('Type:', type, 'Command:', command);
    sendCommand(command);
    closeModal();
}

// МОДАЛЬНОЕ ОКНО: ЛАГЕРЬ
function showCampModal() {
    var html = '<div class="modal-header"><h2>⛺ Лагерь</h2><p>Укажите координаты</p></div>' +
        '<div class="input-group"><label>Координата X</label>' +
        '<input type="number" id="campX" placeholder="Например: 100"></div>' +
        '<div class="input-group"><label>Координата Y</label>' +
        '<input type="number" id="campY" placeholder="Например: 200"></div>' +
        '<div class="modal-buttons">' +
        '<button class="modal-btn modal-btn-cancel" onclick="closeModal()">Отмена</button>' +
        '<button class="modal-btn modal-btn-confirm" onclick="executeCamp()">Выполнить</button></div>';

    showModal(html);

    tg.MainButton.onClick(function () {
        executeCamp();
    });
    tg.MainButton.show();
}

function executeCamp() {
    var x = document.getElementById('campX').value;
    var y = document.getElementById('campY').value;

    console.log('=== EXECUTE CAMP ===');
    console.log('X:', x, 'Y:', y);

    if (!x || !y) {
        showNotification('⚠️ Введите обе координаты!', 'error');
        return;
    }

    var command = '!camp ' + x + ' ' + y;
    sendCommand(command);

    closeModal();

    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// МОДАЛЬНОЕ ОКНО: ОХОТА
function showHuntModal() {
    var html = '<div class="modal-header"><h2>🎯 Охота</h2><p>Укажите координаты для охоты</p></div>' +
        '<div class="input-group"><label>Координата X</label>' +
        '<input type="number" id="huntX" placeholder="Например: 150"></div>' +
        '<div class="input-group"><label>Координата Y</label>' +
        '<input type="number" id="huntY" placeholder="Например: 250"></div>' +
        '<div class="modal-buttons">' +
        '<button class="modal-btn modal-btn-cancel" onclick="closeModal()">Отмена</button>' +
        '<button class="modal-btn modal-btn-confirm" onclick="executeHunt()">Выполнить</button></div>';

    showModal(html);

    tg.MainButton.onClick(function () {
        executeHunt();
    });
    tg.MainButton.show();
}

function executeHunt() {
    var x = document.getElementById('huntX').value;
    var y = document.getElementById('huntY').value;

    console.log('=== EXECUTE HUNT ===');
    console.log('X:', x, 'Y:', y);

    if (!x || !y) {
        showNotification('⚠️ Введите обе координаты!', 'error');
        return;
    }

    var command = '!hunt ' + x + ' ' + y;
    sendCommand(command);

    closeModal();

    tg.MainButton.offClick();
    tg.MainButton.hide();
}

// Показать модальное окно
function showModal(html) {
    var overlay = document.getElementById('modalOverlay');
    var modalContent = document.getElementById('modalContent');

    console.log('=== SHOW MODAL ===');

    modalContent.innerHTML = html;
    overlay.classList.add('active');
}

// Закрыть модальное окно
function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    currentModal = null;

    tg.MainButton.offClick();
    tg.MainButton.hide();

    console.log('=== MODAL CLOSED ===');
}

// ✅ Показывать уведомление (исправлено)
function showNotification(message, type) {
    type = type || 'success';

    // ✅ Удаляем ВСЕ старые уведомления
    var oldNotifications = document.querySelectorAll('.notification');
    for (var i = 0; i < oldNotifications.length; i++) {
        oldNotifications[i].remove();
    }

    // ✅ Создаём новое
    var notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;

    document.body.appendChild(notification);

    // ✅ Показываем
    setTimeout(function () {
        notification.classList.add('show');
    }, 10);

    // ✅ Скрываем через 3 секунды
    setTimeout(function () {
        notification.classList.remove('show');
        setTimeout(function () {
            notification.remove();
        }, 300);
    }, 3000);
}

// Экспорт функций
window.openModal = openModal;
window.sendCommand = sendCommand;
window.closeModal = closeModal;
window.executeStop = executeStop;
window.executeFriends = executeFriends;
window.checkBalance = checkBalance;
window.executeCamp = executeCamp;
window.executeHunt = executeHunt;
window.showModal = showModal;
window.showNotification = showNotification;