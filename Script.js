// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const navContainer = document.querySelector('.nav-container');
    const navSocial = document.querySelector('.nav-social');
    const socialOriginalParent = navSocial ? navSocial.parentElement : null;
    const socialOriginalNextSibling = navSocial ? navSocial.nextElementSibling : null;

    function placeSocialIcons() {
        if (!navSocial || !navMenu || !navContainer) return;

        if (window.innerWidth <= 992) {
            if (!navMenu.contains(navSocial)) {
                navSocial.classList.add('nav-social-mobile');
                navMenu.appendChild(navSocial);
            }
        } else if (!navContainer.contains(navSocial)) {
            navSocial.classList.remove('nav-social-mobile');
            if (socialOriginalNextSibling && socialOriginalParent.contains(socialOriginalNextSibling)) {
                socialOriginalParent.insertBefore(navSocial, socialOriginalNextSibling);
            } else if (navToggle && socialOriginalParent.contains(navToggle)) {
                socialOriginalParent.insertBefore(navSocial, navToggle);
            } else {
                socialOriginalParent.appendChild(navSocial);
            }
        }
    }
    placeSocialIcons();

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        placeSocialIcons();
    });

    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add scroll effect styles
    const style = document.createElement('style');
    style.textContent = `
        .navbar {
            transition: transform 0.3s ease-in-out;
        }
    `;
    document.head.appendChild(style);

    // Dropdown menu functionality for mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const dropdown = this.parentElement;
                const dropdownMenu = dropdown.querySelector('.dropdown-menu');
                
                // Close other dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        const otherDropdown = otherToggle.parentElement;
                        const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                        otherMenu.style.display = 'none';
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                    dropdown.classList.remove('active');
                } else {
                    dropdownMenu.style.display = 'block';
                    dropdown.classList.add('active');
                }
            }
        });
    });


    // Social media link handlers
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'translateY(-2px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'translateY(-2px) scale(1)';
            }, 150);
            
            // You can add actual social media URLs here
            const platform = this.getAttribute('aria-label').toLowerCase();
            console.log(`Opening ${platform}...`);
        });
    });

    // Performance optimization: Debounce scroll events
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

    // Apply debounced scroll handler
    const debouncedScrollHandler = debounce(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.nav-brand, .nav-menu, .nav-social');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    console.log('Shredzone website initialized successfully!');

    // Advanced Image/Video Slider Functionality
    class AdvancedSlider {
        constructor() {
            this.sliderContainer = document.querySelector('.slider-container');
            this.slides = document.querySelectorAll('.slide');
            this.dots = document.querySelectorAll('.dot');
            this.prevBtn = document.querySelector('.slider-nav.prev');
            this.nextBtn = document.querySelector('.slider-nav.next');
            this.playPauseBtn = document.querySelector('.slider-play-pause');
            this.progressBar = document.querySelector('.progress-bar');
            
            this.currentSlide = 0;
            this.totalSlides = this.slides.length;
            this.isPlaying = true;
            this.autoPlayInterval = null;
            this.progressInterval = null;
            this.slideDuration = 5000; // 5 seconds per slide
            
            // Touch/swipe variables
            this.touchStartX = 0;
            this.touchEndX = 0;
            this.minSwipeDistance = 50;
            
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.startAutoPlay();
            this.updateProgressBar();
            this.preloadImages();
        }
        
        setupEventListeners() {
            // Navigation buttons
            this.prevBtn.addEventListener('click', () => this.previousSlide());
            this.nextBtn.addEventListener('click', () => this.nextSlide());
            
            // Dots navigation
            this.dots.forEach((dot, index) => {
                dot.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Play/Pause button
            this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
            
            // Touch events for mobile
            this.sliderContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            this.sliderContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e));
            
            // Mouse events for desktop
            this.sliderContainer.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            this.sliderContainer.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeyboard(e));
            
            // Pause on hover
            this.sliderContainer.addEventListener('mouseenter', () => this.pauseAutoPlay());
            this.sliderContainer.addEventListener('mouseleave', () => this.resumeAutoPlay());
            
            // Visibility change (pause when tab is not active)
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoPlay();
                } else {
                    this.resumeAutoPlay();
                }
            });
        }
        
        handleTouchStart(e) {
            this.touchStartX = e.touches[0].clientX;
            this.sliderContainer.classList.add('touch-active');
        }
        
        handleTouchEnd(e) {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
            this.sliderContainer.classList.remove('touch-active');
        }
        
        handleMouseDown(e) {
            this.touchStartX = e.clientX;
            this.sliderContainer.classList.add('touch-active');
        }
        
        handleMouseUp(e) {
            this.touchEndX = e.clientX;
            this.handleSwipe();
            this.sliderContainer.classList.remove('touch-active');
        }
        
        handleSwipe() {
            const swipeDistance = this.touchEndX - this.touchStartX;
            
            if (Math.abs(swipeDistance) > this.minSwipeDistance) {
                if (swipeDistance > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }
        
        handleKeyboard(e) {
            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
            }
        }
        
        goToSlide(index) {
            if (index === this.currentSlide) return;
            
            this.slides[this.currentSlide].classList.remove('active');
            this.dots[this.currentSlide].classList.remove('active');
            
            this.currentSlide = index;
            
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
            
            this.resetProgressBar();
            this.updateVideoState();
        }
        
        nextSlide() {
            const nextIndex = (this.currentSlide + 1) % this.totalSlides;
            this.goToSlide(nextIndex);
        }
        
        previousSlide() {
            const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevIndex);
        }
        
        startAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
            }
            
            this.autoPlayInterval = setInterval(() => {
                if (this.isPlaying) {
                    this.nextSlide();
                }
            }, this.slideDuration);
        }
        
        pauseAutoPlay() {
            this.isPlaying = false;
            this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            this.playPauseBtn.setAttribute('aria-label', 'Play slider');
        }
        
        resumeAutoPlay() {
            this.isPlaying = true;
            this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            this.playPauseBtn.setAttribute('aria-label', 'Pause slider');
        }
        
        togglePlayPause() {
            if (this.isPlaying) {
                this.pauseAutoPlay();
            } else {
                this.resumeAutoPlay();
            }
        }
        
        updateProgressBar() {
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
            }
            
            let progress = 0;
            const progressStep = 100 / (this.slideDuration / 100);
            
            this.progressInterval = setInterval(() => {
                if (this.isPlaying) {
                    progress += progressStep;
                    this.progressBar.style.width = `${progress}%`;
                    
                    if (progress >= 100) {
                        progress = 0;
                    }
                }
            }, 100);
        }
        
        resetProgressBar() {
            this.progressBar.style.width = '0%';
            this.updateProgressBar();
        }
        
        updateVideoState() {
            // Pause all videos
            const videos = document.querySelectorAll('.slide-video');
            videos.forEach(video => {
                video.pause();
            });
            
            // Play current slide video if it exists
            const currentVideo = this.slides[this.currentSlide].querySelector('.slide-video');
            if (currentVideo) {
                currentVideo.play().catch(e => {
                    console.log('Video autoplay prevented:', e);
                });
            }
        }
        
        preloadImages() {
            const images = document.querySelectorAll('.slide-image');
            images.forEach(img => {
                const imageLoader = new Image();
                imageLoader.src = img.src;
            });
        }
        
        destroy() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
            }
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
            }
        }
    }
    
    // Initialize slider when DOM is loaded
    const slider = new AdvancedSlider();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Recalculate slider dimensions if needed
        slider.updateVideoState();
    });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        slider.destroy();
    });

    // Advanced About Section Functionality
    class AboutSection {
        constructor() {
            this.readMoreBtn = document.getElementById('read-more-btn');
            this.aboutDetails = document.getElementById('about-details');
            this.statNumbers = document.querySelectorAll('.stat-number');
            this.progressBars = document.querySelectorAll('.progress-bar-fill');
            this.isExpanded = false;
            this.animationTriggered = false;
            
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.setupIntersectionObserver();
        }
        
        setupEventListeners() {
            // Read more button
            this.readMoreBtn.addEventListener('click', () => this.toggleReadMore());
        }
        
        setupIntersectionObserver() {
            const observerOptions = {
                threshold: 0.3,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.animationTriggered) {
                        this.triggerAnimations();
                        this.animationTriggered = true;
                    }
                });
            }, observerOptions);
            
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                observer.observe(aboutSection);
            }
        }
        
        toggleReadMore() {
            this.isExpanded = !this.isExpanded;
            
            if (this.isExpanded) {
                this.aboutDetails.classList.add('expanded');
                this.readMoreBtn.classList.add('expanded');
                this.readMoreBtn.querySelector('.btn-text').textContent = 'Read Less';
            } else {
                this.aboutDetails.classList.remove('expanded');
                this.readMoreBtn.classList.remove('expanded');
                this.readMoreBtn.querySelector('.btn-text').textContent = 'Read More';
            }
        }
        
        triggerAnimations() {
            // Animate stat numbers
            this.animateNumbers();
            
            // Animate progress bars
            this.animateProgressBars();
            
            // Add staggered animation to cards
            this.animateCards();
        }
        
        animateNumbers() {
            this.statNumbers.forEach((statNumber, index) => {
                const target = parseInt(statNumber.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    
                    // Format number with commas
                    const formattedNumber = Math.floor(current).toLocaleString();
                    statNumber.textContent = formattedNumber;
                }, 16);
            });
        }
        
        animateProgressBars() {
            this.progressBars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                }, index * 200); // Stagger animation
            });
        }
        
        animateCards() {
            const cards = document.querySelectorAll('.stat-card, .about-detail-item, .progress-section, .mission-section');
            
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                }, index * 100);
            });
        }
    }
    
    // Initialize about section when DOM is loaded
    const aboutSection = new AboutSection();

    // Advanced Products Section Functionality
    class ProductsSection {
        constructor() {
            this.productCards = document.querySelectorAll('.product-card');
            this.tabButtons = document.querySelectorAll('.tab-btn');
            this.wishlistButtons = document.querySelectorAll('.wishlist-btn');
            this.addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
            this.quickViewButtons = document.querySelectorAll('.quick-view-btn');
            this.loadMoreBtn = document.querySelector('.load-more-btn');
            
            // Slider functionality
            this.sliderContainer = document.querySelector('.products-slider-container');
            this.productsGrid = document.getElementById('products-grid');
            this.prevBtn = document.querySelector('.products-nav.prev');
            this.nextBtn = document.querySelector('.products-nav.next');
            this.indicatorsContainer = document.querySelector('.products-indicators');
            this.indicatorDots = document.querySelectorAll('.indicator-dot');
            
            this.mobileVisibleCount = 5;
            this.mobileShowAll = false;
            this.isMobileHorizontal = false;
            
            this.currentSlide = 0;
            this.slidesPerView = this.getSlidesPerView();
            this.slideWidth = this.getSlideWidth();
            this.totalSlides = this.calculateTotalSlides();
            
            this.init();
        }
        
        getSlidesPerView() {
            const width = window.innerWidth;
            if (width >= 1200) return 5;
            if (width >= 992) return 4;
            if (width >= 768) return 3;
            if (width >= 576) return 2;
            return 1;
        }
        
        getSlideWidth() {
            if (!this.productCards.length) return 0;
            const firstCard = this.productCards[0];
            const cardWidth = firstCard.getBoundingClientRect().width;
            const gridStyles = window.getComputedStyle(this.productsGrid);
            const gapValue = gridStyles.columnGap || gridStyles.gap || '0';
            const gap = parseFloat(gapValue);
            if (Number.isNaN(cardWidth)) return 0;
            return cardWidth + (Number.isNaN(gap) ? 0 : gap);
        }
        
        calculateTotalSlides() {
            if (!this.productCards.length) return 0;
            const visible = Math.max(this.slidesPerView, 1);
            const surplus = Math.max(this.productCards.length - visible, 0);
            return surplus + 1;
        }
        
        generateIndicatorDots() {
            if (!this.indicatorsContainer) return;
            
            this.indicatorsContainer.innerHTML = '';
            
            if (this.totalSlides <= 1 || this.isMobileHorizontal) {
                this.indicatorsContainer.style.display = 'none';
                this.indicatorDots = [];
                return;
            }
            
            this.indicatorsContainer.style.display = 'flex';
            
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = `indicator-dot ${i === this.currentSlide ? 'active' : ''}`;
                dot.setAttribute('data-slide', i);
                dot.addEventListener('click', () => this.goToSlide(i));
                this.indicatorsContainer.appendChild(dot);
            }
            
            this.indicatorDots = this.indicatorsContainer.querySelectorAll('.indicator-dot');
        }
        
        init() {
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.initializeWishlist();
            this.updateLayoutMode();
            this.updateSlider();
        }
        
        handleResize() {
            const previousSlidesPerView = this.slidesPerView;
            this.slidesPerView = this.getSlidesPerView();
            this.slideWidth = this.getSlideWidth();
            this.totalSlides = this.calculateTotalSlides();
            this.updateLayoutMode();
            
            if (this.slidesPerView !== previousSlidesPerView) {
                this.currentSlide = Math.min(this.currentSlide, this.totalSlides - 1);
                this.generateIndicatorDots();
            }
            
            this.updateSlider();
        }
        
        goToSlide(slideIndex) {
            if (this.isMobileHorizontal) return;
            this.currentSlide = slideIndex;
            if (this.currentSlide < 0) this.currentSlide = 0;
            if (this.currentSlide > this.totalSlides - 1) {
                this.currentSlide = this.totalSlides - 1;
            }
            this.updateSlider();
        }
        
        nextSlide() {
            if (this.isMobileHorizontal) return;
            if (this.currentSlide >= this.totalSlides - 1) return;
            this.currentSlide++;
            this.updateSlider();
        }
        
        previousSlide() {
            if (this.isMobileHorizontal) return;
            if (this.currentSlide <= 0) return;
            this.currentSlide--;
            this.updateSlider();
        }
        
        updateSlider() {
            if (this.isMobileHorizontal) {
                this.productsGrid.style.transform = 'none';
                return;
            }
            
            if (!this.slideWidth) {
                this.slideWidth = this.getSlideWidth();
            }
            
            const translateX = -this.currentSlide * this.slideWidth;
            this.productsGrid.style.transform = `translateX(${translateX}px)`;
            
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentSlide === 0;
            }
            
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentSlide >= this.totalSlides - 1;
            }
            
            this.indicatorDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentSlide);
            });
        }
        
        updateLayoutMode() {
            const isMobile = window.innerWidth < 576;
            
            if (isMobile && !this.isMobileHorizontal) {
                this.isMobileHorizontal = true;
                this.productsGrid.classList.add('products-grid-mobile');
                this.productsGrid.style.transform = 'none';
                
                this.productCards.forEach((card, index) => {
                    if (!this.mobileShowAll && index >= this.mobileVisibleCount) {
                        card.classList.add('product-card-hidden-mobile');
                    } else {
                        card.classList.remove('product-card-hidden-mobile');
                    }
                });
                
                if (this.sliderContainer) {
                    this.sliderContainer.classList.add('mobile-mode');
                }
                
                if (this.prevBtn) this.prevBtn.style.display = 'none';
                if (this.nextBtn) this.nextBtn.style.display = 'none';
                if (this.indicatorsContainer) this.indicatorsContainer.style.display = 'none';
                
                this.indicatorDots = [];
                this.currentSlide = 0;
                return;
            }
            
            if (!isMobile && this.isMobileHorizontal) {
                this.isMobileHorizontal = false;
                this.productsGrid.classList.remove('products-grid-mobile');
                this.productCards.forEach(card => card.classList.remove('product-card-hidden-mobile'));
                
                if (this.sliderContainer) {
                    this.sliderContainer.classList.remove('mobile-mode');
                }
                
                if (this.prevBtn) this.prevBtn.style.display = '';
                if (this.nextBtn) this.nextBtn.style.display = '';
                
                this.slideWidth = this.getSlideWidth();
                this.totalSlides = this.calculateTotalSlides();
                this.generateIndicatorDots();
                this.updateSlider();
            }
            
            if (!isMobile && !this.isMobileHorizontal) {
                this.generateIndicatorDots();
            }
        }
        
        setupEventListeners() {
            // Tab functionality
            this.tabButtons.forEach(button => {
                button.addEventListener('click', (e) => this.handleTabClick(e));
            });
            
            // Wishlist functionality
            this.wishlistButtons.forEach(button => {
                button.addEventListener('click', (e) => this.handleWishlistClick(e));
            });
            
            // Add to cart functionality
            this.addToCartButtons.forEach(button => {
                button.addEventListener('click', (e) => this.handleAddToCart(e));
            });
            
            // Quick view functionality
            this.quickViewButtons.forEach(button => {
                button.addEventListener('click', (e) => this.handleQuickView(e));
            });
            
            // Load more functionality
            if (this.loadMoreBtn) {
                this.loadMoreBtn.addEventListener('click', () => this.handleLoadMore());
            }
            
            // Slider navigation
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.previousSlide());
            }
            
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }
            
            // Window resize
            window.addEventListener('resize', () => this.handleResize());
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        }
        
        handleKeyNavigation(e) {
            // Only handle arrow keys when products section is visible
            const productsSection = document.querySelector('.products-section');
            if (!productsSection) return;
            
            const rect = productsSection.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (!isVisible) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextSlide();
                    break;
            }
        }
        
        setupIntersectionObserver() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            this.productCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                observer.observe(card);
            });
        }
        
        handleTabClick(e) {
            const button = e.target;
            const productCard = button.closest('.product-card');
            const tabName = button.getAttribute('data-tab');
            
            // Remove active class from all tabs in this product
            const allTabs = productCard.querySelectorAll('.tab-btn');
            allTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Hide all tab content in this product
            const allContent = productCard.querySelectorAll('.tab-content');
            allContent.forEach(content => content.classList.remove('active'));
            
            // Show selected tab content
            const targetContent = productCard.querySelector(`[data-content="${tabName}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }
        
        handleWishlistClick(e) {
            e.preventDefault();
            const button = e.currentTarget;
            const productCard = button.closest('.product-card');
            const productId = productCard.getAttribute('data-product');
            
            // Toggle wishlist state
            button.classList.toggle('active');
            
            // Update icon
            const icon = button.querySelector('i');
            if (button.classList.contains('active')) {
                icon.className = 'fas fa-heart';
                this.showNotification('Added to wishlist!', 'success');
            } else {
                icon.className = 'far fa-heart';
                this.showNotification('Removed from wishlist!', 'info');
            }
            
            // Store wishlist state in localStorage
            this.updateWishlistStorage(productId, button.classList.contains('active'));
        }
        
        handleAddToCart(e) {
            e.preventDefault();
            const button = e.currentTarget;
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            // Add loading state
            const originalText = button.textContent;
            button.textContent = 'Adding...';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                button.textContent = 'Added!';
                button.style.background = 'linear-gradient(135deg, var(--secondary-accent), #00B8B8)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = 'linear-gradient(135deg, var(--primary-accent), #FF6B35)';
                }, 1500);
                
                this.showNotification(`${productName} added to cart!`, 'success');
            }, 1000);
        }
        
        handleQuickView(e) {
            e.preventDefault();
            const button = e.currentTarget;
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            
            this.showNotification(`Quick view for ${productName}`, 'info');
            // Here you would typically open a modal with detailed product information
        }
        
        handleLoadMore() {
            const button = this.loadMoreBtn;
            const originalText = button.textContent;
            
            button.textContent = 'Loading...';
            button.disabled = true;
            
            // Simulate loading more products
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
                
                if (this.isMobileHorizontal) {
                    this.mobileShowAll = true;
                    this.productCards.forEach(card => card.classList.remove('product-card-hidden-mobile'));
                }
                
                this.showNotification('More products loaded!', 'success');
            }, 2000);
        }
        
        initializeWishlist() {
            // Load wishlist state from localStorage
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '{}');
            
            this.wishlistButtons.forEach(button => {
                const productCard = button.closest('.product-card');
                const productId = productCard.getAttribute('data-product');
                
                if (wishlist[productId]) {
                    button.classList.add('active');
                    const icon = button.querySelector('i');
                    icon.className = 'fas fa-heart';
                }
            });
        }
        
        updateWishlistStorage(productId, isWishlisted) {
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '{}');
            
            if (isWishlisted) {
                wishlist[productId] = true;
            } else {
                delete wishlist[productId];
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
        
        showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Style the notification
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: type === 'success' ? 'var(--secondary-accent)' : 
                           type === 'error' ? '#ff4444' : 'var(--primary-accent)',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: '10000',
                transform: 'translateX(100%)',
                transition: 'transform 0.3s ease',
                fontSize: '0.9rem',
                fontWeight: '500'
            });
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }
    }
    
    // Initialize products section when DOM is loaded
    const productsSection = new ProductsSection();

    // Futuristic Contact Section Functionality
    class ContactSection {
        constructor() {
            this.enquireBtn = document.getElementById('enquire-btn');
            this.demoBtn = document.getElementById('demo-btn');
            this.contactCards = document.querySelectorAll('.contact-card');
            
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.setupIntersectionObserver();
            this.setupRippleEffect();
        }
        
        setupEventListeners() {
            // Enquire button
            if (this.enquireBtn) {
                this.enquireBtn.addEventListener('click', (e) => this.handleEnquireClick(e));
            }
            
            // Demo button
            if (this.demoBtn) {
                this.demoBtn.addEventListener('click', (e) => this.handleDemoClick(e));
            }
            
            // Card hover effects
            this.contactCards.forEach(card => {
                card.addEventListener('mouseenter', () => this.handleCardHover(card));
                card.addEventListener('mouseleave', () => this.handleCardLeave(card));
            });
        }
        
        setupIntersectionObserver() {
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            this.contactCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
                observer.observe(card);
            });
        }
        
        setupRippleEffect() {
            [this.enquireBtn, this.demoBtn].forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', (e) => this.createRipple(e, btn));
                }
            });
        }
        
        createRipple(e, button) {
            const ripple = button.querySelector('.btn-ripple');
            if (!ripple) return;
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.animation = 'none';
            
            setTimeout(() => {
                ripple.style.animation = 'ripple 0.6s linear';
            }, 10);
        }
        
        handleEnquireClick(e) {
            e.preventDefault();
            this.showContactModal('enquire');
        }
        
        handleDemoClick(e) {
            e.preventDefault();
            this.showContactModal('demo');
        }
        
        showContactModal(type) {
            const modal = document.createElement('div');
            modal.className = 'contact-modal';
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>${type === 'enquire' ? 'Enquire Now' : 'Book Demo Session'}</h3>
                            <button class="modal-close">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form class="contact-form">
                                <div class="form-group">
                                    <input type="text" placeholder="Your Name" required>
                                </div>
                                <div class="form-group">
                                    <input type="email" placeholder="Email Address" required>
                                </div>
                                <div class="form-group">
                                    <input type="tel" placeholder="Phone Number">
                                </div>
                                <div class="form-group">
                                    <select required>
                                        <option value="">Select Service</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="product">Product Information</option>
                                        <option value="support">Technical Support</option>
                                        <option value="demo">${type === 'demo' ? 'Demo Session' : 'Consultation'}</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <textarea placeholder="Tell us about your fitness goals..." rows="4"></textarea>
                                </div>
                                <button type="submit" class="submit-btn">
                                    ${type === 'enquire' ? 'Send Inquiry' : 'Book Demo'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal styles
            const style = document.createElement('style');
            style.textContent = `
                .contact-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    animation: modalFadeIn 0.3s ease;
                }
                
                .modal-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                
                .modal-content {
                    background: rgba(28, 42, 57, 0.95);
                    border: 1px solid rgba(0, 206, 209, 0.3);
                    border-radius: 20px;
                    max-width: 500px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: modalSlideIn 0.3s ease;
                }
                
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid rgba(0, 206, 209, 0.2);
                }
                
                .modal-header h3 {
                    color: var(--text-white);
                    font-size: 1.5rem;
                    font-weight: var(--font-weight-bold);
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    color: var(--text-gray);
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: var(--transition-medium);
                }
                
                .modal-close:hover {
                    color: var(--primary-accent);
                }
                
                .modal-body {
                    padding: 2rem;
                }
                
                .contact-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    background: rgba(28, 42, 57, 0.6);
                    border: 1px solid rgba(0, 206, 209, 0.3);
                    border-radius: 8px;
                    color: var(--text-white);
                    font-size: 1rem;
                    transition: var(--transition-medium);
                }
                
                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: var(--primary-accent);
                    box-shadow: 0 0 0 2px rgba(255, 69, 0, 0.2);
                }
                
                .form-group input::placeholder,
                .form-group textarea::placeholder {
                    color: var(--text-gray);
                }
                
                .submit-btn {
                    padding: 1rem 2rem;
                    background: linear-gradient(135deg, var(--primary-accent), #FF6B35);
                    border: none;
                    border-radius: 8px;
                    color: var(--text-white);
                    font-size: 1.1rem;
                    font-weight: var(--font-weight-semibold);
                    cursor: pointer;
                    transition: var(--transition-medium);
                    margin-top: 1rem;
                }
                
                .submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(255, 69, 0, 0.4);
                }
                
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes modalSlideIn {
                    from { transform: translateY(-50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                @media (max-width: 768px) {
                    .modal-overlay {
                        padding: 1rem;
                    }
                    
                    .modal-content {
                        max-height: 95vh;
                    }
                    
                    .modal-header {
                        padding: 1rem 1.5rem;
                    }
                    
                    .modal-body {
                        padding: 1.5rem;
                    }
                }
            `;
            
            document.head.appendChild(style);
            document.body.appendChild(modal);
            
            // Close modal functionality
            const closeModal = () => {
                modal.style.animation = 'modalFadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(modal);
                    document.head.removeChild(style);
                }, 300);
            };
            
            modal.querySelector('.modal-close').addEventListener('click', closeModal);
            modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
                if (e.target === e.currentTarget) closeModal();
            });
            
            // Form submission
            modal.querySelector('.contact-form').addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(type);
                closeModal();
            });
            
            // Add fade out animation
            const fadeOutStyle = document.createElement('style');
            fadeOutStyle.textContent = `
                @keyframes modalFadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(fadeOutStyle);
        }
        
        handleFormSubmission(type) {
            this.showNotification(
                `Thank you! Your ${type === 'enquire' ? 'inquiry' : 'demo request'} has been submitted successfully. We'll get back to you within 24 hours.`,
                'success'
            );
        }
        
        handleCardHover(card) {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        }
        
        handleCardLeave(card) {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        }
        
        showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Style the notification
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: type === 'success' ? 'var(--secondary-accent)' : 
                           type === 'error' ? '#ff4444' : 'var(--primary-accent)',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: '10000',
                transform: 'translateX(100%)',
                transition: 'transform 0.3s ease',
                fontSize: '0.9rem',
                fontWeight: '500',
                maxWidth: '400px'
            });
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 5 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    }
    
    // Initialize contact section when DOM is loaded
    const contactSection = new ContactSection();

    // Advanced Footer Functionality
    class FooterSection {
        constructor() {
            this.subscribeForm = document.querySelector('.subscribe-form');
            this.socialLinks = document.querySelectorAll('.social-link');
            this.footerLinks = document.querySelectorAll('.footer-links a');
            
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.setupSmoothScrolling();
        }
        
        setupEventListeners() {
            // Newsletter subscription
            if (this.subscribeForm) {
                this.subscribeForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
            }
            
            // Social links
            this.socialLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleSocialClick(e));
            });
            
            // Footer links
            this.footerLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleFooterLinkClick(e));
            });
        }
        
        setupSmoothScrolling() {
            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
        
        handleNewsletterSubmit(e) {
            e.preventDefault();
            const emailInput = e.target.querySelector('input[type="email"]');
            const submitBtn = e.target.querySelector('.subscribe-btn');
            
            if (!emailInput.value) {
                this.showNotification('Please enter your email address.', 'error');
                return;
            }
            
            if (!this.isValidEmail(emailInput.value)) {
                this.showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                submitBtn.style.background = 'linear-gradient(135deg, var(--secondary-accent), #00B8B8)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = 'linear-gradient(135deg, var(--primary-accent), #FF6B35)';
                    emailInput.value = '';
                }, 2000);
                
                this.showNotification('Thank you for subscribing! You\'ll receive our latest updates soon.', 'success');
            }, 1500);
        }
        
        handleSocialClick(e) {
            e.preventDefault();
            const platform = e.currentTarget.classList[1]; // facebook, twitter, etc.
            const platformNames = {
                'facebook': 'Facebook',
                'twitter': 'Twitter',
                'instagram': 'Instagram',
                'youtube': 'YouTube',
                'linkedin': 'LinkedIn'
            };
            
            this.showNotification(`Redirecting to ${platformNames[platform]}...`, 'info');
            
            // In a real application, you would redirect to actual social media pages
            // window.open(`https://${platform}.com/shredzone`, '_blank');
        }
        
        handleFooterLinkClick(e) {
            const href = e.currentTarget.getAttribute('href');
            
            // Handle internal links with smooth scrolling
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                // Handle external links
                this.showNotification('Opening external link...', 'info');
            }
        }
        
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
        
        showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Style the notification
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: type === 'success' ? 'var(--secondary-accent)' : 
                           type === 'error' ? '#ff4444' : 'var(--primary-accent)',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                zIndex: '10000',
                transform: 'translateX(100%)',
                transition: 'transform 0.3s ease',
                fontSize: '0.9rem',
                fontWeight: '500',
                maxWidth: '400px'
            });
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 4 seconds
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 4000);
        }
    }
    
    // Initialize footer section when DOM is loaded
    const footerSection = new FooterSection();

    // About Us Page Functionality
    class AboutUsPage {
        constructor() {
            this.statNumbers = document.querySelectorAll('.stat-number');
            this.timelineItems = document.querySelectorAll('.timeline-item');
            this.teamMembers = document.querySelectorAll('.team-member');
            this.valueCards = document.querySelectorAll('.value-card');
            this.orgMembers = document.querySelectorAll('.org-member');
            
            this.init();
        }
        
        init() {
            this.setupIntersectionObserver();
            this.setupAnimations();
            this.setupFloatingCards();
        }
        
        setupIntersectionObserver() {
            const observerOptions = {
                threshold: 0.2,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains('stat-number')) {
                            this.animateCounter(entry.target);
                        } else if (entry.target.classList.contains('timeline-item')) {
                            this.animateTimelineItem(entry.target);
                        } else if (entry.target.classList.contains('team-member')) {
                            this.animateTeamMember(entry.target);
                        } else if (entry.target.classList.contains('value-card')) {
                            this.animateValueCard(entry.target);
                        } else if (entry.target.classList.contains('org-member')) {
                            this.animateOrgMember(entry.target);
                        }
                    }
                });
            }, observerOptions);
            
            // Observe all animated elements
            [...this.statNumbers, ...this.timelineItems, ...this.teamMembers, ...this.valueCards, ...this.orgMembers]
                .forEach(element => observer.observe(element));
        }
        
        setupAnimations() {
            // Add initial styles for animations
            this.timelineItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-30px)';
                item.style.transition = `opacity 0.8s ease ${index * 0.2}s, transform 0.8s ease ${index * 0.2}s`;
            });
            
            this.teamMembers.forEach((member, index) => {
                member.style.opacity = '0';
                member.style.transform = 'translateY(30px)';
                member.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
            });
            
            this.valueCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
            });
            
            this.orgMembers.forEach((member, index) => {
                member.style.opacity = '0';
                member.style.transform = 'scale(0.8)';
                member.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
            });
        }
        
        setupFloatingCards() {
            const floatingCards = document.querySelectorAll('.floating-card');
            
            floatingCards.forEach((card, index) => {
                // Add random floating animation
                const randomDelay = Math.random() * 2;
                const randomDuration = 3 + Math.random() * 2;
                
                card.style.animationDelay = `${randomDelay}s`;
                card.style.animationDuration = `${randomDuration}s`;
                
                // Add hover effects
                card.addEventListener('mouseenter', () => {
                    card.style.animationPlayState = 'paused';
                    card.style.transform = 'scale(1.1) translateY(-10px)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.animationPlayState = 'running';
                    card.style.transform = '';
                });
            });
        }
        
        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format numbers with commas for large numbers
                if (target >= 1000) {
                    element.textContent = Math.floor(current).toLocaleString();
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 16);
        }
        
        animateTimelineItem(element) {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }
        
        animateTeamMember(element) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
        
        animateValueCard(element) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
        
        animateOrgMember(element) {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }
    }
    
    // Initialize About Us page functionality when DOM is loaded
    if (document.querySelector('.about-hero')) {
        const aboutUsPage = new AboutUsPage();
    }

    class ProductsPageEnhancements {
        constructor() {
            this.pageRoot = document.querySelector('.products-page');
            if (!this.pageRoot) {
                return;
            }

            this.filterChips = Array.from(document.querySelectorAll('.filter-chip'));
            this.searchInput = document.getElementById('products-search');
            this.priceRange = document.getElementById('price-range');
            this.priceLabel = document.getElementById('price-range-value');
            this.sortSelect = document.getElementById('products-sort');
            this.productsGrid = document.getElementById('products-showcase-grid');
            this.loadMoreBtn = document.getElementById('products-load-more');

            if (!this.productsGrid) {
                return;
            }

            this.productCards = Array.from(this.productsGrid.querySelectorAll('.product-card'));
            this.displayStep = 5;
            this.displayCount = this.displayStep;
            this.activeCategory = 'all';

            this.init();
        }

        init() {
            this.filterChips.forEach((chip) => {
                chip.addEventListener('click', () => {
                    this.filterChips.forEach((other) => other.classList.remove('active'));
                    chip.classList.add('active');
                    this.activeCategory = chip.getAttribute('data-filter') || 'all';
                    this.displayCount = this.displayStep;
                    this.applyFilters();
                });
            });

            if (this.searchInput) {
                this.searchInput.addEventListener(
                    'input',
                    debounce(() => {
                        this.displayCount = this.displayStep;
                        this.applyFilters();
                    }, 180)
                );
            }

            if (this.priceRange) {
                this.updatePriceLabel();
                this.priceRange.addEventListener('input', () => {
                    this.updatePriceLabel();
                    this.displayCount = this.displayStep;
                    this.applyFilters();
                });
            }

            if (this.sortSelect) {
                this.sortSelect.addEventListener('change', () => {
                    this.applyFilters();
                });
            }

            if (this.loadMoreBtn) {
                this.loadMoreBtn.addEventListener('click', () => {
                    this.displayCount += this.displayStep;
                    this.applyFilters();
                });
            }

            this.applyFilters();
        }

        updatePriceLabel() {
            if (!this.priceLabel || !this.priceRange) return;
            this.priceLabel.textContent = `$${parseInt(this.priceRange.value, 10).toLocaleString()}`;
        }

        applyFilters() {
            const searchTerm = this.searchInput ? this.searchInput.value.trim().toLowerCase() : '';
            const maxPrice = this.priceRange ? parseInt(this.priceRange.value, 10) : Number.MAX_SAFE_INTEGER;
            const sortValue = this.sortSelect ? this.sortSelect.value : 'featured';

            let filteredCards = this.productCards.filter((card) => {
                const category = card.getAttribute('data-category') || '';
                const price = parseFloat(card.getAttribute('data-price') || '0');
                const name = card.getAttribute('data-name') || '';
                const searchHaystack = `${name} ${category}`.toLowerCase();
                const cardBody = card.textContent ? card.textContent.toLowerCase() : '';

                const matchesCategory = this.activeCategory === 'all' || category === this.activeCategory;
                const matchesPrice = price <= maxPrice;
                const matchesSearch = !searchTerm || searchHaystack.includes(searchTerm) || cardBody.includes(searchTerm);

                return matchesCategory && matchesPrice && matchesSearch;
            });

            filteredCards = this.sortCards(filteredCards, sortValue);

            this.productCards.forEach((card) => card.classList.add('product-card-hidden'));

            filteredCards.forEach((card, index) => {
                if (index < this.displayCount) {
                    card.classList.remove('product-card-hidden');
                }
            });

            if (this.loadMoreBtn) {
                if (filteredCards.length > this.displayCount) {
                    this.loadMoreBtn.style.display = 'inline-flex';
                } else {
                    this.loadMoreBtn.style.display = 'none';
                }
            }
        }

        sortCards(cards, sortValue) {
            const sorted = [...cards];
            switch (sortValue) {
                case 'price-low-high':
                    sorted.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
                    break;
                case 'price-high-low':
                    sorted.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
                    break;
                case 'rating':
                    sorted.sort((a, b) => parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating));
                    break;
                case 'newest':
                    sorted.sort((a, b) => new Date(b.dataset.release) - new Date(a.dataset.release));
                    break;
                default:
                    sorted.sort((a, b) => parseInt(a.dataset.order || '0', 10) - parseInt(b.dataset.order || '0', 10));
            }
            return sorted;
        }
    }

    const productsPageEnhancements = new ProductsPageEnhancements();

    class ServicesPageEnhancements {
        constructor() {
            this.pageRoot = document.querySelector('.services-page');
            if (!this.pageRoot) {
                return;
            }

            this.filterChips = Array.from(document.querySelectorAll('.service-filter-chip'));
            this.sortSelect = document.getElementById('service-sort');
            this.servicesGrid = document.querySelector('.services-grid');
            this.serviceCards = this.servicesGrid ? Array.from(this.servicesGrid.querySelectorAll('.service-card')) : [];
            this.pricingToggle = document.getElementById('pricing-toggle-input');
            this.servicePrices = Array.from(document.querySelectorAll('.service-price-value'));
            this.pricingValues = Array.from(document.querySelectorAll('.pricing-value'));
            this.pricingButtons = Array.from(document.querySelectorAll('.pricing-btn, .service-intake-btn'));
            this.faqItems = Array.from(document.querySelectorAll('.faq-item'));

            this.activeFilter = 'all';
            this.billingMode = 'monthly';

            this.intensityRank = {
                foundation: 1,
                professional: 2,
                advanced: 3,
                elite: 4
            };

            this.init();
        }

        init() {
            this.filterChips.forEach((chip) => {
                chip.addEventListener('click', () => {
                    this.filterChips.forEach((c) => c.classList.remove('active'));
                    chip.classList.add('active');
                    this.activeFilter = chip.getAttribute('data-filter') || 'all';
                    this.applyFilters();
                });
            });

            if (this.sortSelect) {
                this.sortSelect.addEventListener('change', () => {
                    this.applyFilters();
                });
            }

            if (this.pricingToggle) {
                this.pricingToggle.addEventListener('change', () => {
                    this.billingMode = this.pricingToggle.checked ? 'quarterly' : 'monthly';
                    this.updatePricingDisplay();
                });
            }

            this.pricingButtons.forEach((btn) => {
                btn.addEventListener('click', () => {
                    const planName = btn.getAttribute('data-plan-name') || btn.getAttribute('data-service') || 'Service';
                    this.notify(`${planName} inquiry received. Our concierge will reach out within 24 hours.`, 'success');
                });
            });

            this.faqItems.forEach((item) => {
                const toggle = item.querySelector('.faq-toggle');
                if (toggle) {
                    toggle.addEventListener('click', () => {
                        item.classList.toggle('active');
                    });
                }
            });

            this.applyFilters();
            this.updatePricingDisplay();
        }

        updatePricingDisplay() {
            this.servicePrices.forEach((priceEl) => {
                const monthly = priceEl.getAttribute('data-billed-monthly');
                const quarterly = priceEl.getAttribute('data-billed-quarterly');
                if (this.billingMode === 'quarterly' && quarterly) {
                    priceEl.textContent = quarterly;
                } else if (monthly) {
                    priceEl.textContent = monthly;
                }
            });

            this.pricingValues.forEach((valueEl) => {
                const monthly = valueEl.getAttribute('data-monthly');
                const quarterly = valueEl.getAttribute('data-quarterly');
                if (this.billingMode === 'quarterly' && quarterly) {
                    valueEl.textContent = quarterly;
                } else if (monthly) {
                    valueEl.textContent = monthly;
                }
            });
        }

        applyFilters() {
            const sortValue = this.sortSelect ? this.sortSelect.value : 'highlight';

            const filteredCards = this.serviceCards.filter((card) => {
                const type = card.getAttribute('data-service-type') || 'all';
                return this.activeFilter === 'all' || type === this.activeFilter;
            });

            const sortedCards = this.sortServices(filteredCards, sortValue);

            this.serviceCards.forEach((card) => card.classList.add('service-card-hidden'));

            sortedCards.forEach((card) => {
                card.classList.remove('service-card-hidden');
                this.servicesGrid.appendChild(card);
            });
        }

        sortServices(cards, sortValue) {
            const sorted = [...cards];
            switch (sortValue) {
                case 'duration':
                    sorted.sort((a, b) => parseInt(a.dataset.duration || '0', 10) - parseInt(b.dataset.duration || '0', 10));
                    break;
                case 'intensity':
                    sorted.sort(
                        (a, b) =>
                            (this.intensityRank[b.dataset.intensity] || 0) - (this.intensityRank[a.dataset.intensity] || 0)
                    );
                    break;
                case 'investment':
                    sorted.sort((a, b) => parseFloat(a.dataset.investment || '0') - parseFloat(b.dataset.investment || '0'));
                    break;
                default:
                    sorted.sort((a, b) => parseInt(a.dataset.order || '0', 10) - parseInt(b.dataset.order || '0', 10));
            }
            return sorted;
        }

        notify(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                background:
                    type === 'success'
                        ? 'var(--secondary-accent)'
                        : type === 'error'
                        ? '#ff4444'
                        : 'var(--primary-accent)',
                color: 'white',
                padding: '1rem 1.4rem',
                borderRadius: '10px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
                zIndex: '10000',
                transform: 'translateX(120%)',
                transition: 'transform 0.35s ease',
                maxWidth: '360px',
                fontSize: '0.9rem',
                letterSpacing: '0.02rem'
            });
            document.body.appendChild(notification);
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
            });
            setTimeout(() => {
                notification.style.transform = 'translateX(120%)';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.parentElement.removeChild(notification);
                    }
                }, 350);
            }, 3200);
        }
    }

    const servicesPageEnhancements = new ServicesPageEnhancements();

    class BMICalculatorModule {
        constructor() {
            this.pageRoot = document.querySelector('.calculator-page');
            if (!this.pageRoot) {
                return;
            }

            this.form = document.getElementById('bmi-form');
            this.unitInputs = Array.from(document.querySelectorAll('input[name="unit"]'));
            this.metricGroups = Array.from(this.form.querySelectorAll('[data-group="metric"]'));
            this.imperialGroups = Array.from(this.form.querySelectorAll('[data-group="imperial"]'));

            this.heightCmInput = document.getElementById('height-cm');
            this.heightCmRange = document.getElementById('height-cm-range');
            this.weightKgInput = document.getElementById('weight-kg');
            this.weightKgRange = document.getElementById('weight-kg-range');

            this.heightFtInput = document.getElementById('height-ft');
            this.heightInInput = document.getElementById('height-in');
            this.weightLbsInput = document.getElementById('weight-lbs');

            this.ageInput = document.getElementById('age');
            this.genderInputs = Array.from(document.querySelectorAll('input[name="gender"]'));
            this.resetBtn = document.getElementById('bmi-reset');

            this.bmiValueEl = document.getElementById('bmi-value');
            this.classificationEl = document.getElementById('bmi-classification');
            this.idealWeightRangeEl = document.getElementById('ideal-weight-range');
            this.focusEl = document.getElementById('focus-recommendation');
            this.weightDeltaEl = document.getElementById('weight-delta');
            this.calorieAdjustmentEl = document.getElementById('calorie-adjustment');
            this.targetWeeklyChangeEl = document.getElementById('target-weekly-change');
            this.tipsList = document.getElementById('coaching-tips');
            this.gaugeFill = document.getElementById('bmi-gauge-fill');
            this.indicator = document.getElementById('bmi-indicator');

            this.categories = [
                {
                    label: 'Underweight',
                    max: 18.5,
                    focus: 'Caloric surplus & strength training block',
                    tips: [
                        'Aim for a 250–350 kcal surplus paired with progressive strength work.',
                        'Increase protein to 2.2 g/kg and prioritize compound lifts.',
                        'Schedule a recovery lab to ensure hormonal balance.'
                    ]
                },
                {
                    label: 'Healthy',
                    max: 24.9,
                    focus: 'Performance optimization & lean mass maintenance',
                    tips: [
                        'Periodize training blocks every 6 weeks to avoid plateaus.',
                        'Dial in macros with a 30/30/40 split (P/F/C) and monitor HRV.',
                        'Layer in recovery modalities like contrast therapy weekly.'
                    ]
                },
                {
                    label: 'Overweight',
                    max: 29.9,
                    focus: 'Body recomposition & metabolic conditioning',
                    tips: [
                        'Adopt a modest 350–500 kcal deficit with 1.8 g/kg protein.',
                        'Blend resistance training with zone 2 cardio 4x weekly.',
                        'Track sleep quality and stress to keep cortisol in check.'
                    ]
                },
                {
                    label: 'Obesity',
                    max: Infinity,
                    focus: 'Clinical oversight & progressive lifestyle shifts',
                    tips: [
                        'Work with a coach and clinician to set phased goals and labs.',
                        'Start with a 400–600 kcal deficit and prioritize daily movement.',
                        'Introduce strength circuits and longer recovery sessions gradually.'
                    ]
                }
            ];

            this.bindEvents();
            this.updateUnitVisibility('metric');
            this.calculate();
        }

        bindEvents() {
            if (this.form) {
                this.form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    this.calculate();
                });

                this.form.addEventListener(
                    'input',
                    debounce(() => {
                        this.calculate();
                    }, 150)
                );
            }

            this.unitInputs.forEach((input) => {
                input.addEventListener('change', () => {
                    this.updateUnitVisibility(input.value);
                    this.calculate();
                });
            });

            if (this.heightCmRange && this.heightCmInput) {
                this.heightCmRange.addEventListener('input', () => {
                    this.heightCmInput.value = this.heightCmRange.value;
                    this.calculate();
                });
                this.heightCmInput.addEventListener('input', () => {
                    this.heightCmRange.value = this.heightCmInput.value;
                });
            }

            if (this.weightKgRange && this.weightKgInput) {
                this.weightKgRange.addEventListener('input', () => {
                    this.weightKgInput.value = this.weightKgRange.value;
                    this.calculate();
                });
                this.weightKgInput.addEventListener('input', () => {
                    this.weightKgRange.value = this.weightKgInput.value;
                });
            }

            if (this.resetBtn) {
                this.resetBtn.addEventListener('click', () => {
                    this.resetForm();
                });
            }
        }

        updateUnitVisibility(unit) {
            this.metricGroups.forEach((group) => {
                group.style.display = unit === 'metric' ? '' : 'none';
            });
            this.imperialGroups.forEach((group) => {
                group.style.display = unit === 'imperial' ? '' : 'none';
            });
        }

        resetForm() {
            if (!this.form) return;
            this.form.reset();
            this.heightCmInput.value = '175';
            this.heightCmRange.value = '175';
            this.weightKgInput.value = '70';
            this.weightKgRange.value = '70';
            this.heightFtInput.value = '5';
            this.heightInInput.value = '9';
            this.weightLbsInput.value = '165';
            this.ageInput.value = '30';
            this.unitInputs[0].checked = true;
            this.updateUnitVisibility('metric');
            this.calculate();
        }

        calculate() {
            const unit = this.unitInputs.find((input) => input.checked)?.value || 'metric';
            let heightMeters;
            let weightKg;

            if (unit === 'metric') {
                const heightCm = parseFloat(this.heightCmInput.value);
                const weight = parseFloat(this.weightKgInput.value);
                if (!heightCm || !weight) {
                    return;
                }
                heightMeters = heightCm / 100;
                weightKg = weight;
            } else {
                const heightFeet = parseFloat(this.heightFtInput.value);
                const heightInches = parseFloat(this.heightInInput.value);
                const weightLbs = parseFloat(this.weightLbsInput.value);
                if (!heightFeet && heightFeet !== 0) return;
                if ((!heightInches && heightInches !== 0) || !weightLbs) {
                    return;
                }
                const totalInches = heightFeet * 12 + heightInches;
                heightMeters = totalInches * 0.0254;
                weightKg = weightLbs * 0.453592;
            }

            if (!heightMeters || !weightKg) {
                return;
            }

            const bmi = weightKg / (heightMeters * heightMeters);
            const roundedBMI = Math.max(10, Math.min(60, bmi));
            this.bmiValueEl.textContent = roundedBMI.toFixed(1);

            const category = this.categories.find((cat) => bmi <= cat.max) || this.categories[this.categories.length - 1];
            this.classificationEl.textContent = category.label;
            this.focusEl.textContent = category.focus;

            if (this.tipsList) {
                this.tipsList.innerHTML = '';
                category.tips.forEach((tip) => {
                    const li = document.createElement('li');
                    li.textContent = tip;
                    this.tipsList.appendChild(li);
                });
            }

            const minHealthyWeight = 18.5 * heightMeters * heightMeters;
            const maxHealthyWeight = 24.9 * heightMeters * heightMeters;
            this.idealWeightRangeEl.textContent = `${minHealthyWeight.toFixed(1)} – ${maxHealthyWeight.toFixed(1)} kg`;

            const midpoint = (minHealthyWeight + maxHealthyWeight) / 2;
            const delta = weightKg - midpoint;
            const deltaRounded = Math.round(delta * 10) / 10;
            const deltaDisplay = `${deltaRounded > 0 ? '+' : ''}${deltaRounded} kg from midpoint`;
            this.weightDeltaEl.textContent = deltaDisplay;

            const calorieAdjustment = Math.round((delta * 7700) / 7);
            let adjustmentDisplay = '0 kcal';
            if (Math.abs(calorieAdjustment) > 50) {
                adjustmentDisplay = `${calorieAdjustment > 0 ? '+' : ''}${calorieAdjustment} kcal`;
            }
            this.calorieAdjustmentEl.textContent = adjustmentDisplay;

            const weeklyChange = Math.max(-1.0, Math.min(1.0, delta / 6));
            const weeklyDisplay = `${weeklyChange > 0 ? '+' : ''}${weeklyChange.toFixed(1)} kg/week`;
            this.targetWeeklyChangeEl.textContent = weeklyDisplay;

            const percent = Math.min(100, Math.max(0, (bmi / 40) * 100));
            if (this.gaugeFill) {
                this.gaugeFill.style.background = `conic-gradient(var(--secondary-accent) ${percent}%, transparent ${percent}%)`;
            }

            if (this.indicator) {
                const position = Math.min(96, Math.max(4, (bmi / 40) * 100));
                this.indicator.style.left = `${position}%`;
            }
        }
    }

    const bmiCalculatorModule = new BMICalculatorModule();

    const bmrCalculatorModule = new BMRCalculatorModule();

    class CaloriePlannerModule {
        constructor() {
            this.pageRoot = document.querySelector('.calculator-page');
            if (!this.pageRoot || !document.getElementById('calorie-form')) {
                return;
            }

            this.form = document.getElementById('calorie-form');
            this.bmrInput = document.getElementById('calorie-bmr');
            this.tdeeInput = document.getElementById('calorie-tdee');
            this.goalSelect = document.getElementById('goal-mode');
            this.trainingSelect = document.getElementById('training-days');
            this.macroSelect = document.getElementById('macro-focus');
            this.mealsSelect = document.getElementById('meal-frequency');
            this.resetBtn = document.getElementById('calorie-reset');

            this.calorieTargetEl = document.getElementById('calorie-target');
            this.maintenanceEl = document.getElementById('maintain-target');
            this.goalAdjustmentEl = document.getElementById('goal-adjustment');
            this.focusEl = document.getElementById('calorie-focus');
            this.proteinEl = document.getElementById('calorie-protein');
            this.fatEl = document.getElementById('calorie-fat');
            this.carbEl = document.getElementById('calorie-carb');
            this.mealBreakdownEls = Array.from(document.querySelectorAll('#meal-plan-breakdown li strong'));
            this.trainingCaloriesEl = document.getElementById('training-calories');
            this.restCaloriesEl = document.getElementById('rest-calories');
            this.weeklyTotalEl = document.getElementById('weekly-total');
            this.gaugeFill = document.getElementById('calorie-gauge-fill');

            this.bindEvents();
            this.calculate();
        }

        bindEvents() {
            if (this.form) {
                this.form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    this.calculate();
                });

                this.form.addEventListener(
                    'input',
                    debounce(() => {
                        this.calculate();
                    }, 150)
                );
            }

            if (this.resetBtn) {
                this.resetBtn.addEventListener('click', () => this.resetForm());
            }
        }

        resetForm() {
            if (!this.form) return;
            this.form.reset();
            this.goalSelect.value = 'maintain';
            this.trainingSelect.value = '3';
            this.macroSelect.value = 'balanced';
            this.mealsSelect.value = '3';
            this.bmrInput.value = '';
            this.tdeeInput.value = '';
            this.calculate();
        }

        calculate() {
            let tdee = parseFloat(this.tdeeInput.value);
            let bmr = parseFloat(this.bmrInput.value);

            if (!tdee) {
                if (bmr) {
                    const defaultMultiplier = 1.55;
                    tdee = bmr * defaultMultiplier;
                } else {
                    tdee = 2300;
                }
            }

            if (!bmr) {
                bmr = Math.round(tdee / 1.55);
            }

            const goalMode = this.goalSelect.value || 'maintain';
            const multiplierMap = {
                maintain: 1,
                'mild-cut': 0.9,
                'aggressive-cut': 0.8,
                'lean-bulk': 1.1,
                bulk: 1.2
            };

            const focusMap = {
                maintain: 'Recomposition & metabolic conditioning',
                'mild-cut': 'Gradual fat loss with muscle retention',
                'aggressive-cut': 'Accelerated fat loss under coach supervision',
                'lean-bulk': 'Lean mass gain with performance focus',
                bulk: 'High-calorie hypertrophy phase'
            };

            const multiplier = multiplierMap[goalMode] || 1;
            const targetCalories = Math.round(tdee * multiplier);
            const adjustmentPercent = Math.round((multiplier - 1) * 100);

            this.calorieTargetEl.textContent = targetCalories;
            this.maintenanceEl.textContent = `${Math.round(tdee)} kcal`;
            this.goalAdjustmentEl.textContent = `${adjustmentPercent > 0 ? '+' : ''}${adjustmentPercent}% ${adjustmentPercent === 0 ? 'maintain' : adjustmentPercent > 0 ? 'surplus' : 'deficit'}`;
            this.focusEl.textContent = focusMap[goalMode] || 'Optimize your performance with data-driven fueling';

            this.computeMacros(targetCalories);
            this.computeMealPlan(targetCalories);
            this.computeWeeklyTotals(targetCalories, tdee);
            this.updateGauge(targetCalories);
        }

        computeMacros(targetCalories) {
            const macroFocus = this.macroSelect.value || 'balanced';
            const macroRatios = {
                balanced: { carb: 0.4, protein: 0.3, fat: 0.3 },
                performance: { carb: 0.5, protein: 0.25, fat: 0.25 },
                keto: { carb: 0.1, protein: 0.25, fat: 0.65 },
                mediterranean: { carb: 0.45, protein: 0.3, fat: 0.25 }
            };

            const ratios = macroRatios[macroFocus] || macroRatios.balanced;
            const carbCalories = targetCalories * ratios.carb;
            const proteinCalories = targetCalories * ratios.protein;
            const fatCalories = targetCalories * ratios.fat;

            const carbs = Math.round(carbCalories / 4);
            const protein = Math.round(proteinCalories / 4);
            const fats = Math.round(fatCalories / 9);

            this.proteinEl.textContent = `${protein} g`;
            this.fatEl.textContent = `${fats} g`;
            this.carbEl.textContent = `${carbs} g`;
        }

        computeMealPlan(targetCalories) {
            const meals = parseInt(this.mealsSelect.value || '3', 10);
            const mealCalories = Math.round(targetCalories / meals);
            this.mealBreakdownEls.forEach((el) => {
                el.textContent = `${mealCalories} kcal`;
            });
        }

        computeWeeklyTotals(targetCalories, maintenanceCalories) {
            const trainingDays = parseInt(this.trainingSelect.value || '3', 10);
            const restDays = 7 - trainingDays;
            const trainingDayCalories = Math.round(targetCalories * 1.05);
            const restDayCalories = Math.round(Math.max(maintenanceCalories * 0.85, targetCalories * 0.85));
            const weeklyTotal = trainingDayCalories * trainingDays + restDayCalories * restDays;

            this.trainingCaloriesEl.textContent = `${trainingDayCalories} kcal`;
            this.restCaloriesEl.textContent = `${restDayCalories} kcal`;
            this.weeklyTotalEl.textContent = `${weeklyTotal.toLocaleString()} kcal`;
        }

        updateGauge(targetCalories) {
            const bounded = Math.min(4000, Math.max(1200, targetCalories));
            const percent = ((bounded - 1200) / (4000 - 1200)) * 100;
            if (this.gaugeFill) {
                this.gaugeFill.style.background = `conic-gradient(var(--secondary-accent) ${percent}%, transparent ${percent}%)`;
            }
        }
    }

    const caloriePlannerModule = new CaloriePlannerModule();

    class DietGeneratorModule {
        constructor() {
            this.pageRoot = document.querySelector('.diet-page');
            if (!this.pageRoot || !document.getElementById('diet-form')) {
                return;
            }

            this.form = document.getElementById('diet-form');
            this.ageInput = document.getElementById('diet-age');
            this.genderSelect = document.getElementById('diet-gender');
            this.heightInput = document.getElementById('diet-height');
            this.weightInput = document.getElementById('diet-weight');
            this.goalWeightInput = document.getElementById('diet-goal-weight');
            this.timeframeSelect = document.getElementById('diet-timeframe');
            this.activitySelect = document.getElementById('diet-activity');
            this.preferenceSelect = document.getElementById('diet-preference');
            this.restrictionsInput = document.getElementById('diet-restrictions');
            this.mealsSelect = document.getElementById('diet-meals');
            this.snacksSelect = document.getElementById('diet-snacks');
            this.styleSelect = document.getElementById('diet-style');
            this.resetBtn = document.getElementById('diet-reset');

            this.calorieTargetEl = document.getElementById('diet-calorie-target');
            this.macroSummaryEl = document.getElementById('diet-macro-summary');
            this.weeklyChangeEl = document.getElementById('diet-weekly-change');
            this.mealTimingEl = document.getElementById('diet-meal-timing');
            this.macrosList = {
                protein: document.getElementById('diet-protein'),
                fat: document.getElementById('diet-fat'),
                carb: document.getElementById('diet-carb'),
                fiber: document.getElementById('diet-fiber')
            };
            this.hydrationEls = {
                fluids: document.getElementById('diet-fluids'),
                electrolytes: document.getElementById('diet-electro'),
                recovery: document.getElementById('diet-recovery')
            };
            this.planSummaryEl = document.getElementById('diet-plan-summary');
            this.mealGrid = document.getElementById('meal-plan-grid');
            this.groceryEls = {
                cost: document.getElementById('diet-grocery-cost'),
                prep: document.getElementById('diet-prep-sessions'),
                supplements: document.getElementById('diet-supplements')
            };
            this.gaugeFill = document.getElementById('diet-gauge-fill');

            this.recipeDatabase = this.buildRecipeDatabase();
            this.bindEvents();
            this.generatePlan();
        }

        bindEvents() {
            if (this.form) {
                this.form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    this.generatePlan();
                });

                this.form.addEventListener(
                    'input',
                    debounce(() => {
                        this.generatePlan();
                    }, 200)
                );
            }

            if (this.resetBtn) {
                this.resetBtn.addEventListener('click', () => this.resetForm());
            }
        }

        resetForm() {
            if (!this.form) return;
            this.form.reset();
            this.genderSelect.value = 'male';
            this.heightInput.value = '175';
            this.weightInput.value = '75';
            this.goalWeightInput.value = '70';
            this.timeframeSelect.value = '12';
            this.activitySelect.value = '1.55';
            this.preferenceSelect.value = 'balanced';
            this.mealsSelect.value = '3';
            this.snacksSelect.value = '1';
            this.styleSelect.value = 'performance';
            this.restrictionsInput.value = '';
            this.generatePlan();
        }

        buildRecipeDatabase() {
            return {
                balanced: {
                    breakfast: [
                        'Greek yogurt parfait with berries, chia seeds, and almond butter',
                        'Egg white omelette, avocado toast, and citrus salad',
                        'Protein oats with banana, walnuts, and honey drizzle'
                    ],
                    lunch: [
                        'Grilled chicken quinoa bowl with roasted vegetables',
                        'Salmon, sweet potato mash, asparagus, and olive oil drizzle',
                        'Turkey lettuce wraps with brown rice and mango salsa'
                    ],
                    dinner: [
                        'Lean beef stir-fry with jasmine rice and greens',
                        'Baked cod, herbed couscous, and steamed broccoli',
                        'Chicken tikka bowl with basmati rice and cucumber yogurt'
                    ],
                    snack: [
                        'Cottage cheese with pineapple and pumpkin seeds',
                        'Protein shake with banana and peanut butter',
                        'Trail mix with dark chocolate and dried fruit'
                    ]
                },
                vegetarian: {
                    breakfast: [
                        'Avocado toast with poached eggs and cherry tomatoes',
                        'Protein smoothie bowl with granola and hemp seeds',
                        'Tofu scramble with spinach, salsa, and corn tortillas'
                    ],
                    lunch: [
                        'Lentil Buddha bowl with tahini dressing',
                        'Paneer tikka wrap with mint yogurt and greens',
                        'Quinoa chickpea salad with roasted peppers'
                    ],
                    dinner: [
                        'Vegetable stir-fry with tofu and soba noodles',
                        'Eggplant parmesan with whole wheat pasta',
                        'Vegetable curry with basmati rice and lentils'
                    ],
                    snack: [
                        'Greek yogurt with berries and almonds',
                        'Roasted chickpeas and fruit',
                        'Protein latte with oat milk'
                    ]
                },
                vegan: {
                    breakfast: [
                        'Chia pudding with coconut milk, berries, and almonds',
                        'Tofu breakfast burrito with black beans and salsa',
                        'Overnight oats with peanut butter and flax'
                    ],
                    lunch: [
                        'Tempeh quinoa bowl with kale and tahini',
                        'Vegan sushi rolls with edamame',
                        'Lentil loaf with mashed sweet potatoes'
                    ],
                    dinner: [
                        'Chickpea curry with brown rice and greens',
                        'Stuffed peppers with quinoa and black beans',
                        'Vegan pasta primavera with nutritional yeast sauce'
                    ],
                    snack: [
                        'Protein shake with plant-based powder',
                        'Apple slices with almond butter',
                        'Veggie sticks with hummus'
                    ]
                },
                pescatarian: {
                    breakfast: [
                        'Smoked salmon toast with capers and arugula',
                        'Greek yogurt with berries, granola, and honey',
                        'Protein pancakes with citrus salad'
                    ],
                    lunch: [
                        'Tuna poke bowl with sticky rice and avocado',
                        'Grilled shrimp salad with quinoa and citrus vinaigrette',
                        'Sardine whole grain pasta with roasted veggies'
                    ],
                    dinner: [
                        'Seared salmon with roasted potatoes and green beans',
                        'Miso cod with soba noodles and bok choy',
                        'Fish tacos with cabbage slaw and black beans'
                    ],
                    snack: [
                        'Protein smoothie with spinach and pineapple',
                        'Rice cakes with smoked salmon and dill',
                        'Trail mix with cashews and coconut chips'
                    ]
                },
                mediterranean: {
                    breakfast: [
                        'Greek yogurt with figs, almonds, and honey',
                        'Spinach feta omelette with olive tapenade toast',
                        'Farro breakfast bowl with berries and pistachios'
                    ],
                    lunch: [
                        'Grilled chicken souvlaki with tabbouleh',
                        'Mediterranean quinoa salad with chickpeas',
                        'Whole grain pita stuffed with falafel and greens'
                    ],
                    dinner: [
                        'Baked sea bass with tomatoes, olives, and herbs',
                        'Turkey kofta with brown rice and tzatziki',
                        'Vegetable paella with saffron and beans'
                    ],
                    snack: [
                        'Hummus with raw veggies and whole grain crackers',
                        'Olive tapenade crostini with arugula',
                        'Greek yogurt parfait with walnuts'
                    ]
                },
                lowcarb: {
                    breakfast: [
                        'Egg muffins with turkey bacon and spinach',
                        'Protein shake with MCT oil and berries',
                        'Smoked salmon roll-ups with avocado'
                    ],
                    lunch: [
                        'Grilled chicken salad with avocado and seeds',
                        'Zucchini noodle bowl with turkey meatballs',
                        'Beef lettuce wraps with kimchi'
                    ],
                    dinner: [
                        'Cauliflower mash with salmon and asparagus',
                        'Pork tenderloin with roasted Brussels sprouts',
                        'Shrimp and broccoli stir-fry with coconut aminos'
                    ],
                    snack: [
                        'Greek yogurt with nuts and cocoa nibs',
                        'Hard-boiled eggs with sea salt',
                        'Veggie sticks with guacamole'
                    ]
                }
            };
        }

        generatePlan() {
            const age = parseInt(this.ageInput.value || '30', 10);
            const height = parseFloat(this.heightInput.value || '175');
            const weight = parseFloat(this.weightInput.value || '75');
            const goalWeight = parseFloat(this.goalWeightInput.value || weight);
            const timeframe = parseInt(this.timeframeSelect.value || '12', 10);
            const activity = parseFloat(this.activitySelect.value || '1.55');
            const gender = this.genderSelect.value;
            const preference = this.preferenceSelect.value || 'balanced';
            const restrictions = (this.restrictionsInput.value || '').toLowerCase();
            const mealsPerDay = parseInt(this.mealsSelect.value || '3', 10);
            const snacksPerDay = parseInt(this.snacksSelect.value || '0', 10);
            const style = this.styleSelect.value || 'performance';

            const bmr = this.calculateBMR(gender, weight, height, age);
            const tdee = bmr * activity;
            const goalCalories = this.calculateGoalCalories(weight, goalWeight, timeframe, tdee);

            this.calorieTargetEl.textContent = goalCalories;
            this.macroSummaryEl.textContent = this.getMacroSummary(style);
            this.weeklyChangeEl.textContent = this.getWeeklyChange(weight, goalWeight, timeframe);
            this.mealTimingEl.textContent = this.getMealTiming(style);
            this.updateGauge(goalCalories);

            const macros = this.calculateMacros(goalCalories, style, weight);
            this.macrosList.protein.textContent = `${macros.protein} g`;
            this.macrosList.fat.textContent = `${macros.fat} g`;
            this.macrosList.carb.textContent = `${macros.carb} g`;
            this.macrosList.fiber.textContent = `${macros.fiber} g`;

            this.hydrationEls.fluids.textContent = `${(weight * 0.04).toFixed(1)} L`;
            this.hydrationEls.electrolytes.textContent = `${activity > 1.55 ? '2' : '1'} servings`;
            this.hydrationEls.recovery.textContent = activity > 1.55 ? '8 hrs + contrast therapy' : '7.5 hrs + mobility';

            const plan = this.buildMealPlan({ preference, mealsPerDay, snacksPerDay, restrictions });
            this.planSummaryEl.textContent = plan.summary;
            this.renderMealPlan(plan.meals);

            this.groceryEls.cost.textContent = plan.grocery;
            this.groceryEls.prep.textContent = plan.prep;
            this.groceryEls.supplements.textContent = plan.supplements;
        }

        calculateBMR(gender, weightKg, heightCm, age) {
            let genderOffset = 0;
            if (gender === 'male') {
                genderOffset = 5;
            } else if (gender === 'female') {
                genderOffset = -161;
            }
            return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset);
        }

        calculateGoalCalories(weightKg, goalWeightKg, timeframeWeeks, tdee) {
            const weightDelta = goalWeightKg - weightKg;
            const weeklyDelta = weightDelta / timeframeWeeks;
            const weeklyCalories = weeklyDelta * 7700;
            const dailyAdjustment = weeklyCalories / 7;
            const goalCaloriesRaw = tdee + dailyAdjustment;
            return Math.round(Math.min(Math.max(goalCaloriesRaw, 1400), 4200));
        }

        getMacroSummary(style) {
            const map = {
                performance: '45% carbs · 30% protein · 25% fats',
                fatloss: '30% carbs · 35% protein · 35% fats',
                leanmass: '40% carbs · 35% protein · 25% fats',
                wellness: '40% carbs · 25% protein · 35% fats'
            };
            return map[style] || map.performance;
        }

        getMealTiming(style) {
            switch (style) {
                case 'performance':
                    return 'Center complex carbs before/after training, protein evenly across meals';
                case 'fatloss':
                    return 'Front-load protein at breakfast, schedule carbs near training only';
                case 'leanmass':
                    return 'High-protein meals every 3 hours, carb pulses pre/post training';
                case 'wellness':
                default:
                    return 'Balanced meals spaced evenly with fiber and hydration at each sitting';
            }
        }

        getWeeklyChange(weight, goalWeight, timeframe) {
            const delta = goalWeight - weight;
            const weekly = delta / timeframe;
            return `${weekly > 0 ? '+' : ''}${weekly.toFixed(2)} kg/week`;
        }

        calculateMacros(calories, style, weightKg) {
            let ratios;
            switch (style) {
                case 'fatloss':
                    ratios = { carb: 0.3, protein: 0.35, fat: 0.35 };
                    break;
                case 'leanmass':
                    ratios = { carb: 0.4, protein: 0.35, fat: 0.25 };
                    break;
                case 'wellness':
                    ratios = { carb: 0.4, protein: 0.25, fat: 0.35 };
                    break;
                case 'performance':
                default:
                    ratios = { carb: 0.45, protein: 0.3, fat: 0.25 };
            }

            const carbs = Math.round((calories * ratios.carb) / 4);
            const protein = Math.round((calories * ratios.protein) / 4);
            const fat = Math.round((calories * ratios.fat) / 9);
            const fiber = Math.max(25, Math.round(weightKg * 0.4));

            return { carb: carbs, protein, fat, fiber };
        }

        buildMealPlan({ preference, mealsPerDay, snacksPerDay, restrictions }) {
            const recipes = this.recipeDatabase[preference] || this.recipeDatabase.balanced;
            const hasRestriction = (item) => {
                if (!restrictions) return false;
                const restrictionList = restrictions.split(',').map((str) => str.trim().toLowerCase()).filter(Boolean);
                return restrictionList.some((keyword) => keyword && item.toLowerCase().includes(keyword));
            };

            const filteredRecipes = {
                breakfast: recipes.breakfast.filter((item) => !hasRestriction(item)),
                lunch: recipes.lunch.filter((item) => !hasRestriction(item)),
                dinner: recipes.dinner.filter((item) => !hasRestriction(item)),
                snack: recipes.snack.filter((item) => !hasRestriction(item))
            };

            const summary = `${this.capitalize(preference)} plan tailored to ${this.styleSelect.options[this.styleSelect.selectedIndex].text.toLowerCase()} with ${mealsPerDay} meals${snacksPerDay ? ` and ${snacksPerDay} snack${snacksPerDay > 1 ? 's' : ''}` : ''}.`;

            const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
            const meals = days.map((day, index) => {
                const schedule = [];
                for (let i = 0; i < mealsPerDay; i++) {
                    const mealType = i === 0 ? 'Breakfast' : i === mealsPerDay - 1 ? 'Dinner' : 'Lunch';
                    const recipePool = mealType === 'Breakfast' ? filteredRecipes.breakfast : mealType === 'Dinner' ? filteredRecipes.dinner : filteredRecipes.lunch;
                    const recipe = recipePool.length ? recipePool[(index + i) % recipePool.length] : "Chef's choice macro-balanced meal";
                    schedule.push({ label: mealType, recipe });
                }
                for (let i = 0; i < snacksPerDay; i++) {
                    const snackRecipe = filteredRecipes.snack.length ? filteredRecipes.snack[(index + i) % filteredRecipes.snack.length] : 'Performance snack (protein + healthy fats)';
                    schedule.splice(Math.ceil(schedule.length / (snacksPerDay + 1)) * (i + 1), 0, { label: 'Snack', recipe: snackRecipe });
                }
                return { day, schedule };
            });

            const grocery = preference === 'balanced' ? '$95 – $110' : preference === 'vegan' ? '$85 – $100' : '$90 – $115';
            const prep = mealsPerDay > 3 ? '3 x 40 minutes' : '2 x 45 minutes';
            const supplements =
                preference === 'vegan'
                    ? 'Plant protein, B12, Omega-3 (algae), Vitamin D'
                    : preference === 'vegetarian'
                    ? 'Whey or casein, Omega-3, Vitamin B complex'
                    : 'Whey protein, Omega-3, Vitamin D';

            return { summary, meals, grocery, prep, supplements };
        }

        renderMealPlan(meals) {
            if (!this.mealGrid) return;
            this.mealGrid.innerHTML = '';
            meals.forEach((dayPlan) => {
                const column = document.createElement('div');
                column.className = 'meal-day-card';
                column.innerHTML = `<header><h5>${dayPlan.day}</h5></header>`;
                const list = document.createElement('ul');
                dayPlan.schedule.forEach((entry) => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="meal-label">${entry.label}</span><span class="meal-recipe">${entry.recipe}</span>`;
                    list.appendChild(li);
                });
                column.appendChild(list);
                this.mealGrid.appendChild(column);
            });
        }

        updateGauge(calories) {
            const bounded = Math.min(4200, Math.max(1400, calories));
            const percent = ((bounded - 1400) / (4200 - 1400)) * 100;
            if (this.gaugeFill) {
                this.gaugeFill.style.background = `conic-gradient(var(--secondary-accent) ${percent}%, transparent ${percent}%)`;
            }
        }

        capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    }

    const dietGeneratorModule = new DietGeneratorModule();

    class ContactPageModule {
        constructor() {
            this.pageRoot = document.querySelector('.contact-page');
            if (!this.pageRoot || !document.getElementById('contact-us-form')) {
                return;
            }

            this.form = document.getElementById('contact-us-form');
            this.resetBtn = document.getElementById('contact-reset');
            this.successEl = document.getElementById('contact-success');
            this.topicSelect = document.getElementById('contact-topic');
            this.faqItems = Array.from(document.querySelectorAll('.faq-item'));

            this.bindEvents();
        }

        bindEvents() {
            if (this.form) {
                this.form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    this.handleSubmit();
                });
            }

            if (this.resetBtn) {
                this.resetBtn.addEventListener('click', () => {
                    this.form.reset();
                    if (this.successEl) {
                        this.successEl.textContent = '';
                    }
                });
            }

            this.faqItems.forEach((item) => {
                const toggle = item.querySelector('.faq-toggle');
                if (toggle) {
                    toggle.addEventListener('click', () => {
                        item.classList.toggle('active');
                        this.faqItems.forEach((other) => {
                            if (other !== item) {
                                other.classList.remove('active');
                            }
                        });
                    });
                }
            });
        }

        handleSubmit() {
            const formData = new FormData(this.form);
            const name = formData.get('contact-name') || formData.get('name') || 'Client';
            const topic = formData.get('contact-topic') || 'support';
            const message = formData.get('contact-message') || '';

            console.log('Contact inquiry submitted:', {
                name,
                email: formData.get('contact-email'),
                phone: formData.get('contact-phone'),
                topic,
                message,
                preferredTime: formData.get('preferred-time')
            });

            if (this.successEl) {
                const topicText = this.topicSelect.options[this.topicSelect.selectedIndex].text;
                this.successEl.textContent = `${topicText} inquiry received! A Shredzone architect will reach out to you within one business day.`;
            }

            this.form.reset();
        }
    }

    const contactPageModule = new ContactPageModule();
});
