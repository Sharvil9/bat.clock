@echo off
:: ============================================================================
:: SCRIPT: clock.bat
:: AUTHOR: AI Agent
:: VERSION: 1.3
:: DATE: 2023-10-27
::
:: DESCRIPTION:
:: This script displays a digital clock with selectable themes, an alarm
:: feature, and a countdown timer.
::
:: FEATURES:
:: - Digital clock (Time and Date)
:: - User-selectable themes (background/foreground colors)
:: - Alarm (settable at HH:MM)
:: - Countdown Timer (settable in minutes)
::
:: USAGE:
:: Simply run the batch file. It will guide you through setting options.
:: ============================================================================

:: Enable Delayed Expansion for variables that change within loops/IF blocks
SETLOCAL EnableDelayedExpansion

:: Set the window title
Title Digital Clock with Themes, Alarm, and Timer

:: ----------------------------------------------------------------------------
:: Initial Variable Setup
:: ----------------------------------------------------------------------------
REM Theme related variables
SET "selected_colors=07" REM Default to Dark theme if something goes wrong
SET "theme_name=Dark"

REM Alarm related variables
SET "alarm_time_input="
SET "alarm_active=0"     REM 0 = no alarm, 1 = alarm set

REM Countdown related variables
SET "countdown_active=0" REM 0 = no countdown, 1 = countdown running
SET "countdown_end_time_seconds="
SET "countdown_display_time=00:00"

:: ============================================================================
:: THEME SELECTION MODULE
:: ============================================================================
:choose_theme
CLS
ECHO.
ECHO  ==========================
ECHO      THEME SELECTION
ECHO  ==========================
ECHO  Please select a theme for the clock:
ECHO.
ECHO    1. Light (Light Gray BG, Black Text)
ECHO    2. Dark  (Black BG, White Text)
ECHO    3. Cool Blue (Blue BG, Bright White Text)
ECHO    4. Hacker Green (Black BG, Bright Green Text)
ECHO.

SET "theme_choice=" REM Clear previous choice
SET /P "theme_choice=Enter theme number (1-4): "

REM Process theme choice
IF "%theme_choice%"=="1" (
    SET "selected_colors=70"
    SET "theme_name=Light"
) ELSE IF "%theme_choice%"=="2" (
    SET "selected_colors=07"
    SET "theme_name=Dark"
) ELSE IF "%theme_choice%"=="3" (
    SET "selected_colors=1F"
    SET "theme_name=Cool Blue"
) ELSE IF "%theme_choice%"=="4" (
    SET "selected_colors=0A"
    SET "theme_name=Hacker Green"
) ELSE (
    ECHO.
    ECHO  Invalid choice. Please enter a number between 1 and 4.
    PING -n 3 127.0.0.1 >nul REM Pause for 2 seconds
    GOTO choose_theme
)

REM Apply selected theme colors
color %selected_colors%

REM Set console window size. Adjusted to fit all potential display lines.
@mode con cols=38 lines=15

:: ============================================================================
:: ALARM SETUP MODULE
:: ============================================================================
:ask_alarm
ECHO.
ECHO  ==========================
ECHO         ALARM SETUP
ECHO  ==========================
SET "set_alarm_choice=" REM Clear previous choice
SET /P "set_alarm_choice=Set an alarm? (Y/N): "

IF /I "%set_alarm_choice%"=="Y" (
    GOTO get_alarm_time
) ELSE IF /I "%set_alarm_choice%"=="N" (
    ECHO No alarm set.
    GOTO ask_countdown REM Proceed to countdown setup
) ELSE (
    ECHO Invalid choice. Please enter Y or N.
    PING -n 2 127.0.0.1 >nul REM Pause for 1 second
    GOTO ask_alarm
)

:get_alarm_time
ECHO.
SET "alarm_time_input=" REM Clear previous input
SET /P "alarm_time_input=Enter alarm time (HH:MM, 24-hour format, e.g., 08:05 or 14:30): "

REM Validate alarm time format: must contain a colon
ECHO "%alarm_time_input%" | FIND ":" >NUL
IF ERRORLEVEL 1 (
    ECHO Invalid format. Missing colon or incorrect structure.
    GOTO get_alarm_time
)

REM Validate hour and minute ranges (basic check)
SET "alarm_hour=%alarm_time_input:~0,2%"
SET "alarm_minute=%alarm_time_input:~3,2%"

REM Check if hour/minute are purely numeric (simple check by trying arithmetic)
SET /A alarm_hour_check = %alarm_hour% + 0 >nul 2>nul
SET /A alarm_minute_check = %alarm_minute% + 0 >nul 2>nul
IF ERRORLEVEL 1 (
    ECHO Invalid characters in time. Please use numbers for HH and MM.
    GOTO get_alarm_time
)

IF "%alarm_hour%" GE "24" GOTO invalid_alarm_time_msg
IF "%alarm_minute%" GE "60" GOTO invalid_alarm_time_msg

ECHO Alarm set for %alarm_time_input%.
SET "alarm_active=1"
GOTO ask_countdown REM Proceed to countdown setup

:invalid_alarm_time_msg
ECHO Invalid time value. Hours (00-23) or Minutes (00-59) out of range.
GOTO get_alarm_time

:: ============================================================================
:: COUNTDOWN TIMER SETUP MODULE
:: ============================================================================
:ask_countdown
ECHO.
ECHO  ==========================
ECHO     COUNTDOWN TIMER SETUP
ECHO  ==========================
SET "set_countdown_choice=" REM Clear previous choice
SET /P "set_countdown_choice=Set a countdown timer? (Y/N): "

IF /I "%set_countdown_choice%"=="Y" (
    GOTO get_countdown_minutes
) ELSE IF /I "%set_countdown_choice%"=="N" (
    ECHO No countdown timer set.
    GOTO main_clock_start REM Proceed to main clock
) ELSE (
    ECHO Invalid choice. Please enter Y or N.
    PING -n 2 127.0.0.1 >nul REM Pause for 1 second
    GOTO ask_countdown
)

:get_countdown_minutes
ECHO.
SET "countdown_minutes_input=" REM Clear previous input
SET /P "countdown_minutes_input=Enter timer duration in minutes (e.g., 5): "

REM Validate input: Check if it's a non-empty, positive number
IF "%countdown_minutes_input%"=="" (
    ECHO No value entered. Please enter minutes.
    GOTO get_countdown_minutes
)
SET "not_numeric="
FOR /F "delims=0123456789" %%i IN ("%countdown_minutes_input%") DO SET "not_numeric=%%i"
IF DEFINED not_numeric (
    ECHO Invalid input: Not a number. Please enter minutes.
    GOTO get_countdown_minutes
)
SET /A check_minutes = countdown_minutes_input
IF %check_minutes% LEQ 0 (
    ECHO Invalid input: Duration must be greater than 0 minutes.
    GOTO get_countdown_minutes
)

REM Calculate countdown end time in total seconds from midnight
ECHO Calculating end time for %countdown_minutes_input% minute(s) timer...
SET "temp_time=%time: =0%" REM Replace space with 0 for times like " 9:MM:SS"
REM The 1%%var%% - 100 trick is to correctly convert HH, MM, SS to numbers, handling leading zeros.
SET /A current_h = 1%temp_time:~0,2% - 100
SET /A current_m = 1%temp_time:~3,2% - 100
SET /A current_s = 1%temp_time:~6,2% - 100
SET /A current_total_seconds = (current_h * 3600) + (current_m * 60) + current_s
SET /A duration_total_seconds = countdown_minutes_input * 60
SET /A countdown_end_time_seconds = current_total_seconds + duration_total_seconds
SET "countdown_active=1"
ECHO Timer set for %countdown_minutes_input% minutes.
GOTO main_clock_start REM Proceed to main clock

:: ============================================================================
:: MAIN CLOCK DISPLAY AND LOGIC LOOP
:: ============================================================================
:main_clock_start
REM Brief pause before starting the main clock loop, allowing user to read final setup messages.
ECHO.
ECHO Starting Clock...
PING -n 2 127.0.0.1 -w 500 >nul

:main
    REM Capture current time once for this loop iteration
    SET "current_time_raw=%time%"

    REM --- Countdown Logic ---
    IF "%countdown_active%"=="1" (
        REM Prepare current time for countdown calculation (total seconds from midnight)
        SET "temp_time_countdown=%current_time_raw: =0%"
        SET /A current_h_cd = 1%temp_time_countdown:~0,2% - 100
        SET /A current_m_cd = 1%temp_time_countdown:~3,2% - 100
        SET /A current_s_cd = 1%temp_time_countdown:~6,2% - 100
        SET /A current_total_seconds_cd = (current_h_cd * 3600) + (current_m_cd * 60) + current_s_cd

        REM Calculate remaining seconds for countdown
        SET /A remaining_seconds = countdown_end_time_seconds - current_total_seconds_cd

        IF !remaining_seconds! LEQ 0 (
            SET "countdown_display_time=00:00"
            GOTO countdown_finished REM Jump to countdown finished routine
        ) ELSE (
            REM Format remaining time as MM:SS for display
            SET /A display_mm = remaining_seconds / 60
            SET /A display_ss = remaining_seconds %% 60
            REM Add leading zeros if necessary using delayed expansion
            IF !display_mm! LSS 10 (SET "display_mm_str=0!display_mm!") ELSE (SET "display_mm_str=!display_mm!")
            IF !display_ss! LSS 10 (SET "display_ss_str=0!display_ss!") ELSE (SET "display_ss_str=!display_ss!")
            SET "countdown_display_time=!display_mm_str!:!display_ss_str!"
        )
    )

    REM --- Alarm Check Logic ---
    IF "%alarm_active%"=="1" (
        REM Format current time to HH:MM for alarm comparison
        SET "current_time_full_alarm=%current_time_raw: =0%"
        SET "current_hh_mm_alarm=%current_time_full_alarm:~0,5%"
        IF "%current_hh_mm_alarm%"=="%alarm_time_input%" (
            GOTO alarm_triggered REM Jump to alarm triggered routine
        )
    )

    REM --- Display Update ---
    CLS
    echo.
    echo   +-----------------------------------+
    echo   ^|            DIGITAL CLOCK            ^|
    echo   +-----------------------------------+
    echo.
    echo              Time: %current_time_raw%
    echo              Date: %date%
    echo.
    echo   ===================================
    echo         Theme: %theme_name%
    IF "%alarm_active%"=="1" (
        echo         Alarm: %alarm_time_input%
    ) ELSE (
        echo         Alarm: Not Set
    )
    IF "%countdown_active%"=="1" (
        echo         Timer: !countdown_display_time! remaining
    ) ELSE (
        echo         Timer: Not Set
    )
    echo   ===================================
    echo.

    REM Pause for 1 second before next update (ping trick)
    REM Using -n 2 for roughly 1 second, -w 1000 to timeout quickly if host is unreachable.
    ping -n 2 127.0.0.1 -w 1000 >nul
GOTO main

:: ============================================================================
:: ALARM TRIGGERED SUBROUTINE
:: ============================================================================
:alarm_triggered
SET "original_colors_alarm=%selected_colors%" REM Save current theme colors
color 4F REM Red background, Bright White text for alarm visual
CLS
ECHO.
ECHO   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
ECHO   !!!!!!!!!! A L A R M !!!!!!!!!!!
ECHO   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
ECHO.
ECHO           Alarm Time: %alarm_time_input%
ECHO.
ECHO     Press any key or wait 15s to dismiss.
ECHO.

REM Use TIMEOUT for pause, /NOBREAK means key press won't terminate script (but will end timeout)
timeout /T 15 /NOBREAK >nul

REM Reset alarm state
SET "alarm_active=0"
SET "alarm_time_input="

color %original_colors_alarm% REM Restore original theme colors
CLS
ECHO.
ECHO  Alarm dismissed at %time%
PING -n 2 127.0.0.1 -w 1000 >nul REM Pause to show message
GOTO main

:: ============================================================================
:: COUNTDOWN FINISHED SUBROUTINE
:: ============================================================================
:countdown_finished
SET "original_colors_countdown=%selected_colors%" REM Save current theme colors
color 2F REM Green background, Bright White text for timer visual
CLS
ECHO.
ECHO   ***********************************
ECHO   ********** TIMER UP! ************
ECHO   ***********************************
ECHO.
ECHO           Countdown Finished!
ECHO.
ECHO   ^G^G^G REM Attempt to play BEL sound (may not work on all systems)
ECHO.
ECHO     Press any key or wait 10s to dismiss.
ECHO.

REM Use TIMEOUT for pause
timeout /T 10 /NOBREAK >nul

REM Reset countdown state
SET "countdown_active=0"
SET "countdown_end_time_seconds="
SET "countdown_display_time=00:00" REM Reset display

color %original_colors_countdown% REM Restore original theme colors
CLS
ECHO.
ECHO  Timer Finished & Dismissed at %time%
PING -n 2 127.0.0.1 -w 1000 >nul REM Pause to show message
GOTO main

:: ============================================================================
:: END OF SCRIPT
:: ============================================================================