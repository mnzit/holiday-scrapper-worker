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

	if (pathname.startsWith("/")) {
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
	}
}