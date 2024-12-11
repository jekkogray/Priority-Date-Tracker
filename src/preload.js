const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("scraperAPI", {
	getVisaPageRequest: (date) =>
		ipcRenderer.send("getVisaPageRequest", { month: date.month, year: date.year, requestId: date.requestId }),
	onGetVisaPageResponse: (requestId, htmlTextCallback) =>
		ipcRenderer.on(`getVisaPageResponse-${requestId}`, (_event, value) => {
			htmlTextCallback(value);
		})
});
