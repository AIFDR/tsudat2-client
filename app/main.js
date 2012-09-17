var fs = require("fs");
var {Application} = require("stick");

var app = Application();
app.configure("notfound", "error", "static", "params", "mount");

var appPath = module.resolve("static");
app.static(appPath, "index.html");
app.mount("/proxy", require("./root/proxy").app);

// debug mode loads unminified scripts
// assumes markup pulls in scripts under the path /servlet_name/lib/
var config = fs.normal(fs.join(module.directory, "..", "buildjs.cfg"));
app.mount("/script/", require("./autoloader").App(config));

// proxy a remote geoserver on /geoserver by setting app.proxy.geoserver to remote URL
// only recommended for debug mode
var geoserver = java.lang.System.getProperty("app.proxy.geoserver");
if (geoserver) {
    if (geoserver.charAt(geoserver.length-1) !== "/") {
        geoserver = geoserver + "/";
    }
    // debug specific proxy
    app.mount("/geoserver/", require("./root/proxy").pass({url: geoserver, preserveHost: true, allowAuth: true}));
}
// proxy a remote tsudat app on /tsudat by setting proxy.tsudat to remote URL
// only recommended for debug mode
var tsudat = java.lang.System.getProperty("app.proxy.tsudat");
if (tsudat) {
    if (tsudat.charAt(tsudat.length-1) !== "/") {
        tsudat = tsudat + "/";
    }
    // debug specific proxy
    app.mount("/tsudat/", require("./root/proxy").pass({url: tsudat, allowAuth: true}));
}

// proxy a remote geonode on / by setting proxy.geonode to remote URL
// only recommended for debug mode
var geonode = java.lang.System.getProperty("app.proxy.geonode");
if (geonode) {
    if (geonode.charAt(geonode.length-1) !== "/") {
       geonode = geonode + "/";
    }
    var geonodeUrls = ["data/upload", "data/acls", "accounts", "tsudat-media"];
    var url;
    for (var i=geonodeUrls.length-1; i>=0; --i) {
        url = geonodeUrls[i];
        app.mount("/" + url + "/", require("./root/proxy").pass({url: geonode + url + "/", allowAuth: true}));
    }
}

exports.app = app;

// main script to start application
if (require.main === module) {
    require("ringo/httpserver").main(module.id);
}
