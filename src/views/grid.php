<table id="grid"><?php
	?><thead><?php
		?><tr><?php
			?><th scope="col">Rows</th><?php
for($c = 1; $c <= $game->getColumnCount(); ++$c){
			?><th scope="col">C<?=$c?></th><?php
}
		?></tr><?php
	?></thead><?php
	?><tbody><?php
for($r = 1; $r <= $game->getRowCount(); ++$r){
		?><tr><?php
			?><th scope="row">R<?=$r?></th><?php
	for($c = 1; $c <= $game->getColumnCount(); ++$c){
		$cell = $game->getCell($r, $c);
		$alive = $cell->isAlive();
			?><td class="c<?=($cell->getVariant() ? ' c' . $cell->getVariant() : '')?> <?=($alive ? 'alive' : 'dead')?>"><abbr title="<?=($alive ? 'alive' : 'dead')?>"><b><?=($alive ? 'O' : 'X')?></b></abbr></td><?php
	}
		?></tr><?php
}
	?></tbody><?php
?></table><?php
