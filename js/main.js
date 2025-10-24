/**
 * Caffè Monelli Berlin - Main JavaScript
 * Handles navigation, smooth scrolling, and form interactions
 */

(function() {
    'use strict';

    // ====================================
    // Global Variables
    // ====================================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactForm = document.getElementById('contactForm');

    // ====================================
    // Navigation Scroll Effect
    // ====================================
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ====================================
    // Mobile Menu Toggle
    // ====================================
    function toggleMobileMenu() {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    // ====================================
    // Close Mobile Menu on Link Click
    // ====================================
    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ====================================
    // Smooth Scrolling for Navigation Links
    // ====================================
    function smoothScroll(e) {
        const href = this.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                closeMobileMenu();
                updateActiveNavLink(href);
            }
        }
    }

    // ====================================
    // Update Active Navigation Link
    // ====================================
    function updateActiveNavLink(activeHref) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === activeHref) {
                link.classList.add('active');
            }
        });
    }

    // ====================================
    // Intersection Observer for Section Highlighting
    // ====================================
    function observeSections() {
        const sections = document.querySelectorAll('section[id]');
        const navbarHeight = navbar.offsetHeight;

        const observerOptions = {
            root: null,
            rootMargin: `-${navbarHeight}px 0px -70% 0px`,
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeId = entry.target.getAttribute('id');
                    updateActiveNavLink(`#${activeId}`);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // ====================================
    // Form Validation & Submission
    // ====================================
    function handleFormSubmit(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !email || !message) {
            showFormMessage('Bitte füllen Sie alle Felder aus.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
            return;
        }

        // In a real implementation, this would send data to a server
        // For demo purposes, we'll just show a success message
        showFormMessage('Vielen Dank für Ihre Nachricht! Wir werden uns bald bei Ihnen melden.', 'success');
        contactForm.reset();
    }

    // ====================================
    // Show Form Message
    // ====================================
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            animation: fadeInUp 0.3s ease;
            background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
            border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        `;

        contactForm.appendChild(messageDiv);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }

    // ====================================
    // Lazy Loading Images
    // ====================================
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // Trigger loading
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // ====================================
    // Scroll to Top on Logo Click
    // ====================================
    function scrollToTop(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        closeMobileMenu();
    }

    // ====================================
    // Add Animation on Scroll
    // ====================================
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-item, .menu-category, .review-card, .info-card');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            animationObserver.observe(el);
        });
    }

    // ====================================
    // Handle External Links
    // ====================================
    function handleExternalLinks() {
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(link => {
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // ====================================
    // Initialize Performance Monitoring
    // ====================================
    function initPerformanceMonitoring() {
        // Log page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        });
    }

    // ====================================
    // Accessibility Enhancements
    // ====================================
    function enhanceAccessibility() {
        // Add keyboard navigation for mobile menu
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });

        // Focus trap for mobile menu
        if (navMenu.classList.contains('active')) {
            const focusableElements = navMenu.querySelectorAll('a, button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            navMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    }

    // ====================================
    // Event Listeners
    // ====================================
    function initEventListeners() {
        // Scroll event with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleNavbarScroll();
                    scrollTimeout = null;
                }, 10);
            }
        }, { passive: true });

        // Mobile menu toggle
        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', smoothScroll);
        });

        // Logo click
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', scrollToTop);
        }

        // Form submission
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmit);
        }

        // Close mobile menu on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
            }, 250);
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // ====================================
    // Initialize All Functions
    // ====================================
    function init() {
        // Check if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        initEventListeners();
        handleNavbarScroll();
        observeSections();
        lazyLoadImages();
        animateOnScroll();
        handleExternalLinks();
        enhanceAccessibility();
        initPerformanceMonitoring();

        console.log('Caffè Monelli Berlin website initialized successfully! ☕');
    }

    // Start initialization
    init();

})();
