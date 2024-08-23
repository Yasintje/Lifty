

const timerIcon = document.getElementById('timer-icon-container');
const timerDropdownContainer = document.getElementById('timer-dropdown-container');
const timerContainer = document.getElementById('timer-container');
const timerSelect = document.getElementById('timer-select');

let timerTimeout;

function showTimerDropdown() {
    timerDropdownContainer.style.display = "";

}

function hideTimerDropdown() {
    timerDropdownContainer.style.display = "none";
}
// function startTimer(duration) {
//     // Clear any existing timer
//     clearInterval(timerTimeout);
    
//     // Ensure timer container is visible
//     timerContainer.classList.remove('hidden');
    
//     let timer = duration, minutes, seconds;
//     const display = document.getElementById('timer-display');
//     timerContainer.style.display = "";

//     // Update display every second
//     timerTimeout = setInterval(() => {
//         minutes = Math.floor(timer / 60); // Convert total seconds to minutes
//         seconds = timer % 60; // Get remaining seconds

//         minutes = minutes < 10 ? '0' + minutes : minutes;
//         seconds = seconds < 10 ? '0' + seconds : seconds;

//         display.textContent = minutes + ':' + seconds;

//         if (--timer < 0) {
//             clearInterval(timerTimeout);
//             var msg = new SpeechSynthesisUtterance('Time is up. You shall continue your next set!');
//             window.speechSynthesis.speak(msg);
//             alert('Time is up!');

//             timerContainer.style.display = "none";
//         }
//     }, 1);
// }

function startTimer(duration) {
    // Clear any existing timer
    clearTimeout(timerTimeout);
    
    // Ensure timer container is visible
    timerContainer.style.display = "";
    
    let timer = duration, minutes, seconds;
    const display = document.getElementById('timer-display');
    
    const interval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        display.textContent = minutes + ':' + seconds;

        if (--timer < 0) {
            clearInterval(interval);
            var msg = new SpeechSynthesisUtterance('Time is up. You shall continue your next set!');
            window.speechSynthesis.speak(msg);
            alert('Time is up!');
            timerContainer.style.display = "none";
        }
    }, 1000);
}


function handleTimerStart() {
    const selectedTime = parseInt(timerSelect.value, 10);
    if (selectedTime) {
        startTimer(selectedTime); // Convert minutes to seconds
        hideTimerDropdown();
    }
}

// Event listener for the timer icon
timerIcon.addEventListener('click', () => {
    if (timerDropdownContainer.style.display === "none") {
        showTimerDropdown();
    } else {
        hideTimerDropdown();
    }
});

// Event listener for the timer dropdown selection
timerSelect.addEventListener('change', handleTimerStart);

// Hide the timer container when the page is loaded

timerContainer.style.display = "none";
timerDropdownContainer.style.display = "none";