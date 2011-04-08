Ext.BLANK_IMAGE_URL = "theme/app/img/blank.gif";
OpenLayers.DOTS_PER_INCH = 25.4 / 0.28;
OpenLayers.ImgPath = "externals/openlayers/img/";
OpenLayers.Layer.WMS.prototype.DEFAULT_PARAMS.transparent = true;
OpenLayers.Layer.Google.v3.animationEnabled = false;

var TsuDat2 = Ext.extend(gxp.Viewer, {
    
    /** i18n:
    layersTabTitle: "Layers",
    legendTabTitle: "Legend",
    step1Title: "Step 1. Tsunami Scenario",
    step2Title: "Step 2. Tsunami Simulation Area",
    step3Title: "Step 3. Simulation Parameters",
    step4Title: "Step 4. Generate Tsunami Simulation"
    */

    defaultSourceType: "gxp_wmssource",

    constructor: function(config) {
                
        Ext.applyIf(config.map, {
            id: "map",
            region: "center",
            controls: [
                new OpenLayers.Control.Navigation({zoomWheelOptions: {interval: 250}}),
                new OpenLayers.Control.PanPanel({slideRatio: .5}),
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
                width: 250,
                split: true,
                collapsible: true,
                collapseMode: "mini",
                header: false,
                border: false,
                defaults: {
                    layout: "fit",
                    padding: 10,
                    hideBorders: true
                },
                items: [{
                    id: "step1",
                    title: this.step1Title,
                }, {
                    id: "step2",
                    title: this.step2Title
                    //TODO start disabled, enable when step1 is validated
                }, {
                    id: "step3",
                    title: this.step3Title
                    //TODO start disabled, enable when step2 is validated
                }, {
                    id: "step4",
                    title: this.step4Title
                    //TODO start disabled, enable when step3 is validated
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
            outputTarget: "step1"
        }, {
            ptype: "app_simulationarea",
            outputTarget: "step2"
        }, {
            ptype: "app_simulationparameters",
            outputTarget: "step3"
        }]

        TsuDat2.superclass.constructor.apply(this, arguments);
    }

});
