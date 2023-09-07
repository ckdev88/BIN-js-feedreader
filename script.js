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
console.log(feedlist);

const timeElapsed = Date.now();
const today = new Date(timeElapsed);
console.log('Nu:', today.toUTCString());

const loopfeeds = () => {
	console.log('looping feeds');
	for (feed of feedlist) {

		fetch(feed)
			.then(response => response.text())
			.then(string => new window.DOMParser().parseFromString(string, 'text/xml'))
			.then(data => {
				let loopfeedsHtml = ``;
				let feedTitle = data.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
				loopfeedsHtml += `<h2>${feedTitle}</h2>`;
				let items = data.querySelectorAll('item');
				console.log('itemslength:', items.length);

				if (items.length > 0) {
					count = 0;
					items.forEach(item => {
						count += 1;
						if (count < 3) {
							let pubDate = item.querySelector('pubDate').innerHTML;
							let title = item.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
							let link = item.querySelector('link').innerHTML;
							loopfeedsHtml += `<a href="${link}" target="_blank">${title} <span class="pubdate">${pubDate}</span></a>`;
						}
					});
				}
				let entries = data.querySelectorAll('entry');
				console.log('entrieslength:', entries.length);
				if (entries.length > 0) {
					count = 0;
					entries.forEach(entry => {
						console.log(entry);
						count += 1;
						if (count < 3) {
							let pubDate = entry.querySelector('updated').innerHTML;
							let title = entry.querySelector('title').innerHTML.replace('<![CDATA[', '').replace(']]>', '');
							let link = entry.querySelector('link').innerHTML;
							loopfeedsHtml += `<a href="${link}" target="_blank">${title} <span class="pubdate">${pubDate}</span></a>`;
						}
						console.log(entry.querySelector('title').innerHTML);
					});
				}
				const rss = document.getElementById('rss');
				rss.innerHTML += loopfeedsHtml;
				console.log('-----------------------end----------------------');
			})
			.catch(console.error)
			;
	}


}
loopfeeds(feedlist);
