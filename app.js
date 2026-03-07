// app.js - Обновлённая версия с переключением чатов

var tg = window.Telegram.WebApp;
var currentModal = null;
var userData = {
    telegramId: null,
    username: null,
    activeChat: null,
    chats: []
};

// ✅ API URL (напрямую к Telegram)
var BOT_TOKEN = '8768027801:AAE-nFdnWkLLAVrjLIL5DGN_HIRz8k7JZ8o';

document.addEventListener('DOMContentLoaded', function () {
    initApp();
    createParticles();
    loadUserChats();
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

    console.log('=== WEB APP INIT ===');
    console.log('Platform:', tg.platform);
    console.log('UserID:', userData.telegramId);

    showNotification('🎀 Web App запущен!', 'success');

    tg.ready();
}

// ✅ ЗАГРУЗКА ЧАТОВ ПОЛЬЗОВАТЕЛЯ
function loadUserChats() {
    if (!userData.telegramId) return;

    fetch('http://127.0.0.1:5000/get_chats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userData.telegramId,
            username: userData.username
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('User chats:', data);
            if (data.status === 'success') {
                userData.chats = data.chats;
                userData.activeChat = data.active_chat;
                updateChatSelector();
            }
        })
        .catch(error => {
            console.error('Error loading chats:', error);
        });
}

// ✅ ОБНОВЛЕНИЕ СЕЛЕКТОРА ЧАТОВ
function updateChatSelector() {
    var statusText = document.getElementById('statusText');
    var chatSelector = document.getElementById('chatSelector');

    if (!chatSelector) return;

    if (userData.chats.length === 0) {
        statusText.textContent = '❌ Нет чатов';
        statusText.style.color = '#ff4444';
        chatSelector.innerHTML = '<p style="color: #ff4444; font-size: 12px;">Нет привязанных чатов</p>';
        return;
    }

    var html = '<select id="chatSelect" onchange="changeActiveChat(this.value)" style="width: 100%; padding: 8px; border-radius: 8px; border: 1px solid #444; background: #1a1f2e; color: #fff;">';

    userData.chats.forEach(function (chat) {
        var selected = chat.is_active ? 'selected' : '';
        var icon = chat.is_active ? '✅' : '⚪';
        html += `<option value="${chat.chat_id}" ${selected}>${icon} ${chat.name}</option>`;
    });

    html += '</select>';
    chatSelector.innerHTML = html;

    // Обновляем статус
    var activeChat = userData.chats.find(c => c.is_active);
    if (activeChat) {
        statusText.textContent = '✅ ' + activeChat.name;
        statusText.style.color = '#44ff44';
    }
}

// ✅ ИЗМЕНЕНИЕ АКТИВНОГО ЧАТА
function changeActiveChat(chatId) {
    if (!userData.telegramId) return;

    fetch('http://127.0.0.1:5000/set_active_chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userData.telegramId,
            chat_id: chatId
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                showNotification('✅ Чат переключен: ' + data.message, 'success');

                // Обновляем локальные данные
                userData.chats.forEach(function (chat) {
                    chat.is_active = (chat.chat_id === chatId);
                });
                userData.activeChat = chatId;

                updateChatSelector();
            } else {
                showNotification('❌ Ошибка: ' + data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('❌ Ошибка сети', 'error');
        });
}

// ✅ ОТПРАВКА КОМАНДЫ
function sendCommand(command) {
    console.log('=== SEND COMMAND ===');
    console.log('Command:', command);
    console.log('Active Chat:', userData.activeChat);

    showNotification('📤 Отправка: ' + command, 'info');

    if (!userData.activeChat) {
        showNotification('❌ Выберите чат!', 'error');
        return;
    }

    // ✅ ОТПРАВКА НАПРЯМУЮ В TELEGRAM BOT API
    var BOT_TOKEN = '8768027801:AAE-nFdnWkLLAVrjLIL5DGN_HIRz8k7JZ8o';
    var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: userData.activeChat,  // ✅ Активный чат пользователя
            text: command  // ✅ ТОЛЬКО команда (без username!)
        })
    })
        .then(response => response.json())
        .then(function (data) {
            console.log('Telegram response:', data);
            if (data.ok) {
                // ✅ НЕ ПИШЕМ В ЛС! Только уведомление в Web App
                showNotification('✅ Выполнено!', 'success');
            } else {
                showNotification('❌ Ошибка: ' + data.description, 'error');
            }
        })
        .catch(function (error) {
            console.error('Fetch error:', error);
            showNotification('❌ Ошибка сети', 'error');
        });
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

function openModal(type) {
    currentModal = type;
    showNotification('📋 ' + type, 'info');

    switch (type) {
        case 'stop':
            showStopModal();
            break;
        case 'friends':
            showFriendsModal();
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

    if (!seconds || seconds < 1) {
        showNotification('⚠️ Введите 1-3600!', 'error');
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
        '<input type="number" id="friendsCount" placeholder="50" min="1" max="120"></div>' +
        '<div class="input-group"><label>Интервал (сек)</label>' +
        '<input type="number" id="friendsInterval" placeholder="2" min="1" max="60" value="2"></div>' +
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

    if (!count || count < 1 || count > 120) {
        showNotification('⚠️ Количество: 1-120!', 'error');
        return;
    }

    var command = '!spam ' + count + ' ' + interval;
    sendCommand(command);

    closeModal();
    tg.MainButton.offClick();
    tg.MainButton.hide();
}

function showCampModal() {
    var html = '<div class="modal-header"><h2>⛺ Лагерь</h2><p>Укажите координаты</p></div>' +
        '<div class="input-group"><label>Координата X</label>' +
        '<input type="number" id="campX" placeholder="100"></div>' +
        '<div class="input-group"><label>Координата Y</label>' +
        '<input type="number" id="campY" placeholder="200"></div>' +
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

    if (!x || !y) {
        showNotification('⚠️ Введите X и Y!', 'error');
        return;
    }

    var command = '!camp ' + x + ' ' + y;
    sendCommand(command);

    closeModal();
    tg.MainButton.offClick();
    tg.MainButton.hide();
}

function showHuntModal() {
    var html = '<div class="modal-header"><h2>🎯 Охота</h2><p>Укажите координаты</p></div>' +
        '<div class="input-group"><label>Координата X</label>' +
        '<input type="number" id="huntX" placeholder="150"></div>' +
        '<div class="input-group"><label>Координата Y</label>' +
        '<input type="number" id="huntY" placeholder="250"></div>' +
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

    if (!x || !y) {
        showNotification('⚠️ Введите X и Y!', 'error');
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
    modalContent.innerHTML = html;
    overlay.classList.add('active');
}

function closeModal() {
    var overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('active');
    currentModal = null;
    tg.MainButton.offClick();
    tg.MainButton.hide();
}

function showNotification(message, type) {
    type = type || 'success';

    var old = document.querySelectorAll('.notification');
    for (var i = 0; i < old.length; i++) {
        old[i].remove();
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

// Экспорт функций
window.openModal = openModal;
window.sendCommand = sendCommand;
window.closeModal = closeModal;
window.executeStop = executeStop;
window.executeFriends = executeFriends;
window.executeCamp = executeCamp;
window.executeHunt = executeHunt;
window.changeActiveChat = changeActiveChat;
window.showModal = showModal;
window.showNotification = showNotification;