const { app, BrowserWindow, ipcMain, webContents } = require("electron");
const path = require("node:path");
const scraper = require("./scraper");

let mainWindow = null;
const createMainWindow = () => {
	mainWindow = new BrowserWindow({
		width:900,
		height: 900,
		minWidth:850,
		minHeight:900,
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	});

	mainWindow.loadFile("index.html");
};

const setIpcMain = () => {
	ipcMain.on("getVisaPageRequest", (event, data) => {
		scraper.getVisaPage(data.month, data.year, (htmlText) => {
			console.log(`getVisaPageRequest ${data.month}, ${data.year}, ${data.requestId}`)
			mainWindow.webContents.send(`getVisaPageResponse-${data.requestId}`, htmlText);
		});
	});
};

app.whenReady().then(() => {
	createMainWindow();
	setIpcMain();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
