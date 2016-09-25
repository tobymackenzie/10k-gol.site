(function(_d){
	//--lazy load css into cache if we have no cache yet.  Means it should be there on next load but we don't have to wait for it on this load
	//-@ based on https://github.com/filamentgroup/loadCSS/
	setTimeout(function(){
		var _link = _d.createElement('link');
		var _neighbor = _d.getElementsByTagName('script')[0];
		_link.rel = 'stylesheet';
		_link.href = TJM.baseUrl + '/main.css?v=' + TJM.v;
		_link.media = 'only x';
		_neighbor.parentNode.insertBefore(_link, _neighbor);
	}, 1000);
})(window.document);
