<div class="main-text"><?php
	?><h1>Project Info</h1><?php
	?><p>This project is built by <a href="https://www.tobymackenzie.com/">Toby Mackenzie</a>.  Toby is a quiet <abbr title="Linux Apache MySQL PHP">LAMP</abbr> full-stack web developer from Northeast Ohio.  He works for <a href="https://cogneato.com/">Cogneato</a> in Akron on many websites.</p><?php
	?><p>This project is built for the <a href="https://a-k-apart.com/">10k Apart Challenge</a>.  It is a progressively-enhanced web implementation of <a href="<?=$this->getRelativeUrlBase()?>/info/">Conway's Game of Life</a>.  All basic functionality works without JS or CSS</p><?php
	?><p>Toby encountered the game at a <a href="http://coderetreat.org/">Code Retreat event</a> and has been interesting in making a web-based version ever since.  This challenge provided the perfect opportunity.  The code for this project can be found in <a href="https://github.com/tobymackenzie/site-10k-gol">it's GitHub repo</a>.</p><?php
	?><h2>Development highlights</h2><?php
	?><ul><?php
		?><li>game implemented on both server and client so it can work for no-js browsers but work faster if js available.</li><?php
		?><li>grid consists of 'X's and 'O's for text browsers.</li><?php
		?><li>CSS inlined on first load for fast render, external sheet lazy loaded.  Cookie sent from server switches inline CSS to `&lt;link&gt;` for smaller transfer on subsequent visits.</li><?php
		?><li>JS runs back to IE 8.</li><?php
		?><li>`:target` shows settings panel without js.  clickable screen overlay hides it without link on panel.</li><?php
	?></ul><?php
?></div>
