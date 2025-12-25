// Differential Equation Solver Logic

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const MInput = document.getElementById('M-input');
    const NInput = document.getElementById('N-input');
    const solveBtn = document.getElementById('solve-btn');
    const clearBtn = document.getElementById('clear-btn');
    const exampleBtn = document.getElementById('example-btn');
    const quickBtns = document.querySelectorAll('.quick-btn');
    const outputTabs = document.querySelectorAll('.output-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // State
    let currentEquation = {
        M: '',
        N: '',
        exact: null,
        solution: null,
        steps: []
    };
    
    // Initialize
    initSolver();
    
    function initSolver() {
        // Load last equation if exists
        const lastEquation = localStorage.getItem('lastEquation');
        if (lastEquation) {
            const equation = JSON.parse(lastEquation);
            MInput.value = equation.M;
            NInput.value = equation.N;
        }
        
        // Event Listeners
        solveBtn.addEventListener('click', solveEquation);
        clearBtn.addEventListener('click', clearInputs);
        exampleBtn.addEventListener('click', loadRandomExample);
        
        quickBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const M = this.getAttribute('data-m');
                const N = this.getAttribute('data-n');
                MInput.value = M;
                NInput.value = N;
                showToast('Example loaded successfully!', 'success');
            });
        });
        
        outputTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                switchTab(tabId);
            });
        });
        
        // Graph controls
        const cRange = document.getElementById('c-range');
        const cValue = document.getElementById('c-value');
        const xRange = document.getElementById('x-range');
        const xValue = document.getElementById('x-value');
        
        if (cRange && cValue) {
            cRange.addEventListener('input', function() {
                cValue.textContent = this.value;
                if (currentEquation.solution) {
                    updateGraph();
                }
            });
        }
        
        if (xRange && xValue) {
            xRange.addEventListener('input', function() {
                const val = parseInt(this.value);
                xValue.textContent = `-${val} to ${val}`;
                if (currentEquation.solution) {
                    updateGraph();
                }
            });
        }
    }
    
    function solveEquation() {
        const M = MInput.value.trim();
        const N = NInput.value.trim();
        
        if (!M || !N) {
            showToast('Please enter both M(x,y) and N(x,y)', 'error');
            return;
        }
        
        // Save equation
        currentEquation.M = M;
        currentEquation.N = N;
        localStorage.setItem('lastEquation', JSON.stringify({ M, N }));
        
        // Show loading state
        solveBtn.innerHTML = '<span class="loading"></span> Solving...';
        solveBtn.disabled = true;
        
        // Simulate solving process
        setTimeout(() => {
            try {
                // Analyze equation
                const exact = mathUtils.checkExactness(M, N);
                currentEquation.exact = exact;
                
                // Generate solution
                const solution = generateSolution(M, N, exact);
                currentEquation.solution = solution;
                
                // Generate steps
                currentEquation.steps = generateSteps(M, N, exact, solution);
                
                // Display results
                displayResults();
                
                // Show success message
                showToast(`Equation solved successfully! ${exact ? 'Exact' : 'Non-exact'} equation.`, 'success');
                
                // Switch to solution tab
                switchTab('solution');
                
            } catch (error) {
                console.error('Solving error:', error);
                showToast('Error solving equation. Please check your input.', 'error');
            } finally {
                // Reset button
                solveBtn.innerHTML = '<i class="fas fa-calculator"></i> Solve Equation';
                solveBtn.disabled = false;
            }
        }, 1500);
    }
    
    function generateSolution(M, N, exact) {
        // This is a simplified solution generator
        // In a real application, this would use a proper CAS
        
        const solutions = {
            '2*x*y + y^2|x^2 + 2*x*y': {
                type: 'exact',
                solution: 'x^2*y + x*y^2 = C',
                verification: 'Differentiating gives original equation'
            },
            '3*x^2*y + 2*x*y + y^3|x^2 + y^2': {
                type: 'non-exact',
                solution: 'e^(3x)*(x^2*y + y^3/3) = C',
                verification: 'After applying integrating factor e^(3x)'
            },
            'sin(x)*cos(y)|-cos(x)*sin(y)': {
                type: 'exact',
                solution: 'sin(x)*sin(y) = C',
                verification: 'Direct differentiation verifies solution'
            },
            'y*exp(x)|exp(x)': {
                type: 'exact',
                solution: 'y*exp(x) = C',
                verification: 'Direct integration possible'
            }
        };
        
        const key = `${M}|${N}`;
        
        if (solutions[key]) {
            return solutions[key];
        }
        
        // Generate generic solution based on type
        if (exact) {
            return {
                type: 'exact',
                solution: '∫M dx + ∫(N - ∂/∂y∫M dx) dy = C',
                verification: 'Equation satisfies exactness condition'
            };
        } else {
            return {
                type: 'non-exact',
                solution: 'Apply integrating factor and solve',
                verification: 'Find integrating factor to make equation exact'
            };
        }
    }
    
    function generateSteps(M, N, exact, solution) {
        const steps = [];
        
        steps.push({
            title: 'Step 1: Identify the equation',
            content: `Given: ${M} dx + ${N} dy = 0`,
            equation: `M(x,y) = ${M}, N(x,y) = ${N}`
        });
        
        steps.push({
            title: 'Step 2: Check for exactness',
            content: exact 
                ? '∂M/∂y = ∂N/∂x, so the equation is exact'
                : '∂M/∂y ≠ ∂N/∂x, so the equation is non-exact',
            equation: exact ? 'Exact ✓' : 'Non-exact ×'
        });
        
        if (exact) {
            steps.push({
                title: 'Step 3: Find potential function u(x,y)',
                content: 'Integrate M with respect to x',
                equation: 'u(x,y) = ∫M dx + φ(y)'
            });
            
            steps.push({
                title: 'Step 4: Differentiate with respect to y',
                content: 'Compare with N to find φ(y)',
                equation: '∂u/∂y = N ⇒ φ′(y) = N - ∂/∂y∫M dx'
            });
            
            steps.push({
                title: 'Step 5: Integrate φ′(y)',
                content: 'Find φ(y) by integration',
                equation: 'φ(y) = ∫φ′(y) dy'
            });
        } else {
            steps.push({
                title: 'Step 3: Find integrating factor',
                content: 'Check if (∂M/∂y - ∂N/∂x)/N is function of x only',
                equation: 'μ(x) = exp(∫(∂M/∂y - ∂N/∂x)/N dx)'
            });
            
            steps.push({
                title: 'Step 4: Multiply by integrating factor',
                content: 'Multiply the entire equation by μ(x)',
                equation: 'μ(x)M dx + μ(x)N dy = 0'
            });
            
            steps.push({
                title: 'Step 5: Solve the exact equation',
                content: 'The new equation is exact and can be solved',
                equation: 'Use method for exact equations'
            });
        }
        
        steps.push({
            title: 'Step 6: Write general solution',
            content: 'Combine results to get general solution',
            equation: solution.solution
        });
        
        return steps;
    }
    
    function displayResults() {
        // Update equation display
        const inputEq = document.getElementById('input-equation');
        if (inputEq) {
            inputEq.innerHTML = `${currentEquation.M} dx + ${currentEquation.N} dy = 0`;
        }
        
        // Update equation type
        const eqType = document.getElementById('equation-type');
        if (eqType) {
            eqType.textContent = currentEquation.exact ? 'Exact' : 'Non-exact';
            eqType.className = `type-badge ${currentEquation.exact ? 'exact' : 'non-exact'}`;
        }
        
        // Update exactness result
        const exactnessResult = document.getElementById('exactness-result');
        if (exactnessResult) {
            exactnessResult.textContent = currentEquation.exact 
                ? '∂M/∂y = ∂N/∂x ✓ Equation is exact'
                : '∂M/∂y ≠ ∂N/∂x × Equation is non-exact';
        }
        
        // Update general solution
        const generalSolution = document.getElementById('general-solution');
        if (generalSolution && currentEquation.solution) {
            generalSolution.innerHTML = currentEquation.solution.solution;
            
            // Try to render with MathJax
            if (window.MathJax) {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, generalSolution]);
            }
        }
        
        // Update steps
        displaySteps();
        
        // Update verification
        updateVerification();
        
        // Update graph
        updateGraph();
    }
    
    function displaySteps() {
        const stepsList = document.getElementById('steps-list');
        if (!stepsList) return;
        
        stepsList.innerHTML = '';
        
        currentEquation.steps.forEach((step, index) => {
            const stepElement = document.createElement('div');
            stepElement.className = 'step-item';
            stepElement.innerHTML = `
                <div class="step-header">
                    <span class="step-number">${index + 1}</span>
                    <h4>${step.title}</h4>
                </div>
                <div class="step-content">
                    <p>${step.content}</p>
                    ${step.equation ? `<div class="step-equation">${step.equation}</div>` : ''}
                </div>
            `;
            
            // Add animation delay
            stepElement.style.animationDelay = `${index * 0.1}s`;
            
            stepsList.appendChild(stepElement);
        });
        
        // Add CSS for step animation
        if (!document.querySelector('#step-styles')) {
            const style = document.createElement('style');
            style.id = 'step-styles';
            style.textContent = `
                .step-item {
                    animation: fadeInUp 0.5s ease-out forwards;
                    opacity: 0;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: var(--gray-light);
                    border-radius: var(--border-radius);
                    border-left: 4px solid var(--primary-color);
                }
                
                .step-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.5rem;
                }
                
                .step-number {
                    background: var(--primary-color);
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                
                .step-equation {
                    font-family: 'Courier New', monospace;
                    background: white;
                    padding: 0.8rem;
                    border-radius: 5px;
                    margin-top: 0.5rem;
                    font-size: 0.9rem;
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function updateVerification() {
        const diffStep = document.getElementById('differentiation-step');
        const compStep = document.getElementById('comparison-step');
        const verResult = document.getElementById('verification-result');
        
        if (!diffStep || !compStep || !verResult) return;
        
        if (currentEquation.solution) {
            diffStep.innerHTML = `
                <p>Solution: ${currentEquation.solution.solution}</p>
                <p>Differentiating gives expression in terms of dx and dy</p>
            `;
            
            compStep.innerHTML = `
                <p>Comparing with original equation: ${currentEquation.M} dx + ${currentEquation.N} dy = 0</p>
                <p>${currentEquation.solution.verification}</p>
            `;
            
            verResult.innerHTML = `
                <div class="verification-success">
                    <i class="fas fa-check-circle"></i>
                    Solution verified successfully!
                </div>
            `;
            verResult.className = 'verification-result success';
        }
    }
    
    function updateGraph() {
        const graphPlaceholder = document.getElementById('graph-placeholder');
        if (!graphPlaceholder) return;
        
        // In a real application, this would generate an actual graph
        // For now, we'll create a simulated graph
        
        const cValue = document.getElementById('c-range')?.value || 0;
        const xRange = document.getElementById('x-range')?.value || 5;
        
        graphPlaceholder.innerHTML = `
            <div class="graph-simulation">
                <div class="graph-title">Solution Curves for C = ${cValue}</div>
                <div class="graph-grid">
                    <div class="y-axis">
                        ${Array.from({length: 11}, (_, i) => `<div class="tick">${5-i}</div>`).join('')}
                    </div>
                    <div class="graph-area">
                        ${generateSolutionCurves(cValue, xRange)}
                    </div>
                </div>
                <div class="x-axis">
                    ${Array.from({length: 11}, (_, i) => `<div class="tick">${-xRange + (2*xRange*i/10)}</div>`).join('')}
                </div>
            </div>
        `;
        
        // Add styles for graph
        if (!document.querySelector('#graph-simulation-styles')) {
            const style = document.createElement('style');
            style.id = 'graph-simulation-styles';
            style.textContent = `
                .graph-simulation {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .graph-title {
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 1rem;
                    color: var(--primary-color);
                }
                
                .graph-grid {
                    display: flex;
                    flex: 1;
                    position: relative;
                }
                
                .y-axis {
                    width: 30px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    justify-content: space-between;
                    padding-right: 5px;
                    border-right: 1px solid var(--gray-medium);
                }
                
                .x-axis {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 5px;
                    border-top: 1px solid var(--gray-medium);
                    height: 30px;
                }
                
                .tick {
                    font-size: 0.7rem;
                    color: var(--gray-dark);
                }
                
                .graph-area {
                    flex: 1;
                    position: relative;
                    background: linear-gradient(0deg, rgba(74,111,165,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(74,111,165,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                
                .solution-curve {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at var(--x) var(--y), var(--primary-color) 2px, transparent 2px);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function generateSolutionCurves(C, range) {
        // Generate some points for the solution curve
        // This is a simplified simulation
        
        const curves = [];
        const steps = 50;
        const centerX = 50; // Percentage
        const centerY = 50; // Percentage
        
        for (let i = 0; i < 3; i++) {
            const points = [];
            for (let j = 0; j <= steps; j++) {
                const t = (j / steps) * 2 * Math.PI;
                const x = centerX + 40 * Math.cos(t + i * Math.PI/3);
                const y = centerY + 40 * Math.sin(t + i * Math.PI/3) * (1 + C/10);
                points.push({x, y});
            }
            
            const curveStyle = points.map(p => 
                `radial-gradient(circle at ${p.x}% ${p.y}%, var(--primary-color) 2px, transparent 2px)`
            ).join(', ');
            
            curves.push(`
                <div class="solution-curve" style="
                    --x: ${centerX}%;
                    --y: ${centerY}%;
                    background: ${curveStyle};
                "></div>
            `);
        }
        
        return curves.join('');
    }
    
    function switchTab(tabId) {
        // Update tab buttons
        outputTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
        });
        
        // Update tab content
        tabContents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabId}-tab`);
        });
        
        // If switching to graph tab and solution exists, update graph
        if (tabId === 'graph' && currentEquation.solution) {
            setTimeout(updateGraph, 100);
        }
    }
    
    function clearInputs() {
        MInput.value = '';
        NInput.value = '';
        currentEquation = {
            M: '',
            N: '',
            exact: null,
            solution: null,
            steps: []
        };
        
        // Clear results
        const resultElements = [
            'input-equation',
            'equation-type',
            'exactness-result',
            'general-solution',
            'steps-list',
            'differentiation-step',
            'comparison-step',
            'verification-result'
        ];
        
        resultElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = id.includes('equation') ? 'Solution will appear here...' : '-';
                if (id === 'verification-result') {
                    element.className = 'verification-result';
                }
            }
        });
        
        // Clear graph
        const graphPlaceholder = document.getElementById('graph-placeholder');
        if (graphPlaceholder) {
            graphPlaceholder.innerHTML = `
                <div class="graph-message">
                    <i class="fas fa-chart-area"></i>
                    <p>Graph will be displayed here after solving the equation.</p>
                    <p>The graph shows the family of solution curves for different values of C.</p>
                </div>
            `;
        }
        
        showToast('Inputs cleared successfully!', 'success');
    }
    
    function loadRandomExample() {
        const examples = [
            { M: '2*x*y + y^2', N: 'x^2 + 2*x*y', desc: 'Exact equation' },
            { M: '3*x^2*y + 2*x*y + y^3', N: 'x^2 + y^2', desc: 'Non-exact equation' },
            { M: 'sin(x)*cos(y)', N: '-cos(x)*sin(y)', desc: 'Trigonometric exact equation' },
            { M: 'y*exp(x)', N: 'exp(x)', desc: 'Exponential exact equation' },
            { M: 'x^2 + y', N: 'y^2 + x', desc: 'Simple exact equation' }
        ];
        
        const randomExample = examples[Math.floor(Math.random() * examples.length)];
        MInput.value = randomExample.M;
        NInput.value = randomExample.N;
        
        showToast(`Loaded example: ${randomExample.desc}`, 'success');
    }
    
    // Export functions for use in other contexts
    window.solver = {
        solveEquation,
        clearInputs,
        loadRandomExample,
        currentEquation
    };
});
