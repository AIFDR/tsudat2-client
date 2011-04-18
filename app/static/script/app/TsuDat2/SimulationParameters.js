/*
 * @require TsuDat2.js
 */

TsuDat2.SimulationParameters = Ext.extend(gxp.plugins.Tool, {
    
    ptype: "app_simulationparameters",
    
    /** i18n */
    defineParametersInstructions: "<b>Define parameters for the simulation.</b> These include tide, duration, etc.",
    tideLabel: "Tide",
    startTimeLabel: "Start time",
    endTimeLabel: "End time",
    smoothingLabel: "Smoothing",
    /** end i18n */
    
    /** private: property[valid]
     *  ``Boolean`` Is the form currently valid?
     */
    valid: true,
    
    addOutput: function(config) {
        return (this.form = TsuDat2.SimulationParameters.superclass.addOutput.call(this, {
            xtype: "form",
            labelWidth: 80,
            monitorValid: true,
            defaults: {
                anchor: "100%"
            },
            items: [{
                xtype: "box",
                autoEl: {
                    tag: "p",
                    cls: "x-form-item"
                },
                html: this.defineParametersInstructions
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: this.tideLabel,
                items: [{
                    xtype: "numberfield",
                    value: 1,
                    width: 60,
                    allowBlank: false
                }, {
                    xtype: "label",
                    text: "m",
                    cls: "composite"
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: this.startTimeLabel,
                items: [{
                    xtype: "numberfield",
                    value: 0,
                    width: 60,
                    allowBlank: false
                }, {
                    xtype: "label",
                    text: "seconds",
                    cls: "composite"
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: this.endTimeLabel,
                items: [{
                    xtype: "numberfield",
                    value: 1000000,
                    width: 60,
                    allowBlank: false
                }, {
                    xtype: "label",
                    text: "seconds",
                    cls: "composite"
                }]
            }, {
                xtype: "numberfield",
                fieldLabel: this.smoothingLabel,
                width: 60,
                anchor: null,
                value: 0.00001,
                allowBlank: false
            }],
            listeners: {
                "added": function(cmp, ct) {
                    // start disabled because we're not step 1.
                    ct.disable();
                    // enable/disable based on SimulationArea (step 2) validity.
                    this.target.on({
                        "valid": function(plugin) {
                            if (plugin instanceof TsuDat2.SimulationArea) {
                                ct.enable();
                                this.target.fireEvent(this.valid ? "valid" : "invalid", this);
                            }
                        },
                        "invalid": function(plugin) {
                            if (plugin instanceof TsuDat2.SimulationArea) {
                                ct.disable();
                            }
                        },
                        scope: this
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

Ext.preg(TsuDat2.SimulationParameters.prototype.ptype, TsuDat2.SimulationParameters);