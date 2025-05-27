

document.querySelector("#admin-keyboard-button-special").addEventListener("click", function () {

    toggleAdminEmployeeSymbolPopup()
})

document.querySelector("#admin-keyboard-button-abc").addEventListener("click", function () {
    toggleAdminEmployeeLettersPopup()
})

function toggleAdminEmployeeSymbolPopup() {
    const symbols = ['.', '@', '#', '/', ',', '-', '&', '*', '(', ')'];
    const buttons = document.querySelectorAll('.admin-popup_keyboard_buttonNum');

    buttons.forEach(function (button, index) {
        if (button.textContent === '123') {
            button.textContent = symbols[index];
        } else if (button.textContent === symbols.join('')) {
            button.textContent = '123';
        } else {
            if (!isNaN(parseInt(button.textContent))) {
                button.textContent = symbols[index];
            } else {
                button.textContent = index === 9 ? '0' : (index + 1);
            }
        }
    });

    const symbolButtonPopup = document.querySelector("#admin-keyboard-button-special");
    if (symbolButtonPopup.textContent === '123') {
        symbolButtonPopup.textContent = '!#*';
    } else {
        symbolButtonPopup.textContent = '123';
    }
}


function toggleAdminEmployeeLettersPopup() {
    const letterButtons = document.querySelectorAll('.admin-popup_keyboard_button:not(.admin-popup_keyboard_buttonBackSpace):not(.admin-popup_keyboard_buttonSpace):not(.admin-popup_keyboard_buttonDot)');
    letterButtons.forEach(function (button) {
        if (button.textContent === 'abc?') {
            button.textContent = 'ABC?';
        } else if (button.textContent === 'ABC?') {
            button.textContent = 'abc?';
        } else {
            button.textContent = button.textContent === button.textContent.toUpperCase() ? button.textContent.toLowerCase() : button.textContent.toUpperCase();
        }
    });

}

