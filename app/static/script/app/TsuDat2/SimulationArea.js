/*
 * @require TsuDat2.js
 * @require TsuDat2/LayerUploadPanel.js
 */

TsuDat2.SimulationArea = Ext.extend(gxp.plugins.WizardStep, {
    
    /** i18n */
    simulationAreaInstructions: "<b>Define the area for the tsunami simulation.</b> Draw or upload the area over which to run the simulation, add and rank elevation data, then define the default mesh resolution.",
    simulationAreaLabel: "Simulation Area",
    simulationAreaDrawButtonText: "Draw",
    simulationAreaImportButtonText: "Import",
    meshResolutionLabel: "Mesh Resolution",
    meshFrictionLabel: "Mesh Friction",
    elevationDataLabel: "Elevation Data",
    elevationDataAddButtonText: "Add data",
    elevationDataInstructions: "<b>Elevation data is the key input to generating a tsunami simulation.</b> Choose what elevation data will be used in the simulation. Then, order from highest quality to lowest (based on spatial resolution, quality and date) by dragging and dropping in layer pane on the left.",
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
    uploadButtonText: "Upload",
    uploadFileLabel: "CSV file",
    uploadCrsLabel: "CRS",
    deleteButtonText: "Delete",
    uploadText: "Upload",
    /** end i18n */
    
    ptype: "app_simulationarea",
    
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
    
    /** private: property[addDem]
     *  ``gxp.plugins.AddLayers`` Tool for adding elevation models
     */
    addDem: null,
    
    /** private: property[demStore]
     *  ``Ext.data.JsonStore`` data store or DEMs valid for the project
     */
    demStore: null,
    
    /** api: config[demSource]
     *  ``String`` key of the local layer source that contains DEMs. Default
     *  is "local".
     */
    demSource: "local",
    
    /** api: config[demLayerGroup]
     *  ``String`` name of the Elevation Model group in the layer tree. Default
     *  is "dem".
     */
    demLayerGroup: "dem",
    
    /** private: property[projectId]
     *  ``Number`` project id, obtained after a POST to /tsudat/project/
     */
    projectId: null,
    
    constructor: function(config) {
        TsuDat2.SimulationArea.superclass.constructor.apply(this, arguments);
        
        this.demStore = new Ext.data.JsonStore({
            proxy: new Ext.data.HttpProxy({
                method: "GET",
                url: "/tsudat/data_set/",
                disableCaching: false
            }),
            root: function(o) {
                return o;
            },
            idProperty: "pk",
            fields: [
                {name: "typename", mapping: "fields.typename"}
            ]
        });
    },

    demFilterBy: function(rec) {
        var keywords = rec.get("keywords");
        var matches = ["category:hazard", "subcategory:tsunami", "unit:m", "source:tsudat", "source:flow_depth"];
        var matchCount = 0;
        Ext.each(keywords, function(keyword, index) {
            if (matches.indexOf(keyword) != -1) {
                matchCount++;
            }
        });
        return this.demStore.findExact("typename", rec.get("name")) != -1 && matchCount != 5;
    },

    loadExistingSimulationArea: function(response) {
        // we need to wait for the baseLayer to be there
        this.target.mapPanel.on("afterlayeradd", function() {
            var format = new OpenLayers.Format.GeoJSON({
                externalProjection: new OpenLayers.Projection("EPSG:4326"),
                internalProjection: this.target.mapPanel.map.getProjectionObject()
            });
            var features = format.read(response.responseText);
            // we want to be silent since we do not want to persist again
            this.vectorLayer.addFeatures(features, {silent: true});
            this.setSimulationArea({feature: features[0]});
            this.form.drawInternalPolygon.enable();
            this.form.importInternalPolygon.enable();
        }, this, {single: true});
    },

    loadInternalPolygons: function(response) {
        // we need to wait for the baseLayer to be there
        this.target.mapPanel.on("afterlayeradd", function() {
            var format = new OpenLayers.Format.GeoJSON({
                externalProjection: new OpenLayers.Projection("EPSG:4326"),
                internalProjection: this.target.mapPanel.map.getProjectionObject()
            });         
            var features = format.read(response.responseText);
            // we want to be silent since we do not want to persist again
            this.vectorLayer.addFeatures(features, {silent: true});
            // TODO this is using a private function
            this.featureStore.onFeaturesAdded({features: features}); 
            this.wizardContainer.on("wizardstepvalid", function(tool, data) {
                this.form.meshFriction.setValue(data.default_friction_value);
                // TODO I see no way currently to retrieve value for bounding_polygon_maxarea
                // TODO since no DEM layer is present, setValid will only work once and not when
                // switching accordion panels
                this.setValid(true, {
                    project: this.projectId,
                    default_friction_value: this.form.meshFriction.getValue(),
                    bounding_polygon_maxarea: this.form.meshResolution.getValue()
                });
            }, this, {single: true});
        }, this, {single: true});
    },

    loadDEM: function(response) {
        // first reload demStore (tsudat/data_set endpoint)
        // when this is done, reload and filter GetCapabilities
        this.demStore.on("load", function() {
            var dsInfo = Ext.decode(response.responseText);
            var typeNames = [];
            if (dsInfo) {
                for (var i=0, len=dsInfo.length; i<len; i++) {
                    var ds = dsInfo[i].fields.dataset;
                    var idx = this.demStore.findBy(function(record) {
                        return (record.json.pk === ds);
                    });
                    var record = this.demStore.getAt(idx); 
                    typeNames.push(record.get('typename'));
                }
            }
            var demSource = this.target.layerSources[this.demSource];
            demSource.store.on("load", function() {
                demSource.store.filterBy(this.demFilterBy, this);
                demSource.store.each(function(record) {
                    if (typeNames.indexOf(record.get('name')) !== -1) {
                        record.set("group", this.demLayerGroup);
                        this.target.mapPanel.layers.add(record);
                    }
                }, this);
            }, this);
            demSource.store.load({});
        }, this, {single: true});
        this.demStore.reload();
    },

    init: function(target) {
        TsuDat2.SimulationArea.superclass.init.apply(this, arguments);

        if (this.projectId !== null) {
            Ext.Ajax.request({
                method: "GET",  
                url: "/tsudat/project/" + this.projectId,
                success: this.loadExistingSimulationArea,
                scope: this
            });
            Ext.Ajax.request({
                method: "GET",
                url: "/tsudat/internal_polygon/",
                params: {project: this.projectId},
                success: this.loadInternalPolygons,
                scope: this
            });
            Ext.Ajax.request({
                method: "GET",
                url: "tsudat/project_data_set/",
                params: {project_id: this.projectId},
                success: this.loadDEM,
                scope: this
            });
        }

        this.vectorLayer = new OpenLayers.Layer.Vector(this.id + "_vectorlayer", {
            styleMap: this.styleMap,
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
        
        var origCreateLayerRecord;
        this.addDem = new gxp.plugins.AddLayers({
            actionTarget: this.id + "addDemTarget",
            addActionTooltip: null,
            addActionText: this.elevationDataAddButtonText,
            instructionsText: this.elevationDataInstructions,
            startSourceId: this.demSource,
            upload: true,
            createUploadButton: (function() {
                return new Ext.Button({
                    text: this.uploadText,
                    iconCls: "gxp-icon-filebrowse",
                    handler: function() {
                        var panel = new TsuDat2.LayerUploadPanel({
                            url: "/data/upload",
                            width: 350,
                            border: false,
                            bodyStyle: "padding: 10px 10px 0 10px;",
                            frame: true,
                            labelWidth: 65,
                            defaults: {
                                anchor: "95%",
                                allowBlank: false,
                                msgTarget: "side"
                            },
                            listeners: {
                                uploadcomplete: function(panel, detail) {
                                    // first reload demStore (tsudat/data_set endpoint)
                                    // when this is done, reload and filter GetCapabilities
                                    this.demStore.on("load", function() {
                                        var demSource = this.target.layerSources[this.demSource];
                                        demSource.store.on("load", function() {
                                            demSource.store.filterBy(this.demFilterBy, this);
                                        }, this);
                                        demSource.store.load({});
                                        win.close();
                                    }, this, {single: true});
                                    this.demStore.reload();
                                },
                                scope: this
                            }
                        });

                        var win = new Ext.Window({
                            title: this.uploadText,
                            modal: true,
                            resizable: false,
                            items: [panel]
                        });
                        win.show();
                    },
                    scope: this
                });
            }).createDelegate(this),
            outputConfig: {
                modal: false,
                listeners: {
                    "show": function() {
                        this.setOtherAddLayerButtonsDisabled(true);
                        this.target.showTree();
                        var demSource = this.target.layerSources[this.demSource];
                        demSource.store.filterBy(this.demFilterBy, this);
                        origCreateLayerRecord = demSource.createLayerRecord;
                        demSource.createLayerRecord = (function() {
                            var rec = origCreateLayerRecord.apply(demSource, arguments);
                            rec.set("group", this.demLayerGroup);
                            return rec;
                        }).createDelegate(this);
                    },
                    "hide": function() {
                        this.setOtherAddLayerButtonsDisabled(false);
                        var demSource = this.target.layerSources[this.demSource];
                        demSource.store.clearFilter();
                        demSource.createLayerRecord = origCreateLayerRecord;
                    },
                    scope: this
                }
            }
        });
        this.addDem.init(target);
        
        target.mapPanel.layers.on({
            "add": this.saveDems,
            "remove": this.saveDems,
            scope: this
        });
    },
    
    activate: function() {
        if (TsuDat2.SimulationArea.superclass.activate.apply(this, arguments)) {
            this.modifyControl.activate();
        }
    },
    
    deactivate: function() {
        if (TsuDat2.SimulationArea.superclass.deactivate.apply(this, arguments)) {
            this.drawControl.deactivate();
            this.modifyControl.deactivate();
        }
    },
    
    addOutput: function(config) {
        var output = (this.form = TsuDat2.SimulationArea.superclass.addOutput.call(this, {
            xtype: "form",
            monitorValid: true,
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
                fieldLabel: this.simulationAreaLabel
            }, {
                xtype: "container",
                layout: "hbox",
                cls: "x-form-item composite-wrap",
                fieldLabel: null,
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
                    toggleGroup: "draw",
                    allowDepress: true,
                    text: this.simulationAreaImportButtonText,
                    handler: function(btn) {
                        this.vectorLayer.events.registerPriority("featureadded", this, this.setSimulationArea);
                        this.showUploadWindow(btn);
                    },
                    scope: this
                }, {
                    xtype: "label",
                    text: "or",
                    cls: "composite"
                }, {
                    xtype: "button",
                    iconCls: "icon-delete-simulation-area",
                    text: this.deleteButtonText,
                    toggleGroup: "draw",
                    allowDepress: true,
                    handler: function(btn) {
                        this.addDem.actions[0].disable();
                        this.form.drawInternalPolygon.disable();
                        this.form.importInternalPolygon.disable();
                        this.vectorLayer.removeFeatures([this.simulationArea]);
                        this.simulationArea = null;
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
                    ref: "../meshResolution",
                    allowBlank: false,
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
                ref: "meshFriction",
                xtype: "numberfield",
                allowBlank: false,
                value: 0.01,
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
                    id: this.id + "addDemTarget",
                    xtype: "container",
                    listeners: {
                        "add": function(ct, cmp) {
                            // start with "Add data" button disabled
                            cmp.disable();
                            cmp.on("enable", function() {
                                // disable button again when we don't have a
                                // projectId yet
                                if (this.projectId == null) {
                                    cmp.disable();
                                }
                            }, this);
                        },
                        scope: this
                    }
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
                layout: "hbox",
                cls: "composite-wrap x-form-item",
                items: [{
                    xtype: "button",
                    ref: "../drawInternalPolygon",
                    iconCls: "icon-draw",
                    disabled: true,
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
                    ref: "../importInternalPolygon",
                    iconCls: "icon-import",
                    toggleGroup: "draw",
                    allowDepress: true,
                    disabled: true,
                    text: this.internalPolygonsImportButtonText,
                    handler: function(btn) {
                        this.vectorLayer.events.register("beforefeatureadded", this, function() {
                            this.vectorLayer.events.unregister("beforefeatureadded", this, arguments.callee);
                            this.setInternalPolygonAttributes.apply(this, arguments);
                        });
                        this.showUploadWindow(btn, this.internalPolygonType);
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
                "clientvalidation": this.checkValid,
                scope: this
            }
        }));
        
        this.wizardContainer.on("wizardstepexpanded", function(index) {
            if (index >= this.index) {
                this.vectorLayer.map || this.target.mapPanel.map.addLayer(this.vectorLayer);
            } else {
                this.vectorLayer.map && this.target.mapPanel.map.removeLayer(this.vectorLayer);
            }
        }, this);

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
            recheckInternalPolygons = false,
            isInternalPolygon = feature.attributes.type != null;
        switch (e.type) {
            case "featureadded":
                var modified = !isInternalPolygon && (this.projectId !== null);
                method = modified ? "PUT" : "POST";
                if (modified === true) {
                    recheckInternalPolygons = true;
                }
                break;
            case "featuremodified":
                var modified = feature.fid ||
                    !isInternalPolygon && (this.projectId !== null);
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
        this._working = true;
        Ext.Ajax.request({
            method: method,
            url: url,
            jsonData: json,
            success: function(request) {
                delete this._working;
                var result = Ext.decode(request.responseText);
                if (result.id) {
                    if (isInternalPolygon) {
                        feature.fid = result.id;
                    } else {
                        this.projectId = result.id;
                        this.form.drawInternalPolygon.enable();
                        this.form.importInternalPolygon.enable();
                        this.demStore.load({
                            params: {project_id: this.projectId},
                            callback: function() {
                                // enable "Add data" button
                                this.addDem.actions[0].enable();
                                // remove DEM layers that are no longer valid
                                // for the project
                                this.target.mapPanel.layers.each(function(rec) {
                                    if (rec.get("group") == this.demLayerGroup && this.demStore.findExact("typename", rec.get("name")) == -1) {
                                        this.target.mapPanel.layers.remove(rec);
                                    }
                                }, this);
                            },
                            scope: this
                        });
                    }
                }
                // we didn't use a writer, so we remove all dirty marks
                // manually now that everything is committed
                this._commit = true;
                this.featureStore.commitChanges();
                delete this._commit;
                if (recheckInternalPolygons === true) {
                    this.featureStore.each(function(rec) {
                        this.persistFeature({type: "featuremodified", feature: rec.getFeature()});
                    }, this);
                }
            },
            failure: function(response) {
                this.vectorLayer.removeFeatures([feature]);
                this.target.displayXHRTrouble(response);
            },
            scope: this
        });
    },
    
    showUploadWindow: function(sourceButton, type) {
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
                    fieldLabel: this.uploadFileLabel,
                    allowBlank: false
                }, {
                    xtype: "textfield",
                    ref: "crs",
                    name: "srs",
                    fieldLabel: this.uploadCrsLabel,
                    allowBlank: true
                }],
                buttons: [{
                    text: this.uploadButtonText,
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
                                if (!type) {
                                    var features = this.vectorLayer.features;
                                    for (var i=features.length-1; i>=0; --i) {
                                        features[i].attributes.project_id === undefined || this.vectorLayer.removeFeatures([features[i]]);
                                    }
                                }
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
            }],
            listeners: {
                close: function() {
                    sourceButton.toggle(false);
                }
            }
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
            if (this.internalPolygonType === 1) {
                e.feature.attributes.value = 1000;
            } else if (this.internalPolygonType === 2) {
                e.feature.attributes.value = 0.01;
            }
        }
    },
    
    checkValid: function(form, valid) {
        if (valid) {
            var haveDems = false;
            this.target.mapPanel.layers.each(function(rec) {
                if (rec.get("group") == this.demLayerGroup) {
                    haveDems = true;
                    return false;
                }
            }, this);
        }
        var lastValid = this.valid;
        if (!this._working && valid && haveDems && this.projectId) {
            lastValid || this.setValid(true, {
                project: this.projectId,
                default_friction_value: this.form.meshFriction.getValue(),
                bounding_polygon_maxarea: this.form.meshResolution.getValue()
            });
        } else {
            lastValid && this.setValid(false);
        }
    },
    
    saveDems: function(store, records) {
        if (!Ext.isArray(records)) {
            records = [records];
        }
        var haveDems = false;
        for (var i=records.length-1; i>=0; --i) {
            if (records[i].get("group") == this.demLayerGroup) {
                haveDems = true;
                break;
            }
        }
        if (!haveDems) {
            return;
        }
        
        this._working = true;
        // TODO create this store only once, and do CRUD operations with an
        // appropriate reader and writer
        new Ext.data.JsonStore({
            proxy: new Ext.data.HttpProxy({
                method: "GET",
                url: "/tsudat/project_data_set/",
                disableCaching: false
            }),
            baseParams: {
                project_id: this.projectId
            },
            root: function(o) {
                return o;
            },
            idProperty: "pk",
            fields: [
                {name: "typename", mapping: "fields.typename"},
                {name: "project", mapping: "fields.project"}
            ],
            autoLoad: true,
            listeners: {
                "load": function(store, records) {
                    // delete all existing project_data_sets
                    var record;
                    for (var i=records.length-1; i>=0; --i) {
                        record = records[i];
                        record.get("project") == this.projectId && Ext.Ajax.request({
                            method: "DELETE",
                            url: "/tsudat/project_data_set/" + record.id + "/"
                        });
                    }
                    // and now persist the new ones
                    var ranking = 0, successful = 0;
                    this.target.mapPanel.layers.each(function(rec) {
                        if (rec.get("group") == this.demLayerGroup) {
                            Ext.Ajax.request({
                                method: "POST",
                                url: "/tsudat/project_data_set/",
                                jsonData: {
                                    model: "tsudat.projectdataset",
                                    fields: {
                                        project: this.projectId,
                                        ranking: ranking,
                                        dataset: this.demStore.getAt(
                                            this.demStore.findExact("typename", rec.get("name"))
                                        ).id
                                    }
                                },
                                success: function() {
                                    successful++;
                                    if (successful == ranking) {
                                        delete this._working;
                                    }
                                },
                                scope: this
                            });
                            ranking++;
                        }
                    }, this);
                },
                scope: this
            }
        });
    },
    
    setOtherAddLayerButtonsDisabled: function(disabled) {
        var tool;
        for (var i in this.target.tools) {
            tool = this.target.tools[i];
            if (tool !== this.addDem && tool instanceof gxp.plugins.AddLayers) {
                tool.actions[0].setDisabled(disabled);
            }
        }
    }

});

Ext.preg(TsuDat2.SimulationArea.prototype.ptype, TsuDat2.SimulationArea);
