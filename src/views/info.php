<div class="main-text"><?php
	?><h1>Game Info</h1><?php
	?><p><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">Conway's Game of Life</a> is not a game that's playable per-se, but more of a mathematical game.  An example of a <a href="https://en.wikipedia.org/wiki/Cellular_automaton">cellular automaton</a>, it is sort of a simple simulation of the life of cells over time.  It consists of a grid of cells that can be alive or dead.  The cells are set up in an initial pattern, called the seed.  Time is then incremented through a series of generations or ticks.  Specific rules define what happens to each cell based on its neighbors at each tick.  Neighbors are directly adjacent in eight directions.  The rules:</p><?php
	?><ul><?php
		?><li>Alive cells with less than two neighbors die of under-population</li><?php
		?><li>Alive cells with more than three neighbors die of over-population</li><?php
		?><li>Dead cells with three neighbors become alive, replaced by reproduction</li><?php
		?><li>Other cells remain as they were</li><?php
	?></ul><?php
	?><p>Various patterns can appear on the grid.  These are studied, and even given names, like glider, block, and beacon.  They can be grouped into categories, such as:</p><?php
	?><ul><?php
		?><li>still lifes: non-moving</li><?php
		?><li>oscillators: move in place</li><?php
		?><li>spaceships: travel across the grid</li><?php
	?></ul><?php
	?><p>The game makes for a good simple programming exercise.  As such, it is used for <a href="http://coderetreat.org/">Code Retreat</a>, an annual day-long event of programming practice.  It helps develop or hone skills, particularly focusing on software development and design fundamentals, modularity, and object-orientation.</p><?php
?></div>
