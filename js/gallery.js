/**
 * Caffè Monelli Berlin - Gallery & Lightbox
 * Handles image gallery and lightbox functionality
 */

(function() {
    'use strict';

    // ====================================
    // Global Variables
    // ====================================
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImageIndex = 0;
    let imagesArray = [];

    // ====================================
    // Build Images Array from Gallery
    // ====================================
    function buildImagesArray() {
        imagesArray = Array.from(galleryItems).map(item => ({
            src: item.dataset.image || item.querySelector('img').src,
            alt: item.querySelector('img').alt || 'Gallery Image'
        }));
    }

    // ====================================
    // Open Lightbox
    // ====================================
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add keyboard event listener
        document.addEventListener('keydown', handleKeyboardNavigation);
    }

    // ====================================
    // Close Lightbox
    // ====================================
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Remove keyboard event listener
        document.removeEventListener('keydown', handleKeyboardNavigation);
    }

    // ====================================
    // Update Lightbox Image
    // ====================================
    function updateLightboxImage() {
        if (imagesArray.length === 0) return;

        const currentImage = imagesArray[currentImageIndex];

        // Fade out effect
        lightboxImage.style.opacity = '0';

        setTimeout(() => {
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.alt;

            // Fade in effect
            lightboxImage.onload = () => {
                lightboxImage.style.opacity = '1';
            };
        }, 150);

        // Update navigation button states
        updateNavigationButtons();
    }

    // ====================================
    // Update Navigation Button States
    // ====================================
    function updateNavigationButtons() {
        // Disable/enable buttons based on position
        if (currentImageIndex === 0) {
            lightboxPrev.style.opacity = '0.5';
            lightboxPrev.style.cursor = 'not-allowed';
        } else {
            lightboxPrev.style.opacity = '1';
            lightboxPrev.style.cursor = 'pointer';
        }

        if (currentImageIndex === imagesArray.length - 1) {
            lightboxNext.style.opacity = '0.5';
            lightboxNext.style.cursor = 'not-allowed';
        } else {
            lightboxNext.style.opacity = '1';
            lightboxNext.style.cursor = 'pointer';
        }
    }

    // ====================================
    // Show Previous Image
    // ====================================
    function showPreviousImage(e) {
        e.stopPropagation();
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateLightboxImage();
        }
    }

    // ====================================
    // Show Next Image
    // ====================================
    function showNextImage(e) {
        e.stopPropagation();
        if (currentImageIndex < imagesArray.length - 1) {
            currentImageIndex++;
            updateLightboxImage();
        }
    }

    // ====================================
    // Handle Keyboard Navigation
    // ====================================
    function handleKeyboardNavigation(e) {
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                if (currentImageIndex > 0) {
                    showPreviousImage(e);
                }
                break;
            case 'ArrowRight':
                if (currentImageIndex < imagesArray.length - 1) {
                    showNextImage(e);
                }
                break;
        }
    }

    // ====================================
    // Handle Touch Events for Mobile Swipe
    // ====================================
    let touchStartX = 0;
    let touchEndX = 0;

    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentImageIndex < imagesArray.length - 1) {
                // Swipe left - next image
                currentImageIndex++;
                updateLightboxImage();
            } else if (diff < 0 && currentImageIndex > 0) {
                // Swipe right - previous image
                currentImageIndex--;
                updateLightboxImage();
            }
        }
    }

    // ====================================
    // Preload Adjacent Images
    // ====================================
    function preloadAdjacentImages() {
        const preloadIndices = [
            currentImageIndex - 1,
            currentImageIndex + 1
        ];

        preloadIndices.forEach(index => {
            if (index >= 0 && index < imagesArray.length) {
                const img = new Image();
                img.src = imagesArray[index].src;
            }
        });
    }

    // ====================================
    // Add Zoom Functionality
    // ====================================
    let isZoomed = false;

    function toggleZoom(e) {
        if (e.target === lightboxImage) {
            isZoomed = !isZoomed;

            if (isZoomed) {
                lightboxImage.style.transform = 'scale(1.5)';
                lightboxImage.style.cursor = 'zoom-out';
                lightboxImage.style.transition = 'transform 0.3s ease';
            } else {
                lightboxImage.style.transform = 'scale(1)';
                lightboxImage.style.cursor = 'zoom-in';
            }
        }
    }

    // ====================================
    // Gallery Item Hover Effect Enhancement
    // ====================================
    function enhanceGalleryItems() {
        galleryItems.forEach((item, index) => {
            // Add staggered animation on load
            item.style.animationDelay = `${index * 0.05}s`;

            // Add click handler
            item.addEventListener('click', () => {
                openLightbox(index);
            });

            // Add keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `View image ${index + 1} of ${galleryItems.length}`);

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });
        });
    }

    // ====================================
    // Create Image Counter
    // ====================================
    function createImageCounter() {
        const counter = document.createElement('div');
        counter.id = 'imageCounter';
        counter.style.cssText = `
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 0.5rem 1.5rem;
            border-radius: 20px;
            font-size: 1rem;
            font-weight: 600;
            backdrop-filter: blur(10px);
            z-index: 10000;
        `;
        lightbox.appendChild(counter);
        return counter;
    }

    function updateImageCounter() {
        const counter = document.getElementById('imageCounter');
        if (counter) {
            counter.textContent = `${currentImageIndex + 1} / ${imagesArray.length}`;
        }
    }

    // ====================================
    // Initialize Event Listeners
    // ====================================
    function initEventListeners() {
        // Close button
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        // Navigation buttons
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', showPreviousImage);
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', showNextImage);
        }

        // Close on background click
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
        }

        // Touch events for mobile swipe
        if (lightbox) {
            lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
            lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        // Zoom functionality
        if (lightboxImage) {
            lightboxImage.addEventListener('click', toggleZoom);
            lightboxImage.style.cursor = 'zoom-in';
            lightboxImage.style.transition = 'transform 0.3s ease';
        }

        // Preload images when lightbox opens
        lightbox.addEventListener('transitionend', () => {
            if (lightbox.classList.contains('active')) {
                preloadAdjacentImages();
            }
        });
    }

    // ====================================
    // Lazy Load Gallery Images
    // ====================================
    function lazyLoadGalleryImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target.querySelector('img');
                        if (img && img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        entry.target.classList.add('loaded');
                        imageObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            galleryItems.forEach(item => imageObserver.observe(item));
        }
    }

    // ====================================
    // Add CSS Animation Class
    // ====================================
    function addGalleryAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .gallery-item {
                animation: fadeInScale 0.6s ease forwards;
                opacity: 0;
            }

            #lightboxImage {
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // ====================================
    // Initialize Gallery
    // ====================================
    function initGallery() {
        if (!lightbox || !lightboxImage || galleryItems.length === 0) {
            console.warn('Gallery elements not found');
            return;
        }

        buildImagesArray();
        enhanceGalleryItems();
        initEventListeners();
        lazyLoadGalleryImages();
        addGalleryAnimation();

        // Create image counter
        const counter = createImageCounter();

        // Update counter when lightbox opens
        lightbox.addEventListener('transitionend', () => {
            if (lightbox.classList.contains('active')) {
                updateImageCounter();
            }
        });

        // Update counter on navigation
        const originalUpdateLightboxImage = updateLightboxImage;
        updateLightboxImage = function() {
            originalUpdateLightboxImage();
            updateImageCounter();
        };

        console.log(`Gallery initialized with ${imagesArray.length} images! 📸`);
    }

    // ====================================
    // Initialize on DOM Ready
    // ====================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGallery);
    } else {
        initGallery();
    }

})();
