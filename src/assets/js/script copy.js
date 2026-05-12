

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.getElementById('header');
    const heroSection = document.querySelector('.hero');
    const heroVideo = document.getElementById('hero-video');
    const heroContent = document.querySelector('.hero-content');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const langBtn = document.getElementById('lang-btn');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const backToTop = document.getElementById('back-to-top');
    const reviewTrack = document.querySelector('.reviews-track');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');


    /* hcer desapaecer el Logo con el Scroll */
    const logo = document.querySelector('.image_logo_hero');

window.addEventListener('scroll', () => {
    const heroHeight = window.innerHeight;
    const progress = window.scrollY / heroHeight;

    logo.style.opacity = Math.max(1 - progress * 2, 0);
    logo.style.transform = `translate(-50%, -50%) scale(${Math.max(1 - progress * 0.2, 0.9)})`;
});



    // 1. Video Scroll Control
    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateVideo() {
        const rect = heroSection.getBoundingClientRect();
        const sectionHeight = heroSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate progress (0 to 1) within the hero section
        // The scrollable distance is sectionHeight - windowHeight
        let progress = -rect.top / (sectionHeight - windowHeight);
        progress = Math.max(0, Math.min(1, progress));

        if (heroVideo.duration) {
            heroVideo.currentTime = progress * heroVideo.duration;
        }

        // Fade out content
        const opacity = 1 - (progress * 2);
        heroContent.style.opacity = Math.max(0, opacity);
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateVideo);
            ticking = true;
        }
    });

    // 2. Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    });

    // 3. Theme Switcher
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }

    // 4. Language Switcher
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        langDropdown.classList.remove('active');
    });

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

        function getTranslation(obj, path) {
            return path.split('.').reduce((acc, key) => {
                return acc?.[key];
            }, obj);
        }

    function setLanguage(lang) {

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = getTranslation(translations[lang],key)
            if (value) {
                el.textContent = value;
            }
        });

        // Update current flag and text
        const flagImg = document.getElementById('current-flag');
        const langText = document.getElementById('current-lang-text');
        
        const flags = {
            es: 'https://flagcdn.com/w20/es.png',
            en: 'https://flagcdn.com/w20/gb.png',
            fr: 'https://flagcdn.com/w20/fr.png',
            de: 'https://flagcdn.com/w20/de.png'
        };

        flagImg.src = flags[lang];
        langText.textContent = lang.toUpperCase();
        
        localStorage.setItem('lang', lang);
    }

    // Load saved language
    const savedLang = localStorage.getItem('lang') || 'es';
    setLanguage(savedLang);

    // 5. Mobile Menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 6. Scroll Animations (Fade-in)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section > div, .service-card, .project-item, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    // Add animation style dynamically
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // 7. Review Slider
    let currentSlide = 0;
    const totalSlides = reviewCards.length;
    const slidesVisible = window.innerWidth > 768 ? 2 : 1;

    function updateSlider() {
        const cardWidth = reviewCards[0].offsetWidth + 30; // card + gap
        reviewTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - slidesVisible) {
            currentSlide++;
            updateSlider();
        } else {
            currentSlide = 0;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        } else {
            currentSlide = totalSlides - slidesVisible;
            updateSlider();
        }
    });

    window.addEventListener('resize', updateSlider);

    // 8. Back to Top
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 9. Smooth Scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
