/**
 * Elsie's C LLC Cleaning Service - Main JavaScript
 * Handles: Navigation, Language Switching, Carousel, Modal, Scroll Effects
 * @author Christian Herencia
 * @website https://christian-freelance.us/
 */

(function() {
    'use strict';

    // ===================================
    // DOM ELEMENTS
    // ===================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const langBtns = document.querySelectorAll('.lang-btn');
    const scrollTopBtn = document.getElementById('scrollTop');
    const portfolioModal = document.getElementById('portfolioModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalCounter = document.getElementById('modalCounter');
    const modalClose = portfolioModal?.querySelector('.modal-close');
    const modalPrev = portfolioModal?.querySelector('.modal-prev');
    const modalNext = portfolioModal?.querySelector('.modal-next');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const carouselDots = document.getElementById('carouselDots');

    // ===================================
    // CURRENT STATE
    // ===================================
    let currentLang = 'en';
    let currentSlide = 0;
    let currentPortfolioIndex = 0;
    let portfolioImages = [];
    let portfolioCaptions = [];
    let carouselAutoplayInterval = null;

    // ===================================
    // NAVIGATION
    // ===================================
    
    // Navbar scroll effect
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Hamburger menu toggle
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }

    // Close menu on link click
    function closeMenuOnLinkClick() {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Active link on scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===================================
    // LANGUAGE SWITCHING
    // ===================================
    
    function switchLanguage(lang) {
        currentLang = lang;
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update language buttons
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Update all translatable elements
        const translatableElements = document.querySelectorAll('[data-en]');
        translatableElements.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });
        
        // Update meta tags
        updateMetaTags(lang);
        
        // Store preference
        localStorage.setItem('preferred-lang', lang);
    }

    function updateMetaTags(lang) {
        // Update title
        const titleEl = document.querySelector(`title[${lang}]`);
        if (titleEl) {
            document.title = titleEl.getAttribute(lang);
        }
        
        // Update description
        const descMeta = document.querySelector(`meta[name="description-${lang}"]`);
        const descEl = document.querySelector('meta[name="description"]');
        if (descMeta && descEl) {
            descEl.setAttribute('content', descMeta.getAttribute('content'));
        }
        
        // Update keywords
        const keywordsMeta = document.querySelector(`meta[name="keywords-${lang}"]`);
        const keywordsEl = document.querySelector('meta[name="keywords"]');
        if (keywordsMeta && keywordsEl) {
            keywordsEl.setAttribute('content', keywordsMeta.getAttribute('content'));
        }
    }

    function initLanguage() {
        const storedLang = localStorage.getItem('preferred-lang');
        if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
            switchLanguage(storedLang);
        }
        
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                switchLanguage(btn.dataset.lang);
            });
        });
    }

    // ===================================
    // SCROLL TO TOP
    // ===================================
    
    function handleScrollTopVisibility() {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // ===================================
    // CAROUSEL
    // ===================================
    
    function initCarouselDots() {
        if (!carouselDots) return;
        
        carouselDots.innerHTML = '';
        carouselSlides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            carouselDots.appendChild(dot);
        });
    }

    function updateCarousel() {
        if (!carouselTrack) return;
        
        carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update dots
        const dots = carouselDots?.querySelectorAll('.carousel-dot');
        if (dots) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }
    }

    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
        resetCarouselAutoplay();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
        updateCarousel();
    }

    function startCarouselAutoplay() {
        carouselAutoplayInterval = setInterval(nextSlide, 5000);
    }

    function resetCarouselAutoplay() {
        clearInterval(carouselAutoplayInterval);
        startCarouselAutoplay();
    }

    function initCarousel() {
        initCarouselDots();
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetCarouselAutoplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetCarouselAutoplay();
            });
        }
        
        startCarouselAutoplay();
        
        // Pause on hover
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(carouselAutoplayInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                startCarouselAutoplay();
            });
        }
        
        // Touch support
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (carouselTrack) {
            carouselTrack.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                clearInterval(carouselAutoplayInterval);
            }, { passive: true });
            
            carouselTrack.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                startCarouselAutoplay();
            }, { passive: true });
        }
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                nextSlide();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                prevSlide();
            }
        }
    }

    // ===================================
    // PORTFOLIO MODAL
    // ===================================
    
    function initPortfolioData() {
        portfolioItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const caption = item.getAttribute('data-caption');
            
            if (img) {
                portfolioImages.push(img.src);
                portfolioCaptions.push(caption || '');
            }
            
            item.addEventListener('click', () => openModal(index));
        });
    }

    function openModal(index) {
        currentPortfolioIndex = index;
        updateModalContent();
        portfolioModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        portfolioModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateModalContent() {
        if (modalImage) {
            modalImage.src = portfolioImages[currentPortfolioIndex];
            modalImage.alt = portfolioCaptions[currentPortfolioIndex] || 'Portfolio image';
        }
        
        if (modalCaption) {
            modalCaption.textContent = portfolioCaptions[currentPortfolioIndex];
        }
        
        if (modalCounter) {
            modalCounter.textContent = `${currentPortfolioIndex + 1} / ${portfolioImages.length}`;
        }
    }

    function nextPortfolioImage() {
        currentPortfolioIndex = (currentPortfolioIndex + 1) % portfolioImages.length;
        updateModalContent();
    }

    function prevPortfolioImage() {
        currentPortfolioIndex = (currentPortfolioIndex - 1 + portfolioImages.length) % portfolioImages.length;
        updateModalContent();
    }

    function initPortfolioModal() {
        initPortfolioData();
        
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
        
        if (modalPrev) {
            modalPrev.addEventListener('click', prevPortfolioImage);
        }
        
        if (modalNext) {
            modalNext.addEventListener('click', nextPortfolioImage);
        }
        
        // Close on background click
        if (portfolioModal) {
            portfolioModal.addEventListener('click', (e) => {
                if (e.target === portfolioModal) {
                    closeModal();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!portfolioModal.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowRight') {
                nextPortfolioImage();
            } else if (e.key === 'ArrowLeft') {
                prevPortfolioImage();
            }
        });
    }

    // ===================================
    // SCROLL ANIMATIONS
    // ===================================
    
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(el => {
            observer.observe(el);
        });
    }

    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===================================
    // FOOTER YEAR
    // ===================================
    
    function updateFooterYear() {
        const yearEl = document.getElementById('currentYear');
        if (yearEl) {
            yearEl.textContent = new Date().getFullYear();
        }
    }

    // ===================================
    // LAZY LOADING ENHANCEMENT
    // ===================================
    
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ===================================
    // MOBILE MENU OVERLAY
    // ===================================
    
    function initMobileMenuOverlay() {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.classList.add('nav-overlay');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(overlay);
        
        hamburger.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            overlay.style.opacity = isActive ? '0' : '1';
            overlay.style.visibility = isActive ? 'hidden' : 'visible';
        });
        
        overlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
        });
    }

    // ===================================
    // PRELOADER (Optional enhancement)
    // ===================================
    
    function handlePageLoad() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });
    }

    // ===================================
    // VIDEO FALLBACK
    // ===================================
    
    function initVideoFallback() {
        const videos = document.querySelectorAll('.hero-video, .video-wrapper video');
        
        videos.forEach(video => {
            video.addEventListener('error', () => {
                // If video fails to load, show a gradient background instead
                const parent = video.parentElement;
                if (parent) {
                    parent.style.background = 'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)';
                }
            });
        });
    }

    // ===================================
    // PERFORMANCE: Debounce & Throttle
    // ===================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ===================================
    // INITIALIZATION
    // ===================================
    
    function init() {
        // Navigation
        handleNavbarScroll();
        closeMenuOnLinkClick();
        initMobileMenuOverlay();
        
        // Language
        initLanguage();
        
        // Carousel
        initCarousel();
        
        // Portfolio Modal
        initPortfolioModal();
        
        // Scroll Animations
        initScrollAnimations();
        
        // Smooth Scroll
        initSmoothScroll();
        
        // Footer Year
        updateFooterYear();
        
        // Lazy Loading
        initLazyLoading();
        
        // Video Fallback
        initVideoFallback();
        
        // Page Load
        handlePageLoad();
        
        // Event Listeners
        hamburger.addEventListener('click', toggleMenu);
        scrollTopBtn.addEventListener('click', scrollToTop);
        
        // Scroll Events (throttled for performance)
        const throttledScrollHandler = throttle(() => {
            handleNavbarScroll();
            updateActiveLink();
            handleScrollTopVisibility();
        }, 100);
        
        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        
        // Log initialization
        console.log('✨ Elsie\'s C LLC website initialized successfully');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
