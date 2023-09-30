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
const dateFilters = ['+0000', '00:00:00', 'TZ', 'GMT', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ','];

function cleanUglyDate(datetime) {
	dateFilters.forEach(replacethem);
	function replacethem(item) {
		datetime = datetime.replace(item, '');
	}
	return datetime;
}

const loopfeeds = () => {
	const articleLink = (title, link, date) => {
		date = cleanUglyDate(date);
		return `<a href="${link}" target="_blank">${title} <span class="pubdate">${date} - ${currentYear}</span></a>`;
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
						firstItemDate.indexOf(currentYear, firstItemDate) >= 0
						||
						firstItemDate.indexOf(currentYear - 1, firstItemDate) >= 0
					) {
						items.forEach(item => {
							if (count < 5) {
								let itemDate = item.querySelector('pubDate').innerHTML;
								if (
									itemDate.indexOf(currentYear, itemDate) > -1
									|| itemDate.indexOf((currentYear - 1), itemDate) > -1
								) {
									count += 1;
									let pubDate = cleanUglyDate(item.querySelector('pubDate').innerHTML);
									let title = item.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
									let link = item.querySelector('link').innerHTML;
									loopfeedsHtml += articleLink(title, link, pubDate);
								}
							}
						});
					}
					else loopfeedsHtml += `${feedTitle} is all old, time to clean up? Source: ${feedUri}`;
				}
				items = data.querySelectorAll('entry');
				if (items.length > 0) {
					const firstItemDate = items[0].querySelector('updated').innerHTML;
					count = 0;

					if (firstItemDate.indexOf(currentYear, firstItemDate) >= 0) {
						items.forEach(item => {
							if (count < 5) {
								if (
									itemDate.indexOf(currentYear, itemDate) > -1
									|| itemDate.indexOf((currentYear - 1), itemDate) > -1
								) {
									count += 1;
									let pubDate = cleanUglyDate(item.querySelector('updated').innerHTML);
									let title = item.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
									let link = item.querySelector('link').innerHTML;
									loopfeedsHtml += articleLink(title, link, pubDate);
								}
							}
						});
					}
					if (count === 0) loopfeedsHtml += `${feedTitle} is all old, time to clean up? Source: ${feedUri}`;
				}
				document.getElementById('rss').innerHTML += loopfeedsHtml;
			})
			.catch(console.error)
			;
	}
}
loopfeeds(feedlist);
