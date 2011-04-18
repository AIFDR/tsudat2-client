/*
 * @require TsuDat2.js
 */

TsuDat2.GenerateSimulation = Ext.extend(gxp.plugins.Tool, {
    
    ptype: "app_generatesimulation",
    
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
    /** end i18n */
    
    /** private: property[valid]
     *  ``Boolean`` Is the form currently valid?
     */
    valid: true,
    
    addOutput: function(config) {
        return (this.form = TsuDat2.GenerateSimulation.superclass.addOutput.call(this, {
            xtype: "form",
            labelWidth: 95,
            monitorValid: true,
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
                text: this.addGaugePointLabel,
                iconCls: "icon-add",
                anchor: null
            }],
            listeners: {
                "added": function(cmp, ct) {
                    // start disabled because we're not step 1.
                    ct.disable();
                    // enable/disable based on SimulationParameters (step 3) validity.
                    this.target.on({
                        "valid": function(plugin) {
                            if (plugin instanceof TsuDat2.SimulationParameters) {
                                ct.enable();
                            }
                        },
                        "invalid": function(plugin) {
                            if (plugin instanceof TsuDat2.SimulationParameters) {
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
                "clientvalidation": function(fp, valid) {
                    valid = valid && !this.form.ownerCt.disabled;
                    if (valid !== this.valid) {
                        this.valid = valid;
                        this.target.fireEvent(valid ? "valid" : "invalid", this);
                    }
                },
                scope: this
            }
        }));
    }
    
});

Ext.preg(TsuDat2.GenerateSimulation.prototype.ptype, TsuDat2.GenerateSimulation);