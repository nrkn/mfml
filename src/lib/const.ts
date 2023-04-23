export const defaultGameHtml = `<section id="start">
<h1>Boring Game - Make it better please!</h1>
<p>You are in a room.</p>
<p>There is a door to the north.</p>
<p>There is a door to the south.</p>
<ul>
  <li><a href="#north">Go North</a></li>
  <li><a href="#south">Go South</a></li>
</ul>
</section>

<section id="north">
<h1>Boring Game - North Room</h1>
<p>You are in the north room.</p>
<p>There is a door to the south.</p>
<ul>
  <li><a href="#start">Go South</a></li>
</ul>
</section>

<section id="south">
<h1>Boring Game - South Room</h1>
<p>You are in the south room.</p>
<p>There is a door to the north.</p>
<ul>
  <li><a href="#start">Go North</a></li>
</ul>
</section>
`

export const defaultDocHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}}</title>
    <link rel="stylesheet" href="/player.css">
  </head>
  <body>
    <template>{{html}}</template>
    <script src="/player.js" defer></script>
  </body>
</html>
`