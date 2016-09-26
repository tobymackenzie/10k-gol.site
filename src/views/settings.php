<div class="pane" id="settings"><?php
	?><form class="gridSettings"><?php
		?><h2>Grid Settings</h2><?php
		?><p>Run through iterations looking for patterns.  See how different seeds affect the patterns.  Larger grids can be more interesting, but slower to run.</p><?php
		?><div class="field"><?php
			?><label>
				<span class="fieldLabel">Seed</span>
				<input name="seed" type="text" value="<?=$game->getSeed()?>" />
			</label>
			<span class="fieldDetail">(affects starting set-up)</span><?php
		?></div><?php
		?><div class="field"><?php
			?><label>
				<span class="fieldLabel">Rows</span>
				<input min="1" name="rows" type="number" value="<?=$game->getRowCount()?>" />
			</label><?php
		?></div><?php
		?><div class="field"><?php
			?><label><?php
				?><span class="fieldLabel">Columns</span>
				<input min="1" name="columns" type="number" value="<?=$game->getColumnCount()?>" /><?php
			?></label><?php
		?></div><?php
		?><div class="field"><?php
			?><label>
				<span class="fieldLabel">Tick</span>
				<input min="1" name="tick" type="number" value="<?=$game->getTick()?>" />
			</label>
			<span class="fieldDetail">(iterations or generations the game has run)</span><?php
		?></div><?php
		?><div class="formSubmit"><button type="submit">Change</button></div><?php
	?></form><?php
	/*?><a href="#">Back</a><?php*/
?></div>
