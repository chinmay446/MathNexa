// Common JavaScript for all pages - Fixed Navigation

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
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
                
                // Update active class
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
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
    
    // Handle example parameter in URL for solver page
    handleExampleParameter();
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (hamburger && navMenu && 
            !hamburger.contains(event.target) && 
            !navMenu.contains(event.target) && 
            navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
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
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#' || href === '#!') return;
            
            // Check if the target exists
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
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
                    const index = parseInt(example) - 1;
                    if (index >= 0 && index < exampleBtns.length) {
                        exampleBtns[index].click();
                    }
                }
            }, 500);
        }
    }
}

// Utility function to parse math expressions
function parseMathExpression(expr) {
    if (!expr) return '';
    
    // Convert to string and trim
    expr = String(expr).trim();
    
    // Replace common math notations
    expr = expr.replace(/\s+/g, ''); // Remove spaces
    
    // Handle exponents
    expr = expr.replace(/\^/g, '**');
    
    // Handle implicit multiplication
    expr = expr.replace(/(\d)([a-zA-Z])/g, '$1*$2'); // 2x -> 2*x
    expr = expr.replace(/([a-zA-Z])(\d)/g, '$1*$2'); // x2 -> x*2
    expr = expr.replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2'); // xy -> x*y
    expr = expr.replace(/\)([a-zA-Z\d])/g, ')*$1'); // )(x) -> )*(x)
    expr = expr.replace(/([a-zA-Z\d])\(/g, '$1*('); // x( -> x*(
    
    return expr;
}

// Utility function to simplify expression
function simplifyExpression(expr) {
    // Basic simplification rules
    const simplifications = {
        'x**0': '1',
        '1*x': 'x',
        'x*1': 'x',
        '0*x': '0',
        'x*0': '0',
        'x**1': 'x',
        'x+-': 'x-',
        'x--': 'x+'
    };
    
    let simplified = expr;
    for (const [pattern, replacement] of Object.entries(simplifications)) {
        const regex = new RegExp(pattern, 'g');
        simplified = simplified.replace(regex, replacement);
    }
    
    return simplified;
}

// Export utility functions for use in other scripts
window.MathNexaUtils = {
    parseMathExpression,
    simplifyExpression,
    highlightActiveNavLink
};
