const JSSoup = require("jssoup").default;


// TODO: Make the data scrape for all years and clean it up

const getVisaPage = (month, year, resCallback) => {
	let m = month.toLowerCase();
	const url = `https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin/${year}/visa-bulletin-for-${m}-${year}.html`;
	fetch(url)
		.then((response) => {
			return response.text();
		})
		.then((htmlText) => {
			var soup = new JSSoup(htmlText);
			var table = soup.find("table");
			resCallback(table.prettify());
		});
};

exports.getVisaPage = getVisaPage;
