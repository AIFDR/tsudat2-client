Ext.BLANK_IMAGE_URL = "theme/app/img/blank.gif";
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
OpenLayers.ImgPath = "externals/openlayers/img/";
OpenLayers.Layer.WMS.prototype.DEFAULT_PARAMS.transparent = true;
OpenLayers.Layer.Google.v3.animationEnabled = false;

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

    defaultSourceType: "gxp_wmssource",
    
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
                    iconCls: "icon-geoexplorer",
                    disabled: true
                }, "TsuDat2", "-", "-"]
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
                width: 300,
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
                }]
            },
            "map"]
        }];
        
        config.tools = [{
            ptype: "gxp_zoomtoextent",
            extent: config.map.extent,
            closest: false,
            actionTarget: {target: "paneltbar", index: 3}
        }, {
            ptype: "gxp_navigationhistory",
            actionTarget: {target: "paneltbar", index: 4}
        }, {
            ptype: "gxp_measure",
            actionTarget: {target: "paneltbar", index: 6},
            toggleGroup: "main"
        }, {
            ptype: "gxp_wmsgetfeatureinfo",
            actionTarget: {target: "paneltbar", index: 7},
            toggleGroup: "main"
        }, {
            ptype: "gxp_layertree",
            outputTarget: "west",
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
            ptype: "app_scenario",
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
                if (response.status && !options.failure) {
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
                }
            },
            scope: this
        });

    },
    
    previousStepsCompleted: function(plugin) {
        var index = plugin.index, completed = true;
        if (index > 0) {
            var tool;
            for (var i in this.tools) {
                tool = this.tools[i];
                if (tool instanceof TsuDat2.WizardStep && tool.index < index) {
                    completed = completed && tool.valid;
                }
            }            
        }
        return completed;
    }

});