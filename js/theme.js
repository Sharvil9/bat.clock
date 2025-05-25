/**
 * Applies the single grayscale theme to the body.
 * @param {HTMLElement} body - The body element of the document.
 */
export function applyGrayscaleTheme(body) {
    // Remove any pre-existing theme classes just in case (optional, but good for cleanup)
    // This list could be manually maintained or dynamically generated if needed in other contexts.
    // For this specific overhaul, we assume we want to clear out any of the previous multi-theme classes.
    const oldThemes = [
        "theme-minimal-light", "theme-minimal-dark", "theme-forest",
        "theme-ocean", "theme-sunrise", "light-theme", "dark-theme"
    ];
    oldThemes.forEach(t => {
        if (body.classList.contains(t)) {
            body.classList.remove(t);
        }
    });

    // Apply the single, new grayscale theme class
    body.classList.add("grayscale-theme");
    console.log("Applied grayscale-theme to body."); // Log for confirmation
    // No localStorage usage for a single, fixed theme.
}
