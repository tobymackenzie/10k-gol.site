<?php
namespace TJM\Life10k;
use TJM\Life10k\Game;

class HTTP{
	protected $assetVersion = 1;
	protected $game;
	protected $hasCache = false;
	protected $query;
	protected $relativeUrlBase;
	protected $route;

	public function __construct($route = null, $query = null){
		$this->query = $query;

		if(isset($route)){
			$this->route = rtrim($route, '/');

			//-!!! this assumes no subdirectory
			$this->relativeUrlBase = '';
		}

		//--determine coookie information
		if(isset($_COOKIE['v']) && (int) $_COOKIE['v'] === $this->assetVersion){
			$this->hasCache = true;
		}
	}
	public function getResponse($route = null, $query = null){
		//--set version cookie if not set, used to affect if inlining css / scripts
		if(!$this->hasCache){
			setcookie('v', $this->assetVersion,  time() + 60 * 60 * 24 * 90, $this->getRelativeUrlBase()); //-- 90 days seems reasonable
		}

		if(!isset($route)){
			$route = $this->route;
		}
		if(!isset($query)){
			$query = $this->query;
		}
		switch(rtrim($route, '/')){
			case '':
				$pageData = $this->getGamePageData($query);
			break;
			case '/dist': //--here for BC
				$this->redirect($this->getRelativeUrlBase());
			break;
			case '/info':
				$pageData = $this->getInfoPageData($query);
			break;
			case '/project':
				$pageData = $this->getProjectPageData($query);
			break;
		}

		return $this->renderShell($pageData);
	}
	public function redirect($url){
		if(substr($url, 0, 1) === '/'){
			$url = $this->getAbsoluteUrlBase() . $url;
		}
		header('Location: ' . $url);
		echo "<a href=\"{$url}\">{$url}</a>";
		exit();
	}

	/*=====
	==views
	=====*/
	public function render($file, $data = null){
		if($data){
			extract($data);
		}
		ob_start();
		require($file);
		$content = ob_get_contents();
		ob_end_clean();
		return $content;
	}
	public function renderShell($data){
		//--defaults
		if(!isset($data['id'])){
			if($this->route){
				$data['id'] = str_replace('/', '-',
					substr($this->route, 1)
				);
			}else{
				$data['id'] = 'game';
			}
		}
		//--main view
		$data['hasCache'] = $this->hasCache;
		$response = $this->render(__DIR__ . '/views/shell.php', $data);
		//---strip extra whitespace
		$response = preg_replace('/\s{2,}/', ' ', $response);

		//--inject loading scripts
		$jsData = Array(
			'baseUrl'=> $this->getRelativeUrlBase()
			,'hasCache'=> $this->hasCache
			,'v'=> $this->assetVersion
		);
		$content = "var TJM = " . json_encode($jsData) . ";"; //--config from PHP
		$content .= file_get_contents(__DIR__ . '/../pre.js');
		if(!$this->hasCache){
			$content .= file_get_contents(__DIR__ . '/../empty-cache.js');
		}
		$response = str_replace('<script><!-- ', "<script><!--\n" . $content . "\n", $response);

		//--inject styles if not in cache
		if(!$this->hasCache){
			$content = file_get_contents(__DIR__ . '/../main.css');
			$response = str_replace('<style><!-- ', "<style><!--\n" . $content . "\n", $response);
		}
		return $response;
	}

	/*=====
	==routing
	=====*/
	public function getGamePageData($data){
		//--create game
		if(!isset($data['game'])){
			$data['game'] = $this->game = new Game(
				(isset($data['rows']) && $data['rows'] ? $data['rows'] : null)
				,(isset($data['columns']) && $data['columns'] ? $data['columns'] : null)
				,(isset($data['seed']) && $data['seed'] ? $data['seed'] : null)
			);
		}

		//--make sure URL is canonical
		$gameUrl = $this->buildGameUrl($data['game']);
		if($gameUrl !== $_SERVER['REQUEST_URI']){
			$this->redirect($gameUrl);
		}

		//--run game
		if(isset($data['tick']) && $data['tick']){
			$this->game->tickTo((int) $data['tick']);
		}

		return Array(
			'content'=> $this->render(__DIR__ . '/views/game.php', $data)
		);
	}
	public function getInfoPageData($data){
		return Array(
			'content'=> $this->render(__DIR__ . '/views/info.php')
			,'title'=> 'Game Info'
		);
	}
	public function getProjectPageData($data){
		return Array(
			'content'=> $this->render(__DIR__ . '/views/project.php')
			,'title'=> 'Project Info'
		);
	}

	/*=====
	==server
	=====*/
	public function buildGameUrl($game = null, $data = Array()){
		if(!$game){
			$game = $this->game;
		}
		$data = array_merge($this->query, Array(
			'columns'=> $game->getColumnCount()
			,'rows'=> $game->getRowCount()
			,'seed'=> $game->getSeed()
		), $data);
		$neededData = Array();
		foreach($data as $key=> $value){
			switch($key){
				case 'columns':
					if((int) $value !== Game::DEFAULT_COLUMNS){
						$neededData[$key] = (int) $value;
					}
				break;
				case 'rows':
					if((int) $value !== Game::DEFAULT_ROWS){
						$neededData[$key] = (int) $value;
					}
				break;
				case 'seed':
					if($value !== Game::DEFAULT_SEED){
						$neededData[$key] = $value;
					}
				break;
				case 'tick':
					if((int) $value !== Game::DEFAULT_TICK){
						$neededData[$key] = (int) $value;
					}
				break;
				default:
					$neededData[$key] = $value;
				break;
			}
		}
		$url = $this->getRelativeUrlBase() . '/';
		if($neededData){
			$url .= '?';
			$query = Array();
			foreach($neededData as $key=> $value){
				if(empty($value)){
					$query[] = "{$key}";
				}else{
					$query[] = "{$key}={$value}";
				}
			}
			$url .= implode('&', $query);
		}
		return $url;
	}
	public function getAbsoluteUrlBase(){
		return (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] ? 'https' : 'http')
			. '://'
			. ($_SERVER['SERVER_NAME'] ? $_SERVER['SERVER_NAME'] : $_SERVER['PWD'])
		;
	}
	public function getAssetUrl($asset){
		return $this->getRelativeUrlBase() . '/' . $asset . '?v=' . $this->assetVersion;
	}
	public function getNextUrl($game = null){
		if(!$game){
			$game = $this->game;
		}
		return $this->buildGameUrl($game, Array('tick'=> $game->getTick() + 1));
	}
	public function getPreviousUrl($game = null){
		if(!$game){
			$game = $this->game;
		}
		return $this->buildGameUrl($game, Array('tick'=> $game->getTick() - 1));
	}
	public function getRelativeUrlBase(){
		return $this->relativeUrlBase;
	}
}
