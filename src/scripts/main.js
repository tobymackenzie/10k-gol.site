(function(_w, _d, _u){
	//--safe, short console log for dev.  dropped by build if not used
	var clog = function(){
		if(_w.console && _w.console.log){
			_w.console.log.apply(_w.console, arguments);
		}
	};

	//--extend
	var __extend = function mergeInto(){
		var _args = arguments;
		var _object = _args[0];
		for(var _iArgs = 1; _iArgs < _args.length; ++_iArgs){
			for(var _iObject in _args[_iArgs]){
				if(_args[_iArgs].hasOwnProperty(_iObject)){
					_object[_iObject] = _args[_iArgs][_iObject];
				}
			}
		}
		return _object;
	};

	var __Els = (function(_body){
		var _supportsClassList = 'classList' in _d.body;
		return {
			addClass: (_supportsClassList
				? function(_el, _class){
					_el.classList.add(_class);
				}
				: function(_el, _class){
					if(!this.hasClass(_el, _class)){
						_el.className += ' ' + _class;
					}
				}
			)
			,addListener:  (function(){
				return (_d.addEventListener && function(_elm, _name, _cb, _capt){
						_elm.addEventListener(_name, _cb, _capt || false/*-# ff6- */);
					}) //-# must use pass through for `addEventListener()` because IE can't use `Element`'s implementation for `window`
					|| (_d.attachEvent && function(_elm, _name, _cb){
						_elm.attachEvent('on' + _name, _cb);
					})
					|| function(_elm, _name, _cb){
						_elm['on' + _name] = _cb;
					}
				;
			})()
			//-@ http://stackoverflow.com/a/29751897/1139122
			,hasClass: (_supportsClassList
				? function(_el, _class){
					return _el.classList.contains(_class);
				}
				: function(_el, _class){
					return new RegExp('\\b' + _class).exec(_el.className);
				}
			)
			,isEventModified: function(_event){
				return !!(_event.ctrlKey || _event.metaKey || _event.altKey || _event.shiftKey);
			}
			,preventDefault: function(_event){
				//if(!_event){
				//	_event = _w.event;
				//}
				if(_event.preventDefault){
					_event.preventDefault();
				}else{
					_event.returnValue = false;
				}
			}
			,removeClass: (_supportsClassList
				? function(_el, _class){
					_el.classList.remove(_class);
				}
				: function(_el, _class){
					_el.className = _el.className.replace(new RegExp('\\b' + _class, 'g'), '');
				}
			)
			,removeListener:  (function(){
				var _nativeRemoveListener = _d.removeEventListener || (_d.detachEvent && function(_name, _cb){ this.detachEvent('on' + _name, _cb); }) || function(_name, _cb){
					if(this['on' + _name] === _cb){
						this['on' + _name] = _u;
					}
				};
				return function(_elm, _name, _cb, _capt){
					return _nativeRemoveListener.call(_elm, _name, _cb, _capt || false/*-# ff6- */);
				};
			})()
		};
	})(_d.body);

	//--classes
	var __Classes = {
		baseClass: function(_opts){
			//--merge options into this
			if(typeof _opts === 'object'){
				__extend(this, _opts);
			}
		}
		,create: function(_opts){
			if(!_opts){
				_opts = {};
			}
			if(!_opts._parent){
				_opts._parent = this.baseClass;
			}
			var _class = function(){
				if(this instanceof _class){
					if(_opts._init){
						_opts._init.apply(this, arguments);
					}else{
						_opts._parent.apply(this, arguments);
					}
				}
			};
			__extend(_class.prototype, _opts);
			return _class;
		}
	};

	//--game
	(function(){
		if('querySelectorAll' in _d){
			var _Game = __Classes.create({
				_init: function(){
					var _self = this;
					_self._parent.apply(_self, arguments);
					this._previousTickDiff = [];
					if(!_self.grid && _self.gridEl){
						_self.grid = [];
						var _rowEls = _self.gridEl.querySelectorAll('tbody tr');
						if(!_self.rows){
							_self.rows = _rowEls.length;
						}
						for(var _iRows = 0; _iRows < _rowEls.length; ++_iRows){
							var _rowCells = [];
							var _rowCellEls = _rowEls[_iRows].querySelectorAll('.c');
							if(!_self.columns){
								_self.columns = _rowCellEls.length;
							}
							for(var _iCells = 0; _iCells < _rowCellEls.length; ++_iCells){
								_rowCells.push(new _Cell({
									el: _rowCellEls[_iCells]
								}));
							}
							_self.grid.push(_rowCells);
						}
					}

					//--set up controls
					if(!_self.controlsEl){
						_self.controlsEl = _d.querySelector('.gameControls');
					}
					_self.previousAction = _self.controlsEl.querySelector('.previousTick');
					__Els.addListener(_self.previousAction, 'click', function(_event){
						if(_self._previousTickDiff.length && !__Els.isEventModified(_event)){
							__Els.preventDefault(_event);
							_self.decrementTick();
						}
					});
					_self.nextAction = _self.controlsEl.querySelector('.nextTick');
					__Els.addListener(_self.nextAction, 'click', function(_event){
						if(!__Els.isEventModified(_event)){
							__Els.preventDefault(_event);
							_self.incrementTick();
						}
					});

					//--determine tick
					if(!_self.tick){
						_self.tick = (_self.el.getAttribute('data-tick')
							? parseInt(_self.el.getAttribute('data-tick'), 10)
							: 1
						);
					}

					//--other els
					if(!_self.tickCountEl){
						_self.tickCountEl = this.el.querySelector('.tickCount b');
					}
					if(!_self.playEl){
						var _playLiEl = _d.createElement('li');
						_playLiEl.innerHTML = '<button class="playA">Play</button> '; //-# trailing whitespace since `insertBefore` doesn't add one outside the `li`
						_self.playEl = _playLiEl.querySelector('button');
						//--only add if we're not hovering the controls, so user is less likely to be trying to press something
						//-@ http://stackoverflow.com/a/14800287/1139122
						var _addPlayEl = function(){
							var _controlsEl = _self.controlsEl;
							if(_controlsEl.parentNode.querySelector(':hover') === _controlsEl || _controlsEl.querySelector(':hover')){
								setTimeout(function(){ _addPlayEl(); }, 100);
							}else{
								_controlsEl.insertBefore(_playLiEl, _controlsEl.querySelectorAll('li')[0]);
							}
						};
						_addPlayEl();
					}
					if(_self.playEl){
						__Els.addListener(_self.playEl, 'click', function(){
							_self.togglePlay();
						});
						_self.el.setAttribute('data-playing', 'stopped');
					}
				}
				,columns: _u
				,controlsEl: _u
				,el: _u
				,getAliveNeighborCount: function(_row, _column){
					var _count = 0;
					for(var _iRow = (_row > 0 ? _row - 1 : _row); _iRow <= _row + 1 && _iRow < this.rows; ++_iRow
					){
						for(var _iColumn = (_column > 0 ? _column - 1 : _column); _iColumn <= _column + 1 && _iColumn < this.columns; ++_iColumn){
							if(!(_iRow === _row && _iColumn === _column) && this.getCell(_iRow, _iColumn).alive){
								++_count;
							}
						}
					}
					return _count;
				}
				,gridEl: _u
				,getCell: function(_row, _column){
					return this.grid[_row][_column];
				}
				,grid: _u
				,nextAction: _u
				,previousAction: _u
				,rows: _u
				,tick: _u
				,tickCountEl: _u

				//--play
				,interval: 200 //-# seems to be a good comfortable spot between looking cool and being able to tell what's going on
				,isPlaying: false
				,playEl: _u
				,togglePlay: function(){
					var _self = this;
					if(_self.isPlaying){
						_self.el.setAttribute('data-playing', 'stopped');
						_self.playEl.innerHTML = 'Play';
						if(_self._timeout){
							_w.clearTimeout(_self._timeout);
						}
						_self.isPlaying = false;
					}else{
						_self.el.setAttribute('data-playing', 'playing');
						_self.playEl.innerHTML = 'Stop';
						var _play = function(){
							_self.incrementTick();
							//-# repeatedly set timeout instead of use interval so we can't tick faster than the browser can carry out tick increment logic
							_self._timeout = _w.setTimeout(_play, _self.interval);
						};
						_play();
						_self.isPlaying = true;
					}
				}
				,_timeout: _u

				//--ticking
				,_previousTickDiff: _u
				,_applyTickDiff: function(_diff){
					for(var _iCells = 0; _iCells < _diff.length; ++_iCells){
						_diff[_iCells].switchAlive();
					}
				}
				,setTick: function(_value){
					this.tick = _w.parseInt(_value, 10);
					if(this.tickCountEl){
						this.tickCountEl.innerHTML = this.tick;
					}
				}
				,decrementTick: function(){
					var _self = this;
					if(!_self.isTicking){
						if(_self._previousTickDiff.length){
							_self.isTicking = true;
							_self._applyTickDiff(_self._previousTickDiff.pop());
							_self.setTick(_self.tick - 1);
							_self.isTicking = false;
						}else{
							//-!!! should just send back via server side refresh, handled by listener currently
							alert('There are no more previous ticks.');
						}
					}
				}
				,incrementTick: function(){
					var _self = this;
					if(!_self.isTicking){
						_self.isTicking = true;
						var _cellsNeedingSwitch = [];
						for(var _iRow = 0; _iRow < _self.rows; ++_iRow){
							for(var _iColumn = 0; _iColumn < _self.columns; ++_iColumn){
								var _cell = _self.getCell(_iRow, _iColumn);
								var _aliveNeighborCount = _self.getAliveNeighborCount(_iRow, _iColumn);
								if(
									(_cell.alive
										? _aliveNeighborCount !== 2 && _aliveNeighborCount !== 3
										: _aliveNeighborCount === 3
									)
								){
									_cellsNeedingSwitch.push(_cell);
								}
							}
						}
						_self._applyTickDiff(_cellsNeedingSwitch);
						_self._previousTickDiff.push(_cellsNeedingSwitch);
						_self.setTick(_self.tick + 1);
						_self.isTicking = false;
					}
				}
				,isTicking: false
			});
			var _Cell = __Classes.create({
				_init: function(){
					this._parent.apply(this, arguments);
					if(typeof this.alive === 'undefined' && this.el){
						this.alive = __Els.hasClass(this.el, 'alive');
					}
					if(this.el && !this.abbrEl){
						this.abbrEl = this.el.querySelector('abbr');
					}
				}
				,abbrEl: _u
				,alive: _u
				,setAlive: function(_state){
					if(_state !== this.alive){
						this.alive = _state;
						if(this.el){
							if(_state){
								__Els.addClass(this.el, 'alive');
								__Els.removeClass(this.el, 'dead');
								if(this.abbrEl){
									this.abbrEl.title = 'alive';
									this.abbrEl.innerHTML = 'O';
								}
							}else{
								__Els.removeClass(this.el, 'alive');
								__Els.addClass(this.el, 'dead');
								if(this.abbrEl){
									this.abbrEl.title = 'dead';
									this.abbrEl.innerHTML = 'X';
								}
							}
						}
					}
				}
				,switchAlive: function(){
					return this.setAlive(!this.alive);
				}
				,el: _u
			});

			//--init
			var _gameEl = _d.querySelector('.game');
			if(_gameEl){
				var _game = new _Game({
					el: _gameEl
					,gridEl: _d.getElementById('grid')
				});
			}
		}
	})();

	//--pane
	(function(){
		if('querySelectorAll' in _d && 'onhashchange' in _w){
			var _Panes = __Classes.create({
				_init: function(){
					var _self = this;
					_self._parent.apply(_self, arguments);
					__Els.addListener(_w, 'hashchange', function(){
						_self.checkHash();
					});
					_self.checkHash();
				}
				//--attach escape listener when pane is open
				,checkHash: function(){
					var _self = this;
					var _hash = _w.location.hash.replace(/^#/,'');
					if(_hash){
						//--make sure hash matches a pane
						var _found = false;
						for(var _iEls = 0; _iEls < _self.els.length; ++_iEls){
							if(_self.els[_iEls].id === _hash){
								_found = true;
							}
						}
						if(_found){
							_self.isOpen = _self.isListeningForEscape = true;
							__Els.addListener(_d.body, 'keyup', _self.getEscapeListener());
						}else{
							_self.close();
						}
					}else{
						_self.close();
					}
				}
				,close: function(){
					var _self = this;
					if(_self.isOpen){
						_self.isOpen = false;
						_w.location.hash = '#';
					}
					if(_self.isListeningForEscape && _self._escapeListener){
						_self.isListeningForEscape = false;
						__Els.removeListener(_d.body, 'keyup', _self._escapeListener);
					}
				}
				,els: _u
				,_escapeListener: _u
				,getEscapeListener: function(){
					var _self = this;
					if(!_self._escapeListener){
						//--close on press of escape key
						_self._escapeListener = function(_event){
							var _escape = false;
							if('key' in _event){
								_escape = (_event.key === 'Escape' || _event.key === 'Esc');
							}else{
								_escape = _event.keyCode === 27;
							}
							if(_escape){
								_self.close();
							}
						};
					}
					return _self._escapeListener;
				}
				,isOpen: false
				,isListeningForEscape: false
			});

			//--init
			var _paneEls = _d.querySelectorAll('.pane');
			if(_paneEls && _paneEls.length){
				new _Panes({
					els: _paneEls
				});
			}
		}
	})();

})(window, window.document);
