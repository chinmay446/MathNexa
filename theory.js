// Theory Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const theoryTabs = document.querySelectorAll('.theory-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Interactive Examples
    const interactiveExamples = {
        exact: [
            {
                equation: '(2xy + y²)dx + (x² + 2xy)dy = 0',
                steps: [
                    'M = 2xy + y², N = x² + 2xy',
                    '∂M/∂y = 2x + 2y',
                    '∂N/∂x = 2x + 2y',
                    'Since ∂M/∂y = ∂N/∂x, the equation is exact',
                    'Solution: x²y + xy² = C'
                ]
            },
            {
                equation: '(3x² + 2y)dx + (2x + 3y²)dy = 0',
                steps: [
                    'M = 3x² + 2y, N = 2x + 3y²',
                    '∂M/∂y = 2',
                    '∂N/∂x = 2',
                    'Equation is exact',
                    'Solution: x³ + 2xy + y³ = C'
                ]
            }
        ],
        nonExact: [
            {
                equation: '(3x²y + 2xy + y³)dx + (x² + y²)dy = 0',
                steps: [
                    'M = 3x²y + 2xy + y³, N = x² + y²',
                    '∂M/∂y = 3x² + 2x + 3y²',
                    '∂N/∂x = 2x',
                    'Since ∂M/∂y ≠ ∂N/∂x, the equation is non-exact',
                    'Find integrating factor...',
                    'Solution after integrating factor: e^(3x)(x²y + y³/3) = C'
                ]
            }
        ]
    };
    
    // Initialize
    initTheoryPage();
    
    function initTheoryPage() {
        // Tab switching
        theoryTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTheoryTab(tabId);
            });
        });
        
        // Create interactive examples
        createInteractiveExamples();
        
        // Initialize flowchart
        initFlowchart();
        
        // Initialize application cards
        initApplicationCards();
        
        // Initialize MathJax for equations
        if (window.MathJax) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
        }
    }
    
    function switchTheoryTab(tabId) {
        // Update tab buttons
        theoryTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
        });
        
        // Update tab content
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
        
        // Update URL hash
        window.location.hash = tabId;
        
        // Trigger MathJax rendering for new content
        if (window.MathJax) {
            setTimeout(() => {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
            }, 100);
        }
    }
    
    function createInteractiveExamples() {
        const exactTab = document.getElementById('exact-tab');
        const nonExactTab = document.getElementById('non-exact-tab');
        
        if (exactTab) {
            const exampleContainer = document.createElement('div');
            exampleContainer.className = 'interactive-examples';
            exampleContainer.innerHTML = `
                <h3><i class="fas fa-play-circle"></i> Interactive Examples</h3>
                <div class="example-selector">
                    ${interactiveExamples.exact.map((ex, idx) => `
                        <button class="example-btn" data-type="exact" data-index="${idx}">
                            Example ${idx + 1}
                        </button>
                    `).join('')}
                </div>
                <div class="example-display">
                    <div class="example-equation"></div>
                    <div class="example-steps"></div>
                </div>
            `;
            
            exactTab.appendChild(exampleContainer);
            
            // Add event listeners to example buttons
            exactTab.querySelectorAll('.example-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    const index = parseInt(this.getAttribute('data-index'));
                    showExample(type, index);
                });
            });
        }
        
        if (nonExactTab) {
            const exampleContainer = document.createElement('div');
            exampleContainer.className = 'interactive-examples';
            exampleContainer.innerHTML = `
                <h3><i class="fas fa-play-circle"></i> Interactive Examples</h3>
                <div class="example-selector">
                    ${interactiveExamples.nonExact.map((ex, idx) => `
                        <button class="example-btn" data-type="nonExact" data-index="${idx}">
                            Example ${idx + 1}
                        </button>
                    `).join('')}
                </div>
                <div class="example-display">
                    <div class="example-equation"></div>
                    <div class="example-steps"></div>
                </div>
            `;
            
            nonExactTab.appendChild(exampleContainer);
            
            // Add event listeners to example buttons
            nonExactTab.querySelectorAll('.example-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const type = this.getAttribute('data-type');
                    const index = parseInt(this.getAttribute('data-index'));
                    showExample(type, index);
                });
            });
        }
        
        // Add CSS for interactive examples
        if (!document.querySelector('#interactive-examples-styles')) {
            const style = document.createElement('style');
            style.id = 'interactive-examples-styles';
            style.textContent = `
                .interactive-examples {
                    margin: 2rem 0;
                    padding: 1.5rem;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: var(--border-radius);
                }
                
                .example-selector {
                    display: flex;
                    gap: 0.5rem;
                    margin: 1rem 0;
                    flex-wrap: wrap;
                }
                
                .example-btn {
                    padding: 0.5rem 1rem;
                    background: var(--gray-light);
                    border: 1px solid var(--gray-medium);
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: var(--transition);
                }
                
                .example-btn:hover {
                    background: var(--gray-medium);
                }
                
                .example-btn.active {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }
                
                .example-equation {
                    font-family: 'Courier New', monospace;
                    font-size: 1.2rem;
                    background: white;
                    padding: 1rem;
                    border-radius: 5px;
                    margin: 1rem 0;
                    border: 1px solid var(--gray-light);
                }
                
                .example-steps {
                    margin-top: 1rem;
                }
                
                .example-step {
                    padding: 0.5rem;
                    margin: 0.5rem 0;
                    background: rgba(255, 255, 255, 0.7);
                    border-radius: 5px;
                    border-left: 3px solid var(--primary-color);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function showExample(type, index) {
        const examples = type === 'exact' ? interactiveExamples.exact : interactiveExamples.nonExact;
        const example = examples[index];
        
        // Find the active tab
        const activeTab = document.querySelector('.theory-tab.active');
        const tabType = activeTab ? activeTab.getAttribute('data-tab') : 'exact';
        
        // Update example display in the active tab
        const exampleDisplay = document.querySelector(`#${tabType}-tab .example-display`);
        if (exampleDisplay) {
            const equationDiv = exampleDisplay.querySelector('.example-equation');
            const stepsDiv = exampleDisplay.querySelector('.example-steps');
            
            if (equationDiv) {
                equationDiv.innerHTML = `<strong>Equation:</strong> ${example.equation}`;
            }
            
            if (stepsDiv) {
                stepsDiv.innerHTML = `
                    <strong>Solution Steps:</strong>
                    ${example.steps.map((step, i) => `
                        <div class="example-step">
                            <strong>Step ${i + 1}:</strong> ${step}
                        </div>
                    `).join('')}
                `;
            }
            
            // Update active button
            exampleDisplay.parentElement.querySelectorAll('.example-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Render with MathJax
            if (window.MathJax) {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, equationDiv]);
            }
        }
    }
    
    function initFlowchart() {
        const flowchart = document.querySelector('.flowchart-container');
        if (!flowchart) return;
        
        // Add click handlers to flowchart boxes
        const boxes = flowchart.querySelectorAll('.flowchart-box');
        boxes.forEach(box => {
            box.addEventListener('click', function() {
                const text = this.textContent.trim();
                showFlowchartInfo(text);
            });
        });
        
        // Add CSS for flowchart interactivity
        if (!document.querySelector('#flowchart-styles')) {
            const style = document.createElement('style');
            style.id = 'flowchart-styles';
            style.textContent = `
                .flowchart-box {
                    cursor: pointer;
                    transition: var(--transition);
                    position: relative;
                }
                
                .flowchart-box:hover {
                    transform: scale(1.05);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 10;
                }
                
                .flowchart-box::after {
                    content: 'Click for details';
                    position: absolute;
                    bottom: -20px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.7rem;
                    color: var(--gray-dark);
                    opacity: 0;
                    transition: var(--transition);
                }
                
                .flowchart-box:hover::after {
                    opacity: 1;
                }
                
                .flowchart-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    opacity: 0;
                    visibility: hidden;
                    transition: var(--transition);
                }
                
                .flowchart-modal.active {
                    opacity: 1;
                    visibility: visible;
                }
                
                .flowchart-modal-content {
                    background: white;
                    padding: 2rem;
                    border-radius: var(--border-radius);
                    max-width: 500px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    transform: translateY(-20px);
                    transition: var(--transition);
                }
                
                .flowchart-modal.active .flowchart-modal-content {
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function showFlowchartInfo(text) {
        const info = getFlowchartInfo(text);
        
        // Create or update modal
        let modal = document.querySelector('.flowchart-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'flowchart-modal';
            modal.innerHTML = `
                <div class="flowchart-modal-content">
                    <div class="modal-header">
                        <h3>${info.title}</h3>
                        <button class="modal-close"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        ${info.content}
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Add close handlers
            modal.querySelector('.modal-close').addEventListener('click', function() {
                modal.classList.remove('active');
            });
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        } else {
            modal.querySelector('h3').textContent = info.title;
            modal.querySelector('.modal-body').innerHTML = info.content;
        }
        
        // Show modal
        modal.classList.add('active');
        
        // Render MathJax if needed
        if (window.MathJax) {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, modal.querySelector('.modal-body')]);
        }
    }
    
    function getFlowchartInfo(text) {
        const info = {
            'Given: M(x,y)dx + N(x,y)dy = 0': {
                title: 'Standard Form',
                content: `
                    <p>The differential equation is written in the standard form:</p>
                    <div class="equation">M(x,y)dx + N(x,y)dy = 0</div>
                    <p>Where:</p>
                    <ul>
                        <li>M(x,y) is a function of x and y</li>
                        <li>N(x,y) is a function of x and y</li>
                        <li>dx and dy are differentials of x and y</li>
                    </ul>
                    <p>This form is essential for checking exactness and applying solution methods.</p>
                `
            },
            'Check if separable': {
                title: 'Separable Equations',
                content: `
                    <p>A differential equation is separable if it can be written in the form:</p>
                    <div class="equation">g(y)dy = f(x)dx</div>
                    <p>To check:</p>
                    <ol>
                        <li>Try to separate variables: all y terms with dy, all x terms with dx</li>
                        <li>If separable, integrate both sides</li>
                    </ol>
                    <p><strong>Example:</strong> dy/dx = x²y ⇒ (1/y)dy = x²dx</p>
                `
            },
            'Check if homogeneous': {
                title: 'Homogeneous Equations',
                content: `
                    <p>An equation is homogeneous if M and N are homogeneous functions of the same degree.</p>
                    <p><strong>Test:</strong> Replace x with tx and y with ty. If the equation becomes tⁿ times the original, it's homogeneous.</p>
                    <p><strong>Solution method:</strong> Use substitution y = vx or x = vy</p>
                    <p><strong>Example:</strong> (x² + y²)dx - 2xydy = 0 is homogeneous of degree 2.</p>
                `
            },
            'Check exactness: ∂M/∂y = ∂N/∂x?': {
                title: 'Exactness Condition',
                content: `
                    <p>The equation is exact if:</p>
                    <div class="equation">∂M/∂y = ∂N/∂x</div>
                    <p>This condition must hold for all (x,y) in the domain.</p>
                    <p><strong>Why this works:</strong> If the equation is exact, there exists a function u(x,y) such that:</p>
                    <div class="equation">du = Mdx + Ndy</div>
                    <p>And the solution is u(x,y) = C.</p>
                `
            },
            'If exact: Solve directly': {
                title: 'Solving Exact Equations',
                content: `
                    <p><strong>Steps to solve exact equations:</strong></p>
                    <ol>
                        <li>Verify ∂M/∂y = ∂N/∂x</li>
                        <li>Find u(x,y) such that ∂u/∂x = M and ∂u/∂y = N</li>
                        <li>Integrate M with respect to x: u = ∫M dx + φ(y)</li>
                        <li>Differentiate with respect to y: ∂u/∂y = ∂/∂y(∫M dx) + φ'(y)</li>
                        <li>Set equal to N and solve for φ'(y)</li>
                        <li>Integrate φ'(y) to find φ(y)</li>
                        <li>Solution: u(x,y) = C</li>
                    </ol>
                `
            },
            'If not: Find integrating factor': {
                title: 'Finding Integrating Factors',
                content: `
                    <p>For non-exact equations, try to find μ(x,y) such that:</p>
                    <div class="equation">μM dx + μN dy = 0</div>
                    <p>is exact.</p>
                    
                    <p><strong>Common cases:</strong></p>
                    <ol>
                        <li><strong>μ depends only on x:</strong> If (∂M/∂y - ∂N/∂x)/N = f(x), then μ = e^∫f(x)dx</li>
                        <li><strong>μ depends only on y:</strong> If (∂N/∂x - ∂M/∂y)/M = g(y), then μ = e^∫g(y)dy</li>
                        <li><strong>Special forms:</strong> Try μ = x^m y^n for appropriate m and n</li>
                    </ol>
                `
            }
        };
        
        return info[text] || {
            title: 'Information',
            content: `<p>Details about "${text}" will be added soon.</p>`
        };
    }
    
    function initApplicationCards() {
        const appCards = document.querySelectorAll('.application-card');
        
        appCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.app-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(5deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.app-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0)';
                }
            });
            
            // Add click handler to show more details
            card.addEventListener('click', function() {
                const title = this.querySelector('h3').text
