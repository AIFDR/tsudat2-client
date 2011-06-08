// map url patterns to exported JSGI app functions
var urls = [
    [(/^\/proxy/), require("./proxy").app]
];

// debug mode loads unminified scripts
// assumes markup pulls in scripts under the path /servlet_name/script/
if (java.lang.System.getProperty("app.debug")) {
    var fs = require("fs");
    var config = fs.normal(fs.join(module.directory, "..", "buildjs.cfg"));
    urls.push(
        [(/^\/script(\/.*)/), require("./autoloader").App(config)]
    );

    // proxy a remote geoserver on /geoserver by setting proxy.geoserver to remote URL
    // only recommended for debug mode
    var geoserver = java.lang.System.getProperty("app.proxy.geoserver");
    if (geoserver) {
        if (geoserver.charAt(geoserver.length-1) !== "/") {
            geoserver = geoserver + "/";
        }
        var path = geoserver.split("/");
        var geoserverEndpoint = path[path.length-2];
        if (geoserverEndpoint != "geoserver") {
            // debug specific proxy
            urls.push(
                [new RegExp("^\\/" + geoserverEndpoint + "\\/(.*)"), require("./proxy").pass({url: geoserver, preserveHost: true})]
            );
            urls.push(
                [(/^\/geoserver\/(.*)/), require("./proxy").pass({url: geoserver, preserveHost: true})]
            );
        }
    }

    // proxy a remote tsudat app on /tsudat by setting proxy.tsudat to remote URL
    // only recommended for debug mode
    var tsudat = java.lang.System.getProperty("app.proxy.tsudat");
    if (tsudat) {
        if (tsudat.charAt(tsudat.length-1) !== "/") {
            tsudat = tsudat + "/";
        }
        // debug specific proxy
        urls.push(
            [(/^\/tsudat\/(.*)/), require("./proxy").pass({url: tsudat, preserveHost: false})]
        );
    }

    // proxy a remote geonode on / by setting proxy.geonode to remote URL
    // only recommended for debug mode
    var geonode = java.lang.System.getProperty("app.proxy.geonode");
    if (geonode) {
        if (geonode.charAt(geonode.length-1) !== "/") {
            geonode = geonode + "/";
        }
        var geonodeUrls = ["data/acls", "accounts/", "tsudat-media/"];
        var url;
        for (var i=geonodeUrls.length-1; i>=0; --i) {
            url = geonodeUrls[i];
            urls.push(
                [new RegExp("^\\/" + url.replace("/", "\\/") + "(.*)"), require("./proxy").pass({url: geonode + url, preserveHost: false})]
            );
        }        
    }

}

exports.urls = urls;

// redirect requests without a trailing slash
// Jetty does this automatically for /servlet_name, Tomcat does not
function slash(config) {
    return function(app) {
        return function(request) {
            var response;
            var servletRequest = request.env.servletRequest;
            var pathInfo = servletRequest.getPathInfo();
            if (pathInfo === "/") {
                var uri = servletRequest.getRequestURI();
                if (uri.charAt(uri.length-1) !== "/") {
                    var location = servletRequest.getScheme() + "://" + 
                        servletRequest.getServerName() + ":" + servletRequest.getServerPort() + 
                        uri + "/";
                    return {
                        status: 301,
                        headers: {"Location": location},
                        body: []
                    };
                }
            }
            return app(request);
        };
    };
}

exports.middleware = [
    slash(),
    require("ringo/middleware/gzip").middleware,
    require("ringo/middleware/static").middleware({base: module.resolve("static"), index: "index.html"}),
    require("ringo/middleware/error").middleware,
    require("ringo/middleware/notfound").middleware
];

exports.app = require("ringo/webapp").handleRequest;

exports.charset = "UTF-8";
exports.contentType = "text/html";
