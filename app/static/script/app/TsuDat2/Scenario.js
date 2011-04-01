/*
 * @require TsuDat2.js
 */

TsuDat2.Scenario = Ext.extend(gxp.plugins.Tool, {
    
    ptype: "app_scenario",
    
    /** private: property[selectHazardPoint]
     *  :class:`gxp.plugins.ClickableFeatures` tool for selecting hazard points
     *  on the map
     */
    selectHazardPoint: null,
    
    init: function(target) {
        var epsg4326 = new OpenLayers.Projection("EPSG:4326");
        var format = function(coord, axis) {
            return OpenLayers.Util.getFormattedLonLat(coord, axis, "dm");
        };
        
        var featureManager = new gxp.plugins.FeatureManager({
            id: this.id + "featuremanager",
            layer: {
                source: "local",
                name: "tsudat:tsudat_hazardpoint"
            },
            paging: false
        });
        featureManager.init(target);
        featureManager.featureLayer.events.on({
            "featureselected": function(evt) {
                var feature = evt.feature;
                this.form.hazardPoint.setValue(feature.attributes.tsudat_id);
                var geom = feature.geometry.clone().transform(
                    feature.layer.map.getProjectionObject(), epsg4326
                );
                this.form.hazardPointCoords.setValue(
                    format(geom.x, "lat") + ", " + format(geom.y, "lon")
                );
            },
            scope: this
        });
        
        this.selectHazardPoint = new (Ext.extend(gxp.plugins.ClickableFeatures, {
            featureManager: featureManager.id,
            autoActivate: false,
            init: function(target) {
                gxp.plugins.ClickableFeatures.prototype.init.apply(this, arguments);
                var tool = this;
                this.control = new (OpenLayers.Class(OpenLayers.Control, {
                    autoActivate: true,
                    initialize: function() {
                        OpenLayers.Control.prototype.initialize.apply(this, arguments);
                        this.handler = new OpenLayers.Handler.Click(this, {
                            click: function(evt) {
                                tool.noFeatureClick(evt);
                            }
                        });
                    } 
                }))();
                target.mapPanel.map.addControl(this.control);
            },
            activate: function() {
                if (gxp.plugins.ClickableFeatures.prototype.activate.apply(this, arguments)) {
                    this.control.activate();
                    featureManager.showLayer(this.id);
                    return true;
                }
            },
            deactivate: function() {
                if (gxp.plugins.ClickableFeatures.prototype.deactivate.apply(this, arguments)) {
                    featureManager.hideLayer(this.id);
                    this.control.deactivate();
                    return true;
                }
            }
        }))();
        this.selectHazardPoint.init(target);

        TsuDat2.Scenario.superclass.init.apply(this, arguments);
    },
    
    activate: function() {
        if (TsuDat2.Scenario.superclass.activate.apply(this, arguments)) {
            this.selectHazardPoint.activate();
            return true;
        }
    },
    
    deactivate: function() {
        if (TsuDat2.Scenario.superclass.deactivate.apply(this, arguments)) {
            this.selectHazardPoint.deactivate();
            return true;
        }
    },
    
    addOutput: function(config) {
        return (this.form = TsuDat2.Scenario.superclass.addOutput.call(this, {
            xtype: "form",
            labelWidth: 80,
            defaults: {
                anchor: "100%"
            },
            items: [{
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: "<b>Define the scenario for the tsunami simulation.</b> First, select a hazard point from within the simulation area. Then, define the return period or wave height range."
            }, {
                xtype: "hidden",
                ref: "hazardPoint"
            }, {
                xtype: "textfield",
                ref: "hazardPointCoords",
                fieldLabel: "Hazard Point",
                emptyText: "Select from map",
                readOnly: true,
                allowBlank: false,
                cls: "hazardpoint", // add GetLegendGraphic icon
                listeners: {
                    "valid": this.setWaveHeight,
                    scope: this
                }
            }, {
                xtype: "combo",
                ref: "returnPeriod",
                fieldLabel: "Return Period",
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
                                rpField.setValue(store.getAt(0).get(rpField.valueField));
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
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: "Wave Height",
                items: [{
                    xtype: "numberfield",
                    ref: "../waveHeight",
                    width: 50,
                    allowBlank: false,
                    listeners: {
                        "valid": this.setReturnPeriod,
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
                        "valid": this.setReturnPeriod,
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
                html: "<b>Additionally, define parameters for the simulation.</b> These include tide, duration, etc."
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: "Tide",
                items: [{
                    xtype: "numberfield",
                    value: 1,
                    width: 60
                }, {
                    xtype: "label",
                    text: "m",
                    cls: "composite"
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: "Start time",
                items: [{
                    xtype: "numberfield",
                    value: 0,
                    width: 60
                }, {
                    xtype: "label",
                    text: "seconds",
                    cls: "composite"
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: "End time",
                items: [{
                    xtype: "numberfield",
                    value: 1000000,
                    width: 60
                }, {
                    xtype: "label",
                    text: "seconds",
                    cls: "composite"
                }]
            }, {
                xtype: "numberfield",
                fieldLabel: "Smoothing",
                width: 60,
                anchor: null,
                value: 0.00001
            }],
            listeners: {
                "added": function(cmp, ct) {
                    ct.on({
                        "collapse": this.deactivate,
                        "expand": this.activate,
                        scope: this
                    });
                },
                scope: this
            }
        }));
    },
    
    setWaveHeight: function() {
        if (!this.form) {
            return;
        }
        var hp = this.form.hazardPoint.getValue(),
            rp = this.form.returnPeriod.getValue();
        if (hp && rp) {
            Ext.Ajax.request({
                method: "GET",
                url: "/tsudat/wave_height",
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
        var hp = this.form.hazardPoint.getValue(),
            wh = this.form.waveHeight.getValue(),
            whd = this.form.waveHeightDelta.getValue();
        if (hp && wh && whd) {
            Ext.Ajax.request({
                method: "GET",
                url: "/tsudat/return_period",
                params: {
                    hp: hp,
                    wh: wh,
                    whd: whd
                },
                success: function(response) {
                    var result = Ext.decode(response.responseText)[0];
                    this.form.returnPeriod.setValue(result.fields.return_period);
                },
                scope: this
            });
        }
    }
    
});

Ext.preg(TsuDat2.Scenario.prototype.ptype, TsuDat2.Scenario);