<div class="pane" id="settings"><?php
	?><form class="gridSettings"><?php
		?><h2>Grid Settings</h2><?php
		?><div class="field"><?php
			?><label>
				<span class="fieldLabel">Tick</span>
				<input name="tick" type="number" value="<?=$game->getTick()?>" />
			</label>
			<span class="fieldDetail">(iterations or generations the game has run)</span><?php
		?></div><?php
		?><div class="field"><?php
			?><label>
				<span class="fieldLabel">Rows</span>
				<input name="rows" type="number" value="<?=$game->getRowCount()?>" />
			</label><?php
		?></div><?php
		?><div class="field"><?php
			?><label><?php
				?><span class="fieldLabel">Columns</span>
				<input name="columns" type="number" value="<?=$game->getColumnCount()?>" /><?php
			?></label><?php
		?></div><?php
		?><div class="field"><?php
			?><label>
				<span class="fieldLabel">Seed</span>
				<input name="seed" type="text" value="<?=$game->getSeed()?>" />
			</label>
			<span class="fieldDetail">(affects starting set-up)</span><?php
		?></div><?php
		?><div class="formSubmit"><button type="submit">Change</button></div><?php
	?></form><?php
	/*?><a href="#">Back</a><?php*/
?></div>
