// Common JavaScript for all pages - Copy paste ready

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const currentYear = document.getElementById('current-year');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('MathNexa - Differential Equation Solver initialized');
    
    // Mobile Navigation Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
            });
        });
    }
    
    // Set current year in footer
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }
    
    // Active navigation link highlighting
    highlightActiveNavLink();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize glass card hover effects
    initGlassCardEffects();
    
    // Handle example parameter in URL for solver page
    handleExampleParameter();
});

// Highlight active navigation link
function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // Remove active class from all links
        link.classList.remove('active');
        
        // Check if this link matches current page
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
        
        // Special case for index.html
        if (currentPage === '' && linkPage === 'index.html') {
            link.classList.add('active');
        }
    });
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (hamburger && navMenu) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
                
                // Calculate scroll position (adjust for fixed navbar)
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltipText = element.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
            tooltip.style.opacity = '0';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }, 10);
            
            element._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', () => {
            if (element._tooltip) {
                element._tooltip.remove();
                element._tooltip = null;
            }
        });
    });
}

// Initialize glass card hover effects
function initGlassCardEffects() {
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--glass-shadow)';
        });
    });
}

// Handle example parameter in URL for solver page
function handleExampleParameter() {
    if (window.location.pathname.includes('solver.html') || window.location.pathname.endsWith('/')) {
        const urlParams = new URLSearchParams(window.location.search);
        const example = urlParams.get('example');
        
        if (example) {
            // Wait a bit for the DOM to be fully loaded
            setTimeout(() => {
                const exampleBtns = document.querySelectorAll('.example-btn');
                if (exampleBtns.length >= example) {
                    exampleBtns[example - 1].click();
                }
            }, 800);
        }
    }
}

// Add CSS for tooltips if not already present
if (!document.querySelector('style#tooltip-styles')) {
    const tooltipStyle = document.createElement('style');
    tooltipStyle.id = 'tooltip-styles';
    tooltipStyle.textContent = `
        .tooltip {
            position: absolute;
            background: var(--dark);
            color: white;
            padding: 8px 12px;
            border-radius: var(--radius-sm);
            font-size: 0.9rem;
            z-index: 10000;
            pointer-events: none;
            transform: translateY(10px);
            transition: opacity 0.2s, transform 0.2s;
            white-space: nowrap;
            box-shadow: var(--shadow-md);
            max-width: 300px;
            word-wrap: break-word;
            white-space: normal;
            text-align: center;
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-width: 5px;
            border-style: solid;
            border-color: var(--dark) transparent transparent transparent;
        }
    `;
    document.head.appendChild(tooltipStyle);
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Utility function for debouncing
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

// Export utility functions for use in other scripts
window.MathNexaUtils = {
    debounce,
    isInViewport,
    highlightActiveNavLink,
    initSmoothScrolling
};
