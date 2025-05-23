const userNameInput = document.querySelector("#login-username");
const passwordInput = document.querySelector("#login-password");
const keypadButtons = document.querySelectorAll('.login-keyboard__key');

let selectedLoginInput;


function showLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "flex";
}

function hideLoadingScreen() {
  document.getElementById("loadingScreen").style.display = "none";
}

async function handleLogin() {
  showLoadingScreen();
  const userId = userNameInput.value;
  const password = passwordInput.value;

  if (!userId || !password) {
    hideLoadingScreen();
    return Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please enter both username and password.',
    });
  }

  try {
    const baseUrl = await window.api.getBaseUrl();
    const response = await fetch(`${baseUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, password })
    });


    if (response.ok) {
      const data = await response.json();
      window.api.saveJwtToken(data.jwt);
      window.api.saveUserRole(data.role);
      window.api.saveUserName(data.userName);
      window.api.saveUserId(data.userId);

      redirectBasedOnRole(data.role);
    } else {
      console.error('Login failed:', response.statusText);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please check your credentials.',
        customClass: {
          confirmButton: 'alert-orange-button',
        }
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'An unexpected error occurred. Please try again later.',
    });
  }
  hideLoadingScreen();
}


function checkExistingUser() {
  const jwt = window.api.getJwtToken();

  if (jwt) {
    const decodedToken = window.api.decodeJwt(jwt);

    if (decodedToken && isTokenValid(decodedToken)) {
      const role = window.api.getUserRole();
      redirectBasedOnRole(role);
    } else {
      window.api.clearAuthData();
    }
  }
}

function isTokenValid(decodedToken) {
  const expirationTimestamp = decodedToken.exp * 1000;
  const currentTimestamp = Date.now();
  return currentTimestamp < expirationTimestamp;
}

function redirectBasedOnRole(role) {
  if (role === 'Admin') {
    window.location.href = './admin.html';
  } else if (role === 'cashier') {
    window.location.href = './cashier-takeaway.html';
  }
}


function toggleCase() {
  const buttons = document.querySelectorAll('.login-keyboard__key:not(.login-keyboard__enter):not(.login-keyboard__backspace)');
  buttons.forEach(function (button) {
    if (button.textContent === 'abc?') {
      button.textContent = 'ABC?';
    } else if (button.textContent === 'ABC?') {
      button.textContent = 'abc?';
    } else {
      button.textContent = button.textContent === button.textContent.toUpperCase() ? button.textContent.toLowerCase() : button.textContent.toUpperCase();
    }
  });
}


function toggleSymbol() {
  const symbols = ['!', '@', '#', '$', '%', '-', '&', '*', '(', ')'];
  const buttons = document.querySelectorAll('.login-keyboard__num');
  const symbolButtons = document.querySelector('#login-symbol_key');

  buttons.forEach(function (button, index) {
    if (button.textContent.includes('!#*')) {
      button.textContent = symbols[index];
    } else if (button.textContent === symbols.join('')) {
      button.textContent = '123?';
    } else {
      if (!isNaN(parseInt(button.textContent))) {
        button.textContent = symbols[index];
      } else {
        button.textContent = index === 9 ? '0' : (index + 1);
      }
    }
  });

  if (symbolButtons.textContent === '123') {
    symbolButtons.textContent = '!#*';
  } else {
    symbolButtons.textContent = '123';
  }
}


function handleButtonClick(event) {
  const buttonValue = event.target.textContent;

  if (buttonValue === 'abc?' || buttonValue === '!#*' || buttonValue === 'ABC?' || buttonValue === '123') {
    return;
  }

  if (selectedLoginInput) {
    if (buttonValue === 'Backspace') {
      selectedLoginInput.value = selectedLoginInput.value.slice(0, -1);
    } else if (buttonValue === "Enter") {
      return;
    } else {
      selectedLoginInput.value += buttonValue;
    }

    const inputEvent = new Event('input', {
      bubbles: true,
      cancelable: true,
    });
    selectedLoginInput.dispatchEvent(inputEvent);
  }
}

keypadButtons.forEach(button => {
  button.addEventListener('click', handleButtonClick);
});

function selectLoginInput(input) {
  selectedLoginInput = input;
}




document.addEventListener('DOMContentLoaded', () => {
  userNameInput.focus();
  checkExistingUser();

  document.getElementById('login-button').addEventListener('click', handleLogin);
  document.querySelector('.login-keyboard__enter').addEventListener('click', handleLogin);
  userNameInput.addEventListener('focus', function () {
    selectLoginInput(userNameInput);
  });

  passwordInput.addEventListener('focus', function () {
    selectLoginInput(passwordInput);
  });
  document.querySelector('#login-symbol_key').addEventListener('click', toggleSymbol);
   document.querySelector('#login-letters_key').addEventListener('click', toggleCase);


  document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      handleLogin();
    }
  });
});