/**
 * Copyright (c) 2011 The Open Planning Project
 */

Ext.BLANK_IMAGE_URL = "theme/app/img/blank.gif";
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 10;
// the only resource we need from OpenLayers.ImgPath is blank.gif, and we take
// this from the theme.
OpenLayers.ImgPath = "externals/openlayers/theme/default/img/";
// wrap the date line for our tiled base layers
OpenLayers.Layer.XYZ.prototype.wrapDateLine = true;

var TsuDat2 = Ext.extend(gxp.Viewer, {
    
    /** i18n */
    layersTabTitle: "Layers",
    legendTabTitle: "Legend",
    step1Title: "Step 1. Tsunami Scenario",
    step2Title: "Step 2. Tsunami Simulation Area",
    step3Title: "Step 3. Simulation Parameters",
    step4Title: "Step 4. Generate Tsunami Simulation",
    errorTitle: "Error",
    errorMsg: "{0}: {1}",
    unknownErrorMsg: "The server returned an error: {0} {1}",
    /** end i18n */

    defaultSourceType: "gxp_wmscsource",
    
    constructor: function(config) {
                
        Ext.applyIf(config.map, {
            id: "map",
            region: "center",
            controls: [
                new OpenLayers.Control.Navigation({zoomWheelOptions: {interval: 250}}),
                new OpenLayers.Control.PanPanel({slideRatio: 0.5}),
                new OpenLayers.Control.ZoomPanel(),
                new OpenLayers.Control.Attribution()
            ]
        });

        config.mapItems = [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }];
        
        config.portalItems = [{
            region: "center",
            layout: "border",
            tbar: {
                id: "paneltbar",
                items: [{
                    iconCls: "icon-geonode",
                    text: "&nbsp;TsuDat2",
                    handler: function() {
                        window.location.href = "/";
                    }
                }, "-", "-"]
            },
            items: [{
                xtype: "tabpanel",
                id: "west",
                region: "west",
                width: 200,
                split: true,
                collapsible: true,
                collapsed: true,
                collapseMode: "mini",
                header: false,
                listeners: {
                    "add": {
                        fn: function(cmp) { cmp.setActiveTab(0); },
                        single: true
                    }
                }
            }, {
                id: "east",
                region: "east",
                layout: "accordion",
                width: 280,
                split: true,
                collapsible: true,
                collapseMode: "mini",
                header: false,
                border: false,
                defaults: {
                    padding: 10,
                    hideBorders: true,
                    autoScroll: true
                },
                items: [{
                    id: "step1",
                    title: this.step1Title
                }, {
                    id: "step2",
                    title: this.step2Title
                }, {
                    id: "step3",
                    title: this.step3Title
                }, {
                    id: "step4",
                    title: this.step4Title
                }],
                plugins: {
                    ptype: "gxp_wizardcontainer"
                }
            },
            "map"]
        }];
        
        config.tools = [{
            ptype: "gxp_zoomtoextent",
            extent: config.map.extent,
            closest: false,
            actionTarget: {target: "paneltbar", index: 2}
        }, {
            ptype: "gxp_navigationhistory",
            actionTarget: {target: "paneltbar", index: 3}
        }, {
            ptype: "gxp_measure",
            actionTarget: {target: "paneltbar", index: 5},
            toggleGroup: "main"
        }, {
            ptype: "gxp_wmsgetfeatureinfo",
            actionTarget: {target: "paneltbar", index: 6},
            toggleGroup: "main"
        }, {
            ptype: "gxp_layertree",
            outputTarget: "west",
            groups: {
                "default": "Overlays (optional)",
                "dem": "Elevation Models (required)",
                "background": {
                    title: "Base Layers",
                    exclusive: true
                }
            },
            outputConfig: {
                title: this.layersTabTitle,
                id: "tree",
                tbar: []
            }
        }, {
            ptype: "gxp_addlayers",
            actionTarget: "tree.tbar"
        }, {
            ptype: "gxp_removelayer",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        }, {
            ptype: "gxp_zoomtolayerextent",
            closest: false,
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        }, {
            outputTarget: "west",
            outputConfig: {
                xtype: "gx_legendpanel",
                title: this.legendTabTitle,
                padding: 5
            }
        }, {
            ptype: "gxp_featuremanager",
            id: "eventhighlighter",
            format: "JSON",
            maxFeatures: 250,
            paging: false,
            symbolizer: {
                graphicName: "circle",
                pointRadius: 5,
                fillOpacity: 0.5,
                fillColor: "#FFFFFF",
                stroke: false
            },
            layer: {
                source: "local",
                name: "tsudat:tsudat_event_subfaults_view"
            }
        }, {
            ptype: "app_scenario",
            eventHighlighter: "eventhighlighter",
            outputTarget: "step1",
            symbolizer: {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "white",
                fillOpacity: 0.5,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            }
        }, {
            ptype: "app_simulationarea",
            outputTarget: "step2"
        }, {
            ptype: "app_simulationparameters",
            outputTarget: "step3"
        }, {
            ptype: "app_generatesimulation",
            outputTarget: "step4"
        }];

        TsuDat2.superclass.constructor.apply(this, arguments);
        
        this.addEvents(
            /** private: event[valid]
             *  Triggered when a wizard step is valid.
             *
             *  Listener arguments:
             *
             *  * ``gxp.plugins.Tool`` - the wizard step plugin
             *  * ``Object`` - data gathered by this wizard step
             */
            "valid",
            
            /** private: event[invalid]
             *  Triggered when a wizard step is invalid.
             *
             *  Listener arguments:
             *
             *  * ``gxp.plugins.Tool`` - the wizard step plugin
             */
            "invalid"
        );

        // global request error handling
        Ext.util.Observable.observeClass(Ext.data.Connection);
        Ext.data.Connection.on({
            "requestexception": function(conn, response, options) {
                var attempts = options.attempts || 0;
                if (response.status == 500 && attempts <= 10) {
                    options.attempts = ++attempts;
                    window.setTimeout(function() {
                        Ext.Ajax.request(options);
                    }, 250);
                } else if (response.status && !options.failure) {
                    if (response.status == 401 && options.url.indexOf("/" == 0)) {
                        this.login(options);
                    } else {
                        this.displayXHRTrouble(response);
                    }
                }
            },
            scope: this
        });

    },
    
    login: function(options) {
        var submit = function() {
            form.getForm().submit({
                waitMsg: "Logging in...",
                success: function(form, action) {
                    win.close();
                    // resend the original request
                    Ext.Ajax.request(options);
                },
                failure: function(form, action) {
                    var username = form.items.get(0);
                    var password = form.items.get(1);
                    username.markInvalid();
                    password.markInvalid();
                    username.focus(true);
                },
                scope: this
            });
        }.bind(this);
        var win = new Ext.Window({
            title: "GeoNode Login",
            modal: true,
            width: 230,
            autoHeight: true,
            layout: "fit",
            items: [{
                xtype: "form",
                autoHeight: true,
                labelWidth: 55,
                border: false,
                bodyStyle: "padding: 10px;",
                url: "/accounts/ajax_login",
                waitMsgTarget: true,
                errorReader: {
                    // teach ExtJS a bit of RESTfulness
                    read: function(response) {
                        return {
                            success: response.status == 200,
                            records: []
                        };
                    }
                },
                defaults: {
                    anchor: "100%"
                },
                items: [{
                    xtype: "textfield",
                    name: "username",
                    fieldLabel: "Username"
                }, {
                    xtype: "textfield",
                    name: "password",
                    fieldLabel: "Password",
                    inputType: "password"
                }, {
                    xtype: "button",
                    text: "Login",
                    inputType: "submit",
                    handler: submit
                }]
            }],
            keys: {
                "key": Ext.EventObject.ENTER,
                "fn": submit
            }
        });
        win.show();
        var form = win.items.get(0);
        form.items.get(0).focus(false, 100);
    },

    displayXHRTrouble: function(response) {
        var msg;
        try {
            var result = Ext.decode(response.responseText);
            msg = String.format(this.errorMsg, result.msg, result.reason);
        } catch(e) {
            msg = String.format(this.unknownErrorMsg,
                response.status, response.statusText
            );
        }
        Ext.Msg.show({
            title: this.errorTitle,
            msg: msg,
            icon: Ext.MessageBox.ERROR,
            buttons: {ok: true}
        });
    },
        
    showTree: function() {
        var westPanel = Ext.getCmp("west");
        westPanel.expand();
        westPanel.setActiveTab(0);
    }

});