<?php
use TJM\Life10k\Game;
require_once(__DIR__ . '/../../vendor/autoload.php');

//--set up args
$columns = $rows = $seed = null;
$tick = 1;
$currentFlag = null;
foreach($argv as $arg){
	if($currentFlag){
		switch($currentFlag){
			case 'c':
			case 'columns':
				$columns = (int) $arg;
			break;
			case 'r':
			case 'rows':
				$rows = (int) $arg;
			break;
			case 's':
			case 'seed':
				$seed = $arg;
			break;
		}
		$currentFlag = null;
	}else{
		if(substr($arg, 0, 1) === '-'){
			$currentFlag = preg_replace('/^[-]+/', '', $arg);
		}else{
			$tick = (int) $arg;
		}
	}
}

//--run game
$game = new Game($rows, $columns, $seed);
$game->tickTo($tick);

//--output
for($iRow = 1; $iRow <= $game->getRowCount(); ++$iRow){
	for($iColumn = 1; $iColumn <= $game->getColumnCount(); ++$iColumn){
		echo ($game->getCell($iRow, $iColumn)->isAlive() ? 'O' : 'X') . ' ';
	}
	echo "\n";
}
