# Bat Clock - Enhanced Multifunctional Time Application

## Description

Bat Clock is a feature-rich web application designed to be your all-in-one time management companion. It goes beyond a simple clock, offering a suite of tools to enhance productivity and provide useful information at a glance. From customizable themes to a Pomodoro timer and a live weather widget, Bat Clock aims to be both functional and visually appealing.

## Features

*   **Digital Clock:** Displays the current time (HH:MM:SS AM/PM) and date.
*   **Analog Clock:** A classic analog clock display, toggleable with the digital view.
*   **Multiple Themes:**
    *   Choose from several pre-defined themes to personalize your clock experience:
        *   Minimal Light
        *   Minimal Dark
        *   Forest
        *   Ocean
        *   Sunrise
    *   Theme preference is saved in `localStorage` and applied on subsequent visits.
    *   Includes a theme selector dropdown and a "Cycle Theme" button.
*   **Pomodoro Timer:**
    *   Standard Pomodoro functionality with Work (25 min), Short Break (5 min), and Long Break (15 min) sessions.
    *   Automatically transitions between sessions.
    *   Tracks and displays the number of completed work cycles.
    *   Cycle count is persisted in `localStorage`.
    *   Controls: Start, Pause, Reset.
*   **Weather Widget:**
    *   Displays current weather information for a searched city.
    *   Shows temperature in Celsius, weather description, and a weather icon.
    *   Requires a free API key from [OpenWeatherMap](https://openweathermap.org/appid).
    *   The last searched city is saved in `localStorage` and its weather is fetched on page load.
*   **Responsive Design:** The application interface is designed to adapt to various screen sizes, from mobile devices to desktops.
*   **Settings Persistence:** User preferences for theme, clock view (digital/analog), Pomodoro cycle count, and last weather city are saved locally.

## Screenshot

<!-- 
    Add Screenshot Here 
    A good screenshot would showcase the clock (digital or analog), 
    the Pomodoro timer, the weather widget, and perhaps the theme selector, 
    ideally with one of the more vibrant themes active.
-->
![Bat Clock Screenshot Placeholder](https://via.placeholder.com/800x500.png?text=Bat+Clock+Application+Screenshot)
*(Replace placeholder image with an actual screenshot of the application.)*

## Tech Stack

*   **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
*   **Testing:** Jest (for unit tests)
*   **Build/Environment:** Node.js with npm (for dependency management and running tests)

## Setup and Usage

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/bat.clock.git 
    # Replace with the actual repository URL if different
    cd bat.clock
    ```
2.  **Open `index.html`:**
    Simply open the `index.html` file in your web browser to use the application.

3.  **Weather API Key (Important!):**
    The weather widget requires a free API key from [OpenWeatherMap](https://openweathermap.org/appid).
    *   Sign up for a free account and obtain your API key.
    *   Open the `js/weather.js` file.
    *   Replace the placeholder `'YOUR_API_KEY'` with your actual API key:
        ```javascript
        const API_KEY = 'YOUR_ACTUAL_OPWNWEATHERMAP_API_KEY'; 
        ```
    *   Without a valid API key, the weather widget will display placeholder data or an error message.

## How to Run Tests

The project uses Jest for unit testing core JavaScript logic.

1.  **Install Dependencies:**
    Make sure you have Node.js and npm installed. Navigate to the project directory in your terminal and run:
    ```bash
    npm install
    ```
    This will install Jest and other development dependencies listed in `package.json`.

2.  **Run Tests:**
    Execute the following command to run the tests:
    ```bash
    npm test
    ```
    Test results will be displayed in the terminal.

## Future Enhancements (Ideas)

*   Configurable Pomodoro durations and long break intervals.
*   Sound notifications for Pomodoro session completion.
*   More detailed analog clock markings (e.g., numbers for hours).
*   Option to choose temperature units (Celsius/Fahrenheit) for the weather widget.
*   Additional themes or user-defined custom themes.
*   Internationalization for date and text elements.

## Contributing

Contributions are welcome! If you have ideas for improvements or find any bugs, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
