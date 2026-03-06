// app.js

var tg = window.Telegram.WebApp;
var currentModal = null;

document.addEventListener('DOMContentLoaded', function () {
    initApp();
    createParticles();
    loadUserData();
});

function initApp() {
    tg.expand();

    tg.MainButton.setText("ВЫПОЛНИТЬ");
    tg.MainButton.setParams({
        color: '#f7931a',
        text_color: '#ffffff'
    });

    if (tg.colorScheme === 'dark') {
        document.documentElement.style.setProperty('--bg', '#0f1419');
        document.documentElement.style.setProperty('--card', '#1a1f2e');
        document.documentElement.style.setProperty('--text', '#ffffff');
    } else {
        document.documentElement.style.setProperty('--bg', '#f0f2f5');
        document.documentElement.style.setProperty('--card', '#ffffff');
        document.documentElement.style.setProperty('--text', '#000000');
    }

    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        userData.telegramId = tg.initDataUnsafe.user.id;
        userData.username = tg.initDataUnsafe.user.username;
        document.getElementById('userId').textContent = '@' + (userData.username || userData.telegramId);
    }

    // ✅ ДЕТАЛЬНАЯ ДИАГНОСТИКА
    console.log('=== TELEGRAM WEB APP INFO ===');
    console.log('Platform:', tg.platform);
    console.log('ColorScheme:', tg.colorScheme);
    console.log('UserID:', userData.telegramId);
    console.log('tg.sendData:', typeof tg.sendData);
    console.log('tg.sendData exists:', tg.sendData !== undefined);
    console.log('initDataUnsafe:', tg.initDataUnsafe ? 'YES' : 'NO');
    console.log('================================');

    // ✅ ПРОВЕРКА: Запущено в Telegram?
    if (tg.platform === 'unknown' || !tg.initDataUnsafe) {
        showNotification('⚠️ Откройте В TELEGRAM, не в браузере!', 'error');
        showNotification('❌ tg.sendData не будет работать!', 'error');
    } else {
        showNotification('✅ Запущено в Telegram: ' + tg.platform, 'success');
        showNotification('✅ tg.sendData доступен', 'success');
    }

    showNotification('Web App запущен! 🎀', 'success');

    tg.ready();
}

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

function loadUserData() { }

// ✅ ОТПРАВКА КОМАНДЫ (С ПРОВЕРКОЙ)
function sendCommand(command) {
    console.log('=== SEND COMMAND DEBUG ===');
    console.log('Command:', command);
    console.log('tg object:', tg);
    console.log('tg.sendData:', typeof tg.sendData);
    console.log('tg.platform:', tg.platform);
    console.log('tg.initDataUnsafe:', tg.initDataUnsafe ? 'YES' : 'NO');
    console.log('=========================');

    showNotification('📤 Отправка: ' + command, 'info');

    // ✅ ПРОВЕРКА 1: Запущено в Telegram?
    if (tg.platform === 'unknown' || !tg.initDataUnsafe) {
        showNotification('❌ Откройте В TELEGRAM!', 'error');
        showNotification('📋 Команда: ' + command, 'info');
        console.error('Web App opened in BROWSER, not Telegram!');
        console.error('tg.sendData will NOT work!');
        return;
    }

    // ✅ ПРОВЕРКА 2: sendData доступен?
    if (typeof tg.sendData === 'function') {
        showNotification('⏳ Отправка данных боту...', 'info');

        try {
            console.log('Calling tg.sendData("' + command + '")...');
            tg.sendData(command);
            console.log('✅ tg.sendData() called successfully!');

            setTimeout(function () {
                showNotification('✅ Команда отправлена боту!', 'success');
                showNotification('🎀 Проверьте чат с ботом', 'info');
            }, 500);

        } catch (error) {
            console.error('Error in tg.sendData:', error);
            showNotification('❌ Ошибка: ' + error.message, 'error');
        }
    } else {
        showNotification('❌ tg.sendData не доступен!', 'error');
        console.error('tg.sendData is not a function!');
        console.error('tg object:', tg);
    }
}

// ... (остальные функции как были: openModal, showStopModal, и т.д.)
// ... (весь остальной код app.js без изменений)

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

    closeModal();

    tg.MainButton.offClick();
    tg.MainButton.hide();
}

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

function showModal(html) {
    var overlay = document.getElementById('modalOverlay');
    var modalContent = document.getElementById('modalContent');

    console.log('=== SHOW MODAL ===');

    modalContent.innerHTML = html;
    overlay.classList.add('active');
}

function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    currentModal = null;

    tg.MainButton.offClick();
    tg.MainButton.hide();

    console.log('=== MODAL CLOSED ===');
}

function showNotification(message, type) {
    type = type || 'success';

    var oldNotifications = document.querySelectorAll('.notification');
    for (var i = 0; i < oldNotifications.length; i++) {
        oldNotifications[i].remove();
    }

    var notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(function () {
        notification.classList.add('show');
    }, 10);

    setTimeout(function () {
        notification.classList.remove('show');
        setTimeout(function () {
            notification.remove();
        }, 300);
    }, 3000);
}

// app.js - добавьте этот код

// app.js - замените функцию sendCommand

function sendCommand(command) {
    console.log('=== SEND COMMAND ===');
    console.log('Command:', command);
    console.log('tg.platform:', tg.platform);

    showNotification('📤 Отправка: ' + command, 'info');

    // ✅ СПОСОБ 1: tg.sendData() (работает на Desktop)
    if (typeof tg.sendData === 'function' && tg.platform !== 'unknown') {
        showNotification('⏳ Отправка через Telegram...', 'info');

        try {
            tg.sendData(command);
            console.log('✅ tg.sendData() вызван');

            setTimeout(function () {
                showNotification('✅ Отправлено!', 'success');
                showNotification('📬 Проверьте чат с ботом', 'info');
            }, 500);

        } catch (error) {
            console.error('tg.sendData error:', error);
            showNotification('❌ Ошибка Telegram', 'error');
            // Пробуем способ 2
            sendViaHTTP(command);
        }
    } else {
        // ✅ СПОСОБ 2: HTTP запрос (работает везде!)
        sendViaHTTP(command);
    }
}

// ✅ НОВАЯ ФУНКЦИЯ: Отправка через HTTP
function sendViaHTTP(command) {
    showNotification('⏳ Отправка через сервер...', 'info');

    // Получаем данные пользователя из Telegram
    var initData = tg.initData || '';
    var userId = userData.telegramId || '';

    // Отправляем на ваш сервер (или напрямую боту)
    fetch('https://your-server.com/webhook', {  // ← Замените на ваш сервер
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            command: command,
            userId: userId,
            initData: initData
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('✅ HTTP response:', data);
            showNotification('✅ Команда отправлена!', 'success');
        })
        .catch(error => {
            console.error('HTTP error:', error);
            showNotification('❌ Ошибка сети', 'error');
        });
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