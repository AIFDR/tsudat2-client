# TsuDat2 Client

## Debug Mode

Loads all scripts uncompressed.

    ant init
    ant debug

This will give you an application available at http://localhost:8080/ by
default.  You only need to run `ant init` once (or any time dependencies
change).

To use a specific tsudat application, you can add the following option to the
"ant debug" command:

    -Dapp.proxy.tsudat=<tsudat_url>

where <tsudat_url> is e.g. http://tsudat.dev.opengeo.org/tsudat/.

To use a specific geoserver instance, you can add the following option to the
"ant debug" command:

    -Dapp.proxy.geoserver=<geoserver_url>

where <geoserver_url> is e.g.
http://tsudat.dev.opengeo.org/geoserver-geonode-dev/

## Prepare App for Deployment

To create a servlet run the following:

    ant

The servlet will be assembled in the build directory.
