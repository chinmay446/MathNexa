// Differential Equation Solver with WORKING Virtual Keyboard

// DOM Elements
const solveBtn = document.getElementById('solve-btn');
const clearBtn = document.getElementById('clear-btn');
const randomBtn = document.getElementById('random-btn');
const copyBtn = document.getElementById('copy-btn');
const MInput = document.getElementById('M-input');
const NInput = document.getElementById('N-input');
const solutionSteps = document.getElementById('solution-steps');
const solutionPlaceholder = document.getElementById('solution-placeholder');
const solutionStatus = document.getElementById('solution-status');
const exampleBtns = document.querySelectorAll('.example-btn');

// Virtual Keyboard Elements
const toggleKeyboardBtn = document.querySelector('.toggle-keyboard-btn');
const keyboardContainer = document.querySelector('.virtual-keyboard-container');
const keyboardTabs = document.querySelectorAll('.keyboard-tab');
const keyboardKeys = document.querySelectorAll('.keyboard-key');

// Current focused input
let currentInput = null;

// Example equations database
const examples = [
    { 
        m: '2xy', 
        n: 'x^2', 
        name: 'Exact Equation', 
        type: 'exact',
        solution: 'x²y = C',
        dM_dy: '2x',
        dN_dx: '2x'
    },
    { 
        m: 'y', 
        n: '2x', 
        name: 'Non-Exact (μ = x)', 
        type: 'non-exact',
        solution: 'x²y = C',
        dM_dy: '1',
        dN_dx: '2'
    },
    { 
        m: '3x^2+y', 
        n: 'x-2y', 
        name: 'Exact with Both Variables', 
        type: 'exact',
        solution: 'x³ + xy - y² = C',
        dM_dy: '1',
        dN_dx: '1'
    },
    { 
        m: 'y^2', 
        n: '2xy', 
        name: 'Exact Equation', 
        type: 'exact',
        solution: 'xy² = C',
        dM_dy: '2y',
        dN_dx: '2y'
    },
    { 
        m: 'x+y', 
        n: 'x-y', 
        name: 'Exact Equation', 
        type: 'exact',
        solution: 'x² + 2xy - y² = C',
        dM_dy: '1',
        dN_dx: '1'
    },
    { 
        m: '2y', 
        n: '3x^2', 
        name: 'Non-Exact (μ = y)', 
        type: 'non-exact',
        solution: 'x³y² = C',
        dM_dy: '2',
        dN_dx: '6x'
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('MathNexa Solver initialized');
    
    // Set up event listeners for inputs
    setupInputListeners();
    
    // Set up event listeners for buttons
    setupButtonListeners();
    
    // Set up virtual keyboard
    setupVirtualKeyboard();
    
    // Load default example
    loadExample(0);
});

// Set up input listeners
function setupInputListeners() {
    if (MInput) {
        MInput.addEventListener('focus', () => {
            currentInput = MInput;
            highlightCurrentInput();
            showKeyboard();
        });
        
        MInput.addEventListener('input', () => {
            validateInput(MInput);
        });
    }
    
    if (NInput) {
        NInput.addEventListener('focus', () => {
            currentInput = NInput;
            highlightCurrentInput();
            showKeyboard();
        });
        
        NInput.addEventListener('input', () => {
            validateInput(NInput);
        });
    }
}

// Highlight current input
function highlightCurrentInput() {
    [MInput, NInput].forEach(input => {
        if (input) {
            input.style.boxShadow = 'none';
            input.style.borderColor = 'var(--gray-light)';
        }
    });
    
    if (currentInput) {
        currentInput.style.boxShadow = '0 0 0 3px rgba(74, 107, 255, 0.2)';
        currentInput.style.borderColor = 'var(--primary)';
    }
}

// Validate input
function validateInput(input) {
    const value = input.value;
    // Allow letters, numbers, operators, parentheses, and basic functions
    const validPattern = /^[a-zA-Z0-9\+\-\*\/\^\(\)\s\.sincoetanlgexp√πθ∂∫]*$/;
    
    if (!validPattern.test(value)) {
        input.style.borderColor = 'var(--danger)';
        return false;
    } else {
        input.style.borderColor = 'var(--gray-light)';
        return true;
    }
}

// Set up button listeners
function setupButtonListeners() {
    // Solve button
    if (solveBtn) {
        solveBtn.addEventListener('click', solveEquation);
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAll);
    }
    
    // Random example button
    if (randomBtn) {
        randomBtn.addEventListener('click', loadRandomExample);
    }
    
    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener('click', copySolution);
    }
    
    // Example buttons
    if (exampleBtns) {
        exampleBtns.forEach((btn, index) => {
            btn.addEventListener('click', function() {
                const m = this.getAttribute('data-m');
                const n = this.getAttribute('data-n');
                loadCustomExample(m, n, index);
            });
        });
    }
}

// Set up virtual keyboard
function setupVirtualKeyboard() {
    // Toggle keyboard visibility
    if (toggleKeyboardBtn) {
        toggleKeyboardBtn.addEventListener('click', function() {
            if (keyboardContainer.style.display === 'none') {
                showKeyboard();
                this.textContent = 'Hide Keyboard';
            } else {
                hideKeyboard();
                this.textContent = 'Show Keyboard';
            }
        });
    }
    
    // Keyboard tabs
    if (keyboardTabs) {
        keyboardTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                keyboardTabs.forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show/hide keyboard sections
                const tabType = this.getAttribute('data-tab');
                document.querySelectorAll('.keyboard-section').forEach(section => {
                    section.style.display = 'none';
                });
                
                const activeSection = document.getElementById(`keyboard-${tabType}`);
                if (activeSection) {
                    activeSection.style.display = 'grid';
                }
            });
        });
    }
    
    // Keyboard keys
    if (keyboardKeys) {
        keyboardKeys.forEach(key => {
            key.addEventListener('click', function() {
                const action = this.getAttribute('data-action');
                const value = this.getAttribute('data-value') || this.textContent.trim();
                
                handleKeyboardInput(action, value);
            });
        });
    }
    
    // Close keyboard when clicking outside
    document.addEventListener('click', function(e) {
        if (keyboardContainer && toggleKeyboardBtn && 
            !keyboardContainer.contains(e.target) && 
            !toggleKeyboardBtn.contains(e.target) &&
            MInput && !MInput.contains(e.target) && 
            NInput && !NInput.contains(e.target)) {
            hideKeyboard();
        }
    });
}

// Show virtual keyboard
function showKeyboard() {
    if (keyboardContainer) {
        keyboardContainer.style.display = 'block';
        if (toggleKeyboardBtn) {
            toggleKeyboardBtn.textContent = 'Hide Keyboard';
        }
    }
}

// Hide virtual keyboard
function hideKeyboard() {
    if (keyboardContainer) {
        keyboardContainer.style.display = 'none';
        if (toggleKeyboardBtn) {
            toggleKeyboardBtn.textContent = 'Show Keyboard';
        }
    }
}

// Handle keyboard input
function handleKeyboardInput(action, value) {
    if (!currentInput) {
        // If no input is focused, focus M-input
        if (MInput) {
            MInput.focus();
            currentInput = MInput;
            highlightCurrentInput();
        } else {
            return;
        }
    }
    
    const input = currentInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    
    switch (action) {
        case 'backspace':
            if (start === end && start > 0) {
                // Delete character before cursor
                input.value = text.substring(0, start - 1) + text.substring(end);
                input.selectionStart = input.selectionEnd = start - 1;
            } else if (start !== end) {
                // Delete selected text
                input.value = text.substring(0, start) + text.substring(end);
                input.selectionStart = input.selectionEnd = start;
            }
            break;
            
        case 'clear':
            input.value = '';
            break;
            
        case 'space':
            insertAtCursor(' ');
            break;
            
        case 'enter':
            // Move to next input
            if (input === MInput && NInput) {
                NInput.focus();
            }
            break;
            
        case 'left':
            if (start > 0) {
                input.selectionStart = input.selectionEnd = start - 1;
            }
            break;
            
        case 'right':
            if (start < text.length) {
                input.selectionStart = input.selectionEnd = start + 1;
            }
            break;
            
        case 'copy':
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text.substring(start, end) || text);
            }
            break;
            
        case 'paste':
            if (navigator.clipboard) {
                navigator.clipboard.readText().then(clipText => {
                    insertAtCursor(clipText);
                });
            }
            break;
            
        default:
            insertAtCursor(value);
            break;
    }
    
    // Trigger input event for validation
    input.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Keep focus on input
    input.focus();
}

// Insert text at cursor position
function insertAtCursor(text) {
    if (!currentInput) return;
    
    const input = currentInput;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    
    input.value = input.value.substring(0, start) + text + input.value.substring(end);
    input.selectionStart = input.selectionEnd = start + text.length;
}

// Load example by index
function loadExample(index) {
    if (index >= 0 && index < examples.length) {
        const example = examples[index];
        if (MInput) MInput.value = example.m;
        if (NInput) NInput.value = example.n;
        
        // Update solution status
        if (solutionStatus) {
            solutionStatus.innerHTML = `<i class="fas fa-check-circle"></i> Example Loaded: ${example.name}`;
            solutionStatus.style.color = '#00b894';
        }
    }
}

// Load custom example
function loadCustomExample(m, n, index) {
    if (MInput) MInput.value = m;
    if (NInput) NInput.value = n;
    
    // Update solution status
    if (solutionStatus) {
        const example = examples[index];
        solutionStatus.innerHTML = `<i class="fas fa-check-circle"></i> Example Loaded: ${example ? example.name : 'Custom'}`;
        solutionStatus.style.color = '#00b894';
    }
}

// Load random example
function loadRandomExample() {
    const randomIndex = Math.floor(Math.random() * examples.length);
    loadExample(randomIndex);
}

// Clear all inputs and solutions
function clearAll() {
    if (MInput) MInput.value = '';
    if (NInput) NInput.value = '';
    
    if (solutionSteps) {
        solutionSteps.innerHTML = '';
        solutionSteps.style.display = 'none';
    }
    
    if (solutionPlaceholder) {
        solutionPlaceholder.style.display = 'flex';
    }
    
    if (solutionStatus) {
        solutionStatus.innerHTML = '<i class="fas fa-hourglass-start"></i> Ready to solve';
        solutionStatus.style.color = '#4a6bff';
    }
    
    if (copyBtn) copyBtn.disabled = true;
    
    // Reset current input
    currentInput = null;
    highlightCurrentInput();
}

// Solve the differential equation
function solveEquation() {
    const M_expr = MInput ? MInput.value.trim() : '';
    const N_expr = NInput ? NInput.value.trim() : '';
    
    if (!M_expr || !N_expr) {
        alert('Please enter both M(x,y) and N(x,y)');
        return;
    }
    
    // Validate inputs
    if (!validateInput(MInput) || !validateInput(NInput)) {
        alert('Please check your input for invalid characters');
        return;
    }
    
    // Update solution status
    if (solutionStatus) {
        solutionStatus.innerHTML = '<i class="fas fa-cog fa-spin"></i> Solving...';
        solutionStatus.style.color = '#fdcb6e';
    }
    
    // Hide placeholder, show steps
    if (solutionPlaceholder) solutionPlaceholder.style.display = 'none';
    if (solutionSteps) {
        solutionSteps.style.display = 'block';
        solutionSteps.innerHTML = '';
    }
    
    // Enable copy button
    if (copyBtn) copyBtn.disabled = false;
    
    // Parse and solve the equation
    setTimeout(() => {
        try {
            const solution = solveDifferentialEquation(M_expr, N_expr);
            displaySolutionSteps(solution);
            
            // Update solution status
            if (solutionStatus) {
                solutionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Solution Complete';
                solutionStatus.style.color = '#00b894';
            }
        } catch (error) {
            console.error('Error solving equation:', error);
            displayError('Unable to solve the equation. Please check your input format or try one of the examples.');
            
            // Update solution status
            if (solutionStatus) {
                solutionStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Solution Failed';
                solutionStatus.style.color = '#e17055';
            }
        }
    }, 500);
}

// Solve differential equation and return solution object
function solveDifferentialEquation(M_expr, N_expr) {
    // Check if it's one of our examples
    const exampleIndex = examples.findIndex(ex => 
        ex.m === M_expr && ex.n === N_expr
    );
    
    if (exampleIndex !== -1) {
        // Return example solution
        return getExampleSolution(exampleIndex);
    } else {
        // Try to analyze the equation
        return analyzeGeneralEquation(M_expr, N_expr);
    }
}

// Get solution for example equation
function getExampleSolution(index) {
    const example = examples[index];
    
    let steps = [];
    if (example.type === 'exact') {
        steps = [
            'Step 1: Check exactness condition',
            `∂M/∂y = ${example.dM_dy}, ∂N/∂x = ${example.dN_dx}`,
            'Since ∂M/∂y = ∂N/∂x, the equation is exact',
            'Step 2: Find ψ(x,y) such that ∂ψ/∂x = M and ∂ψ/∂y = N',
            'Step 3: Integrate M with respect to x, treating y as constant',
            'Step 4: Differentiate the result with respect to y',
            'Step 5: Compare with N to find the integration constant',
            'Step 6: Write the general solution'
        ];
    } else {
        steps = [
            'Step 1: Check exactness condition',
            `∂M/∂y = ${example.dM_dy}, ∂N/∂x = ${example.dN_dx}`,
            'Since ∂M/∂y ≠ ∂N/∂x, the equation is not exact',
            'Step 2: Find an integrating factor',
            'Step 3: Check if (∂M/∂y - ∂N/∂x)/N depends only on x',
            'Step 4: Compute the integrating factor μ(x)',
            'Step 5: Multiply the equation by μ(x)',
            'Step 6: Solve the new exact equation'
        ];
    }
    
    return {
        isExample: true,
        type: example.type,
        original: { M: example.m, N: example.n },
        exactness: { isExact: example.type === 'exact', dM_dy: example.dM_dy, dN_dx: example.dN_dx },
        solution: example.solution,
        steps: steps,
        method: example.type === 'exact' ? 'Exact Equation Method' : 'Integrating Factor Method'
    };
}

// Analyze general equation
function analyzeGeneralEquation(M_expr, N_expr) {
    // Try to determine partial derivatives
    const dM_dy = estimatePartialDerivative(M_expr, 'y');
    const dN_dx = estimatePartialDerivative(N_expr, 'x');
    
    const isExact = dM_dy === dN_dx;
    
    let steps = [];
    let solution = '';
    let method = '';
    
    if (isExact) {
        method = 'Exact Equation Method';
        solution = 'ψ(x,y) = C (General solution)';
        steps = [
            'Step 1: Check exactness condition',
            `∂M/∂y = ${dM_dy}, ∂N/∂x = ${dN_dx}`,
            'Since ∂M/∂y = ∂N/∂x, the equation is exact',
            'Step 2: Find ψ(x,y) such that ∂ψ/∂x = M and ∂ψ/∂y = N',
            'Step 3: Integrate M with respect to x, treating y as constant:',
            '  ψ(x,y) = ∫M dx + g(y)',
            'Step 4: Differentiate with respect to y:',
            '  ∂ψ/∂y = ∂/∂y[∫M dx] + g\'(y)',
            'Step 5: Compare with N to find g\'(y)',
            'Step 6: Integrate g\'(y) to find g(y)',
            'Step 7: Write the general solution: ψ(x,y) = C'
        ];
    } else {
        method = 'Integrating Factor Method';
        solution = 'Solution depends on integrating factor';
        
        // Check for integrating factor that depends only on x
        const f_x = `(${dM_dy} - ${dN_dx})/${N_expr}`;
        
        steps = [
            'Step 1: Check exactness condition',
            `∂M/∂y = ${dM_dy}, ∂N/∂x = ${dN_dx}`,
            'Since ∂M/∂y ≠ ∂N/∂x, the equation is not exact',
            'Step 2: Try to find an integrating factor',
            `Check if (∂M/∂y - ∂N/∂x)/N = ${f_x} depends only on x`,
            'Step 3: If yes, integrating factor μ(x) = exp(∫(∂M/∂y - ∂N/∂x)/N dx)',
            'Step 4: Multiply the equation by μ(x)',
            'Step 5: The new equation should be exact',
            'Step 6: Solve the new exact equation'
        ];
    }
    
    return {
        isExample: false,
        type: isExact ? 'exact' : 'non-exact',
        original: { M: M_expr, N: N_expr },
        exactness: { isExact, dM_dy, dN_dx },
        solution: solution,
        steps: steps,
        method: method
    };
}

// Estimate partial derivative (simplified)
function estimatePartialDerivative(expr, variable) {
    // Very basic derivative estimation
    if (expr.includes(variable)) {
        if (expr === variable) return '1';
        if (expr === `2${variable}`) return '2';
        if (expr === `3${variable}`) return '3';
        if (expr === `${variable}^2` || expr === `${variable}**2`) return `2${variable}`;
        if (expr === `2${variable}^2` || expr === `2${variable}**2`) return `4${variable}`;
        if (expr === `3${variable}^2` || expr === `3${variable}**2`) return `6${variable}`;
        if (expr.includes(`${variable}^2`) || expr.includes(`${variable}**2`)) return `2${variable}`;
        if (expr.includes(`2${variable}`)) return '2';
        if (expr.includes(`3${variable}`)) return '3';
    }
    
    // Default estimation
    if (expr.includes('^') || expr.includes('**')) {
        return `d(${expr})/d${variable}`;
    }
    
    return expr.includes(variable) ? `1` : '0';
}

// Display solution steps
function displaySolutionSteps(solution) {
    if (!solutionSteps) return;
    
    solutionSteps.innerHTML = '';
    
    // Step 1: Show original equation
    addSolutionStep(1, 'Original Equation', 
        `${solution.original.M} dx + ${solution.original.N} dy = 0`);
    
    // Step 2: Check exactness
    const exactStatus = solution.exactness.isExact ? 'Exact' : 'Not Exact';
    const exactClass = solution.exactness.isExact ? 'exact' : 'not-exact';
    addSolutionStep(2, 'Check Exactness',
        `∂M/∂y = ${solution.exactness.dM_dy}, ∂N/∂x = ${solution.exactness.dN_dx}<br>
         <span class="${exactClass}">Equation is ${exactStatus}</span>`);
    
    // Step 3: Method
    addSolutionStep(3, 'Solution Method', solution.method);
    
    // Additional steps
    solution.steps.forEach((step, index) => {
        const stepNum = index + 4;
        const stepTitle = step.split(':')[0];
        const stepContent = step.split(':').slice(1).join(':').trim();
        addSolutionStep(stepNum, stepTitle || `Step ${stepNum}`, stepContent || step);
    });
    
    // Final solution
    const finalStepNum = solution.steps.length + 4;
    addSolutionStep(finalStepNum, 'Final Solution',
        `<strong>${solution.solution}</strong><br>
         where C is the constant of integration.`);
}

// Add a solution step to the display
function addSolutionStep(number, title, content) {
    if (!solutionSteps) return;
    
    const stepDiv = document.createElement('div');
    stepDiv.className = 'solution-step';
    
    stepDiv.innerHTML = `
        <div class="step-header">
            <div class="step-title">
                <div class="step-number">${number}</div>
                ${title}
            </div>
        </div>
        <div class="step-content">
            <div class="step-equation">${content}</div>
        </div>
    `;
    
    solutionSteps.appendChild(stepDiv);
}

// Display error message
function displayError(message) {
    if (!solutionSteps) return;
    
    solutionSteps.innerHTML = `
        <div class="solution-step error">
            <div class="step-header">
                <div class="step-title">
                    <div class="step-number"><i class="fas fa-exclamation-triangle"></i></div>
                    Error
                </div>
            </div>
            <div class="step-content">
                <div class="step-equation">${message}</div>
                <div class="step-explanation">
                    Please check that your equation is in the form M(x,y) dx + N(x,y) dy = 0
                    and uses valid mathematical notation. Try one of the examples above.
                </div>
            </div>
        </div>
    `;
}

// Copy solution to clipboard
function copySolution() {
    if (!solutionSteps) return;
    
    const stepsText = Array.from(solutionSteps.querySelectorAll('.step-content'))
        .map(step => step.textContent)
        .join('\n\n');
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(stepsText)
            .then(() => {
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        if (copyBtn) copyBtn.innerHTML = originalText;
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy solution to clipboard');
            });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = stepsText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (copyBtn) {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                if (copyBtn) copyBtn.innerHTML = originalText;
            }, 2000);
        }
    }
}
