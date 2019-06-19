'use strict';
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	typeof window === 'object' ? 
	function () {
		var cdn = factory();
		var scripts = [ cdn['@appfibre']+'/webapp-systemjs-polyfill.js'
					  , cdn['@cdnjs']+'/react/16.8.6/umd/react.development.js'
					  , cdn['@cdnjs']+'/react-dom/16.8.6/umd/react-dom.development.js'
					  , cdn['@appfibre']+'/webapp-systemjs.js'
					  ].map(function(src) { var s = document.createElement('script'); s.src = src; return s; });
		function ph1() { document.head.appendChild(scripts[1]); document.head.appendChild(scripts[2]);  }
		function ph2() { if (window.React && window.ReactDOM) document.head.appendChild(scripts[3]); };
		function ph3() { System.import('/index.json').then(function (a) { a.default.run(); }); }
		scripts[0].onload = ph1;
		scripts[1].onload = scripts[2].onload = ph2;
		scripts[3].onload = ph3;
		(window.Set && Object.assign && window.Promise) ? ph1() : document.head.appendChild(scripts[0]); 

	}() : (global.cdn = factory());
}(this, (function () { 'use strict';
    return 	{ "@cdnjs": location.hostname === "localhost" ? "http://localhost/cdn/cdnjs" : "https://cdnjs.cloudflare.com/ajax/libs"
    		, "@appfibre": location.hostname === "localhost" ? "http://localhost/cdn/appfibre" : "https://unpkg.com/@appfibre"
			};
})));


