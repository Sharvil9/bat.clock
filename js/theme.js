// List of all known theme classes
const knownThemes = [
    "theme-minimal-light",
    "theme-minimal-dark",
    "theme-forest",
    "theme-ocean",
    "theme-sunrise",
    "light-theme", // Keep old class names for cleanup if they were previously used
    "dark-theme"   // Keep old class names for cleanup
];

/**
 * Applies the specified theme to the body and saves it to localStorage.
 * @param {string} themeName - The class name of the theme to apply (e.g., "theme-forest").
 * @param {HTMLElement} body - The body element of the document.
 * @param {HTMLElement} [themeToggleButton] - The theme toggle button (optional, its text is no longer updated here).
 * @param {HTMLElement} [themeSelector] - The theme select dropdown (optional, used to set its value).
 */
export function applyTheme(themeName, body, themeToggleButton, themeSelector) {
    // Remove any existing theme classes
    knownThemes.forEach(t => {
        body.classList.remove(t);
    });

    // Add the new theme class
    if (themeName) {
        body.classList.add(themeName);
        localStorage.setItem('theme', themeName);

        // Update the selector to show the current theme if provided
        if (themeSelector && themeSelector.value !== themeName) {
            themeSelector.value = themeName;
        }
    } else {
        console.warn("applyTheme called with no themeName. Applying default.");
        // Fallback to a default if themeName is null or undefined
        body.classList.add("theme-minimal-light"); 
        localStorage.setItem('theme', "theme-minimal-light");
        if (themeSelector) {
            themeSelector.value = "theme-minimal-light";
        }
    }
    
    // The themeToggleButton's text is no longer updated here.
    // That logic will be in main.js if the button is repurposed (e.g., to cycle themes).
}

// The old toggleTheme function is removed as theme selection is now handled by the dropdown
// and potentially a new cycle function in main.js for the button.
