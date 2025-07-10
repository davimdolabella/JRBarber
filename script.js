// ========== NAVIGATION SETUP ==========
function setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link
        updateActiveNavLink();
        
        // Show/hide floating booking button
        updateFloatingBooking();
    });
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            
            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const mobileMenu = document.getElementById('mobile-menu');
            if (navMenu) navMenu.classList.remove('active');
            if (mobileMenu) mobileMenu.classList.remove('active');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ========== MOBILE MENU ==========
function setupMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// ========== FLOATING BOOKING BUTTON ==========
function updateFloatingBooking() {
    const floatingBooking = document.getElementById('floating-booking');
    const bookingSection = document.getElementById('booking');
    
    if (floatingBooking && bookingSection) {
        const bookingSectionTop = bookingSection.offsetTop;
        const bookingSectionBottom = bookingSectionTop + bookingSection.clientHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Show button when past hero section and not in booking section
        if (window.scrollY > 500 && (window.scrollY < bookingSectionTop || window.scrollY > bookingSectionBottom)) {
            floatingBooking.classList.add('visible');
        } else {
            floatingBooking.classList.remove('visible');
        }
    }
}

function setupFloatingBooking() {
    const floatingBooking = document.getElementById('floating-booking');
    
    if (floatingBooking) {
        floatingBooking.addEventListener('click', () => {
            const bookingSection = document.getElementById('booking');
            if (bookingSection) {
                const offsetTop = bookingSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ========== BOOKING FORM ==========
function setupBookingForm() {
    const bookingForm = document.getElementById('booking-form');
    
    if (bookingForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.min = tomorrow.toISOString().split('T')[0];
        }
        
        // Handle form submission
        bookingForm.addEventListener('submit', handleBookingSubmission);
        
        // Update available times based on selected date
        const dateField = document.getElementById('date');
        if (dateField) {
            dateField.addEventListener('change', updateAvailableTimes);
        }
    }
}

function handleBookingSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        name: formData.get('name'),
        phone: formData.get('phone')
    };
    
    // Simulate booking process
    showBookingConfirmation(bookingData);
    
    // Reset form
    e.target.reset();
}

function showBookingConfirmation(bookingData) {
    const confirmationMessage = `
        Thank you, ${bookingData.name}!
        
        Your appointment has been requested:
        • Service: ${getServiceName(bookingData.service)}
        • Date: ${formatDate(bookingData.date)}
        • Time: ${bookingData.time}
        
        We'll call you at ${bookingData.phone} to confirm your appointment.
    `;
    
    alert(confirmationMessage);
}

function getServiceName(serviceValue) {
    const services = {
        'haircut': 'Haircut - $35',
        'beard': 'Beard Trim - $25',
        'combo': 'Haircut + Beard - $55',
        'shave': 'Hot Towel Shave - $40',
        'premium': 'Premium Package - $75'
    };
    return services[serviceValue] || serviceValue;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function updateAvailableTimes() {
    const dateField = document.getElementById('date');
    const timeField = document.getElementById('time');
    
    if (!dateField || !timeField) return;
    
    const selectedDate = new Date(dateField.value);
    const today = new Date();
    const timeOptions = timeField.querySelectorAll('option');
    
    // If selected date is today, disable past times
    if (selectedDate.toDateString() === today.toDateString()) {
        const currentHour = today.getHours();
        
        timeOptions.forEach(option => {
            if (option.value) {
                const optionHour = parseInt(option.value.split(':')[0]);
                const adjustedHour = optionHour === 12 ? 12 : optionHour;
                
                if (adjustedHour <= currentHour) {
                    option.disabled = true;
                    option.style.color = '#ccc';
                } else {
                    option.disabled = false;
                    option.style.color = '';
                }
            }
        });
    } else {
        // Enable all times for future dates
        timeOptions.forEach(option => {
            option.disabled = false;
            option.style.color = '';
        });
    }
}

// ========== SCROLL ANIMATIONS ==========
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.info-card, .review-card, .portfolio-item, .booking-card');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
}

// ========== PORTFOLIO INTERACTIONS ==========
function setupPortfolioInteractions() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ========== CONTACT FUNCTIONALITY ==========
function setupContactFunctionality() {
    // Phone number click tracking
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Phone call initiated');
            // Track phone calls for analytics
        });
    });
    
    // Email click tracking
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', () => {
            console.log('Email initiated');
            // Track email clicks for analytics
        });
    });
}

// ========== SMOOTH SCROLLING ==========
function setupSmoothScrolling() {
    // Add smooth scrolling to all anchor links
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

// ========== MAIN INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    setupNavigation();
    setupMobileMenu();
    setupFloatingBooking();
    setupBookingForm();
    setupScrollAnimations();
    setupPortfolioInteractions();
    setupContactFunctionality();
    setupSmoothScrolling();
    
    // Show floating booking button after initial load
    setTimeout(() => {
        updateFloatingBooking();
    }, 1000);
    
    console.log('Elite Cuts Barbershop website loaded successfully!');
});

// ========== UTILITY FUNCTIONS ==========
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

// Debounce scroll events for better performance
window.addEventListener('scroll', debounce(() => {
    updateActiveNavLink();
    updateFloatingBooking();
}, 10));