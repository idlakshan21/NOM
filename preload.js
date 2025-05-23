const { contextBridge, ipcRenderer } = require('electron');

function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        return null;
    }
}

function startJwtExpirationCheck() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
        redirectToLogin();
        return;
    }

    const decodedToken = decodeJwt(jwt);
    if (!decodedToken) {
        redirectToLogin();
        return;
    }

    const expirationTimestamp = decodedToken.exp * 1000;
    const currentTimestamp = Date.now();

    if (currentTimestamp >= expirationTimestamp) {
        redirectToLogin();
        return;
    }

    // Set up interval to check expiration
    const intervalId = setInterval(() => {
        const currentTime = Date.now();
        if (currentTime >= expirationTimestamp) {
            clearInterval(intervalId);
            redirectToLogin();
        }
    }, 1000);
}

function redirectToLogin() {
    localStorage.clear();
    window.location.href = './login.html';
}

function checkUserAuthentication() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
        redirectToLogin();
        return;
    }

    const decodedToken = decodeJwt(jwt);
    if (!decodedToken) {
        redirectToLogin();
        return;
    }

    const expirationTimestamp = decodedToken.exp * 1000;
    const currentTimestamp = Date.now();

    if (currentTimestamp < expirationTimestamp) {
        startJwtExpirationCheck();
    } else {
        redirectToLogin();
    }
}

contextBridge.exposeInMainWorld('api', {
    // IPC methods
    getBaseUrl: () => ipcRenderer.invoke('get-base-url'),
    getLoginPath: () => ipcRenderer.invoke('get-login-path'),
    getUnits: () => ipcRenderer.invoke('get-units'),
    getImagePath: () => ipcRenderer.invoke('get-image-path'),
    getRoleIds: () => ipcRenderer.invoke('get-role-ids'),
    
    // Auth storage methods
    saveJwtToken: (token) => localStorage.setItem('jwt', token),
    getJwtToken: () => localStorage.getItem('jwt'),
    saveUserRole: (role) => localStorage.setItem('role', role),
    getUserRole: () => localStorage.getItem('role'),
    saveUserName: (userName) => localStorage.setItem('userName', userName),
    getUserName: () => localStorage.getItem('userName'),
    saveUserId: (userId) => localStorage.setItem('userId', userId),
    getUserId: () => localStorage.getItem('userId'),
    
    clearAuthData: () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        return true;
    },
    
    // Auth utility methods
    decodeJwt: (token) => decodeJwt(token),
    checkUserAuthentication: checkUserAuthentication,
    startJwtExpirationCheck: startJwtExpirationCheck
});