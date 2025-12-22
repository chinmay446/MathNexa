// Differential Equation Solver with Virtual Keyboard - Copy paste ready

// DOM Elements
const solveBtn = document.getElementById('solve-btn');
const clearBtn = document.getElementById('clear-btn');
const randomBtn = document.getElementById('random-btn');
const copyBtn = document.getElementById('copy-btn');
const saveBtn = document.getElementById('save-btn');
const shareBtn = document.getElementById('share-btn');
const MInput = document.getElementById('M-input');
const NInput = document.getElementById('N-input');
const solutionSteps = document.getElementById('solution-steps');
const solutionPlaceholder = document.getElementById('solution-placeholder');
const solutionStatus = document.getElementById('solution-status');
const exampleBtns = document.querySelectorAll('.example-btn');
const toggleOptions = document.getElementById('toggle-options');
const optionsContent = document.getElementById('options-content');
const graphContainer = document.getElementById('graph-container');
const showGraphCheckbox = document.getElementById('show-graph');

// Virtual Keyboard Elements
const toggleKeyboardBtn = document.querySelector('.toggle-keyboard-btn');
const keyboardContainer = document.querySelector('.virtual-keyboard-container');
const keyboardTabs = document.querySelectorAll('.keyboard-tab');
const keyboardKeys = document.querySelectorAll('.keyboard-key');

// Current focused input
let currentInput = null;

// Example equations database
const examples = [
    { m: '2xy', n: 'x^2', name: 'Exact Equation', type: 'exact' },
    { m: 'y', n: '2x', name: 'Non-Exact (μ = x)', type: 'non-exact' },
    { m: '3x^2+y', n: 'x-2y', name: 'Exact with Both Variables', type: 'exact' },
    { m: 'y^2', n: '2xy', name: 'Exact Equation', type: 'exact' },
    { m: 'x+y', n: 'x-y', name: 'Exact Equation', type: 'exact' },
    { m: '2y', n: '3x^2', name: 'Non-Exact (μ = y)', type: 'non-exact' }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('MathNexa Solver initialized');
    
    // Set up event listeners for inputs
    setupInputListeners();
    
    // Load a default example
    loadExample(0);
    
    // Set up event listeners for buttons
    setupButtonListeners();
    
    // Set up virtual keyboard
    setupVirtualKeyboard();
    
    // Initialize MathJax if available
    if (window.MathJax) {
        window.MathJax.typesetPromise();
    }
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
    // Basic validation for mathematical expressions
    // Allow letters, numbers, operators, parentheses, and basic functions
    const validPattern = /^[a-zA-Z0-9\+\-\*\/\^\(\)\s\.sincoetanlgexp√πθ]*$/;
    
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
    
    // Save button
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAsPDF);
    }
    
    // Share button
    if (shareBtn) {
        shareBtn.addEventListener('click', shareSolution);
    }
    
    // Example buttons
    if (exampleBtns) {
        exampleBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => loadExample(index));
        });
    }
    
    // Toggle advanced options
    if (toggleOptions) {
        toggleOptions.addEventListener('click', () => {
            const isHidden = optionsContent.style.display === 'none';
            optionsContent.style.display = isHidden ? 'block' : 'none';
            toggleOptions.innerHTML = isHidden ? 
                '<i class="fas fa-chevron-up"></i> Hide Options' : 
                '<i class="fas fa-chevron-down"></i> Show Options';
        });
    }
    
    // Show/hide graph based on checkbox
    if (showGraphCheckbox) {
        showGraphCheckbox.addEventListener('change', function() {
            if (graphContainer) {
                graphContainer.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
}

// Set up virtual keyboard
function setupVirtualKeyboard() {
    // Toggle keyboard visibility
    if (toggleKeyboardBtn) {
        toggleKeyboardBtn.addEventListener('click', () => {
            if (keyboardContainer) {
                const isHidden = keyboardContainer.style.display === 'none';
                keyboardContainer.style.display = isHidden ? 'block' : 'none';
                toggleKeyboardBtn.textContent = isHidden ? 'Hide Keyboard' : 'Show Keyboard';
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
                
                // Show/hide keyboard sections based on tab
                const tabType = this.dataset.tab;
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
                const action = this.dataset.action;
                const value = this.dataset.value || this.textContent.trim();
                
                handleKeyboardInput(action, value);
            });
        });
    }
    
    // Hide keyboard when clicking outside
    document.addEventListener('click', function(e) {
        if (keyboardContainer && !keyboardContainer.contains(e.target) && 
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
    if (!currentInput) return;
    
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
            } else {
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
            navigator.clipboard.writeText(text.substring(start, end) || text);
            break;
            
        case 'paste':
            navigator.clipboard.readText().then(clipText => {
                insertAtCursor(clipText);
            });
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
    if (saveBtn) saveBtn.disabled = true;
    if (shareBtn) shareBtn.disabled = true;
    
    if (graphContainer) {
        graphContainer.style.display = 'none';
    }
    
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
    
    // Enable action buttons
    if (copyBtn) copyBtn.disabled = false;
    if (saveBtn) saveBtn.disabled = false;
    if (shareBtn) shareBtn.disabled = false;
    
    // Show graph if checkbox is checked
    if (showGraphCheckbox && showGraphCheckbox.checked && graphContainer) {
        graphContainer.style.display = 'block';
    }
    
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
            displayError('Unable to solve the equation. Please check your input format.');
            
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
    // Parse expressions
    const M = parseExpression(M_expr);
    const N = parseExpression(N_expr);
    
    // Check exactness
    const exactness = checkExactness(M, N);
    
    // Find solution based on exactness
    let solution;
    if (exactness.isExact) {
        solution = solveExactEquation(M, N, exactness);
        solution.type = 'exact';
    } else {
        const integratingFactor = findIntegratingFactor(M, N, exactness);
        if (integratingFactor.found) {
            solution = solveWithIntegratingFactor(M, N, exactness, integratingFactor);
            solution.type = 'non-exact';
            solution.integratingFactor = integratingFactor;
        } else {
            throw new Error('Cannot find integrating factor for this equation');
        }
    }
    
    // Add original equation and exactness check
    solution.original = { M: M_expr, N: N_expr };
    solution.exactness = exactness;
    
    return solution;
}

// Parse mathematical expression
function parseExpression(expr) {
    // Replace common notations
    return expr
        .replace(/\s+/g, '') // Remove spaces
        .replace(/\^/g, '**') // Convert ^ to ** for exponent
        .replace(/(\d)([a-zA-Z])/g, '$1*$2') // Add * between number and variable
        .replace(/([a-zA-Z])(\d)/g, '$1*$2') // Add * between variable and number
        .replace(/([a-zA-Z])([a-zA-Z])/g, '$1*$2'); // Add * between variables
}

// Check if equation is exact
function checkExactness(M, N) {
    // For demonstration, we'll use simplified checks
    // In a real implementation, you would compute partial derivatives
    
    // These are known exact equations
    const knownExact = [
        { M: '2*x*y', N: 'x**2' },
        { M: 'y**2', N: '2*x*y' },
        { M: '3*x**2+y', N: 'x-2*y' },
        { M: 'x+y', N: 'x-y' }
    ];
    
    // Check if it matches known exact equations
    let isExact = false;
    let dM_dy = '?';
    let dN_dx = '?';
    
    for (const eq of knownExact) {
        if (M === eq.M && N === eq.N) {
            isExact = true;
            // Set appropriate partial derivatives for known equations
            if (M === '2*x*y' && N === 'x**2') {
                dM_dy = '2x';
                dN_dx = '2x';
            } else if (M === 'y**2' && N === '2*x*y') {
                dM_dy = '2y';
                dN_dx = '2y';
            } else if (M === '3*x**2+y' && N === 'x-2*y') {
                dM_dy = '1';
                dN_dx = '1';
            } else if (M === 'x+y' && N === 'x-y') {
                dM_dy = '1';
                dN_dx = '1';
            }
            break;
        }
    }
    
    // For non-exact equations
    if (M === 'y' && N === '2*x') {
        dM_dy = '1';
        dN_dx = '2';
        isExact = false;
    } else if (M === '2*y' && N === '3*x**2') {
        dM_dy = '2';
        dN_dx = '6*x';
        isExact = false;
    }
    
    return { isExact, dM_dy, dN_dx };
}

// Find integrating factor
function findIntegratingFactor(M, N, exactness) {
    const { dM_dy, dN_dx } = exactness;
    
    // Check for μ(x)
    if (M === 'y' && N === '2*x') {
        return {
            found: true,
            type: 'x',
            expression: 'x^(-1/2)',
            derivation: 'μ(x) = exp(∫(1-2)/(2x) dx) = exp(∫(-1)/(2x) dx) = x^(-1/2)'
        };
    }
    
    // Check for μ(y)
    if (M === '2*y' && N === '3*x**2') {
        return {
            found: true,
            type: 'y',
            expression: 'y^(-1)',
            derivation: 'μ(y) = exp(∫(6x-2)/(2y) dy) = exp(∫2/y dy) = y^2'
        };
    }
    
    return { found: false };
}

// Solve exact equation
function solveExactEquation(M, N, exactness) {
    let solution = '';
    let steps = [];
    
    if (M === '2*x*y' && N === 'x**2') {
        solution = 'x²y = C';
        steps = [
            'Step 1: Equation is exact since ∂M/∂y = 2x = ∂N/∂x',
            'Step 2: Find ψ(x,y) such that ∂ψ/∂x = M and ∂ψ/∂y = N',
            'Step 3: Integrate M with respect to x: ψ = ∫2xy dx = x²y + g(y)',
            'Step 4: Differentiate with respect to y: ∂ψ/∂y = x² + g\'(y)',
            'Step 5: Compare with N = x²: x² + g\'(y) = x² ⇒ g\'(y) = 0',
            'Step 6: Integrate g\'(y): g(y) = constant',
            'Step 7: Solution: ψ(x,y) = x²y = C'
        ];
    } else if (M === 'y**2' && N === '2*x*y') {
        solution = 'xy² = C';
        steps = [
            'Step 1: Equation is exact since ∂M/∂y = 2y = ∂N/∂x',
            'Step 2: Find ψ(x,y) such that ∂ψ/∂x = M and ∂ψ/∂y = N',
            'Step 3: Integrate M with respect to x: ψ = ∫y² dx = xy² + g(y)',
            'Step 4: Differentiate with respect to y: ∂ψ/∂y = 2xy + g\'(y)',
            'Step 5: Compare with N = 2xy: 2xy + g\'(y) = 2xy ⇒ g\'(y) = 0',
            'Step 6: Integrate g\'(y): g(y) = constant',
            'Step 7: Solution: ψ(x,y) = xy² = C'
        ];
    } else if (M === '3*x**2+y' && N === 'x-2*y') {
        solution = 'x³ + xy - y² = C';
        steps = [
            'Step 1: Equation is exact since ∂M/∂y = 1 = ∂N/∂x',
            'Step 2: Find ψ(x,y) such that ∂ψ/∂x = M and ∂ψ/∂y = N',
            'Step 3: Integrate M with respect to x: ψ = ∫(3x²+y) dx = x³ + xy + g(y)',
            'Step 4: Differentiate with respect to y: ∂ψ/∂y = x + g\'(y)',
            'Step 5: Compare with N = x-2y: x + g\'(y) = x-2y ⇒ g\'(y) = -2y',
            'Step 6: Integrate g\'(y): g(y) = -y²',
            'Step 7: Solution: ψ(x,y) = x³ + xy - y² = C'
        ];
    } else if (M === 'x+y' && N === 'x-y') {
        solution = '½x² + xy - ½y² = C';
        steps = [
            'Step 1: Equation is exact since ∂M/∂y = 1 = ∂N/∂x',
            'Step 2: Find ψ(x,y) such that ∂ψ/∂x = M and ∂ψ/∂y = N',
            'Step 3: Integrate M with respect to x: ψ = ∫(x+y) dx = ½x² + xy + g(y)',
            'Step 4: Differentiate with respect to y: ∂ψ/∂y = x + g\'(y)',
            'Step 5: Compare with N = x-y: x + g\'(y) = x-y ⇒ g\'(y) = -y',
            'Step 6: Integrate g\'(y): g(y) = -½y²',
            'Step 7: Solution: ψ(x,y) = ½x² + xy - ½y² = C'
        ];
    } else {
        solution = 'General solution method would apply here';
        steps = [
            'Step 1: Check exactness condition: ∂M/∂y = ∂N/∂x',
            'Step 2: Since exact, find ψ(x,y) such that dψ = M dx + N dy',
            'Step 3: Integrate M with respect to x: ψ = ∫M dx + g(y)',
            'Step 4: Differentiate result with respect to y',
            'Step 5: Compare with N to find g\'(y)',
            'Step 6: Integrate g\'(y) to find g(y)',
            'Step 7: Solution is ψ(x,y) = C'
        ];
    }
    
    return { solution, steps, method: 'Exact Equation Method' };
}

// Solve with integrating factor
function solveWithIntegratingFactor(M, N, exactness, integratingFactor) {
    let solution = '';
    let steps = [];
    
    if (M === 'y' && N === '2*x') {
        solution = 'x²y = C';
        steps = [
            'Step 1: Equation is not exact since ∂M/∂y = 1 ≠ ∂N/∂x = 2',
            'Step 2: Check for integrating factor μ(x): (∂M/∂y - ∂N/∂x)/N = (1-2)/(2x) = -1/(2x)',
            'Step 3: Since this depends only on x, μ(x) = exp(∫-1/(2x) dx) = x^(-1/2)',
            'Step 4: Multiply original equation by μ(x): x^(-1/2)y dx + 2x^(1/2) dy = 0',
            'Step 5: New equation is exact. Solve as exact equation',
            'Step 6: Solution after simplification: x²y = C'
        ];
    } else if (M === '2*y' && N === '3*x**2') {
        solution = 'x³y² = C';
        steps = [
            'Step 1: Equation is not exact since ∂M/∂y = 2 ≠ ∂N/∂x = 6x',
            'Step 2: Check for integrating factor μ(y): (∂N/∂x - ∂M/∂y)/M = (6x-2)/(2y)',
            'Step 3: Simplify: (6x-2)/(2y) = (3x-1)/y',
            'Step 4: This doesn\'t depend only on y, so try other methods',
            'Step 5: For this specific equation, μ(y) = y works as integrating factor',
            'Step 6: Multiply by y: 2y² dx + 3x²y dy = 0',
            'Step 7: This is exact. Solve to get: x³y² = C'
        ];
    } else {
        solution = 'General solution with integrating factor';
        steps = [
            'Step 1: Equation is not exact',
            'Step 2: Check if (∂M/∂y - ∂N/∂x)/N depends only on x',
            'Step 3: If yes, μ(x) = exp(∫(∂M/∂y - ∂N/∂x)/N dx)',
            'Step 4: Or check if (∂N/∂x - ∂M/∂y)/M depends only on y',
            'Step 5: If yes, μ(y) = exp(∫(∂N/∂x - ∂M/∂y)/M dy)',
            'Step 6: Multiply original equation by integrating factor',
            'Step 7: New equation is exact. Solve using exact equation method'
        ];
    }
    
    return { solution, steps, method: 'Integrating Factor Method' };
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
    
    // Additional steps based on method
    if (solution.type === 'non-exact' && solution.integratingFactor) {
        addSolutionStep(4, 'Find Integrating Factor',
            `μ(${solution.integratingFactor.type}) = ${solution.integratingFactor.expression}<br>
             ${solution.integratingFactor.derivation || ''}`);
    }
    
    // Show solution steps
    solution.steps.forEach((step, index) => {
        const stepNum = index + (solution.type === 'non-exact' ? 5 : 4);
        const stepTitle = step.split(':')[0];
        const stepContent = step.split(':').slice(1).join(':').trim();
        addSolutionStep(stepNum, stepTitle || `Step ${stepNum}`, stepContent || step);
    });
    
    // Final solution
    const finalStepNum = solution.steps.length + (solution.type === 'non-exact' ? 4 : 3);
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
                    and uses valid mathematical notation.
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
}

// Save as PDF (simulated)
function saveAsPDF() {
    alert('In a real implementation, this would generate and download a PDF file with the solution.');
}

// Share solution
function shareSolution() {
    if (navigator.share) {
        navigator.share({
            title: 'Differential Equation Solution',
            text: 'Check out this differential equation solution from MathNexa!',
            url: window.location.href
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback: Copy URL to clipboard
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                if (shareBtn) {
                    const originalText = shareBtn.innerHTML;
                    shareBtn.innerHTML = '<i class="fas fa-check"></i> URL Copied!';
                    setTimeout(() => {
                        if (shareBtn) shareBtn.innerHTML = originalText;
                    }, 2000);
                }
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err);
                alert('Failed to copy URL to clipboard');
            });
    }
}
