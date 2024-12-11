class PriorityDateTrackerApp {
	constructor(elementId) {
		this.createUI(elementId);
		this.currentYearArray = null;
		this.previousYearArray = null;
	}

	_getVisaRequest(month, year, getVisaPageResponseCallback) {
		let requestId = (Date.now() + Math.random() * 10.5).toString(36);
		if (month && year) {
			window.scraperAPI.getVisaPageRequest({
				month: month,
				year: year,
				requestId: requestId,
			});

			window.scraperAPI.onGetVisaPageResponse(requestId, (htmlText) => {
				getVisaPageResponseCallback(htmlText);
			});
		}
	}

	_formatDate(date) {
		const day = date.getDate().toString().padStart(2, "0"); // Get day with leading zero
		const monthNames = [
			"JAN",
			"FEB",
			"MAR",
			"APR",
			"MAY",
			"JUN",
			"JUL",
			"AUG",
			"SEP",
			"OCT",
			"NOV",
			"DEC",
		];
		const month = monthNames[date.getMonth()]; // Get month abbreviation
		const year = date.getFullYear().toString().slice(-2); // Get last 2 digits of year

		return `${day}${month}${year}`;
	}

	createUI(elementId) {
		this.visaPage = document.getElementById(elementId);
		let currentYearTable = document.createElement("div");
		currentYearTable.className = "current-year-container";
		let previousYearTable = document.createElement("div");
		previousYearTable.className = "previous-year-container";

		const updateDateDifferences = () => {
			if (this.currentYearArray && this.previousYearArray) {
				// Current Year
				currentYearTable
					.querySelectorAll("tr")
					.forEach((tr, trIndex) => {
						tr.querySelectorAll("td").forEach((td, tdIndex) => {
							// Begin comparison
							let currentDate =
								this.currentYearArray[trIndex][tdIndex];

							if (!currentDate) {
								return;
							}

							let previousDate =
								this.previousYearArray[trIndex][tdIndex];

							if (currentDate) {
								let daysBetween = this.calculateDateDifference(
									new Date(previousDate),
									new Date(currentDate),
									"days"
								);

								td.querySelector(".days-count")?.remove();

								let daysCount = document.createElement("span");
								daysCount.innerText = `+ ${Math.round(
									daysBetween
								)}`;

								let className = "days-count";

								className +=
									daysBetween !== 0 ? " positive" : "";
								daysCount.className = className;

								td.appendChild(daysCount);
							}
						});
					});

				// Previous Year
				previousYearTable
					.querySelectorAll("tr")
					.forEach((tr, trIndex) => {
						tr.querySelectorAll("td").forEach((td, tdIndex) => {
							// Begin comparison
							let currentDate =
								this.currentYearArray[trIndex][tdIndex];

							if (!currentDate) {
								return;
							}

							let previousDate =
								this.previousYearArray[trIndex][tdIndex];

							if (currentDate) {
								let daysBetween = this.calculateDateDifference(
									new Date(previousDate),
									new Date(currentDate),
									"days"
								);

								td.querySelector(".days-count")?.remove();
								let daysCount = document.createElement("span");
								daysCount.innerText = `- ${Math.round(
									daysBetween
								)}`;

								let className = "days-count";
								className +=
									daysBetween !== 0 ? " negative" : "";
								daysCount.className = className;

								td.appendChild(daysCount);
							}
						});
					});
			}
		};

		// Previous Year Input

		let previousYearInput = this.createYearInput(
			"january",
			2024,
			(htmlOutputText) => {
				if (!htmlOutputText) {
					return;
				}

				previousYearTable.innerHTML = htmlOutputText;

				let datesArray = [];
				// Process table and clean
				previousYearTable
					.querySelectorAll("tr")
					.forEach((tr, trIndex) => {
						datesArray[trIndex] = [];

						// Parse the dates
						tr.querySelectorAll("td").forEach((td, tdIndex) => {
							// Header
							if (trIndex === 0) {
								td.querySelector("br")?.remove();
								td.innerText = td.innerText;
							}
							let timestamp = null;
							if (td.innerText === "C") {
								timestamp = new Date();
							} else {
								timestamp = new Date(td.innerText);
							}

							if (isNaN(timestamp) == false) {
								datesArray[trIndex][tdIndex] = timestamp;
								td.innerHTML = this._formatDate(
									new Date(timestamp)
								);
							}
						});
					});

				this.previousYearArray = datesArray;
				updateDateDifferences();
			}
		);

		// Current Year Input

		let currentYearInput = this.createYearInput(
			"january",
			2025,
			(htmlOutputText) => {
				if (!htmlOutputText) {
					return;
				}

				currentYearTable.innerHTML = htmlOutputText;

				let datesArray = [];
				// Process table and clean
				currentYearTable
					.querySelectorAll("tr")
					.forEach((tr, trIndex) => {
						datesArray[trIndex] = [];

						// Parse the dates
						tr.querySelectorAll("td").forEach((td, tdIndex) => {
							if (trIndex === 0) {
								td.querySelector("br")?.remove();
								td.innerText = td.innerText;
							}

							let timestamp = null;
							if (td.innerText === "C") {
								timestamp = new Date();
							} else {
								timestamp = new Date(td.innerText);
							}

							if (isNaN(timestamp) == false) {
								datesArray[trIndex][tdIndex] = timestamp;
								td.innerHTML = this._formatDate(
									new Date(timestamp)
								);
							}
						});
					});

				this.currentYearArray = datesArray;
				updateDateDifferences();
			}
		);

		const titleSpan = document.createElement("Span");
		titleSpan.className = "title"
		titleSpan.innerText =
			"FINAL ACTION DATES FOR FAMILY-SPONSORED PREFERENCE CASES";

		this.visaPage.appendChild(titleSpan);

		this.visaPage.appendChild(currentYearInput);
		this.visaPage.appendChild(previousYearInput);

		this.visaPage.appendChild(currentYearTable);
		this.visaPage.appendChild(previousYearTable);
	}

	// Make this generic
	createYearInput(defaultMonth, defaultYear, htmlOutputTextCallback) {
		let m = defaultMonth;
		let y = defaultYear;

		const yearContainer = document.createElement("div");
		yearContainer.className = "container";

		// Create Month Select
		const monthSelect = document.createElement("select");
		monthSelect.className = "input";
		const months = [
			"january",
			"february",
			"march",
			"april",
			"may",
			"june",
			"july",
			"august",
			"september",
			"october",
			"november",
			"december",
		];

		months.forEach((month) => {
			const monthOption = document.createElement("option");
			monthOption.value = month;
			monthOption.innerText = month.toUpperCase();
			if (month === m) {
				monthOption.selected = true;
			}
			monthSelect.appendChild(monthOption);
		});

		yearContainer.appendChild(monthSelect);

		// Create Year Input

		const yearInput = document.createElement("input");
		yearInput.type = "number";
		yearInput.className = "input";
		yearInput.placeholder = "Enter year";
		yearInput.value = y;

		yearContainer.appendChild(yearInput);

		// Create listeners
		monthSelect.addEventListener("change", () => {
			m = monthSelect.value;
			if (m && y) {
				this._getVisaRequest(m, y, (responseCallback) => {
					htmlOutputTextCallback(responseCallback);
				});
			}
		});

		yearInput.addEventListener("change", () => {
			y = yearInput.value;
			if (m && y) {
				this._getVisaRequest(m, y, (responseCallback) => {
					htmlOutputTextCallback(responseCallback);
				});
			}
		});

		this._getVisaRequest(m, y, (responseCallback) => {
			htmlOutputTextCallback(responseCallback);
		});

		return yearContainer;
	}

	// TODO
	// Generate a table for the time that has passed.

	// TODO
	// Display a positive sign when there's a change
	// Display a negative sign if there's a change in the date

	calculateDateDifference(date1, date2, unit = "days") {
		// Parse the dates if they are not Date objects
		const d1 = new Date(date1);
		const d2 = new Date(date2);

		if (isNaN(d1) || isNaN(d2)) {
			throw new Error("Invalid date provided.");
		}

		// Ensure d1 is earlier than d2 for consistency
		const earlier = d1 < d2 ? d1 : d2;
		const later = d1 < d2 ? d2 : d1;

		// Calculate difference based on the unit
		switch (unit.toLowerCase()) {
			case "days": {
				const diffInMilliseconds = later - earlier;
				return diffInMilliseconds / (1000 * 60 * 60 * 24);
			}
			case "months": {
				const yearDiff = later.getFullYear() - earlier.getFullYear();
				const monthDiff = later.getMonth() - earlier.getMonth();
				const totalMonths = yearDiff * 12 + monthDiff;
				return (
					totalMonths +
					(later.getDate() >= earlier.getDate() ? 0 : -1)
				);
			}
			case "years": {
				const yearDiff = later.getFullYear() - earlier.getFullYear();
				if (
					later.getMonth() < earlier.getMonth() ||
					(later.getMonth() === earlier.getMonth() &&
						later.getDate() < earlier.getDate())
				) {
					return yearDiff - 1;
				}
				return yearDiff;
			}
			default:
				throw new Error(
					"Invalid unit provided. Use 'days', 'months', or 'years'."
				);
		}
	}
}

const main = () => {
	const app = new PriorityDateTrackerApp("visa-page");
};

window.addEventListener("DOMContentLoaded", main);
