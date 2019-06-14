define([], function() {

    return {
        navigation: {
            resolveUrl: function inject(app) {
                return new Promise(function(resolve, reject){
                    app.services.moduleSystem.import('./pages/latest/index.jst#default').then(function(r) { debugger; resolve(r), reject});
                });
            }
        },

        resolve: function transform(args) {
            var app = this;
            return new Promise(function(r,f ) { 
                app.services.moduleSystem.import.call(app.services.moduleSystem,'./pages/latest/' + (args[0] || "index") +'.json#default').then(function (o) {debugger; r(o);}, f);
            });

        },

        leftnav: function transform(args) {
            var app = this;
            //return new Promise(function(r,f ) { 
                //debugger;
                return ["aside", {"className": "fd-side"}, JSON.stringify(args)];
            //});

        }
    };
});