(function(_d){
	//--lazy load css into cache if we have no cache yet.  Means it should be there on next load but we don't have to wait for it on this load
	//-@ based on https://github.com/filamentgroup/loadCSS/
	var _cacheCSS = function(_href, _media, _neighbor){
		var _link = _d.createElement('link');
		if(!_neighbor){
			_neighbor = _d.getElementsByTagName('script')[0];
		}
		_link.rel = 'stylesheet';
		_link.href = _href;
		_link.media = 'only x';
		_neighbor.parentNode.insertBefore(_link, _neighbor);
	};
	setTimeout(function(){
		_cacheCSS(TJM.baseUrl + '/main.css?v=' + TJM.v);
	}, 200);
})(window.document);
