(function(_d){
	//--load js if mustard cut, old browsers won't get extra weight
	//-# mustard cut should match minimum for main.js functionality
	if('querySelectorAll' in _d){
		/*! loadJS: [c]2014 @scottjehl, Filament Group, Inc. Licensed MIT */
		var _loadJS = function(_src, _cb){
			var _ref = _d.getElementsByTagName('script')[0];
			var _script = _d.createElement('script');
			_script.src = _src;
			_script.async = true;
			_ref.parentNode.insertBefore(_script, _ref);
			if(_cb && typeof(_cb) === 'function') {
				_script.onload = _cb;
			}
			return _script;
		};
		_loadJS(TJM.baseUrl + '/main.js');
	}
})(window.document);
