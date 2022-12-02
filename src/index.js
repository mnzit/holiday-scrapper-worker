import { load } from "cheerio";

addEventListener("fetch", (event) => {
	event.respondWith(
		handleRequest(event.request).catch(
			(err) => new Response(err.stack, { status: 500 })
		)
	);
});

async function handleRequest(request) {
	const { pathname } = new URL(request.url);

	if (pathname.startsWith("/hamropatro")) {
		return fetch('https://www.hamropatro.com/nepali-public-holidays')
			.then(response => response.text())
			.then(text => {
				let holidays = [];
				let $ = load(text);
				$(".holidays-table-wrapper").each(function (i, holidayTableWrapper) {
					let count = 0;
					$(this).find("table tr").each(function (j, table) {
						if (count != 0) {
							let holiday = {
								event: ($(this).find("td:nth-child(1) span:nth-child(2)").text()).trim(),
								nepaliDate: ($(this).find("td:nth-child(2)").text()).trim(),
								englishDate: $(this).find("td:nth-child(3)").text()
							}
							holidays.push(holiday);
						}
						count++;
					});
				});
				return new Response(JSON.stringify(holidays));
			});
	}else if(pathname.startsWith("/nepalipatro")){
		return fetch("https://api.nepalipatro.com.np/goverment-holidays/2079")
		.then(response => response.json())
			.then(holidays => {
				let response = [];

				for(let holiday of holidays){
					response.push({
						event: JSON.parse(holiday.description).en,
						nepaliDate: holiday.bs,
						englishDate: holiday.ad
					})
				}

				return new Response(JSON.stringify(response));
			});
	}
}