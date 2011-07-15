/*
 * @require TsuDat2.js
 */

TsuDat2.Scenario = Ext.extend(gxp.plugins.WizardStep, {
    
    /** i18n */
    hazardPointLabel: "Hazard Point",
    hazardPointEmptyText: "Select from map",
    returnPeriodLabel: "Return Period",
    waveHeightLabel: "Wave Height",
    sourceInstructions: "<b>Additionally, define the hazard source for the tsunami simulation.</b> Choose from the options below or select a sub-fault from the map.",
    sourceLabel: "Source",
    eventGridInstructions: "Once the tsunami scenario has been defined and a hazard source selected, a table below will be populated with the events valid for this set of parameters.",
    probabilityTooltip: "Probability",
    waveHeightTooltip: "Wave Height",
    magnitudeTooltip: "Magnitude",
    slipTooltip: "Slip",
    selectEventInstructions: "<b>Select one of the {0} events</b> for the tsunami scenario:",
    loadingEventsMsg: "Loading the events valid for this set of parameters...",
    hazardPointPopupTitle: "Wave Height versus Return Period",
    /** end i18n */
    
    ptype: "app_scenario",
    
    autoActivate: true,
    
    /** api: config[eventHighlighter]
     *  ``String`` id of a FeatureManager configured with a layer that has an
     *  event_id field to highlight selected events. Optional.
     */
    
    /** private: property[hazardPoint]
     *  ``OpenLayers.Feature.Vector``
     */
    hazardPoint: null,
    
    /** api: config[symbolizer]
     *  ``Object`` Symbolizer for selected hazard points and sub-faults. The
     *  object expected has two keys, hazardPoint and subfault, with a valid
     *  OpenLayers symbolizer as value for each.
     */
    
    /** private: property[selectHazardPoint]
     *  :class:`gxp.plugins.ClickableFeatures` tool for selecting hazard points
     *  from the map
     */
    selectHazardPoint: null,
    
    /** private: property[selectSubfault]
     *  :class:`gxp.plugins.ClickableFeatures` tool for selecting sub-faults
     *  from the map
     */
    selectSubfault: null,
    
    /** private: property[currentGridParams]
     *  ``String`` current parameters for the events selection in the form's
     *  eventGrid.
     */
    currentGridParams: null,

    init: function(target) {
        this.initHazardPointManagement(target);
        this.initSubfaultManagement(target);
        
        target.tools[this.eventHighlighter].showLayer();

        TsuDat2.Scenario.superclass.init.apply(this, arguments);
    },
    
    activate: function() {
        if (TsuDat2.Scenario.superclass.activate.apply(this, arguments)) {
            this.selectHazardPoint.activate();
            this.selectSubfault.activate();
            return true;
        }
    },
    
    deactivate: function() {
        if (TsuDat2.Scenario.superclass.deactivate.apply(this, arguments)) {
            this.selectHazardPoint.deactivate();
            this.selectSubfault.deactivate();
            return true;
        }
    },
    
    addOutput: function(config) {
        return (this.form = TsuDat2.Scenario.superclass.addOutput.call(this, {
            xtype: "form",
            labelWidth: 80,
            monitorValid: true,
            defaults: {
                anchor: "100%",
                allowBlank: false
            },
            items: [{
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: "<b>Define the scenario for the tsunami simulation.</b> First, select a hazard point from within the simulation area. Then, define the return period or wave height range."
            }, {
                xtype: "textfield",
                ref: "hazardPointCoords",
                fieldLabel: this.hazardPointLabel,
                emptyText: this.hazardPointEmptyText,
                readOnly: true,
                cls: "hazardpoint", // add GetLegendGraphic icon
                listeners: {
                    "valid": function() {
                        this.setWaveHeight();
                        this.updateEventGrid();
                    },
                    "invalid": this.hideEventGrid,
                    scope: this
                }
            }, {
                // wrapping combo box to avoid reduced initial width in Webkit
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                fieldLabel: this.returnPeriodLabel,
                items: [{
                    xtype: "combo",
                    ref: "../returnPeriod",
                    flex: 1,
                    store: new Ext.data.ArrayStore({
                        proxy: new Ext.data.HttpProxy({
                            method: "GET",
                            url: "/tsudat/return_periods/",
                            disableCaching: false
                        }),
                        autoLoad: true,
                        idIndex: 0,
                        fields: [
                            {name: "id", type: "integer"},
                            "label"
                        ],
                        listeners: {
                            "load": {
                                fn: function(store) {
                                    var rpField = this.form.returnPeriod;
                                    var returnPeriod = store.getAt(0).get(rpField.valueField);
                                    rpField.setValue(returnPeriod);
                                    if (!this.setReturnPeriodFilter(returnPeriod)) {
                                        this.target.mapPanel.map.events.register("addlayer", this, function(evt) {
                                            if (this.setReturnPeriodFilter(returnPeriod)) {
                                                this.target.mapPanel.map.events.unregister("addlayer", this, arguments.callee);
                                            }
                                        });
                                    }
                                },
                                single: true
                            },
                            scope: this
                        }
                    }),
                    mode: "local",
                    triggerAction: "all",
                    valueField: "id",
                    displayField: "label",
                    editable: false,
                    listeners: {
                        "select": this.setWaveHeight,
                        scope: this
                    }
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                fieldLabel: this.waveHeightLabel,
                items: [{
                    xtype: "numberfield",
                    ref: "../waveHeight",
                    width: 50,
                    allowBlank: false,
                    listeners: {
                        "valid": function() {
                            this.setReturnPeriod();
                            this.updateEventGrid();
                        },
                        "invalid": this.hideEventGrid,
                        scope: this
                    }
                }, {
                    xtype: "label",
                    text: "±",
                    cls: "composite"
                }, {
                    xtype: "numberfield",
                    ref: "../waveHeightDelta",
                    value: 0.05,
                    width: 50,
                    allowBlank: false,
                    listeners: {
                        "valid": function() {
                            this.setReturnPeriod();
                            this.updateEventGrid();
                        },
                        "invalid": this.hideEventGrid,
                        scope: this
                    }
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
                html: this.sourceInstructions
            }, {
                // wrapping combo box to avoid reduced initial width in Webkit
                xtype: "container",
                layout: "hbox",
                cls: "composite-wrap",
                fieldLabel: this.sourceLabel,
                items: [{
                    xtype: "combo",
                    ref: "../sourceZone",
                    flex: 1,
                    store: new Ext.data.JsonStore({
                        proxy: new Ext.data.HttpProxy({
                            method: "GET",
                            url: "/tsudat/source_zones/",
                            disableCaching: false
                        }),
                        root: function(o) {
                            return o;
                        },
                        autoLoad: true,
                        idProperty: "pk",
                        fields: [
                            {name: "source_zone", mapping: "fields.tsudat_id"},
                            {name: "name", mapping: "fields.name"}
                        ]
                    }),
                    mode: "local",
                    triggerAction: "all",
                    valueField: "source_zone",
                    displayField: "name",
                    hiddenName: this.id + "source_zone",
                    allowBlank: false,
                    cls: "subfault", // add GetLegendGraphic icon
                    forceSelection: true,
                    listeners: {
                        "select": function(combo, rec) {
                            this.target.tools[this.selectSubfault.featureManager].loadFeatures(
                                new OpenLayers.Filter.Comparison({
                                    type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                    property: "source_zone_id",
                                    value: rec.id
                                })
                            );
                        },
                        "valid": function() {
                            // update the grid in the next cycle, to make sure
                            // that getValue() returns the valueField's value,
                            // not the displayField's.
                            window.setTimeout(
                                this.updateEventGrid.createDelegate(this), 0
                            );
                        },
                        "invalid": this.hideEventGrid,
                        scope: this
                    }
                }]
            }, {
                xtype: "box",
                ref: "eventGridInstructions",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: this.eventGridInstructions
            }, {
                xtype: "grid",
                ref: "eventGrid",
                hidden: true,
                height: 150,
                store: new Ext.data.JsonStore({
                    proxy: new Ext.data.HttpProxy({
                        method: "GET",
                        url: "/tsudat/events/",
                        disableCaching: false
                    }),
                    root: function(o) {
                        return o;
                    },
                    idProperty: "pk",
                    fields: [
                        {name: "id", mapping: "fields.event.fields.tsudat_id"},
                        {name: "probability", mapping: "fields.event.fields.probability"},
                        {name: "wave_height", mapping: "fields.wave_height"},
                        {name: "magnitude", mapping: "fields.event.fields.magnitude"},
                        {name: "slip", mapping: "fields.event.fields.slip"}
                    ]
                }),
                columns: [
                    {header: "ID", dataIndex: "id"},
                    {header: "prob", dataIndex: "probability", tooltip: this.probabilityTooltip, sortable: true},
                    {header: "wh", dataIndex: "wave_height", tooltip: this.waveHeightTooltip, sortable: true},
                    {header: "M", dataIndex: "magnitude", tooltip: this.magnitudeTooltip, sortable: true},
                    {header: "slip", dataIndex: "slip", tooltip: this.slipTooltip, sortable: true}
                ],
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect: true,
                    listeners: {
                        "selectionchange": function(sm) {
                            var eventHighlighter = this.target.tools[this.eventHighlighter];
                            if (sm.getCount() == 0) {
                                this.setValid(false);
                                if (eventHighlighter) {
                                    eventHighlighter.clearFeatures();
                                }
                            } else {
                                var sz = this.form.sourceZone;
                                var event = sm.getSelected().get("id");
                                if (eventHighlighter) {
                                    eventHighlighter.loadFeatures(
                                        new OpenLayers.Filter.Comparison({
                                            type: OpenLayers.Filter.Comparison.EQUAL_TO,
                                            property: "event_id",
                                            value: event
                                        })
                                    );
                                }
                                this.setValid(true, {
                                    hazard_point: Number(this.hazardPoint.fid.split(".").pop()),
                                    source_zone: sz.store.getAt(sz.store.findExact("source_zone", sz.getValue())).id,
                                    wave_height_delta: this.form.waveHeightDelta.getValue(),
                                    wave_height: this.form.waveHeight.getValue(),
                                    return_period: this.form.returnPeriod.getValue(),
                                    event: event
                                });
                            }
                        },
                        scope: this
                    }
                }),
                viewConfig: {forceFit: true}
            }]
        }));
    },
    
    initHazardPointManagement: function(target) {
        var epsg4326 = new OpenLayers.Projection("EPSG:4326");
        var format = function(coord, axis) {
            return OpenLayers.Util.getFormattedLonLat(coord, axis, "dm");
        };
        
        var hazardPointManager = new gxp.plugins.FeatureManager({
            id: this.id + "hazardpointmanager",
            layer: {
                source: "local",
                name: "tsudat:tsudat_hazardpoint"
            },
            paging: false,
            symbolizer: this.symbolizer.hazardPoint
        });
        hazardPointManager.init(target);
        this.selectHazardPoint = new (Ext.extend(gxp.plugins.ClickableFeatures, {
            featureManager: hazardPointManager.id,
            autoActivate: false,
            parent: this,
            init: function(target) {
                gxp.plugins.ClickableFeatures.prototype.init.apply(this, arguments);
                var tool = this;
                this.control = new OpenLayers.Control({
                    autoActivate: true,
                    handler: new OpenLayers.Handler.Click(this, {
                        click: function(evt) {
                            tool.noFeatureClick(evt);
                        }
                    }),
                    displayClass: "appSelectHazardPoint"
                });
                target.mapPanel.map.addControl(this.control);
            },
            activate: function() {
                if (gxp.plugins.ClickableFeatures.prototype.activate.apply(this, arguments)) {
                    this.control.activate();
                    hazardPointManager.showLayer(this.id);
                    return true;
                }
            },
            deactivate: function() {
                if (gxp.plugins.ClickableFeatures.prototype.deactivate.apply(this, arguments)) {
                    this.control.deactivate();
                    return true;
                }
            },
            select: function(feature) {
                this.parent.hazardPoint = feature;
                var geom = feature.geometry.clone().transform(
                    feature.layer.map.getProjectionObject(), epsg4326
                );
                this.parent.form.hazardPointCoords.setValue(
                    format(geom.x, "lat") + ", " + format(geom.y, "lon")
                );
                this.parent.showHazardPointGraph(feature);
            }
        }))();
        this.selectHazardPoint.init(target);
    },
    
    showHazardPointGraph: function(feature) {
        var hazardPointManager = this.target.tools[this.id + "hazardpointmanager"];
        function closePopup(evt) {
            popup.close();
        }
        var popup = new GeoExt.Popup({
            location: feature,
            title: this.hazardPointPopupTitle,
            height: 304,
            width: 314,
            items: [{
                xtype: "box",
                width: 300,
                height: 256,
                autoEl: {
                    tag: "img",
                    src: "/tsudat-media/wh_rp_hazard_graphs/" + feature.attributes.tsudat_id + ".png",
                    width: 300,
                    height: 256
                }
            }],
            listeners: {
                "close": function() {
                    hazardPointManager.featureLayer.events.unregister("featureadded", this, closePopup);
                }
            }
        });
        popup.show();
        hazardPointManager.featureLayer.events.register("featureadded", this, closePopup);
    },
    
    initSubfaultManagement: function(target) {
        var subfaultManager = new gxp.plugins.FeatureManager({
            id: this.id + "subfaultmanager",
            layer: {
                source: "local",
                name: "tsudat:tsudat_subfault"
            },
            paging: false,
            symbolizer: this.symbolizer.subfault
        });
        subfaultManager.init(target);
        this.selectSubfault = new (Ext.extend(gxp.plugins.ClickableFeatures, {
            featureManager: subfaultManager.id,
            autoActivate: false,
            parent: this,
            init: function(target) {
                gxp.plugins.ClickableFeatures.prototype.init.apply(this, arguments);
                var tool = this;
                this.control = new OpenLayers.Control({
                    autoActivate: true,
                    handler: new OpenLayers.Handler.Click(this, {
                        click: function(evt) {
                            tool.noFeatureClick(evt);
                        }
                    }),
                    displayClass: "appSelectSubfault"
                });
                target.mapPanel.map.addControl(this.control);
            },
            activate: function() {
                if (gxp.plugins.ClickableFeatures.prototype.activate.apply(this, arguments)) {
                    this.control.activate();
                    subfaultManager.showLayer(this.id);
                    return true;
                }
            },
            deactivate: function() {
                if (gxp.plugins.ClickableFeatures.prototype.deactivate.apply(this, arguments)) {
                    this.control.deactivate();
                    return true;
                }
            },
            select: function(feature) {
                var sourceZone = this.parent.form.sourceZone;
                sourceZone.store.clearFilter();
                var rec = sourceZone.store.getById(feature.attributes.source_zone_id);
                sourceZone.setValue(rec.get("source_zone"));
            }
        }))();
        this.selectSubfault.init(target);
    },
    
    setWaveHeight: function() {
        if (!this.form) {
            return;
        }
        var hp = this.hazardPoint && this.hazardPoint.attributes.tsudat_id,
            rp = this.form.returnPeriod.getValue();
        this.setReturnPeriodFilter(rp, hp);
        if (hp && rp) {
            Ext.Ajax.request({
                method: "GET",
                url: "/tsudat/wave_height/",
                params: {
                    hp: hp,
                    rp: rp
                },
                success: function(response) {
                    var result = Ext.decode(response.responseText)[0];
                    this.form.waveHeight.setValue(result.fields.wave_height);
                },
                scope: this
            });
        }
    },
    
    setReturnPeriod: function() {
        if (!this.form) {
            return;
        }
        var hp = this.hazardPoint.attributes.tsudat_id,
            wh = this.form.waveHeight.getValue(),
            whd = this.form.waveHeightDelta.getValue();
        if (hp && wh && whd) {
            Ext.Ajax.request({
                method: "GET",
                url: "/tsudat/return_period/",
                params: {
                    hp: hp,
                    wh: wh,
                    whd: whd
                },
                success: function(response) {
                    var result = Ext.decode(response.responseText)[0];
                    var returnPeriod = result.fields.return_period;
                    this.form.returnPeriod.setValue(returnPeriod);
                    this.setReturnPeriodFilter(returnPeriod, hp);
                },
                scope: this
            });
        }
    },
    
    setReturnPeriodFilter: function(returnPeriod, hazardPoint) {
        var hpRec;
        if (returnPeriod) {
            hpRec = this.target.getLayerRecordFromMap({
                name: "tsudat:tsudat_hazardpoint",
                source: "local"
            });
            if (hpRec) {
                var filter = "return_period=" + returnPeriod;
                var hpLayer = hpRec.getLayer();
                if (hpLayer.params.CQL_FILTER != filter) {
                    // make initially invisible layer visible
                    hpLayer.params.CQL_FILTER || hpLayer.setVisibility(true);
                    hpLayer.mergeNewParams({
                        layers: "tsudat:tsudat_hazardpoint_rp",
                        styles: null,
                        sld: "http://localhost/tsudat/hp_rp_style.xml?rp=" + returnPeriod,
                        cql_filter: filter
                    });
                }
            }
            if (hazardPoint) {
                sfRec = this.target.getLayerRecordFromMap({
                    name: "tsudat:tsudat_subfault",
                    source: "local"
                });
                filter += " AND hazardpoint_tsudat_id=" + hazardPoint;
                var sfLayer = sfRec.getLayer();
                if (sfLayer.params.CQL_FILTER != filter) {
                    sfLayer.mergeNewParams({
                        layers: "tsudat:tsudat_subfault_contribution",
                        styles: "tsudat_subfault_contribution",
                        cql_filter: filter
                    });
                }
            }
        }
        return !!hpRec;
    },
        
    updateEventGrid: function() {
        if (!this.form) {
            return;
        }
        var hp = this.hazardPoint ? this.hazardPoint.attributes.tsudat_id : "",
            wh = this.form.waveHeight.getValue(),
            whd = this.form.waveHeightDelta.getValue(),
            sz = this.form.sourceZone.getValue(),
            valid = hp !== "" && wh !== "" && whd !== "" && sz !== "",
            params = {
                hp: hp,
                wh: wh,
                whd: whd,
                sz: sz
            },
            gridParams = Ext.encode(params);
        if (valid) {
            if (gridParams != this.currentGridParams) {
                this.currentGridParams = gridParams;
                this.form.eventGrid.getSelectionModel().clearSelections();
                this.showEventGrid();
                new Ext.LoadMask(this.form.eventGrid.body, {
                    store: this.form.eventGrid.store
                }).show();
                this.form.eventGrid.store.load({
                    params: params,
                    callback: function(records) {
                        this.showEventGrid(records.length);
                    },
                    scope: this
                });
            }
        } else {
            this.hideEventGrid();
        }
    },
    
    showEventGrid: function(count) {
        if (this.form) {
            this.form.eventGridInstructions.el.update(count != null ? String.format(
                this.selectEventInstructions, count
            ) : this.loadingEventsMsg);
            this.form.eventGrid.show();
        }
    },
    
    hideEventGrid: function() {
        if (this.form && !this.form.eventGrid.hidden) {
            this.form.eventGrid.getSelectionModel().clearSelections();
            this.form.eventGrid.hide();
            this.form.eventGridInstructions.el.update(this.eventGridInstructions);
            this.currentGridParams = null;
        }
    }
        
});

Ext.preg(TsuDat2.Scenario.prototype.ptype, TsuDat2.Scenario);