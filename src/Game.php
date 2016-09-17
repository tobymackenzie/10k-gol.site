<?php
namespace TJM\Life10k;
use Exception;
use TJM\Life10k\Cell;

class Game{
	const DEFAULT_COLUMNS = 20;
	const DEFAULT_ROWS = 20;
	const DEFAULT_SEED = 'XOXXOOXOX';
	const DEFAULT_TICK = 1;

	protected $cells = Array();
	protected $columns = self::DEFAULT_COLUMNS;
	protected $rows = self::DEFAULT_ROWS;
	protected $seed = self::DEFAULT_SEED;
	protected $tick = self::DEFAULT_TICK;

	public function __construct($rows = null, $columns = null, $seed = null){
		if($rows){
			$this->rows = (int) $rows;
		}
		if($columns){
			$this->columns = (int) $columns;
		}
		if($seed){
			$this->seed = $seed;
		}
		$seedEnd = strlen($this->seed) - 1;
		$iSeed = 0;
		for($row = 1; $row <= $this->rows; ++$row){
			for($column = 1; $column <= $this->columns; ++$column){
				$alive = $this->isSeedCharAlive($this->seed[$iSeed]);
				$this->cells[$row . '-' . $column] = new Cell($alive);
				if($iSeed >= $seedEnd){
					$iSeed = 0;
				}else{
					++$iSeed;
				}
			}
		}
	}
	public function getAliveNeighborCount($row, $column){
		$aliveNeighbors = 0;
		for($nRow = ($row > 1 ? $row - 1 : $row); $nRow <= $row + 1 && $nRow <= $this->rows; ++$nRow){
			for($nColumn = ($column > 1 ? $column - 1 : $column); $nColumn <= $column + 1 && $nColumn <= $this->columns; ++$nColumn){
				if(!($nRow === $row && $nColumn === $column) && $this->getCell($nRow, $nColumn)->isAlive()){
					++$aliveNeighbors;
				}
			}
		}
		return $aliveNeighbors;
	}
	public function getCell($row, $column){
		return $this->cells[$row . '-' . $column];
	}
	public function getCellById($id){
		return $this->cells[$id];
	}
	public function getColumnCount(){
		return $this->columns;
	}
	public function getRowCount(){
		return $this->rows;
	}
	public function getSeed(){
		return $this->seed;
	}
	public function getTick(){
		return $this->tick;
	}
	public function isSeedCharAlive($char){
		switch($char){
			case '0';
			case 'd';
			case 'D';
			case 'x';
			case 'X';
				return false;
			break;
			case '1';
			case 'a';
			case 'A';
			case 'o';
			case 'O';
				return true;
			break;
			default:
				return ord($char) % 2;
			break;
		}
	}
	public function tick($count = 1){
		$cellsNeedingSwitch = Array();
		for($row = 1; $row <= $this->rows; ++$row){
			for($column = 1; $column <= $this->columns; ++$column){
				$cell = $this->getCell($row, $column);
				$aliveNeighbors = $this->getAliveNeighborCount($row, $column);
				$needsSwitch = ($cell->isAlive()
					? ($aliveNeighbors !== 2 && $aliveNeighbors !== 3)
					: ($aliveNeighbors === 3)
				);
				if($needsSwitch){
					$cellsNeedingSwitch[] = $cell;
				}
			}
		}
		foreach($cellsNeedingSwitch as $cell){
			$cell->switchAliveState();
		}
		++$this->tick;
	}
	public function tickTo($to){
		if($to < $this->tick){
			throw new Exception("Game->tickTo(): Can't tick backwards.");
		}else{
			while($this->tick < $to){
				$this->tick();
			}
		}
	}
}
