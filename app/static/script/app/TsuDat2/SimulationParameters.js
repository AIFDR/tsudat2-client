/*
 * @require TsuDat2.js
 */

TsuDat2.SimulationParameters = Ext.extend(gxp.plugins.Tool, {
    
    /** i18n */
    defineParametersInstructions: "<b>Define parameters for the simulation.</b> These include tide, duration, etc.",
    tideLabel: "Tide",
    startTimeLabel: "Start time",
    endTimeLabel: "End time",
    smoothingLabel: "Smoothing",
    /** end i18n */
    
    ptype: "app_simulationparameters",
    
    autoActivate: false,

    /** api: property[index]
     *  ``Number`` index of this tool in the wizard container. Useful for
     *  enabling and disabling step panels when another step changes its valid
     *  state.
     */
    index: null,
    
    /** private: property[valid]
     *  ``Boolean`` Is the form currently valid?
     */
    valid: true,
    
    addOutput: function(config) {
        var output = (this.form = TsuDat2.SimulationParameters.superclass.addOutput.call(this, {
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
                    this.index = ct.ownerCt.items.indexOf(ct);
                    ct.setDisabled(this.index != 0);
                    this.target.on({
                        "valid": function(plugin) {
                            if (plugin.index == this.index - 1) {
                                ct.enable();
                                this.target.fireEvent(this.valid ? "valid" : "invalid", this);
                            }
                        },
                        "invalid": function(plugin) {
                            if (plugin.index < this.index) {
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
                    if (valid !== this.valid) {
                        this.valid = valid;
                        this.target.fireEvent(valid ? "valid" : "invalid", this);                            
                    }
                },
                scope: this
            }
        }));
        return output;
    }
    
});

Ext.preg(TsuDat2.SimulationParameters.prototype.ptype, TsuDat2.SimulationParameters);