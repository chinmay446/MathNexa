// Main JavaScript file for common functionality across all pages

document.addEventListener('DOMContentLoaded', function() {
    // Theme Switching
    const lightModeBtn = document.getElementById('lightMode');
    const darkModeBtn = document.getElementById('darkMode');
    
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'light') {
        lightModeBtn.classList.add('active');
    } else {
        darkModeBtn.classList.add('active');
    }
    
    lightModeBtn.addEventListener('click', function() {
        document.body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        lightModeBtn.classList.add('active');
        darkModeBtn.classList.remove('active');
    });
    
    darkModeBtn.addEventListener('click', function() {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeBtn.classList.add('active');
        lightModeBtn.classList.remove('active');
    });
    
    // Mobile Menu Toggle
    const createMobileMenu = function() {
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.sidebar');
            const sidebarMenu = document.querySelector('.sidebar-menu');
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 1001;
                background: var(--primary-color);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;
            
            if (!document.querySelector('.mobile-menu-toggle')) {
                document.body.appendChild(menuToggle);
                
                menuToggle.addEventListener('click', function() {
                    sidebar.classList.toggle('mobile-open');
                    menuToggle.innerHTML = sidebar.classList.contains('mobile-open') 
                        ? '<i class="fas fa-times"></i>' 
                        : '<i class="fas fa-bars"></i>';
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', function(event) {
                    if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
                        sidebar.classList.remove('mobile-open');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            }
        } else {
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (menuToggle) {
                menuToggle.remove();
            }
            document.querySelector('.sidebar')?.classList.remove('mobile-open');
        }
    };
    
    // Initialize mobile menu
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    // Active link highlighting based on scroll position
    const highlightActiveLink = function() {
        const sections = document.querySelectorAll('.content section[id]');
        const navLinks = document.querySelectorAll('.sidebar-menu a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    
    // Only run if there are sections
    if (document.querySelectorAll('.content section[id]').length > 0) {
        window.addEventListener('scroll', highlightActiveLink);
    }
    
    // MathJax configuration
    if (window.MathJax) {
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true,
                processEnvironments: true
            },
            CommonHTML: { linebreaks: { automatic: true } },
            "HTML-CSS": { linebreaks: { automatic: true } },
            SVG: { linebreaks: { automatic: true } }
        });
    }
    
    // Loading animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Form validation helper
    window.validateForm = function(formId, rules) {
        const form = document.getElementById(formId);
        if (!form) return true;
        
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            const errorElement = input.nextElementSibling?.classList.contains('error-message') 
                ? input.nextElementSibling 
                : null;
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                }
            } else {
                input.classList.remove('error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            }
        });
        
        return isValid;
    };
    
    // Toast notification system
    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close"><i class="fas fa-times"></i></button>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 500px;
            box-shadow: var(--box-shadow);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', function() {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
        
        // Add CSS for animations if not already present
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: var(--box-shadow);
        z-index: 1000;
        transition: var(--transition);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Initialize tooltips
    const initTooltips = function() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip');
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.cssText = `
                position: absolute;
                background: var(--dark-color);
                color: var(--light-color);
                padding: 5px 10px;
                border-radius: 4px;
                font-size: 0.8rem;
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s;
                pointer-events: none;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                margin-bottom: 5px;
            `;
            
            element.style.position = 'relative';
            element.appendChild(tooltip);
            
            element.addEventListener('mouseenter', function() {
                tooltip.style.opacity = '1';
            });
            
            element.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
            });
        });
    };
    
    initTooltips();
    
    // Session management for tests
    window.sessionManager = {
        getSession: function() {
            return JSON.parse(localStorage.getItem('de_solver_session') || '{}');
        },
        
        setSession: function(data) {
            const session = this.getSession();
            Object.assign(session, data);
            localStorage.setItem('de_solver_session', JSON.stringify(session));
        },
        
        clearSession: function() {
            localStorage.removeItem('de_solver_session');
        }
    };
    
    // Page transition effect
    document.querySelectorAll('a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href && !this.target && !this.hasAttribute('download')) {
                e.preventDefault();
                document.body.style.opacity = '0.5';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            }
        });
    });
    
    // Restore body opacity on page load
    document.body.style.opacity = '1';
});

// Utility functions for mathematical operations
window.mathUtils = {
    // Parse mathematical expression
    parseExpression: function(expr) {
        // Replace common math symbols
        expr = expr
            .replace(/\^/g, '**')
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/exp\(/g, 'Math.exp(')
            .replace(/ln\(/g, 'Math.log(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/sqrt\(/g, 'Math.sqrt(');
        
        return expr;
    },
    
    // Evaluate expression at given point
    evaluate: function(expr, x, y) {
        try {
            const parsedExpr = this.parseExpression(expr);
            const func = new Function('x', 'y', `return ${parsedExpr}`);
            return func(x, y);
        } catch (error) {
            console.error('Evaluation error:', error);
            return NaN;
        }
    },
    
    // Partial derivative approximation
    partialDerivative: function(expr, variable, point, h = 0.0001) {
        const { x, y } = point;
        
        if (variable === 'x') {
            const f1 = this.evaluate(expr, x + h, y);
            const f2 = this.evaluate(expr, x - h, y);
            return (f1 - f2) / (2 * h);
        } else if (variable === 'y') {
            const f1 = this.evaluate(expr, x, y + h);
            const f2 = this.evaluate(expr, x, y - h);
            return (f1 - f2) / (2 * h);
        }
        
        return NaN;
    },
    
    // Check if equation is exact
    checkExactness: function(M_expr, N_expr) {
        const points = [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 1, y: 2 },
            { x: -1, y: 1 }
        ];
        
        for (const point of points) {
            const dM_dy = this.partialDerivative(M_expr, 'y', point);
            const dN_dx = this.partialDerivative(N_expr, 'x', point);
            
            if (Math.abs(dM_dy - dN_dx) > 0.01) {
                return false;
            }
        }
        
        return true;
    },
    
    // Format equation for display
    formatEquation: function(expr) {
        return expr
            .replace(/\*\*/g, '^')
            .replace(/\*/g, '·')
            .replace(/Math\./g, '');
    }
};
