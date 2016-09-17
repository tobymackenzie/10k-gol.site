<div class="main-text"><?php
	?><h1>Game Info</h1><?php
	?><p>Conway's Game of Life is not a game that's playable per-se, but more of a mathematical game or simple simulation.  It consists of a grid of "cells" that can be alive or dead.  An initial pattern of cells is set up, called the seed.  Time is then incremented through a series of generations or ticks.  Specific rules define what happens to each cell based on its neighbors at each tick.  Neighbors are directly adjacent in eight directions.  The rules:</p><?php
	?><ul><?php
		?><li>Alive cells with less than two neighbors die of under-population</li><?php
		?><li>Alive cells with more than three neighbors die of over-population</li><?php
		?><li>Dead cells with three neighbors become alive, replaced by reproduction</li><?php
		?><li>Other cells remain as they were</li><?php
	?></ul><?php
	?><p>Various patterns can appear on the grid.  Run through many iterations and look for patterns in the cells.</p><?php
	?><p>The game makes for a good simple programming exercise.  As such, it is used for <a href="http://coderetreat.org/">Code Retreat</a>, an annual day-long event of programming practice.  It helps develop or hone skills, particularly focusing on software development and design fundamentals, modularity, and object-orientation.</p><?php
	?><p><a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">More info on the game at Wikipedia</a></p><?php
?></div>
