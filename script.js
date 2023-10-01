
const feedlist = [
	'https://dmitripavlutin.com/rss.xml',
	'https://davidwalsh.name/feed',
	'https://css-tricks.com/feed/',
	'https://hackernoon.com/tagged/react/feed',
	'https://hackernoon.com/tagged/css/feed',
	'https://blog.chromium.org/feeds/posts/default',
	'https://hidde.blog/feed',
	'https://bitsofco.de/rss',
	'https://developer.mozilla.org/en-US/blog/rss.xml',
	'https://news.vuejs.org/feed.xml',
	'https://medium.com/@upekshadilshan000/feed',
	'https://codeburst.io/feed',
	'https://medium.com/@zac_heisey/feed',
	'https://kristoff.it/index.xml',
	'https://hackernoon.com/tagged/coding/feed',
	'https://hackernoon.com/tagged/frontend/feed',
	'https://hackernoon.com/tagged/javascript/feed',
	'https://andrewkelley.me/rss.xml'
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

function getMonthNum(monthName) {
	const monthDictionary = {
		'Jan': '01',
		'Feb': '02',
		'Mar': '03',
		'Apr': '04',
		'May': '05',
		'Jun': '06',
		'Jul': '07',
		'Aug': '08',
		'Sep': '09',
		'Oct': '10',
		'Nov': '11',
		'Dec': '12',
	};
	for (let key in monthDictionary) {
		if (key === monthName) return monthDictionary[monthName];
	}
}

function cleanupDateChars(datetime) {
	const dateFilters = [
		'+0000',
		'00:00:00',
		'TZ',
		'GMT',
		','
	];
	for (let i = 0; i < dateFilters.length; i++) {
		if (datetime.indexOf(dateFilters[i]) !== -1) datetime = datetime.replace(dateFilters[i], '');
	}
	return datetime;
}

function removeDayNames(datetime) {
	const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
	for (let i = 0; i < dayNames.length; i++) {
		if (datetime.indexOf(dayNames[i]) !== -1) return datetime.replace(dayNames[i], '');
	};
	return datetime;
}

function restructDate(datetime) {
	datetime = datetime.trim();
	datetime = removeDayNames(datetime);
	datetime = cleanupDateChars(datetime);
	datetime = datetime.substring(0, 12).trim().split(' '); // use first 12 chars leftover to deal with
	if (datetime[1] !== undefined) { // where left over date is DD MMM YYYY
		datetime['month'] = getMonthNum(datetime[1]);
		datetime['year'] = datetime[2];
		datetime['day'] = datetime[0]
	}
	else { // where left over date is YYYY-MM-DDTT
		datetime = datetime[0].split('-');
		datetime['year'] = datetime[0];
		datetime['month'] = datetime[1];
		datetime['day'] = datetime[2].substring(0, 2);
	}
	return `${datetime['year']}/${datetime['month']}/${datetime['day']}`;
}

const loopfeeds = () => {
	const articleLink = (title, link, date) => {
		date = restructDate(date);
		return `<a href="${link}" target="_blank"><span class="pubdate">${date}</span>${title}</a>`;
	}
	let tmpurl;
	for (feed of feedlist) {
		const feedUri = feed;
		fetch(feed)
			.then(response => response.text())
			.then(string => new window.DOMParser().parseFromString(string, 'text/xml'))
			.then(data => {
				let loopfeedsHtml = ``;
				const feedTitle = data.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
				loopfeedsHtml += `<h2>${feedTitle}</h2>`;
				let items = data.querySelectorAll('item');
				if (items.length > 0) {
					tmpurl = feed;
					const firstItemDate = items[0].querySelector('pubDate').innerHTML;
					count = 0;
					if (
						firstItemDate.indexOf(currentYear, firstItemDate) !== -1
						||
						firstItemDate.indexOf(currentYear - 1, firstItemDate) !== -1
					) {
						items.forEach(item => {
							if (count < 5) {
								let itemDate = item.querySelector('pubDate').innerHTML;
								if (
									itemDate.indexOf(currentYear, itemDate) !== -1
									|| itemDate.indexOf((currentYear - 1), itemDate) !== -1
								) {
									count += 1;
									let pubDate = item.querySelector('pubDate').innerHTML;
									let title = item.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
									let link = item.querySelector('link').innerHTML;
									loopfeedsHtml += articleLink(title, link, pubDate);
								}
							}
						});
					}
					else loopfeedsHtml += `All old, time to clean up? See: ${feedUri}`;
				}
				items = data.querySelectorAll('entry');
				if (items.length > 0) {
					const firstItemDate = items[0].querySelector('updated').innerHTML;
					count = 0;

					if (firstItemDate.indexOf(currentYear, firstItemDate) !== -1) {
						items.forEach(item => {
							if (count < 5) {
								let itemDate = item.querySelector('updated').innerHTML;
								if (
									itemDate.indexOf(currentYear, itemDate) !== -1
									|| itemDate.indexOf((currentYear - 1), itemDate) !== -1
								) {
									count += 1;
									let pubDate = item.querySelector('updated').innerHTML;
									let title = item.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
									let link = item.querySelector('link').innerHTML;
									loopfeedsHtml += articleLink(title, link, pubDate);
								}
							}
						});
					}
					if (count === 0) loopfeedsHtml += `All old, time to clean up? See: ${feedUri}`;
				}
				document.getElementById('rss').innerHTML += loopfeedsHtml;
			})
			.catch(console.error)
			;
	}
}
loopfeeds(feedlist);
