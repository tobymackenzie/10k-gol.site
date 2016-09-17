<?php
namespace TJM\Life10k;

class Cell{
	protected $alive;
	public function __construct($alive){
		$this->alive = $alive;
	}
	public function getVariant(){
		return mt_rand(0, 5);
	}
	public function isAlive(){
		return $this->alive;
	}
	public function switchAliveState(){
		$this->alive = !$this->alive;
	}
}
