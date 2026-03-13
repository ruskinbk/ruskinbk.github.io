// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorDot = document.querySelector('.cursor-dot');

if (cursor && cursorDot) {
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.left = `${cursorX - 10}px`;
        cursor.style.top = `${cursorY - 10}px`;
        cursorDot.style.left = `${mouseX - 3}px`;
        cursorDot.style.top = `${mouseY - 3}px`;

        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effects
    document.querySelectorAll('a, button, .showcase-card, .service-card, .skill-card, .quote-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Scroll Progress Bar
const scrollProgress = document.querySelector('.scroll-progress-bar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = `${scrollPercent}%`;
    }
});

// Parallax effect for background shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.gradient-shape');
    
    shapes.forEach((shape, index) => {
        const rate = (index + 1) * 0.5;
        const yPos = -(scrolled * rate);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');
    });
}

// Theme toggle (light/dark)
const themeToggle = document.getElementById('theme-toggle');
const storedTheme = localStorage.getItem('theme');

const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-sun', 'fa-moon');
        icon.classList.add(theme === 'light' ? 'fa-sun' : 'fa-moon');
    }
};

const getPreferredTheme = () => {
    if (storedTheme) return storedTheme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

const setTheme = (theme) => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
};

const initialTheme = getPreferredTheme();
setTheme(initialTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// Close menu when link is clicked (mobile only)
const navLinks = document.querySelectorAll('.nav-link');
const isMobileOpen = () => window.innerWidth <= 768 && window.getComputedStyle(navMenu).display !== 'none';

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (link.id === 'theme-toggle') return; // Keep menu open when toggling theme on mobile
        if (!isMobileOpen()) return;
        navMenu.style.display = 'none';
        hamburger.classList.remove('active');
    });
});

// Portfolio filter
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.showcase-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filterValue === 'all') {
                item.style.display = 'block';
                // Trigger animation
                setTimeout(() => {
                    item.style.animation = 'none';
                    setTimeout(() => {
                        item.style.animation = '';
                    }, 10);
                }, 10);
            } else {
                if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Trigger animation
                    setTimeout(() => {
                        item.style.animation = 'none';
                        setTimeout(() => {
                            item.style.animation = '';
                        }, 10);
                    }, 10);
                } else {
                    item.style.display = 'none';
                }
            }
        });
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
const serviceSelect = document.getElementById('service');
const otherServiceField = document.getElementById('other-service');

const updateOtherServiceVisibility = () => {
    if (!serviceSelect || !otherServiceField) return;
    if (serviceSelect.value === 'other') {
        otherServiceField.style.display = 'block';
        otherServiceField.required = true;
    } else {
        otherServiceField.style.display = 'none';
        otherServiceField.required = false;
        otherServiceField.value = '';
    }
};

if (serviceSelect) {
    serviceSelect.addEventListener('change', updateOtherServiceVisibility);
}

if (contactForm) {
    updateOtherServiceVisibility();

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const service = document.getElementById('service').value;
        const otherService = document.getElementById('other-service').value;
        const message = document.getElementById('message').value;

        // Validate form
        if (name && email && service && message && (service !== 'other' || otherService)) {
            const selectedService = service === 'other' ? `Other - ${otherService}` : service;

            // Create mailto link with all fields
            const emailBody = `Name: ${name}
Email: ${email}
Service Interested In: ${selectedService}

Project Details:
${message}`;

            const mailtoLink = `mailto:ruskinnnbk@gmail.com?subject=New Project Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(emailBody)}`;

            // Open email client
            window.location.href = mailtoLink;

            // Reset form
            contactForm.reset();
            updateOtherServiceVisibility();

            // Show success message
            showNotification('Thank you! Opening your email client...');
        } else {
            showNotification('Please fill in all fields', 'error');
        }
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for navigation links (offset by fixed navbar height)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = href !== '#' ? document.querySelector(href) : null;
        if (target) {
            e.preventDefault();
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill cards
document.querySelectorAll('.skill-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.6s ease ${(index * 0.1) + 0.2}s, transform 0.6s ease ${(index * 0.1) + 0.2}s`;
    observer.observe(card);
});

// Observe portfolio items - removed since we use CSS animations now

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe testimonial cards
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe benefit items
document.querySelectorAll('.benefit-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Observe process steps
document.querySelectorAll('.process-step').forEach(step => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(20px)';
    step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(step);
});

// Navigation active state on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        link.classList.remove('active');
        if (href.slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active state styling to nav links
const style2 = document.createElement('style');
style2.textContent = `
    .nav-link.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
        padding-bottom: 0.5rem;
    }
`;
document.head.appendChild(style2);

// Track form interactions for conversion tracking
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Log CTA clicks for analytics (can be replaced with Google Analytics)
        console.log('CTA Clicked:', this.textContent);
    });
});

// Add scroll tracking for page engagement
let scrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollDepth = Math.max(scrollDepth, scrollPercent);
});

// Track time on page
let pageStartTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeOnPage = (Date.now() - pageStartTime) / 1000; // in seconds
    console.log('Time on page:', timeOnPage, 'seconds');
    console.log('Scroll depth:', Math.round(scrollDepth), '%');
});

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display quotes
    const quotesContainer = document.getElementById('quotes-container');
    if (quotesContainer) {
        fetch('https://api.quotable.io/quotes/random?tags=design,motivation,growth&limit=3')
            .then(response => response.json())
            .then(quotes => {
                quotesContainer.innerHTML = quotes.map((quote, index) => `
                    <div class="quote-card" style="opacity: 0; transform: translateY(20px); animation: fadeInUp 0.8s ease ${(index * 0.2) + 0.5}s both;">
                        <blockquote>"${quote.content}"</blockquote>
                        <cite>— ${quote.author}</cite>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error fetching quotes:', error);
                quotesContainer.innerHTML = '<p>Unable to load quotes at this time.</p>';
            });
    }

    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.classList.add('loaded');
        setTimeout(() => loader.remove(), 500);
    }
});

console.log('Portfolio website loaded successfully!');

