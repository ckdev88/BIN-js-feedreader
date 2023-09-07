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

const loopfeeds = () => {
	const articleLink = (title, link, date) => {
		return `<a href="${link}" target="_blank">${title} <span class="pubdate">${date}</span></a>`;
	}
	for (feed of feedlist) {
		fetch(feed)
			.then(response => response.text())
			.then(string => new window.DOMParser().parseFromString(string, 'text/xml'))
			.then(data => {
				let loopfeedsHtml = ``;
				let feedTitle = data.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
				loopfeedsHtml += `<h2>${feedTitle}</h2>`;
				let items = data.querySelectorAll('item');

				if (items.length > 0) {
					count = 0;
					items.forEach(item => {
						if (count < 5) {
							count += 1;
							let pubDate = item.querySelector('pubDate').innerHTML;
							let title = item.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
							let link = item.querySelector('link').innerHTML;
							loopfeedsHtml += articleLink(title, link, pubDate);
						}
					});
				}
				items = data.querySelectorAll('entry');
				if (items.length > 0) {
					count = 0;
					items.forEach(item => {
						if (count < 5) {
							count += 1;
							let pubDate = item.querySelector('updated').innerHTML;
							let title = item.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
							let link = item.querySelector('link').innerHTML;
							loopfeedsHtml += articleLink(title, link, pubDate);
						}
					});
				}
				document.getElementById('rss').innerHTML += loopfeedsHtml;
			})
			.catch(console.error)
			;
	}
}
loopfeeds(feedlist);
