/* ============================================
   БИЗНЕС АКВАРИУМ - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // АНИМИРОВАННЫЕ ПУЗЫРЬКИ
  // ============================================
  const bubblesContainer = document.querySelector('.bubbles-container');
  
  if (bubblesContainer) {
    // Создаём 25 пузырьков
    for (let i = 0; i < 25; i++) {
      createBubble(bubblesContainer);
    }
  }
  
  function createBubble(container) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    // Случайные параметры
    const size = Math.random() * 60 + 30; // 30-90px
    const left = Math.random() * 100; // 0-100%
    const duration = Math.random() * 12 + 8; // 8-20 сек
    const delay = Math.random() * 8; // 0-8 сек
    
    bubble.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    
    container.appendChild(bubble);
    
    // Пересоздаём пузырь после завершения анимации
    bubble.addEventListener('animationend', function() {
      bubble.remove();
      createBubble(container);
    });
  }
  
  // ============================================
  // МОБИЛЬНОЕ МЕНЮ
  // ============================================
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const mobileToggle = document.querySelector('.mobile-toggle');
  
  // Обрабатываем оба типа кнопок меню
  const menuBtn = mobileMenuBtn || mobileToggle;
  
  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Меняем иконку
      const svg = menuBtn.querySelector('svg');
      if (navMenu.classList.contains('active')) {
        svg.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
      } else {
        svg.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>';
      }
    });
    
    // Закрываем меню при клике на ссылку
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
  
  // ============================================
  // ТАБЫ
  // ============================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const target = this.dataset.tab;
      const container = this.closest('.container');
      
      if (!container) return;
      
      // Убираем active со всех кнопок и контента
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Добавляем active к текущим
      this.classList.add('active');
      const targetContent = container.querySelector('#' + target);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
  
  // ============================================
  // FAQ АККОРДЕОН
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', function() {
        // Закрываем другие
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('active');
          }
        });
        
        // Переключаем текущий
        item.classList.toggle('active');
      });
    }
  });
  
  // ============================================
  // КОНСТРУКТОР ТАРИФОВ (для сервисных страниц)
  // ============================================
  const constructorWrapper = document.querySelector('.constructor-wrapper');
  
  if (constructorWrapper) {
    const optionItems = constructorWrapper.querySelectorAll('.option-item');
    const summaryItems = constructorWrapper.querySelector('.summary-items');
    const totalPriceEl = constructorWrapper.querySelector('.summary-total-price');
    
    let selectedOptions = [];
    let optionsData = [];
    
    // Собираем данные об опциях
    optionItems.forEach(item => {
      const id = item.dataset.id;
      const price = parseInt(item.dataset.price) || 0;
      const nameEl = item.querySelector('.option-name');
      const name = nameEl ? nameEl.textContent : id;
      
      optionsData.push({ id, price, name, element: item });
    });
    
    // Добавляем обработчики кликов
    optionItems.forEach(item => {
      item.addEventListener('click', function() {
        const id = this.dataset.id;
        const category = this.closest('.options-list')?.dataset.category;
        
        // Для базовых тарифов - только один выбор
        if (category === 'base') {
          const baseOptions = constructorWrapper.querySelectorAll('.options-list[data-category="base"] .option-item');
          baseOptions.forEach(opt => {
            opt.classList.remove('selected');
            const optId = opt.dataset.id;
            selectedOptions = selectedOptions.filter(s => s !== optId);
          });
        }
        
        if (selectedOptions.includes(id)) {
          selectedOptions = selectedOptions.filter(o => o !== id);
          this.classList.remove('selected');
        } else {
          selectedOptions.push(id);
          this.classList.add('selected');
        }
        
        updateSummary();
      });
    });
    
    // Обновление сводки
    function updateSummary() {
      if (!summaryItems || !totalPriceEl) return;
      
      let html = '';
      let total = 0;
      
      selectedOptions.forEach(id => {
        const option = optionsData.find(o => o.id === id);
        if (option) {
          html += `
            <div class="summary-item">
              <span class="summary-item-name">${option.name}</span>
              <span class="summary-item-price">${option.price.toLocaleString('ru-RU')} ₽</span>
            </div>
          `;
          total += option.price;
        }
      });
      
      if (selectedOptions.length === 0) {
        html = '<p class="summary-empty">Выберите опции для расчёта</p>';
      }
      
      summaryItems.innerHTML = html;
      totalPriceEl.textContent = total.toLocaleString('ru-RU') + ' ₽';
    }
    
    // Инициализация
    updateSummary();
  }
  
  // ============================================
  // КОНСТРУКТОР НА ГЛАВНОЙ (с переключением услуг)
  // ============================================
  const constructorServices = document.querySelectorAll('.constructor-service-btn');
  const optionsContainer = document.querySelector('.constructor-options');
  const summaryItemsHome = document.querySelector('.summary-items:not(.constructor-wrapper .summary-items)');
  const totalPriceElHome = document.querySelector('.summary-total-price:not(.constructor-wrapper .summary-total-price)');
  
  // Данные для конструктора на главной
  const servicesData = {
    rop: {
      categories: [
        {
          name: 'Базовый тариф',
          options: [
            { id: 'rop-start', name: 'Тариф «Старт» (5 ч/нед)', price: 15000 },
            { id: 'rop-accompany', name: 'Тариф «Сопровождение» (15 ч/нед)', price: 45000 },
            { id: 'rop-partner', name: 'Тариф «Партнёр» (40 ч/нед)', price: 90000 },
          ]
        },
        {
          name: 'Дополнительные опции',
          options: [
            { id: 'rop-scripts', name: 'Написание/доработка скриптов', price: 10000 },
            { id: 'rop-hire', name: 'Участие в найме и собеседованиях', price: 15000 },
            { id: 'rop-daily', name: 'Ежедневные планерки', price: 20000 },
            { id: 'rop-sales', name: 'Личные продажи РОПа (до 10 сделок/мес)', price: 25000 },
            { id: 'rop-attestation', name: 'Аттестация менеджеров раз в месяц', price: 8000 },
            { id: 'rop-bitrix', name: 'Интеграция отчетов в Битрикс24', price: 12000 },
          ]
        },
        {
          name: 'Умные модули',
          options: [
            { id: 'rop-okk', name: '🔍 Автоматизированный ОКК', price: 30000 },
            { id: 'rop-bot', name: '🤖 Обучающий бот для менеджеров', price: 20000 },
          ]
        }
      ]
    },
    santehnik: {
      categories: [
        {
          name: 'Базовый тариф',
          options: [
            { id: 'san-diag', name: 'Диагностика (разовый аудит)', price: 25000 },
            { id: 'san-repair', name: 'Ремонт (проект 2-3 недели)', price: 75000 },
            { id: 'san-capital', name: 'Капитальный (проект + сопровождение)', price: 150000 },
          ]
        },
        {
          name: 'Этапы работы',
          options: [
            { id: 'san-audit-ads', name: 'Аудит рекламных источников', price: 5000 },
            { id: 'san-audit-process', name: 'Диагностика обработки заявок', price: 10000 },
            { id: 'san-dojim', name: 'Оптимизация дожима', price: 15000 },
            { id: 'san-payment', name: 'Настройка оплаты и выдачи', price: 12000 },
          ]
        },
        {
          name: 'Умные модули',
          options: [
            { id: 'san-okk-basic', name: '🔍 ОКК (базовый)', price: 25000 },
            { id: 'san-okk-ai', name: '🔍 ОКК с AI-аналитикой', price: 50000 },
            { id: 'san-bot-basic', name: '🤖 Обучающий бот (5 сценариев)', price: 20000 },
            { id: 'san-bot-crm', name: '🤖 Бот с интеграцией в CRM', price: 40000 },
          ]
        },
        {
          name: 'Дополнительно',
          options: [
            { id: 'san-mystery', name: 'Тайный покупатель (10 заявок)', price: 8000 },
            { id: 'san-calls', name: 'Аудит звонков (50 шт.)', price: 10000 },
            { id: 'san-scripts', name: 'Пересборка скриптов', price: 15000 },
            { id: 'san-training', name: 'Обучение команды', price: 20000 },
            { id: 'san-support', name: 'Сопровождение 1 месяц', price: 30000 },
          ]
        }
      ]
    },
    crm: {
      categories: [
        {
          name: 'Базовый тариф',
          options: [
            { id: 'crm-basic', name: 'Базовая настройка', price: 40000 },
            { id: 'crm-auto', name: 'Автоматизация', price: 90000 },
            { id: 'crm-eco', name: 'Экосистема', price: 180000 },
          ]
        },
        {
          name: 'Каналы связи',
          options: [
            { id: 'crm-whatsapp', name: 'WhatsApp Business API', price: 10000 },
            { id: 'crm-telegram', name: 'Telegram-бот для лидов', price: 8000 },
            { id: 'crm-instagram', name: 'Instagram Direct', price: 7000 },
            { id: 'crm-chat', name: 'Онлайн-чат на сайте', price: 5000 },
            { id: 'crm-telephony', name: 'IP-телефония (настройка)', price: 12000 },
          ]
        },
        {
          name: 'Автоматизация',
          options: [
            { id: 'crm-docs', name: 'Генерация договоров/счетов', price: 15000 },
            { id: 'crm-edo', name: 'Интеграция с ЭДО', price: 20000 },
            { id: 'crm-robots-5', name: 'Роботы и триггеры (5 сценариев)', price: 10000 },
            { id: 'crm-robots-15', name: 'Роботы и триггеры (15+ сценариев)', price: 25000 },
          ]
        },
        {
          name: 'Интеграции',
          options: [
            { id: 'crm-gc-basic', name: 'Базовая интеграция с GetCourse', price: 25000 },
            { id: 'crm-gc-adv', name: 'Продвинутая связка Б24 ↔ GetCourse', price: 50000 },
            { id: 'crm-roistat', name: 'Подключение Roistat/Calltouch', price: 30000 },
            { id: 'crm-dashboards', name: 'P&L-дашборды для собственника', price: 40000 },
          ]
        },
        {
          name: 'Умные модули',
          options: [
            { id: 'crm-okk-basic', name: '🔍 ОКК (базовый)', price: 30000 },
            { id: 'crm-okk-ai', name: '🔍 ОКК с AI-аналитикой', price: 60000 },
            { id: 'crm-bot-basic', name: '🤖 Обучающий бот', price: 25000 },
            { id: 'crm-bot-crm', name: '🤖 Бот с интеграцией в CRM', price: 45000 },
          ]
        },
        {
          name: 'Сопровождение',
          options: [
            { id: 'crm-training-2', name: 'Обучение команды (2 часа)', price: 5000 },
            { id: 'crm-training-4', name: 'Обучение команды (4 часа + методички)', price: 15000 },
            { id: 'crm-support-1', name: 'Техподдержка 1 месяц', price: 30000 },
            { id: 'crm-support-3', name: 'Техподдержка 3 месяца', price: 75000 },
          ]
        }
      ]
    }
  };
  
  let currentService = 'rop';
  let selectedOptionsHome = [];
  
  // Переключение услуги
  constructorServices.forEach(btn => {
    btn.addEventListener('click', function() {
      constructorServices.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      currentService = this.dataset.service;
      selectedOptionsHome = [];
      renderOptionsHome();
      updateSummaryHome();
    });
  });
  
  // Рендер опций
  function renderOptionsHome() {
    if (!optionsContainer) return;
    
    const data = servicesData[currentService];
    if (!data) return;
    
    let html = '';
    
    data.categories.forEach(category => {
      html += `
        <div class="option-category">
          <div class="option-category-title">${category.name}</div>
          <div class="options-list">
            ${category.options.map(option => `
              <div class="option-item ${selectedOptionsHome.includes(option.id) ? 'selected' : ''}" 
                   data-id="${option.id}" 
                   data-price="${option.price}">
                <span class="option-name">${option.name}</span>
                <span class="option-price">+${option.price.toLocaleString('ru-RU')} ₽</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
    
    optionsContainer.innerHTML = html;
    
    // Добавляем обработчики кликов
    optionsContainer.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', function() {
        const id = this.dataset.id;
        
        if (selectedOptionsHome.includes(id)) {
          selectedOptionsHome = selectedOptionsHome.filter(o => o !== id);
          this.classList.remove('selected');
        } else {
          selectedOptionsHome.push(id);
          this.classList.add('selected');
        }
        
        updateSummaryHome();
      });
    });
  }
  
  // Обновление сводки
  function updateSummaryHome() {
    if (!summaryItemsHome || !totalPriceElHome) return;
    
    const data = servicesData[currentService];
    if (!data) return;
    
    let html = '';
    let total = 0;
    
    selectedOptionsHome.forEach(id => {
      let found = null;
      data.categories.forEach(cat => {
        const opt = cat.options.find(o => o.id === id);
        if (opt) found = opt;
      });
      
      if (found) {
        html += `
          <div class="summary-item">
            <span class="summary-item-name">${found.name}</span>
            <span class="summary-item-price">${found.price.toLocaleString('ru-RU')} ₽</span>
          </div>
        `;
        total += found.price;
      }
    });
    
    if (selectedOptionsHome.length === 0) {
      html = '<p class="summary-empty">Выберите опции для расчёта</p>';
    }
    
    summaryItemsHome.innerHTML = html;
    totalPriceElHome.textContent = total.toLocaleString('ru-RU') + ' ₽';
  }
  
  // Инициализация конструктора на главной
  if (optionsContainer) {
    renderOptionsHome();
    updateSummaryHome();
  }
  
  // ============================================
  // ФИЛЬТРЫ КЕЙСОВ
  // ============================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.dataset.filter;
      
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      caseCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          const categories = card.dataset.category || '';
          if (categories.includes(filter)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
  
  // ============================================
  // ФОРМЫ
  // ============================================
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Показываем уведомление
      showNotification('Заявка отправлена! 🎉', 'Мы свяжемся с вами в течение 2 часов.');
      form.reset();
      
      // Сбрасываем выбранные опции в конструкторе (если есть)
      const wrapper = form.closest('.constructor-wrapper');
      if (wrapper) {
        const optionItems = wrapper.querySelectorAll('.option-item.selected');
        optionItems.forEach(item => item.classList.remove('selected'));
        
        const summaryItems = wrapper.querySelector('.summary-items');
        const totalPrice = wrapper.querySelector('.summary-total-price');
        
        if (summaryItems) {
          summaryItems.innerHTML = '<p class="summary-empty">Выберите опции для расчёта</p>';
        }
        if (totalPrice) {
          totalPrice.textContent = '0 ₽';
        }
      }
    });
  });
  
  // ============================================
  // УВЕДОМЛЕНИЯ
  // ============================================
  function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: white;
      padding: 20px 24px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
      z-index: 9999;
      max-width: 350px;
      border-left: 4px solid #06b6d4;
      animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
      <h4 style="margin: 0 0 8px; font-size: 16px; color: #0f172a;">${title}</h4>
      <p style="margin: 0; font-size: 14px; color: #64748b;">${message}</p>
    `;
    
    // Добавляем анимацию
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Удаляем через 5 секунд
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100px)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  // ============================================
  // ПЛАВНЫЙ СКРОЛЛ
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
});
