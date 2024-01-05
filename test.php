<html><head>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>



</head><body>

<h1>Test feed</h1>
<script>
// const RSS_URL = `https://hidde.blog/feed`; // werkt
const RSS_URL = `https://davidwalsh.name/feed`;

fetch(RSS_URL)
  .then(response => response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    console.log(data);
    const items = data.querySelectorAll("item");
    let html = ``;
    items.forEach(el => {
      html += `
        <article>
          <h2>
            <a href="${el.querySelector("link").innerHTML}" target="_blank" rel="noopener">
              ${el.querySelector("title").innerHTML}
            </a>
          </h2>
        </article>
      `;
    });
    document.body.insertAdjacentHTML("beforeend", html);
  });
</script>
</body></html>
