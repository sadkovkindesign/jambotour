document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('reviews-carousel');
    const btnPrev = document.getElementById('review-prev');
    const btnNext = document.getElementById('review-next');
    const pagCurrent = document.getElementById('pag-current');
    const progressFill = document.getElementById('pag-progress-fill');
    const pagTotal = document.getElementById('pag-total');

    if (!carousel || !btnPrev || !btnNext) return;

    let totalPages = 2;
    let currentPage = 0;

    // Обновление состояния прогресс-бара и цифр
    function updateSliderState(pageIndex) {
        pagCurrent.textContent = String(pageIndex + 1).padStart(2, '0');
        
        const progressPercent = ((pageIndex + 1) / totalPages) * 100;
        progressFill.style.width = `${progressPercent}%`;
    }

    // Листаем сразу на всю ширину видимой области (3 карточки)
    function getScrollPageWidth() {
        return carousel.clientWidth;
    }

    // Автоматический перерасчет страниц в зависимости от разрешения экрана
    function calculatePages() {
        const card = carousel.querySelector('.review-card');
        if (!card) return;
        
        // Сколько карточек полностью помещается в карусель сейчас
        const cardsInView = Math.round(carousel.clientWidth / card.getBoundingClientRect().width);
        
        if (cardsInView >= 3) {
            totalPages = 2; // Десктоп: 6 карточек / 3 в ряд = 2 страницы
        } else if (cardsInView === 2) {
            totalPages = 3; // Планшет: 6 карточек / 2 в ряд = 3 страницы
        } else {
            totalPages = 6; // Мобильный: 6 карточек / 1 в ряд = 6 страниц
        }
        
        if (pagTotal) {
            pagTotal.textContent = String(totalPages).padStart(2, '0');
        }
        updateSliderState(currentPage);
    }

    // Клик вперед (следующая страница)
    btnNext.addEventListener('click', () => {
        currentPage++;
        if (currentPage >= totalPages) {
            currentPage = 0; // Сброс карусели к началу
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: getScrollPageWidth(), behavior: 'smooth' });
        }
        updateSliderState(currentPage);
    });

    // Клик назад (предыдущая страница)
    btnPrev.addEventListener('click', () => {
        currentPage--;
        if (currentPage < 0) {
            currentPage = totalPages - 1; // Перемотка в самый конец
            carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: -getScrollPageWidth(), behavior: 'smooth' });
        }
        updateSliderState(currentPage);
    });

    // Отслеживание ручного скролла/свайпа для мобильных устройств
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const pageWidth = getScrollPageWidth();
            if (pageWidth > 0) {
                const pageIndex = Math.round(carousel.scrollLeft / pageWidth);
                if (pageIndex !== currentPage && pageIndex < totalPages) {
                    currentPage = pageIndex;
                    updateSliderState(currentPage);
                }
            }
        }, 100);
    });

    // Инициализация при загрузке страницы и изменении размеров окна
    window.addEventListener('resize', calculatePages);
    calculatePages();
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Логика Аккордеона (FAQ) ---
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const trigger = item.querySelector('.accordion-trigger');
        const content = item.querySelector('.accordion-content');

        if (!trigger || !content) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Закрываем все остальные открытые аккордеоны (режим "Solo")
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.accordion-content').style.maxHeight = '0';
                }
            });

            // Переключаем состояние текущего аккордеона
            if (isOpen) {
                item.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
                // Динамический расчет высоты для плавной CSS-анимации
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');
    const scrollThreshold = 50; // Точка, после которой включается матовое стекло

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 1. Логика изменения внешнего вида (матовое стекло)
        if (scrollTop > scrollThreshold) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // 2. Логика скрытия/показа при направлении скролла
        if (scrollTop > lastScrollTop && scrollTop > 150) {
            // Скроллим вниз — прячем хедер
            header.classList.add('header-hidden');
        } else {
            // Скроллим вверх — показываем хедер
            header.classList.remove('header-hidden');
        }

        // Не даем уходить в минус на мобильных при резинке (iOS bounce)
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, { passive: true });
});

// --- Плавный скролл к якорям с учетом высоты хедера ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return; // Игнорируем пустые ссылки-заглушки

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerHeight = document.querySelector('.main-header').offsetHeight;
            // Вычисляем позицию элемента на странице минус высота хедера и небольшой зазор
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 20; 

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth' // Плавный ход прокрутки
            });
        }
    });
});