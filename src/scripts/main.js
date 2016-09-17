(function(_w, _d, undefined){
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
			//-@ http://stackoverflow.com/a/29751897/1139122
			,hasClass: (_supportsClassList
				? function(_el, _class){
					return _el.classList.contains(_class);
				}
				: function(_el, _class){
					return new RegExp('\\b' + _class).exec(_el.className);
				}
			)
			,removeClass: (_supportsClassList
				? function(_el, _class){
					_el.classList.remove(_class);
				}
				: function(_el, _class){
					_el.className = _el.className.replace(new RegExp('\\b' + _class, 'g'), '');
				}
			)
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
					_self.previousAction.addEventListener('click', function(_event){
						if(_self._previousTickDiff.length){
							_event.preventDefault();
							_self.decrementTick();
						}
					});
					_self.nextAction = _self.controlsEl.querySelector('.nextTick');
					_self.nextAction.addEventListener('click', function(_event){
						_event.preventDefault();
						_self.incrementTick();
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
				}
				,columns: undefined
				,controlsEl: undefined
				,el: undefined
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
				,gridEl: undefined
				,getCell: function(_row, _column){
					return this.grid[_row][_column];
				}
				,grid: undefined
				,nextAction: undefined
				,previousAction: undefined
				,rows: undefined
				,tick: undefined
				,tickCountEl: undefined

				//--ticking
				,_previousTickDiff: undefined
				,_applyTickDiff: function(_diff){
					for(var _iCells = 0; _iCells < _diff.length; ++_iCells){
						_diff[_iCells].switchAlive();
					}
				}
				,setTick: function(_value){
					this.tick = _value;
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
							setTimeout(function(){
								_self.isTicking = false;
							}, 200);
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

						//--attempt to make time for animation
						setTimeout(function(){
							_self.isTicking = false;
						}, 200);
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
				,abbrEl: undefined
				,alive: undefined
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
				,el: undefined
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

})(window, window.document);
