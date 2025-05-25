# Bat Clock - A Minimalist Grayscale Time & Weather Display

## Description

Bat Clock is a refined web application that offers a serene and focused time-telling experience. It presents a minimalist digital clock and an automatic weather display, all wrapped in a delicate, dreamlike grayscale aesthetic. Designed for simplicity and visual calm, Bat Clock provides essential information at a glance without unnecessary distractions.

## Features

*   **Minimalist Digital Clock:** Clearly displays the current time (HH:MM:SS AM/PM) and date, styled for a delicate and easily readable experience.
*   **Automatic Weather Display:**
    *   Shows current weather conditions for your location, determined automatically via IP geolocation.
    *   Displays temperature in Celsius, a textual weather description, your general location, and a subtle weather icon.
    *   Utilizes the OpenWeatherMap API for weather data.
*   **Aesthetic Design:**
    *   Features a single, carefully crafted grayscale theme.
    *   Employs a "dreamlike" and "delicate" visual style with light fonts, subtle shadows, and a minimalist layout.
*   **Responsive Design:** The interface adapts gracefully to various screen sizes, ensuring a consistent experience on desktop and mobile devices.
*   **Settings Persistence:**
    *   _(Note: While features like Pomodoro timer and advanced theme/view settings are currently hidden, their data (e.g., Pomodoro cycle count) might still be persisted in `localStorage` if those modules are re-activated in the future.)_ For the current visible features, only the last displayed weather data might be implicitly cached by the browser but no specific user settings are actively saved for the visible UI.

### Currently Hidden/Disabled Features
The following features were part of previous iterations but are currently not active in the UI to maintain the minimalist focus:
*   Multi-theme system (replaced by a single grayscale theme).
*   Analog clock display option.
*   Pomodoro timer functionality.
*   Manual city input for the weather widget.

## Screenshot

<!-- 
    Add Screenshot Here 
    A good screenshot would showcase the new minimalist grayscale UI, 
    featuring the digital clock and the automatic weather display.
-->
![Bat Clock Minimalist Screenshot Placeholder](https://via.placeholder.com/800x500.png?text=Bat+Clock+Minimalist+Grayscale+UI)
*(Replace placeholder image with an actual screenshot of the application's current design.)*

## Tech Stack

*   **Frontend:** HTML5, CSS3 (with CSS Variables), JavaScript (ES6 Modules)
*   **Testing:** Jest (for unit testing core JavaScript logic)
*   **Development Environment:** Node.js with npm (for dependency management and running tests)

## Setup and Usage

1.  **Clone the repository (if you haven't already):**
    ```bash
    # Example: git clone https://github.com/your-username/bat.clock.git
    # Replace with the actual repository URL
    cd bat.clock
    ```
2.  **Open `index.html`:**
    Simply open the `index.html` file in your preferred web browser to use the application.

3.  **Weather API Key Information:**
    *   The weather widget uses the OpenWeatherMap API. A pre-configured API key (`e40951f785b14f5880361537252505`) is included in `js/weather.js` for immediate use.
    *   If you wish to use your own OpenWeatherMap API key, you can replace the existing `API_KEY` constant value in the `js/weather.js` file:
        ```javascript
        // js/weather.js
        const API_KEY = 'YOUR_OWN_OPENWEATHERMAP_API_KEY'; 
        ```
    *   Please note that API keys can have usage limits. The pre-configured key is for demonstration and may be subject to such limits.

## How to Run Tests

The project uses Jest for unit testing core JavaScript logic that was part of the application's previous, more feature-rich state. These tests primarily cover data formatting and state transition logic.

1.  **Install Dependencies:**
    Ensure you have Node.js and npm installed. Navigate to the project directory in your terminal and run:
    ```bash
    npm install
    ```
    This installs Jest and other development dependencies.

2.  **Run Tests:**
    Execute the following command:
    ```bash
    npm test
    ```
    Test results will be displayed in the terminal.

## Future Enhancements (Ideas for a Minimalist Path)

*   Subtle animations or transitions for weather updates.
*   User option to toggle visibility of the date or weather widget for an even more minimal clock-only view.
*   Exploration of alternative minimalist-friendly ways to re-introduce features like a very subtle Pomodoro timer (e.g., background color shifts).

## Contributing

While the project has shifted towards a specific minimalist aesthetic, feedback or suggestions that align with this vision are welcome. Please feel free to open an issue to discuss potential changes.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
