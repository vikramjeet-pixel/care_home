// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.hamburger')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Header scroll effect and progress bar
const header = document.querySelector('header');
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    // Header scroll effect
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update scroll progress bar
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    
    if (scrollProgress) {
        const progressWidth = (scrolled / scrollable) * 100;
        scrollProgress.style.width = progressWidth + '%';
    }
});

// Set active nav link based on current page
const setActiveNavLink = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// Run on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

// Scroll animation
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.classList.add('show');
        }
    });
};

// Run on load
window.addEventListener('load', animateOnScroll);

// Run on scroll
window.addEventListener('scroll', animateOnScroll);

// Testimonial Slider
const testimonialSlider = (() => {
    const slider = document.querySelector('.testimonial-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (!slider || slides.length === 0) return;
    
    let currentIndex = 0;
    let slideWidth = 0;
    let autoplayInterval;
    const autoplayDelay = 5000;
    
    // Initialize slider
    const init = () => {
        // Set up slides
        setupSlides();
        
        // Create dots
        createDots();
        
        // Set up event listeners
        setupEventListeners();
        
        // Start autoplay
        startAutoplay();
        
        // Update on window resize
        window.addEventListener('resize', () => {
            setupSlides();
            goToSlide(currentIndex);
        });
    };
    
    // Set up slides
    const setupSlides = () => {
        slideWidth = slider.clientWidth;
        
        // Set each slide width
        slides.forEach(slide => {
            slide.style.width = `${slideWidth}px`;
        });
        
        // Set initial position
        goToSlide(currentIndex);
    };
    
    // Create dots
    const createDots = () => {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
            
            dotsContainer.appendChild(dot);
        });
    };
    
    // Set up event listeners
    const setupEventListeners = () => {
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToPrevSlide();
                resetAutoplay();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToNextSlide();
                resetAutoplay();
            });
        }
        
        // Touch events for mobile swipe
        let startX, endX;
        const minSwipeDistance = 50;
        
        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const distance = endX - startX;
            
            if (Math.abs(distance) >= minSwipeDistance) {
                if (distance > 0) {
                    goToPrevSlide();
                } else {
                    goToNextSlide();
                }
                resetAutoplay();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToPrevSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowRight') {
                goToNextSlide();
                resetAutoplay();
            }
        });
    };
    
    // Go to specific slide
    const goToSlide = (index) => {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        currentIndex = index;
        
        // Update slider position
        const position = -currentIndex * slideWidth;
        slider.style.transform = `translateX(${position}px)`;
        
        // Update dots
        updateDots();
    };
    
    // Go to previous slide
    const goToPrevSlide = () => {
        goToSlide(currentIndex - 1);
    };
    
    // Go to next slide
    const goToNextSlide = () => {
        goToSlide(currentIndex + 1);
    };
    
    // Update dots
    const updateDots = () => {
        if (!dotsContainer) return;
        
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    
    // Start autoplay
    const startAutoplay = () => {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        
        autoplayInterval = setInterval(() => {
            goToNextSlide();
        }, autoplayDelay);
    };
    
    // Reset autoplay
    const resetAutoplay = () => {
        clearInterval(autoplayInterval);
        startAutoplay();
    };
    
    // Pause autoplay on hover
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        startAutoplay();
    });
    
    // Initialize
    init();
    
    // Public methods
    return {
        next: goToNextSlide,
        prev: goToPrevSlide,
        goTo: goToSlide
    };
})();

// Create placeholder images if images are missing
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/400x300?text=Serenity+Care+Home';
            this.alt = 'Placeholder image';
        });
    });
    
    // Add accessibility attributes
    document.querySelectorAll('button').forEach(button => {
        if (!button.getAttribute('aria-label')) {
            if (button.classList.contains('prev-btn')) {
                button.setAttribute('aria-label', 'Previous slide');
            } else if (button.classList.contains('next-btn')) {
                button.setAttribute('aria-label', 'Next slide');
            }
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') return;
        
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (!targetElement) return;
        
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});