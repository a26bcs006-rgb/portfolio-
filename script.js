
/* ==========================================
   1. GET HTML ELEMENTS
========================================== */

const promptInput = document.getElementById("promptInput");

const checkBtn = document.getElementById("checkBtn");
const sampleBtn = document.getElementById("sampleBtn");
const clearBtn = document.getElementById("clearBtn");

const scoreValue = document.getElementById("scoreValue");
const scoreCircle = document.getElementById("scoreCircle");

const ratingText = document.getElementById("ratingText");
const ratingDescription = document.getElementById("ratingDescription");

const progressBar = document.getElementById("progressBar");

const detectedCount = document.getElementById("detectedCount");

const suggestions = document.getElementById("suggestions");

const errorMessage = document.getElementById("errorMessage");

const charCount = document.getElementById("charCount");


/* ==========================================
   2. KEYWORD DEFINITIONS
========================================== */

// Each component has keywords or phrases.
// Detection is case-insensitive.

const keywords = {

    role: [
        "act as",
        "you are",
        "assume the role",
        "role:",
        "role of",
        "as an expert",
        "as a professional",
        "as a teacher",
        "as a coach",
        "as a developer",
        "as a tutor"
    ],

    task: [
        "explain",
        "describe",
        "create",
        "write",
        "generate",
        "summarize",
        "analyze",
        "compare",
        "evaluate",
        "design",
        "develop",
        "translate",
        "identify",
        "classify",
        "calculate",
        "solve",
        "task:"
    ],

    context: [
        "context:",
        "i am",
        "i'm",
        "my background",
        "for college students",
        "for students",
        "for beginners",
        "beginner",
        "college student",
        "university student",
        "my project",
        "background:",
        "audience:",
        "target audience",
        "i want to",
        "the purpose"
    ],

    constraints: [
        "constraint",
        "constraints",
        "limit",
        "word limit",
        "within",
        "maximum",
        "minimum",
        "must",
        "should",
        "do not",
        "don't",
        "avoid",
        "only",
        "exactly",
        "no more than",
        "at least",
        "requirements:",
        "rules:"
    ],

    format: [
        "output format",
        "format:",
        "in bullet points",
        "bullet points",
        "numbered list",
        "table",
        "json",
        "paragraph",
        "step by step",
        "step-by-step",
        "headings",
        "as a list",
        "in a list",
        "markdown",
        "code block",
        "report format"
    ]

};


/* ==========================================
   3. IMPROVEMENT SUGGESTIONS
========================================== */

const improvementTips = {

    role:
        "Add a clear role. Example: Act as an expert teacher, professional developer or experienced cricket coach.",

    task:
        "Clearly describe what the AI should do. Example: Explain, create, summarize, analyze or compare a topic.",

    context:
        "Provide background information. Explain who the answer is for, your experience level or the purpose of the task.",

    constraints:
        "Add specific rules. Example: Use simple English, limit the answer to 100 words or provide exactly five points.",

    format:
        "Specify the expected output format. Example: Present the answer as bullet points, a table, a numbered list or JSON."

};


/* ==========================================
   4. SAMPLE PROMPTS
========================================== */

// Sample 1: Only Role = 20 marks.

const sample20 = `Act as an expert teacher.`;


// Sample 2: Role + Task + Context = 60 marks.

const sample60 = `Act as an expert teacher.

Explain artificial intelligence to college students.
I am a beginner and want to understand the basic concepts.`;


// Sample 3: All Five Components = 100 marks.

const sample100 = `Act as an expert teacher.

Task: Explain artificial intelligence and its applications.

Context: I am a college student and a beginner
who wants to learn about artificial intelligence.

Constraints:
Use simple English.
Limit the answer to 100 words.
Include exactly five important points.

Output Format:
Present the answer as a numbered list.`;


/* ==========================================
   5. CHECK KEYWORDS
========================================== */

function containsKeyword(text, keywordList) {

    return keywordList.some(keyword => {

        const escapedKeyword = keyword.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );

        // Case-insensitive whole phrase matching.
        // Avoid matching words inside unrelated words.
        const regex = new RegExp(
            `(^|[^a-z0-9])${escapedKeyword}($|[^a-z0-9])`,
            "i"
        );

        return regex.test(text);

    });

}


/* ==========================================
   6. DETECT ALL COMPONENTS
========================================== */

function detectComponents(prompt) {

    const result = {

        role: containsKeyword(prompt, keywords.role),

        task: containsKeyword(prompt, keywords.task),

        context: containsKeyword(prompt, keywords.context),

        constraints: containsKeyword(prompt, keywords.constraints),

        format: containsKeyword(prompt, keywords.format)

    };

    return result;

}


/* ==========================================
   7. CALCULATE SCORE
========================================== */

function calculateScore(result) {

    let score = 0;

    // Every detected component gets 20 marks.

    Object.values(result).forEach(detected => {

        if (detected) {
            score += 20;
        }

    });

    return score;

}


/* ==========================================
   8. GET PROMPT RATING
========================================== */

function getRating(score) {

    if (score === 100) {

        return {
            title: "Excellent! 🏆",
            description: "Your prompt contains all five important components."
        };

    }

    if (score === 80) {

        return {
            title: "Very Good! 🌟",
            description: "Your prompt is strong. Just one component is missing."
        };

    }

    if (score === 60) {

        return {
            title: "Good! 👍",
            description: "Your prompt has a good foundation. Improve the missing components."
        };

    }

    if (score === 40) {

        return {
            title: "Average! 📘",
            description: "Your prompt needs more information and clarity."
        };

    }

    return {
        title: "Needs Improvement! 💡",
        description: "Your prompt needs several important components."
    };

}


/* ==========================================
   9. DISPLAY COMPONENT RESULTS
========================================== */

function displayComponents(result) {

    const componentIds = {

        role: "roleItem",
        task: "taskItem",
        context: "contextItem",
        constraints: "constraintsItem",
        format: "formatItem"

    };

    let count = 0;

    Object.keys(componentIds).forEach(key => {

        const element = document.getElementById(
            componentIds[key]
        );

        const status = element.querySelector(".status");

        // Remove previous classes.

        element.classList.remove("detected", "missing");

        if (result[key]) {

            element.classList.add("detected");

            status.textContent = "✓ Detected";

            count++;

        } else {

            element.classList.add("missing");

            status.textContent = "✕ Missing";

        }

    });

    detectedCount.textContent = `${count} / 5 Detected`;

}


/* ==========================================
   10. DISPLAY SUGGESTIONS
========================================== */

function displaySuggestions(result) {

    suggestions.innerHTML = "";

    const missingComponents = Object.keys(result).filter(
        key => !result[key]
    );

    // All components detected.

    if (missingComponents.length === 0) {

        suggestions.innerHTML = `
            <div class="success-message">
                🎉 Excellent work! All five components
                are detected in your prompt.
                Your prompt is ready to use.
            </div>
        `;

        return;

    }

    // Display a suggestion for each missing component.

    missingComponents.forEach((component, index) => {

        const suggestion = document.createElement("div");

        suggestion.className = "suggestion-item";

        suggestion.style.animationDelay = `${index * 0.12}s`;

        const heading = document.createElement("strong");

        heading.textContent =
            `⚠ Missing ${component.toUpperCase()}`;

        const description = document.createElement("p");

        description.textContent = improvementTips[component];

        suggestion.appendChild(heading);

        suggestion.appendChild(description);

        suggestions.appendChild(suggestion);

    });

}


/* ==========================================
   11. UPDATE SCORE DISPLAY
========================================== */

function updateScore(score) {

    const rating = getRating(score);

    // Display score.

    scoreValue.textContent = score;

    // Display rating.

    ratingText.textContent = rating.title;

    ratingDescription.textContent = rating.description;

    // Animate progress bar.

    progressBar.style.width = `${score}%`;

    // Update circular progress indicator.

    const degrees = (score / 100) * 360;

    scoreCircle.style.background = `
        conic-gradient(
            #695ce9 ${degrees}deg,
            #e9e9f2 ${degrees}deg
        )
    `;

}


/* ==========================================
   12. CHECK PROMPT BUTTON
========================================== */

checkBtn.addEventListener("click", function() {

    const prompt = promptInput.value.trim();

    // Validate empty input.

    if (prompt === "") {

        errorMessage.style.display = "block";

        promptInput.focus();

        return;

    }

    // Hide previous error.

    errorMessage.style.display = "none";

    // Detect five components.

    const result = detectComponents(prompt);

    // Calculate total score.

    const score = calculateScore(result);

    // Display all results.

    displayComponents(result);

    updateScore(score);

    displaySuggestions(result);

});


/* ==========================================
   13. LOAD SAMPLE PROMPT BUTTON
========================================== */

sampleBtn.addEventListener("click", function() {

    promptInput.value = sample100;

    errorMessage.style.display = "none";

    updateCharacterCount();

    // Automatically analyze the sample prompt.

    checkBtn.click();

});


/* ==========================================
   14. CLEAR BUTTON
========================================== */

clearBtn.addEventListener("click", function() {

    // Clear input.

    promptInput.value = "";

    // Reset character count.

    updateCharacterCount();

    // Hide errors.

    errorMessage.style.display = "none";

    // Reset score.

    updateScore(0);

    // Reset detected count.

    detectedCount.textContent = "0 / 5 Detected";

    // Reset rating.

    ratingText.textContent = "Not Checked";

    ratingDescription.textContent =
        "Your prompt score will appear here.";

    // Reset all component statuses.

    const items = document.querySelectorAll(".component-item");

    items.forEach(item => {

        item.classList.remove("detected", "missing");

        item.querySelector(".status").textContent = "Pending";

    });

    // Reset suggestions.

    suggestions.innerHTML = `
        <p class="empty-suggestion">
            Check your prompt to receive
            personalized improvement suggestions.
        </p>
    `;

});


/* ==========================================
   15. CHARACTER COUNTER
========================================== */

function updateCharacterCount() {

    const length = promptInput.value.length;

    charCount.textContent = `${length} characters`;

}


// Update counter whenever the user types.

promptInput.addEventListener("input", function() {

    updateCharacterCount();

    errorMessage.style.display = "none";

});


/* ==========================================
   16. INITIAL APPLICATION STATE
========================================== */

// Set the default score and progress.

updateScore(0);

