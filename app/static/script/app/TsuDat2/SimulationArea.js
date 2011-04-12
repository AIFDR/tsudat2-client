/*
 * @require TsuDat2.js
 */

TsuDat2.SimulationArea = Ext.extend(gxp.plugins.Tool, {
    
    ptype: "app_simulationarea",
    
    autoActivate: false,
    
    /** private: property[vectorLayer]
     *  ``OpenLayers.Layer.Vector`` vector layer to draw internal polygons on
     */
    vectorLayer: null,
    
    /** private: property[featureStore]
     *  ``GeoExt.data.FeatureStore`` feature store for the ``vectorLayer``
     */
    featureStore: null,
    
    /** private: property[modifyControl]
     *  ``OpenLayers.Control.ModifyFeature`` modify control for internal polys
     */
    modifyControl: null,

    /** private: property[drawControl]
     *  ``OpenLayers.Control.DrawFeature`` draw control for internal polys
     */
    drawControl: null,
    
    /** private: property[internalPolygonType]
     *  ``String`` The type selected in the polygon type combo box
     */
    internalPolygonType: null,
    
    /** private: property[simulationArea]
     *  ``OpenLayers.Feature.Vector`` The simulation area
     */
    simulationArea: null,

    init: function(target) {
        TsuDat2.SimulationArea.superclass.init.apply(this, arguments);
        this.vectorLayer = new OpenLayers.Layer.Vector(
            this.id + "_vectorlayer", {displayInLayerSwitcher: false}
        );
        this.featureStore = new GeoExt.data.FeatureStore({
            layer: this.vectorLayer,
            fields: [
                {name: "type", type: "integer"},
                {name: "value", type: "float"}
            ],
            featureFilter: new OpenLayers.Filter({
                evaluate: function(feature) {
                    return feature.attributes.type !== undefined; 
                } 
            })
        });
        this.modifyControl = new OpenLayers.Control.ModifyFeature(
            this.vectorLayer
        );
        this.drawControl = new OpenLayers.Control.DrawFeature(
            this.vectorLayer,
            OpenLayers.Handler.Polygon
        );
        target.mapPanel.map.addControls([this.modifyControl, this.drawControl]);
    },
    
    activate: function() {
        if (TsuDat2.SimulationArea.superclass.activate.apply(this, arguments)) {
            this.target.mapPanel.map.addLayer(this.vectorLayer);
            this.modifyControl.activate();
        }
    },
    
    deactivate: function() {
        if (TsuDat2.SimulationArea.superclass.deactivate.apply(this, arguments)) {
            this.drawControl.deactivate();
            this.modifyControl.deactivate();
            this.target.mapPanel.map.removeLayer(this.vectorLayer);
        }
    },
    
    addOutput: function(config) {
        var output = (this.form = TsuDat2.SimulationArea.superclass.addOutput.call(this, {
            xtype: "form",
            labelWidth: 95,
            defaults: {
                anchor: "100%"
            },
            items: [{
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: "<b>Define the area for the tsunami simulation.</b> Draw or upload the area over which to run the simulation, add and rank elevetion data, then define the default mesh resolution."
            }, {
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                fieldLabel: "Simulation Area",
                items: [{
                    xtype: "button",
                    ref: "../drawSimulationArea",
                    iconCls: "icon-draw",
                    text: "Draw",
                    enableToggle: true,
                    toggleGroup: "draw",
                    listeners: {
                        "toggle": function(button, pressed) {
                            function setSimulationArea(e) {
                                this.vectorLayer.events.unregister("featureadded", this, setSimulationArea);                                this.simulationArea = e.feature;
                                this.drawControl.deactivate();
                                this.modifyControl.selectControl.unselectAll();
                                this.modifyControl.selectControl.select(e.feature);
                            }
                            if (pressed) {
                                if (!this.simulationArea) {
                                    this._toggling = this.drawControl.active;
                                    this.drawControl.activate();
                                    this.vectorLayer.events.register("featureadded", this, setSimulationArea);
                                } else {
                                    this.modifyControl.selectFeature(this.simulationArea);
                                }
                            } else {
                                if (this.simulationArea) {
                                    this.modifyControl.unselectFeature(this.simulationArea);
                                } else {
                                    this.vectorLayer.events.unregister("featureadded", this, setSimulationArea);                                this.simulationArea = e.feature;
                                }
                                if (!this._toggling) {
                                    this.drawControl.deactivate();
                                }
                                delete this._toggling;
                            }
                        },
                        scope: this
                    }
                }, {
                    xtype: "label",
                    text: "or",
                    cls: "composite"
                }, {
                    xtype: "button",
                    iconCls: "icon-import",
                    text: "Import"
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                fieldLabel: "Mesh Resolution",
                items: [{
                    xtype: "numberfield",
                    value: 1000000,
                    minValue: 1,
                    maxValue: 1000000,
                    width: 60
                }, {
                    xtype: "label",
                    text: "m²",
                    cls: "composite"
                }]
            }, {
                fieldLabel: "Mesh Friction",
                xtype: "numberfield",
                value: 0.0001,
                width: 60,
                minValue: 0.0001,
                maxValue: 1,
                decimalPrecision: 4,
                anchor: 0
            }, {
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                fieldLabel: "Elevation Data",
                items: [{
                    xtype: "button",
                    iconCls: "icon-add",
                    text: "Add data"
                }]
            }, {
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: "<b>Optionally, create internal polygons</b> for areas of interest or to define areas with different mesh resolutions or mesh frictions."
            }, {
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                cls: "x-form-item",
                items: [{
                    xtype: "button",
                    ref: "../drawInternalPolygon",
                    iconCls: "icon-draw",
                    text: "Draw",
                    enableToggle: true,
                    toggleGroup: "draw",
                    listeners: {
                        "toggle": function(button, pressed) {
                            function setType(e) {
                                e.feature.attributes.type = this.internalPolygonType;
                            }
                            if (pressed) {
                                this._toggling = this.drawControl.active;
                                this.modifyControl.selectControl.unselectAll();
                                this.drawControl.activate();
                                this.vectorLayer.events.register("beforefeatureadded", this, setType);
                            } else {
                                this.vectorLayer.events.unregister("beforefeatureadded", this, setType);
                                this._toggling || this.drawControl.deactivate();
                                delete this._toggling;
                            }
                        },
                        scope: this
                    }
                }, {
                    xtype: "label",
                    text: "or",
                    cls: "composite"
                }, {
                    xtype: "button",
                    iconCls: "icon-import",
                    text: "Import"
                }, {
                    xtype: "label",
                    text: "a",
                    cls: "composite"
                }, {
                    xtype: "combo",
                    flex: 1,
                    store: new Ext.data.ArrayStore({
                        proxy: new Ext.data.HttpProxy({
                            method: "GET",
                            url: "/tsudat/internal_polygon_types",
                            disableCaching: false
                        }),
                        autoLoad: true,
                        idIndex: 0,
                        fields: [
                            {name: "id", type: "integer"},
                            "type"
                        ]
                    }),
                    emptyText: "Select type",
                    mode: "local",
                    triggerAction: "all",
                    valueField: "id",
                    displayField: "type",
                    editable: false,
                    listeners: {
                        "select": function(combo, rec) {
                            this.internalPolygonType = rec.get("type");
                        },
                        scope: this
                    }
                }]
            }, {
                xtype: "grid",
                height: 150,
                sm: new GeoExt.grid.FeatureSelectionModel({
                    selectControl: this.modifyControl.selectControl
                }),
                columns: [
                    {id: "type", dataIndex: "type", header: "Type"},
                    {id: "value", dataIndex: "value", header: "Value"},
                    {id: "actions", header: "Actions"}
                ],
                store: this.featureStore,
                viewConfig: {forceFit: true}
            }],
            listeners: {
                "added": function(cmp, ct) {
                    ct.on({
                        "expand": this.activate,
                        "collapse": this.deactivate,
                        scope: this
                    });
                },
                scope: this
            }
        }));
        
        this.vectorLayer.events.on({
            "featureselected": function(e) {
                if (e.feature === this.simulationArea) {
                    output.drawSimulationArea.toggle(true);
                }
                output.drawInternalPolygon.toggle(false);
            },
            "featureunselected": function(e) {
                output.drawSimulationArea.toggle(false);
            },
            scope: this
        });
        
        return output;
    }
    
});

Ext.preg(TsuDat2.SimulationArea.prototype.ptype, TsuDat2.SimulationArea);