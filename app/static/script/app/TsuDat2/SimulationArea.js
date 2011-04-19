/*
 * @require TsuDat2.js
 */

TsuDat2.SimulationArea = Ext.extend(gxp.plugins.Tool, {
    
    /** i18n */
    simulationAreaInstructions: "<b>Define the area for the tsunami simulation.</b> Draw or upload the area over which to run the simulation, add and rank elevetion data, then define the default mesh resolution.",
    simulationAreaLabel: "Simulation Area",
    simulationAreaDrawButtonText: "Draw",
    simulationAreaImportButtonText: "Import",
    meshResolutionLabel: "Mesh Resolution",
    meshFrictionLabel: "Mesh Friction",
    elevationDataLabel: "Elevation Data",
    elevationDataAddButtonText: "Add data",
    internalPolygonsInstructions: "<b>Optionally, create internal polygons</b> for areas of interest or to define areas with different mesh resolutions or mesh frictions.",
    internalPolygonsDrawButtonText: "Draw",
    internalPolygonsImportButtonText: "Import",
    internalPolygonsGridTypeHeader: "Type",
    internalPolygonsGridValueHeader: "Value",
    internalPolygonsRemoveActionTooltip: "Remove the internal polygon",
    importTitle: "Import a {0}",
    importInstructions: "<b>Select a {0} in csv format for uploading.</b> If the coordinates are not latitudes and longitudes in WGS84, also provide the appropriate coordinate reference system (CRS), e.g. an EPSG code.",
    importProgress: "Uploading your {0}",
    importErrorTitle: "Error",
    importErrorMsg: "{0}: {1}",
    /** end i18n */
    
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
    
    /** private: property[internalPolygonTypes]
     *  ``Ext.data.Store`` internal polygon types for combo boxes etc.
     */
    internalPolygonTypes: null,
    
    /** private: property[modifyControl]
     *  ``OpenLayers.Control.ModifyFeature`` modify control for internal polys
     */
    modifyControl: null,

    /** private: property[drawControl]
     *  ``OpenLayers.Control.DrawFeature`` draw control for internal polys
     */
    drawControl: null,
    
    /** private: property[internalPolygonType]
     *  ``Number`` The type selected in the polygon type combo box
     */
    internalPolygonType: 1,
    
    /** private: property[simulationArea]
     *  ``OpenLayers.Feature.Vector`` The simulation area
     */
    simulationArea: null,
    
    /** private: property[projectId]
     *  ``Number`` project id, obtained after a POST to /tsudat/project/
     */
    projectId: null,

    init: function(target) {
        TsuDat2.SimulationArea.superclass.init.apply(this, arguments);

        this.vectorLayer = new OpenLayers.Layer.Vector(this.id + "_vectorlayer", {
            projection: new OpenLayers.Projection("EPSG:4326"),
            displayInLayerSwitcher: false,
            // because we don't read features, have multiple featuretypes in
            // the layer and a custom server API, we use plain event listeners
            // instead of a HTTP protocol for C(R)UD operations.
            eventListeners: {
                "featureadded": this.persistFeature,
                "featuremodified": this.persistFeature,
                "featureremoved": this.persistFeature,
                scope: this
            }
        });
        this.featureStore = new GeoExt.data.FeatureStore({
            layer: this.vectorLayer,
            fields: [
                {name: "type", type: "integer"},
                {name: "value", type: "float"}
            ],
            featureFilter: new OpenLayers.Filter({
                evaluate: function(feature) {
                    return feature.attributes.type != null; 
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

        this.internalPolygonTypes = new Ext.data.ArrayStore({
            proxy: new Ext.data.HttpProxy({
                method: "GET",
                url: "/tsudat/internal_polygon_types/",
                disableCaching: false
            }),
            autoLoad: true,
            idIndex: 0,
            fields: [
                {name: "id", type: "integer"},
                "type"
            ]
        });
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
                html: this.simulationAreaInstructions
            }, {
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                fieldLabel: this.simulationAreaLabel,
                items: [{
                    xtype: "button",
                    ref: "../drawSimulationArea",
                    iconCls: "icon-draw",
                    text: this.simulationAreaDrawButtonText,
                    enableToggle: true,
                    toggleGroup: "draw",
                    listeners: {
                        "toggle": function(button, pressed) {
                            if (pressed) {
                                if (!this.simulationArea) {
                                    this.drawControl.activate();
                                    this.vectorLayer.events.registerPriority("featureadded", this, this.setSimulationArea);
                                } else {
                                    if (!this._toggling) {
                                        this.modifyControl.selectControl.unselectAll();
                                        this.modifyControl.selectControl.select(this.simulationArea);
                                    }
                                }
                            } else {
                                if (!this.simulationArea) {
                                    this.vectorLayer.events.unregister("featureadded", this, this.setSimulationArea);
                                } else {
                                    this.modifyControl.selectControl.unselect(this.simulationArea);
                                }
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
                    text: this.simulationAreaImportButtonText,
                    handler: function() {
                        this.vectorLayer.events.registerPriority("featureadded", this, this.setSimulationArea);
                        this.showUploadWindow();
                    },
                    scope: this
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                fieldLabel: this.meshResolutionLabel,
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
                fieldLabel: this.meshFrictionLabel,
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
                fieldLabel: this.elevationDataLabel,
                items: [{
                    xtype: "button",
                    iconCls: "icon-add",
                    text: this.elevationDataAddButtonText
                }]
            }, {
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: this.internalPolygonsInstructions
            }, {
                xtype: "container",
                ref: "internalPolygons",
                layout: "hbox",
                cls: "composite-wrap x-form-item",
                disabled: true,
                items: [{
                    xtype: "button",
                    ref: "../drawInternalPolygon",
                    iconCls: "icon-draw",
                    text: this.internalPolygonsDrawButtonText,
                    enableToggle: true,
                    toggleGroup: "draw",
                    listeners: {
                        "toggle": function(button, pressed) {
                            if (pressed) {
                                this.drawControl.activate();
                                this.vectorLayer.events.registerPriority("beforefeatureadded", this, this.setInternalPolygonAttributes);
                            } else {
                                this.vectorLayer.events.unregister("beforefeatureadded", this, this.setInternalPolygonAttributes);
                                this.drawControl.deactivate();
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
                    text: this.internalPolygonsImportButtonText,
                    handler: function() {
                        this.vectorLayer.events.register("beforefeatureadded", this, function() {
                            this.vectorLayer.events.unregister("beforefeatureadded", this, arguments.callee);
                            this.setInternalPolygonAttributes.apply(this, arguments);
                        });
                        this.showUploadWindow(this.internalPolygonType);
                    },
                    scope: this
                }, {
                    xtype: "label",
                    text: "a",
                    cls: "composite"
                }, {
                    xtype: "combo",
                    flex: 1,
                    store: this.internalPolygonTypes,
                    mode: "local",
                    triggerAction: "all",
                    valueField: "id",
                    displayField: "type",
                    value: this.internalPolygonType,
                    editable: false,
                    listeners: {
                        "select": function(combo, rec) {
                            this.internalPolygonType = rec.get("id");
                        },
                        scope: this
                    }
                }]
            }, {
                xtype: "editorgrid",
                height: 150,
                sm: new GeoExt.grid.FeatureSelectionModel({
                    selectControl: this.modifyControl.selectControl
                }),
                columns: [{
                    dataIndex: "type",
                    header: this.internalPolygonsGridTypeHeader,
                    renderer: (function(value) {
                        return this.internalPolygonTypes.getById(value).get("type");
                    }).createDelegate(this),
                    editor: {
                        xtype: "combo",
                        store: this.internalPolygonTypes,
                        mode: "local",
                        triggerAction: "all",
                        valueField: "id",
                        displayField: "type",
                        editable: false
                    }
                }, {
                    dataIndex: "value",
                    header: this.internalPolygonsGridValueHeader,
                    renderer: function(value, meta, rec) {
                        var html = value;
                        if (rec.get("type") == 3) {
                            html = "n/a";
                            meta.css = "x-item-disabled";
                        }
                        return html;
                    },
                    //TODO type dependent validation
                    editor: {xtype: "numberfield", decimalPrecision: 4}
                }, {
                    xtype: "actioncolumn",
                    width: 30,
                    fixed: true,
                    menuDisabled: true,
                    hideable: false,
                    items: [{
                        iconCls: "icon-delete",
                        tooltip: this.internalPolygonsRemoveActionTooltip,
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
            listeners: {
                "added": function(cmp, ct) {
                    // start disabled because we're not step 1.
                    ct.disable();
                    // enable/disable based on Scenario (step 1) validity.
                    this.target.on({
                        "valid": function(plugin) {
                            if (plugin instanceof TsuDat2.Scenario) {
                                ct.enable();
                            }
                        },
                        "invalid": function(plugin) {
                            if (plugin instanceof TsuDat2.Scenario) {
                                ct.disable();
                            }
                        }
                    });
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
                this._toggling = true;
                if (e.feature === this.simulationArea) {
                    output.drawSimulationArea.toggle(true);
                } else {
                    output.drawInternalPolygon.toggle(false);
                    output.drawSimulationArea.toggle(false);
                }
                delete this._toggling;
            },
            "featureunselected": function(e) {
                if (e.feature === this.simulationArea) {
                    this._toggling = true;
                    output.drawSimulationArea.toggle(false);
                    delete this._toggling;
                }
            },
            scope: this
        });
        
        return output;
    },
    
    persistFeature: function(e) {
        if (this._commit || e.type == "featureremoved" && !e.feature.fid) {
            return;
        }
        var url, method,
            feature = e.feature,
            isInternalPolygon = feature.attributes.type != null;
        switch (e.type) {
            case "featureadded":
                method = "POST";
                break;
            case "featuremodified":
                var modified = feature.fid ||
                    !isInternalPolygon && this.projectId;
                method = modified ? "PUT" : "POST";
                break;
            case "featureremoved":
                method = "DELETE";
                break;
        } 
        if (isInternalPolygon) {
            url = "/tsudat/internal_polygon/";
        } else {
            // simulation area
            url = "/tsudat/project/";
        }
        if (method != "POST") {
            url += (isInternalPolygon ? feature.fid : this.projectId) + "/";
        }
        var json;
        if (method != "DELETE") {
            feature.attributes.project_id = this.projectId;
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
                    if (isInternalPolygon) {
                        feature.fid = result.id;
                    } else {
                        this.projectId = result.id;
                        this.form.internalPolygons.enable();
                        this.target.fireEvent("valid", this);
                    }
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
    
    showUploadWindow: function(type) {
        var isInternalPolygon = (type != null),
            humanReadableType;
        if (isInternalPolygon) {
            humanReadableType = this.internalPolygonTypes.getById(type).get("type");
        } else {
            humanReadableType = this.simulationAreaLabel;
        }
        
        var format = new OpenLayers.Format.GeoJSON({
            externalProjection: new OpenLayers.Projection("EPSG:4326"),
            internalProjection: this.vectorLayer.map.getProjectionObject()
        });
        
        var uploadWindow = new Ext.Window({
            title: String.format(this.importTitle, humanReadableType),
            width: 250,
            autoHeight: true,
            modal: true,
            items: [{
                xtype: "form",
                ref: "form",
                padding: 10,
                border: false,
                autoHeight: true,
                fileUpload: true,
                monitorValid: true,
                labelWidth: 55,
                defaults: {
                    anchor: "100%"
                },
                items: [{
                    xtype: "box",
                    autoEl: {
                        tag: "p",
                        cls: "x-form-item"
                    },
                    html: String.format(this.importInstructions, humanReadableType)
                }, {
                    xtype: "fileuploadfield",
                    name: "csv_file",
                    fieldLabel: "CSV file",
                    allowBlank: false
                }, {
                    xtype: "textfield",
                    ref: "crs",
                    name: "srs",
                    fieldLabel: "CRS",
                    allowBlank: true
                }],
                buttons: [{
                    text: "Upload",
                    ref: "../uploadButton",
                    disabled: true,
                    handler: function() {
                        if (!uploadWindow.form.crs.getValue()) {
                            uploadWindow.form.crs.setValue("EPSG:4326");
                        }
                        uploadWindow.form.getForm().submit({
                            url: "/tsudat/polygon_from_csv/",
                            waitMsg: String.format(this.importProgress, humanReadableType),
                            success: function(form, action) {
                                this.vectorLayer.addFeatures(action.result.features);
                                this.vectorLayer.map.zoomToExtent(action.result.features[0].geometry.getBounds());
                                uploadWindow.close();
                            },
                            failure: function(form, action) {
                                Ext.Msg.show({
                                    title: this.importErrorTitle,
                                    msg: String.format(this.importErrorMsg, action.result.msg, action.result.reason),
                                    icon: Ext.MessageBox.ERROR,
                                    buttons: {ok: true}
                                });
                            },
                            scope: this
                        });
                    },
                    scope: this
                }],
                listeners: {
                    "clientvalidation": function(form, valid) {
                        uploadWindow.form.uploadButton.setDisabled(!valid);
                    },
                    "beforeaction": function(form, action) {
                        if (action instanceof Ext.form.Action.Submit) {
                            action.handleResponse = function(response) {
                                var result = Ext.form.Action.Submit.prototype.handleResponse.apply(this, arguments);
                                if (result.success === undefined) {
                                    var features = format.read(response.responseText);
                                    if (features instanceof Array) {
                                        result = {
                                            success: true,
                                            features: features
                                        };
                                    }
                                }
                                return result;
                            };
                        }
                    }
                }
            }]
        });
        uploadWindow.show();
    },
    
    setSimulationArea: function(e) {
        this.vectorLayer.events.unregister("featureadded", this, this.setSimulationArea);
        e.feature.attributes.name = "";
        e.feature.attributes.max_area = 0;
        this.simulationArea = e.feature;
        this.drawControl.deactivate();
        this._toggling || this.modifyControl.selectControl.select(e.feature);
    },
    
    setInternalPolygonAttributes: function(e) {
        e.feature.attributes.type = this.internalPolygonType;
        // everything except area of interest has a value
        if (this.internalPolygonType != 3) {
            e.feature.attributes.value = 0;
        }
    }

});

Ext.preg(TsuDat2.SimulationArea.prototype.ptype, TsuDat2.SimulationArea);