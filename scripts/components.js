(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    function _extend(obj, props) {
        if (obj == undefined)
            obj = {};
        for (var i in props)
            obj[i] = typeof obj[i] == "object" && typeof props[i] == "object" ? _extend(obj[i], props[i]) : obj[i] || props[i];
        return obj;
    }
    // bulma
    var Navbar = function transform(a, c) {
        a = a || {};
        return ["div",
            _extend({ "className": "navbar " + (a.className || ""), role: "navigation", "area-label": "main navigation" }, a),
            c];
    };
    var NavbarBurger = function transform(a) {
        a = a || {};
        return ["a",
            _extend({ "className": "navbar-burger " + (a.className || ""), "role": "button", "aria-label": "menu", "aria-expanded": "true" }, a),
            [["span", { "areahidden": "true" }], ["span", { "areahidden": "true" }], ["span", { "areahidden": "true" }]]
        ];
    };
    var NavbarMenu = function transform(a, c) {
        a = a || {};
        return ["div",
            _extend({ "className": "navbar-menu " + (a.className || "") }, a),
            c
        ];
    };
    var NavbarStart = function transform(a, c) {
        a = a || {};
        return ["div",
            _extend({ "className": "navbar-start " + (a.className || "") }, a),
            c
        ];
    };
    var NavbarEnd = function transform(a, c) {
        a = a || {};
        return ["div",
            _extend({ "className": "navbar-end " + (a.className || "") }, a),
            c
        ];
    };
    var NavbarItem = function transform(a, c) {
        a = a || {};
        return ["div",
            _extend({ "className": "navbar-item has-dropdown is-hoverable " + (a.className || "") }, a),
            c
        ];
    };
    var NavbarItemLink = function transform(a, c) {
        a = a || {};
        return ["a",
            _extend({ "className": "navbar-item has-dropdown is-hoverable " + (a.className || "") }, a),
            c
        ];
    };
    var NavbarLink = function transform(a, c) {
        a = a || {};
        return ["div",
            _extend({ "className": "navbar-link " + (a.className || "") }, a),
            c
        ];
    };
    var NavbarDropdown = function transform(a, c) {
        a = a || {};
        return ["div",
            _extend({ "className": "navbar-dropdown " + (a.className || "") }, a),
            c
        ];
    };
    /*var CodeMirror = function inject(app) {
        return new Promise(function (r, f) { app.services.moduleSystem.import('./scripts/codemirror.js').then(function(o) { r(o.default)})});
    }*/
    var CodeMirror = function transform(a, c) {
        var app = this;
        return new Promise(function (r, f) { return app.services.moduleSystem["import"]('./scripts/codemirror.js').then(function (o) { return r([o["default"], a, c]); }, function (e) { return r(["div", {}, "Unable to load designer: " + e.stack]); }); });
    };
    exports.CodeMirror = CodeMirror;
    var Designer = function transform(a, c) {
        var app = this;
        return new Promise(function (r, f) { app.services.moduleSystem["import"]('@appfibre/webcomponents-appfibre.cjs.js#Designer').then(function (o) { return r([o["default"], a, c]); }, function (e) { return r(["div", {}, "Unable to load designer: " + e.stack]); }); });
    };
    exports.Designer = Designer;
    var Transformer = function transform(a, c) {
        try {
            return ["pre", {}, this.services.transformer.transform(a.value).code];
        }
        catch (e) {
            return ["pre", { "style": { "color": "red" } }, e.stack || e.message];
        }
    };
    exports.Transformer = Transformer;
    var Bulma = { Navbar: Navbar, NavbarBurger: NavbarBurger, NavbarMenu: NavbarMenu, NavbarStart: NavbarStart, NavbarEnd: NavbarEnd, NavbarItem: NavbarItem, NavbarItemLink: NavbarItemLink, NavbarDropdown: NavbarDropdown, NavbarLink: NavbarLink };
    exports.Bulma = Bulma;
    function visitArray(obj, test) {
        if (Array.isArray(obj)) {
            var out = test(obj) || [];
            if (Array.isArray(obj[2]))
                out[2] = obj[2].map(function (e) { return visitArray(e, test); }).filter(function (e) { return e.length > 0; });
            if (!out[0] && out.length > 0)
                out[0] = 'div';
            return out;
        }
        else
            return test(obj);
    }
    function extractOutline(obj) {
        function test(e) {
            if (e[1] && e[1].className === "fd-bookmark")
                return ["div", e[1], [e[2][0]].concat(e[2].slice(1).map(function (e) { return extractOutline(e /*, test*/); }).filter(function (e) { return e.length > 0; }))];
            else if (Array.isArray(e[2]))
                return [null, null, obj[2].map(function (e) { return extractOutline(e /*, test*/); }).filter(function (e) { return e.length > 0; })];
        }
        if (Array.isArray(obj)) {
            var out = test(obj) || [];
            if (!out[0] && out.length > 0)
                out[0] = 'div';
            return out[2] && out[2].length > 0 ? out : [];
        }
    }
    function findMenu(fullpath, parent) {
        var s = fullpath.indexOf('/');
        var p = fullpath.substr(0, s > -1 ? s : undefined) || '';
        if (parent)
            for (var z = 0; z < parent.length; z++)
                if ((parent[z].name !== undefined ? parent[z].name : parent[z].title) === p)
                    return s > -1 ? findMenu(fullpath.substr(s + 1), parent[z].children) : parent[z];
        return "Could not find " + p + ' within ' + JSON.stringify(parent);
    }
    var Layout = { Menus: function transform(props) {
            var path = this.services.navigation.current.path || '';
            function constructMenus(menuItems, level, maxLevel, parent) {
                var p = parent || '';
                return menuItems.map(function (x, i) {
                    if (x.children && x.children.filter(function (x) { return x.title || x.name; }).length > 0 && level < maxLevel)
                        return ["Bulma.NavbarItem",
                            {} //{ className:  }
                            ,
                            [["span",
                                    { className: "navbar-link" },
                                    [x.content ? ["Navigation.a", { className: "navbar-item" + ((path.substr(0, (x.path || "").length) === x.path) ? " is-active" : ""), href: '?' + p + x.path }, [[path == (p + x.path) ? "em" : "span", {}, x.title || x.name]]]
                                            : [(path.substr(0, (x.path || "").length) === x.path) ? "em" : "span", {}, x.title || x.name]]],
                                ["Bulma.NavbarDropdown", { "className": "is-boxed" }, constructMenus(x.children, level + 1, maxLevel, p + x.path + '/')]
                            ]
                        ];
                    else
                        return ["Navigation.a", { className: "navbar-item" + (path == (p + x.path) ? " is-active" : ""), href: '?' + p + x.path }, [[path == (p + x.path) ? "em" : "span", {}, x.title || x.name]]];
                });
            }
            return ["Bulma.Navbar",
                { "className": "is-transparent", "style": { "margin": "auto", "background": "gray" }, "aria-label": "main navigation" },
                [["div",
                        { className: "navbar-brand" },
                        [["Navigation.a", { className: "navbar-item", style: { font: "16pt Times New Roman" }, href: '/' }, [["i", { style: { "color": "#DFDFDF" } }, "app"], ["i", { style: { "color": "#FFDF00" } }, "f"], ["i", { style: { "color": "#DFDFDF" } }, "ibre"]]],
                            ["Bulma.NavbarBurger", { "className": /*this.state.burgerActive ?*/ false ? 'is-active' : '' /*, onClick: this.burgerClick*/ }],
                            ["Bulma.NavbarMenu", { id: "navbarMain", "className": /*this.state.burgerActive*/ false ? ' is-active' : '' },
                                [["Bulma.NavbarStart", {}, constructMenus(props.value, 0, 1)]
                                    /*, ["Bulma.NavbarEnd",
                                            {},
                                            [["Bulma.NavbarItem",
                                                    {},
                                                    [["Bulma.NavbarLink", {}, [["Label", {}, "Language"]]],
                                                        ["Bulma.NavbarDropdown", {}, languages.map(function (y) { return ["a", { className: "navbar-item " + (Context.state.lang === y.id ? "is-active" : ""), onClick: function () { return Context.setState({ "lang": y.id }); } }, [["Label", {}, y.name]]]; })]
                                                    ]
                                                ]
                                            ]
                                        ]*/
                                ]
                            ]
                        ]
                    ]]
            ];
        },
        Main: function transform(props) {
            var app = this;
            var path = this.services.navigation.current.path;
            var menu = findMenu(path, props.value);
            return new Promise(function (r) {
                if (menu && typeof menu === "object" && menu.content)
                    app.services.moduleSystem["import"].call(app.services.moduleSystem, menu.content).then(function (o) {
                        //var z = visitArray(o, function (e) { if (e[1] && e[1].className === "fd-bookmark" ) return e; });
                        /*var outline = extractOutline(o.default);
                        if (outline.length > 0)
                            r( [ ["div", { className: "fd-side"}, [outline] ]
                            , ["div", { className: "fd-content"}, [o.default]]
                            ] );
                        else*/
                        r(["div", { className: "fd-content" }, [o]]);
                    }, function (f) {
                        r(["div", { className: "fd-content" }, [["p", { style: { color: "red" } }, 'Error loading ' + (typeof menu === "object" && menu.content ? menu.content : '(no content)')], ["p", {}, f.stack]]]);
                    });
                else
                    r(["div", { className: "fd-content" }, [["p", { style: { color: "red" } }, 'Error loading menu "' + path + '": ' + (menu ? 'content property on menu item not defined' : 'menu not found')]]]);
            });
        }
    };
    exports.Layout = Layout;
});
