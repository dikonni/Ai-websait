 /**
 * script.js — Практикалық жұмыс №1
 * ЖИ веб-бетінің барлық JavaScript функционалы
 *
 * Мазмұны:
 *  1. Тақырып ауыстыру (dark/light mode) — Task 4
 *  2. Scroll Reveal анимация — Task 4
 *  3. ЖИ-чат (Claude API) — Task 3
 *  4. Сұраныс санауышы — Task 4
 */

/* ══════════════════════════════════════════════
   1. ТАҚЫРЫП АУЫСТЫРУ (Dark / Light Mode)
   CSS айнымалылары арқылы — класс ауыстыру
══════════════════════════════════════════════ */

/**
 * Тақырып ауыстыру батырмасын баптайды.
 * localStorage арқылы таңдауды сақтайды.
 */
function initThemeToggle() {
  const btn  = document.getElementById('themeToggle');
  const body = document.body;

  // Бұрынғы таңдауды тексеру (қайта ашқанда есте сақталады)
  const saved = localStorage.getItem('theme') || 'light';
  body.className = saved + '-theme';

  btn.addEventListener('click', function () {
    const isDark = body.classList.contains('dark-theme');
    const next   = isDark ? 'light' : 'dark';

    body.className = next + '-theme';
    localStorage.setItem('theme', next);
  });
}

/* ══════════════════════════════════════════════
   2. SCROLL REVEAL АНИМАЦИЯ
   Intersection Observer API — Task 4
══════════════════════════════════════════════ */

/**
 * .reveal класы бар элементтер экранға кіргенде
 * .visible класын қосып, CSS transition іске қосады.
 */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');

  // Браузер Intersection Observer қолдайтынын тексеру
  if (!('IntersectionObserver' in window)) {
    // Ескі браузерлер үшін — бірден көрсету
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Бір рет іске қосу
        }
      });
    },
    { threshold: 0.15 } // Элементтің 15% экранда көрінгенде іске қосу
  );

  items.forEach(function (el) { observer.observe(el); });
}

/* ══════════════════════════════════════════════
   3. СҰРАНЫС САНАУЫШЫ — Task 4
══════════════════════════════════════════════ */

/** Жіберілген сұраныстар саны */
var requestCount = 0;

/**
 * Санауышты 1-ге арттырып, DOM-да жаңартады.
 */
function incrementCounter() {
  requestCount += 1;
  var counter = document.getElementById('requestCounter');
  if (counter) {
    counter.textContent = requestCount;

    // Кішкентай анимация — санауыш өзгергенде
    counter.style.transform = 'scale(1.4)';
    setTimeout(function () {
      counter.style.transform = 'scale(1)';
      counter.style.transition = 'transform 0.2s ease';
    }, 150);
  }
}

/* ══════════════════════════════════════════════
   4. ЖИ-ЧАТ — Claude API интеграциясы — Task 3
══════════════════════════════════════════════ */

/**
 * Чат хабарламасын экранға қосады.
 *
 * @param {string} role    - 'user' немесе 'ai'
 * @param {string} content - Хабарлама мәтіні
 */
function appendMessage(role, content) {
  var container = document.getElementById('chatMessages');

  var msgDiv    = document.createElement('div');
  msgDiv.className = 'message message-' + role;

  var avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  avatarDiv.textContent = role === 'user' ? 'Мен' : 'AI';

  var bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble';
  bubbleDiv.textContent = content;

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(bubbleDiv);
  container.appendChild(msgDiv);

  // Автоматты скролл — соңғы хабарламаға
  container.scrollTop = container.scrollHeight;

  return msgDiv;
}

/**
 * "Жазып жатыр..." индикаторын қосады.
 * @returns {HTMLElement} — жою үшін элемент
 */
function showTyping() {
  var container = document.getElementById('chatMessages');

  var msgDiv    = document.createElement('div');
  msgDiv.className = 'message message-ai';
  msgDiv.id = 'typingIndicator';

  var avatarDiv = document.createElement('div');
  avatarDiv.className = 'message-avatar';
  avatarDiv.textContent = 'AI';

  var bubbleDiv = document.createElement('div');
  bubbleDiv.className = 'message-bubble typing-indicator';
  bubbleDiv.innerHTML = '<span></span><span></span><span></span>';

  msgDiv.appendChild(avatarDiv);
  msgDiv.appendChild(bubbleDiv);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  return msgDiv;
}

/**
 * Claude API-ге сұраныс жіберіп, жауапты қайтарады.
 *
 * @param {string} apiKey  - Пайдаланушының Claude API кілті
 * @param {string} message - Пайдаланушының хабарламасы
 * @returns {Promise<string>} - ЖИ жауабы
 */
/**
 * Grok (xAI) API-ге сұраныс жіберіп, жауапты қайтарады.
 *
 * @param {string} apiKey  - Пайдаланушының Grok API кілті (console.x.ai)
 * @param {string} message - Пайдаланушының хабарламасы
 * @returns {Promise<string>} - ЖИ жауабы
 */
async function callClaudeAPI(apiKey, message) {
  var response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'grok-3-beta',
      max_tokens: 1024,
      messages: [
        {
          role:    'system',
          content: 'Сен — пайдаланушыға веб-әзірлеу мен ЖИ-технологиялар туралы көмектесетін ассистентсің. Қысқаша, нақты және қазақша жауап бер.'
        },
        { role: 'user', content: message }
      ]
    })
  });

  if (!response.ok) {
    var errData = await response.json().catch(function () { return {}; });
    var errMsg  = (errData.error && errData.error.message) || ('HTTP қате: ' + response.status);
    throw new Error(errMsg);
  }

  var data = await response.json();

  // Grok жауабынан мәтін алу (OpenAI форматымен бірдей)
  if (data.choices && data.choices.length > 0) {
    return data.choices[0].message.content || 'Жауап алынды, бірақ мәтін жоқ.';
  }
  return 'ЖИ бос жауап қайтарды.';
}

/**
 * "Жіберу" батырмасын басқанда іске қосылатын негізгі функция.
 * Пайдаланушы хабарламасын жіберіп, Claude жауабын алады.
 */
async function handleSend() {
  var apiKeyInput = document.getElementById('apiKeyInput');
  var userInput   = document.getElementById('userInput');
  var sendBtn     = document.getElementById('sendBtn');

  var apiKey  = apiKeyInput.value.trim();
  var message = userInput.value.trim();

  // Тексеру: хабарлама бос па?
  if (!message) {
    userInput.focus();
    return;
  }

  // Тексеру: API кілті бар ма?
  if (!apiKey) {
    appendMessage('ai', '⚠ API кілтін жоғарыдағы өріске енгізіңіз. claude.ai → Settings → API Keys бетінен алуға болады.');
    return;
  }

  // UI-ді блоктау (қос жіберуден сақтандыру)
  sendBtn.disabled = true;
  userInput.value  = '';

  // Пайдаланушы хабарламасын экранға қосу
  appendMessage('user', message);

  // Санауышты арттыру
  incrementCounter();

  // "Жазып жатыр..." индикаторы
  var typingEl = showTyping();

  try {
    var reply = await callClaudeAPI(apiKey, message);

    // Typing индикаторын жою
    typingEl.remove();

    // ЖИ жауабын экранға қосу
    appendMessage('ai', reply);

  } catch (err) {
    typingEl.remove();
    appendMessage('ai', '❌ Қате: ' + err.message + '\n\nAPI кілтіңізді тексеріп, қайталап көріңіз.');
  }

  sendBtn.disabled = false;
  userInput.focus();
}

/**
 * Чат функционалын инициализациялайды:
 * батырма click оқиғасы + Enter пернесі.
 * localStorage-дан API кілтін автоматты жүктейді.
 */
function initChat() {
  var sendBtn     = document.getElementById('sendBtn');
  var userInput   = document.getElementById('userInput');
  var apiKeyInput = document.getElementById('apiKeyInput');

  // Бұрын сақталған API кілтін автоматты жүктеу
  var savedKey = localStorage.getItem('grok_api_key');
  if (savedKey) {
    apiKeyInput.value = savedKey;
  }

  // API кілті өзгергенде автоматты сақтау
  apiKeyInput.addEventListener('input', function () {
    var key = apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('grok_api_key', key);
    } else {
      localStorage.removeItem('grok_api_key');
    }
  });

  sendBtn.addEventListener('click', handleSend);

  // Enter басқанда жіберу (Shift+Enter — жаңа жол)
  userInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}

/* ══════════════════════════════════════════════
   БАСТАПҚЫ ІСКЕ ҚОСУ
   Бет толық жүктелгенде барлық функцияларды іске қосу
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();
  initScrollReveal();
  initChat();
});
