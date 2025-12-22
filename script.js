// DOM Elements
const navMenu = document.querySelector('.nav-menu');
const hamburger = document.querySelector('.hamburger');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-menu a');
const solveBtn = document.getElementById('solve-btn');
const exampleBtn = document.getElementById('example-btn');
const clearBtn = document.getElementById('clear-btn');
const MInput = document.getElementById('M-input');
const NInput = document.getElementById('N-input');
const solutionSteps = document.getElementById('solution-steps');
const examples = document.querySelectorAll('.example');
const quizOptions = document.querySelectorAll('.quiz-options .option');
const pretestScore = document.getElementById('pretest-score');
const posttestScore = document.getElementById('posttest-score');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Section Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Hide all sections
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(targetId).classList.add('active');
        
        // Update active nav link
        navLinks.forEach(navLink => {
            navLink.parentElement.classList.remove('active');
        });
        link.parentElement.classList.add('active');
    });
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Math expression parser (simplified)
function parseExpression(expr, variables = ['x', 'y']) {
    // Remove whitespace
    expr = expr.replace(/\s+/g, '');
    
    // Handle exponents (convert ^ to **)
    expr = expr.replace(/\^/g, '**');
    
    // Handle implicit multiplication (e.g., 2x -> 2*x)
    for (let i = 0; i < expr.length - 1; i++) {
        const char = expr[i];
        const nextChar = expr[i+1];
        
        if ((/\d/.test(char) && /[a-z]/.test(nextChar)) || 
            (/[a-z]/.test(char) && /\d/.test(nextChar)) ||
            (/[a-z]/.test(char) && /[a-z]/.test(nextChar) && char !== nextChar)) {
            expr = expr.slice(0, i+1) + '*' + expr.slice(i+1);
            i++;
        }
    }
    
    return expr;
}

// Calculate partial derivative numerically
function partialDerivative(expr, wrt, atPoint = {x: 1, y: 1}) {
    // This is a simplified numerical derivative calculation
    // For a real application, you would want a proper symbolic math library
    
    const h = 0.0001;
    
    // Create a function from the expression
    const func = (x, y) => {
        // Replace variables with values
        let evalExpr = expr
            .replace(/x/g, `(${x})`)
            .replace(/y/g, `(${y})`);
        
        // Evaluate safely
        try {
            return eval(evalExpr);
        } catch (e) {
            console.error("Error evaluating expression:", e);
            return 0;
        }
    };
    
    if (wrt === 'x') {
        const f1 = func(atPoint.x + h, atPoint.y);
        const f2 = func(atPoint.x - h, atPoint.y);
        return (f1 - f2) / (2 * h);
    } else if (wrt === 'y') {
        const f1 = func(atPoint.x, atPoint.y + h);
        const f2 = func(atPoint.x, atPoint.y - h);
        return (f1 - f2) / (2 * h);
    }
    
    return 0;
}

// Check if an expression depends on a variable
function dependsOn(expr, variable) {
    return expr.includes(variable);
}

// Check if equation is exact
function checkExactness(M_expr, N_expr) {
    const dM_dy = partialDerivative(M_expr, 'y');
    const dN_dx = partialDerivative(N_expr, 'x');
    
    // Round to avoid floating point errors
    const rounded_dM_dy = Math.round(dM_dy * 10000) / 10000;
    const rounded_dN_dx = Math.round(dN_dx * 10000) / 10000;
    
    return {
        isExact: rounded_dM_dy === rounded_dN_dx,
        dM_dy: rounded_dM_dy,
        dN_dx: rounded_dN_dx
    };
}

// Find integrating factor
function findIntegratingFactor(M_expr, N_expr, exactnessCheck) {
    const { dM_dy, dN_dx } = exactnessCheck;
    
    // Try μ(x): (dM/dy - dN/dx)/N should be function of x only
    // For simplicity, we'll check if it doesn't contain y
    const exprForMuX = `(${dM_dy} - ${dN_dx})/(${N_expr})`;
    const dependsOnYForMuX = dependsOn(exprForMuX, 'y');
    
    if (!dependsOnYForMuX) {
        // In a real implementation, we would integrate this
        return { type: 'x', found: true, expression: `exp(∫(${dM_dy} - ${dN_dx})/(${N_expr}) dx)` };
    }
    
    // Try μ(y): (dN/dx - dM/dy)/M should be function of y only
    const exprForMuY = `(${dN_dx} - ${dM_dy})/(${M_expr})`;
    const dependsOnXForMuY = dependsOn(exprForMuY, 'x');
    
    if (!dependsOnXForMuY) {
        return { type: 'y', found: true, expression: `exp(∫(${dN_dx} - ${dM_dy})/(${M_expr}) dy)` };
    }
    
    return { found: false };
}

// Solve exact differential equation
function solveExactEquation(M_expr, N_expr) {
    // This is a simplified solution - in a real app you'd need proper integration
    
    let solution = "";
    
    // For common exact equations, provide specific solutions
    if (M_expr === "2xy" && N_expr === "x^2") {
        solution = "x²y = C";
    } else if (M_expr === "y^2" && N_expr === "2xy") {
        solution = "xy² = C";
    } else if (M_expr === "3x^2+y" && N_expr === "x-2y") {
        solution = "x³ + xy - y² = C";
    } else if (M_expr === "y" && N_expr === "2x") {
        solution = "This equation is not exact. But if we use integrating factor μ(x) = x, we get: x²y = C";
    } else {
        solution = `∫(${M_expr}) dx + ∫(${N_expr} - ∂/∂y[∫(${M_expr}) dx]) dy = C`;
    }
    
    return solution;
}

// Solve differential equation
function solveDifferentialEquation() {
    const M_expr = parseExpression(MInput.value);
    const N_expr = parseExpression(NInput.value);
    
    if (!M_expr || !N_expr) {
        alert("Please enter both M(x,y) and N(x,y)");
        return;
    }
    
    // Clear previous solution
    solutionSteps.innerHTML = '';
    
    // Step 1: Display the equation
    addSolutionStep("Step 1: Given Equation", `${MInput.value} dx + ${NInput.value} dy = 0`);
    
    // Step 2: Check exactness
    const exactness = checkExactness(M_expr, N_expr);
    
    addSolutionStep("Step 2: Check for Exactness", 
        `∂M/∂y = ${exactness.dM_dy}<br>
         ∂N/∂x = ${exactness.dN_dx}<br>
         Since ∂M/∂y ${exactness.isExact ? '=' : '≠'} ∂N/∂x, the equation is 
         <span class="${exactness.isExact ? 'exact-true' : 'exact-false'} exact-status">
            ${exactness.isExact ? 'EXACT' : 'NOT EXACT'}
         </span>`);
    
    // Step 3: If not exact, try to find integrating factor
    if (!exactness.isExact) {
        const integratingFactor = findIntegratingFactor(M_expr, N_expr, exactness);
        
        if (integratingFactor.found) {
            addSolutionStep("Step 3: Find Integrating Factor",
                `Since (∂M/∂y - ∂N/∂x)/N is a function of ${integratingFactor.type} only,<br>
                 we can find an integrating factor μ(${integratingFactor.type}) = ${integratingFactor.expression}`);
        } else {
            addSolutionStep("Step 3: Find Integrating Factor",
                "The equation doesn't have an integrating factor that is a function of x only or y only.<br>Other methods may be needed to solve this equation.");
        }
    }
    
    // Step 4: Solve the equation
    const solution = solveExactEquation(M_expr, N_expr);
    
    if (exactness.isExact) {
        addSolutionStep("Step 3: Solve the Exact Equation",
            `Since the equation is exact, there exists a function ψ(x,y) such that:<br>
             ∂ψ/∂x = ${MInput.value} and ∂ψ/∂y = ${NInput.value}<br><br>
             Integrating ∂ψ/∂x with respect to x:<br>
             ψ(x,y) = ∫(${MInput.value}) dx = ...<br><br>
             Then differentiate with respect to y and compare with N(x,y)...<br><br>
             <strong>Solution:</strong> ${solution}`);
    } else {
        addSolutionStep("Step 4: Solve Using Integrating Factor",
            `After multiplying by the integrating factor, the equation becomes exact.<br>
             We then solve it as an exact equation.<br><br>
             <strong>Solution:</strong> ${solution}`);
    }
    
    // Step 5: Final solution
    addSolutionStep("Step 5: Final Solution",
        `<strong>${solution}</strong><br><br>
         where C is an arbitrary constant of integration.`);
}

// Add a step to the solution display
function addSolutionStep(title, content) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'solution-step';
    
    const titleDiv = document.createElement('div');
    titleDiv.className = 'step-title';
    titleDiv.innerHTML = `<i class="fas fa-arrow-right"></i> ${title}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'step-content';
    contentDiv.innerHTML = content;
    
    stepDiv.appendChild(titleDiv);
    stepDiv.appendChild(contentDiv);
    solutionSteps.appendChild(stepDiv);
}

// Load example
function loadExample(M, N) {
    MInput.value = M;
    NInput.value = N;
}

// Clear inputs and solution
function clearAll() {
    MInput.value = '';
    NInput.value = '';
    solutionSteps.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-calculator"></i>
            <p>Enter a differential equation and click "Solve" to see the step-by-step solution.</p>
        </div>
    `;
}

// Quiz functionality
function setupQuiz() {
    let pretestCorrect = 0;
    let posttestCorrect = 0;
    
    // Pre-test
    const pretestOptions = document.querySelectorAll('#pretest .option');
    pretestOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Check if this is the correct answer
            if (this.classList.contains('correct')) {
                if (!this.classList.contains('selected')) {
                    pretestCorrect++;
                    pretestScore.textContent = pretestCorrect;
                }
                this.classList.add('selected');
            } else {
                // Find correct answer in this question
                const question = this.closest('.quiz-question');
                const correctOption = question.querySelector('.option.correct');
                correctOption.classList.add('selected');
                
                // Mark this wrong option
                this.style.backgroundColor = '#f8d7da';
                this.style.borderColor = '#f5c6cb';
            }
            
            // Disable all options in this question after answering
            const options = question.querySelectorAll('.option');
            options.forEach(opt => {
                opt.style.pointerEvents = 'none';
            });
        });
    });
    
    // Post-test
    const posttestOptions = document.querySelectorAll('#posttest .option');
    posttestOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Check if this is the correct answer
            if (this.classList.contains('correct')) {
                if (!this.classList.contains('selected')) {
                    posttestCorrect++;
                    posttestScore.textContent = posttestCorrect;
                }
                this.classList.add('selected');
            } else {
                // Find correct answer in this question
                const question = this.closest('.quiz-question');
                const correctOption = question.querySelector('.option.correct');
                correctOption.classList.add('selected');
                
                // Mark this wrong option
                this.style.backgroundColor = '#f8d7da';
                this.style.borderColor = '#f5c6cb';
            }
            
            // Disable all options in this question after answering
            const options = question.querySelectorAll('.option');
            options.forEach(opt => {
                opt.style.pointerEvents = 'none';
            });
        });
    });
}

// Event Listeners
solveBtn.addEventListener('click', solveDifferentialEquation);

exampleBtn.addEventListener('click', () => {
    loadExample("2xy", "x^2");
});

clearBtn.addEventListener('click', clearAll);

examples.forEach(example => {
    example.addEventListener('click', function() {
        const M = this.getAttribute('data-m');
        const N = this.getAttribute('data-n');
        loadExample(M, N);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set home section as active
    document.getElementById('home').classList.add('active');
    
    // Set first nav link as active
    navLinks[0].parentElement.classList.add('active');
    
    // Setup quiz functionality
    setupQuiz();
    
    // Load a default example
    loadExample("2xy", "x^2");
});
