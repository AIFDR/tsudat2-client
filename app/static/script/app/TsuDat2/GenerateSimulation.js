/*
 * @require TsuDat2/WizardStep.js
 */

TsuDat2.GenerateSimulation = Ext.extend(TsuDat2.WizardStep, {
    
    /** i18n */
    scenarioNameLabel: "Scenario Name",
    areaResolutionInstructions: "<b>Choose the area and resolution</b> over which to export the results.",
    simulationAreaLabel: "Simulation Area",
    areaOfInterestLabel: "Area of Interest",
    rasterResolutionLabel: "Raster resolution",
    chooseLayersInstructions: "<b>Choose layers to create from the simulation:</b>",
    depthLabel: "Depth of the water (m)",
    stageLabel: "Stage, height of the water above MSL (m)",
    velocityLabel: "Velocity of the water (m/s)",
    energyLabel: "Energy, a function of velocity and depth (kj)",
    bedShearStressLabel: "Bed shear stress at base of water column",
    outputAsMaximumLabel: "Output the quantities above as the maximum value over the entire duration of the simulation.",
    gaugePointsInstructions: "<b>Optionally, draw gauge points</b> to create time series showing wave heights of the tsunami over the time of the simulation.",
    addGaugePointLabel: "Add gauge point",
    gaugePointNameHeader: "Name",
    gaugePointElevationHeader: "Elevation",
    gaugePointUnitHeader: "Unit",
    gaugePointRemoveActionTooltip: "Remove gauge point",
    saveSimulationText: "Save Simulation",
    generateSimulationText: "<b>Generate Simulation</b>",
    /** end i18n */
    
    ptype: "app_generatesimulation",
    
    autoActivate: false,
    
    /** private: property[vectorLayer]
     *  ``OpenLayers.Layer.Vector`` vector layer to draw gauge points on
     */
    vectorLayer: null,
    
    /** private: property[featureStore]
     *  ``GeoExt.data.FeatureStore`` feature store for the ``vectorLayer``
     */
    featureStore: null,
    
    /** private: property[modifyControl]
     *  ``OpenLayers.Control.ModifyFeature`` modify control for gauge points
     */
    modifyControl: null,

    /** private: property[drawControl]
     *  ``OpenLayers.Control.DrawFeature`` draw control for gauge points
     */
    drawControl: null,
    
    /** private: property[projectId]
     *  ``Number`` project id, obtained after a POST to /tsudat/project/
     */
    projectId: null,

    /** private: property[valid]
     *  ``Boolean`` Is the form currently valid?
     */
    valid: true,
    
    init: function(target) {
        TsuDat2.GenerateSimulation.superclass.init.apply(this, arguments);

        this.vectorLayer = new OpenLayers.Layer.Vector(this.id + "_vectorlayer", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            displayInLayerSwitcher: false,
            // because we don't read features and have a custom server API, we
            // use plain event listeners instead of a HTTP protocol for C(R)UD
            // operations.
            eventListeners: {
                "featureadded": function() {
                    this.persistFeature.apply(this, arguments);
                },
                "featuremodified": this.persistFeature,
                "featureremoved": this.persistFeature,
                scope: this
            }
        });
        this.featureStore = new GeoExt.data.FeatureStore({
            layer: this.vectorLayer,
            fields: [
                {name: "name", type: "string"},
                {name: "elevation", type: "float"}
            ]
        });
        this.modifyControl = new OpenLayers.Control.ModifyFeature(
            this.vectorLayer
        );
        this.drawControl = new OpenLayers.Control.DrawFeature(
            this.vectorLayer,
            OpenLayers.Handler.Point
        );
        target.mapPanel.map.addControls([this.modifyControl, this.drawControl]);
    },

    activate: function() {
        if (TsuDat2.GenerateSimulation.superclass.activate.apply(this, arguments)) {
            this.target.mapPanel.map.addLayer(this.vectorLayer);
            this.modifyControl.activate();
        }
    },
    
    deactivate: function() {
        if (TsuDat2.GenerateSimulation.superclass.deactivate.apply(this, arguments)) {
            this.drawControl.deactivate();
            this.modifyControl.deactivate();
            this.target.mapPanel.map.removeLayer(this.vectorLayer);
        }
    },
    
    addOutput: function(config) {
        return (this.form = TsuDat2.GenerateSimulation.superclass.addOutput.call(this, {
            xtype: "form",
            labelWidth: 95,
            monitorValid: true,
            cls: "big-fbar",
            defaults: {
                anchor: "100%"
            },
            items: [{
                xtype: "textfield",
                fieldLabel: this.scenarioNameLabel,
                allowBlank: false,
                ref: "scenarioName"
            }, {
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: this.areaResolutionInstructions
            }, {
                xtype: "radio",
                name: "area",
                hideLabel: true,
                boxLabel: this.simulationAreaLabel
            }, {
                xtype: "radio",
                name: "area",
                hideLabel: true,
                boxLabel: this.areaOfInterestLabel
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: this.rasterResolutionLabel,
                items: [{
                    xtype: "numberfield",
                    value: 25,
                    width: 60,
                    allowBlank: false
                }, {
                    xtype: "label",
                    text: "m",
                    cls: "composite"
                }]
            }, {
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: this.chooseLayersInstructions
            }, {
                xtype: "checkbox",
                ref: "depth",
                hideLabel: true,
                boxLabel: this.depthLabel
            }, {
                xtype: "checkbox",
                ref: "stage",
                hideLabel: true,
                boxLabel: this.stageLabel
            }, {
                xtype: "checkbox",
                ref: "velocity",
                hideLabel: true,
                boxLabel: this.velocityLabel
            }, {
                xtype: "checkbox",
                ref: "energy",
                hideLabel: true,
                boxLabel: this.energyLabel
            }, {
                xtype: "checkbox",
                ref: "bedShearStress",
                hideLabel: true,
                boxLabel: this.bedShearStressLabel
            }, {
                xtype: "checkbox",
                ref: "outputAsMaximum",
                hideLabel: true,
                ctCls: "space-above",
                boxLabel: this.outputAsMaximumLabel
            }, {
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: this.gaugePointsInstructions
            }, {
                xtype: "button",
                ref: "addGaugePoint",
                text: this.addGaugePointLabel,
                iconCls: "icon-add",
                anchor: null,
                enableToggle: true,
                toggleGroup: "draw",
                listeners: {
                    "toggle": function(button, pressed) {
                        if (pressed) {
                            this.drawControl.activate();
                            this.vectorLayer.events.registerPriority("beforefeatureadded", this, this.setGaugePointAttributes);
                        } else {
                            this.vectorLayer.events.unregister("beforefeatureadded", this, this.setGaugePointAttributes);
                            this.drawControl.deactivate();
                        }
                    },
                    scope: this
                }
            }, {
                xtype: "editorgrid",
                height: 150,
                cls: "small-space-above",
                sm: new GeoExt.grid.FeatureSelectionModel({
                    selectControl: this.modifyControl.selectControl
                }),
                columns: [{
                    dataIndex: "name",
                    header: this.gaugePointNameHeader,
                    editor: {
                        xtype: "textfield"
                    }
                }, {
                    dataIndex: "elevation",
                    header: this.gaugePointElevationHeader,
                    width: 70,
                    editor: {
                        xtype: "numberfield"
                    }
                }, {
                    header: this.gaugePointUnitHeader,
                    width: 40,
                    renderer: function() {
                        return "m";
                    }
                }, {
                    xtype: "actioncolumn",
                    width: 30,
                    fixed: true,
                    menuDisabled: true,
                    hideable: false,
                    items: [{
                        iconCls: "icon-delete",
                        tooltip: this.gaugePointRemoveActionTooltip,
                        handler: function(grid, rowIndex) {
                            this.modifyControl.unselectFeature(grid.store.getAt(rowIndex).getFeature());
                            grid.store.removeAt(rowIndex);
                        },
                        scope: this
                    }]
                }],
                store: this.featureStore,
                viewConfig: {forceFit: true}
            }],
            buttonAlign: "left",
            fbar: new Ext.Toolbar({
                items: [{
                    text: this.saveSimulationText,
                    cls: "big-button",
                    scale: "large"
                }, "->", {
                    text: this.generateSimulationText,
                    cls: "big-button",
                    scale: "large"
                }
            ]})
        }));
    },
    
    persistFeature: function(e) {
        if (this._commit || e.type == "featureremoved" && !e.feature.fid) {
            return;
        }
        var method,
            feature = e.feature,
            isInternalPolygon = feature.attributes.type != null;
        switch (e.type) {
            case "featureadded":
                method = "POST";
                break;
            case "featuremodified":
                method = feature.fid ? "PUT" : "POST";
                break;
            case "featureremoved":
                method = "DELETE";
                break;
        } 
        var url = "/tsudat/gauge_point/";
        if (method != "POST") {
            url += feature.fid + "/";
        }
        var json;
        if (method != "DELETE") {
            // casting attributes to string because api does not like numbers
            var clone = feature.clone();
            clone.attributes = Ext.apply({}, feature.attributes);
            for (var i in clone.attributes) {
                if (typeof clone.attributes[i] == "number") {
                    clone.attributes[i] = String(clone.attributes[i]);
                }
            }
            json = new OpenLayers.Format.GeoJSON({
                internalProjection: feature.layer.map.getProjectionObject(),
                externalProjection: new OpenLayers.Projection("EPSG:4326")
            }).write(clone);
        }
        Ext.Ajax.request({
            method: method,
            url: url,
            jsonData: json,
            success: function(request) {
                var result = Ext.decode(request.responseText);
                if (result.id) {
                    feature.fid = result.id;
                }
                // we didn't use a writer, so we remove all dirty marks
                // manually now that everything is committed
                this._commit = true;
                this.featureStore.commitChanges();
                delete this._commit;
            },
            scope: this
        });
    },
    
    setGaugePointAttributes: function(e) {
        e.feature.attributes.name = "";
        e.feature.attributes.elevation = 0;
        e.feature.attributes.project_id = this.projectId;
    }

});

Ext.preg(TsuDat2.GenerateSimulation.prototype.ptype, TsuDat2.GenerateSimulation);