(function(_w, _d){
	//--load js if mustard cut, old browsers won't get extra weight
	//-# mustard cut should match minimum for main.js functionality
	//-# js is virtually worthless for opera mini, play button bad, so don't load it
	if('querySelectorAll' in _d && !(_w.operamini && ({}).toString.call(_w.operamini) === '[object OperaMini]')){
		/*! loadJS: [c]2014 @scottjehl, Filament Group, Inc. Licensed MIT */
		var _ref = _d.getElementsByTagName('script')[0];
		var _script = _d.createElement('script');
		_script.src = TJM.baseUrl + '/main.js?v=' + TJM.v;
		_script.async = true;
		_ref.parentNode.insertBefore(_script, _ref);
	}
})(window, window.document);
