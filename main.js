const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

const configPath = path.join(__dirname, 'config.json');
let config;
try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (error) {
    console.error("Failed to read config.json:", error);
    app.quit();
}

function createWindow() {
    app.whenReady().then(() => {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;

        // Create the main window
        const mainWindow = new BrowserWindow({
            width: width,
            height: height,
            resizable: true,
            icon: path.join(__dirname, 'src/assets/icons/favicon.ico'),
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                enableRemoteModule: false,
            },
        });


        mainWindow.loadFile('src/views/login.html');

        // IPC handlers to send config values 
        //BASEURL
        ipcMain.handle('get-base-url', () => {
            const baseUrl = config.BASE_URL;
            if (!baseUrl) {
                console.error("BASE_URL not defined in config.json");
                return null;
            }
            return baseUrl;
        });

        //UNITS
        ipcMain.handle('get-units', () => {
            const unitsString = config.UNITS;
            if (!unitsString) {
                console.error("UNITS not defined in config.json");
                return [];
            }
            return unitsString.split(',').filter(unit => unit.trim() !== '');
        });

        //IMG-PATH
        ipcMain.handle('get-image-path', () => {
            const imagePath = config.IMAGE_PATH;
            if (!imagePath) {
                console.error("IMAGE_PATH not defined in config.json");
                return null;
            }
            return imagePath;
        });

        //ROLE-IDS
        ipcMain.handle('get-role-ids', () => {
            const roleIds = config.ROLE_IDS;
            if (!roleIds) {
                console.error("ROLE_IDS not defined in config.json");
                return null;
            }
            return roleIds;
        });
    });
}

// Quit when all windows are closed (except macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Re-create the window on macOS when the dock icon is clicked
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Initialize the app
app.on('ready', createWindow);
