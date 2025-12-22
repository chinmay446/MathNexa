// Theory Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Table of Contents navigation
    const tocLinks = document.querySelectorAll('.toc-link');
    const theorySections = document.querySelectorAll('.theory-section');
    
    // Set up smooth scrolling for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Update active TOC link
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // Scroll to section
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active TOC link on scroll
    function updateActiveTocLink() {
        let currentSection = '';
        
        theorySections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 150) && 
                window.scrollY < (sectionTop + sectionHeight - 150)) {
                currentSection = '#' + section.id;
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    // Tab functionality for examples
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Math rendering (if MathJax is available)
    if (window.MathJax) {
        window.MathJax.typesetPromise();
    }
    
    // Scroll event listener for TOC
    window.addEventListener('scroll', updateActiveTocLink);
    
    // Initialize
    updateActiveTocLink();
});
