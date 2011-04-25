/*
 * @require TsuDat2/WizardStep.js
 */

TsuDat2.SimulationParameters = Ext.extend(TsuDat2.WizardStep, {
    
    /** i18n */
    defineParametersInstructions: "<b>Define parameters for the simulation.</b> These include tide, duration, etc.",
    tideLabel: "Tide",
    startTimeLabel: "Start time",
    endTimeLabel: "End time",
    smoothingLabel: "Smoothing",
    modelSetupLabel: "Model Setup",
    trialLabel: "Trial",
    finalLabel: "Final",
    /** end i18n */
    
    ptype: "app_simulationparameters",
    
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
                    name: "initial_tidal_stage",
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
                    name: "start_time",
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
                    name: "end_time",
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
                name: "smoothing_param",
                width: 60,
                anchor: null,
                value: 0.00001,
                allowBlank: false
            }, {
                xtype: "radiogroup",
                fieldLabel: this.modelSetupLabel,
                columns: 1,
                items: [{
                    xtype: "radio",
                    name: "model_setup",
                    boxLabel: this.trialLabel,
                    checked: true
                }, {
                    xtype: "radio",
                    name: "model_setup",
                    boxLabel: this.finalLabel
                }]
            }],
            listeners: {
                "clientvalidation": function(fp, valid) {
                    if (valid !== this.valid) {
                        this.valid = valid;
                        var data = this.form.getFormValues();
                        data.model_setup = data.model_setup[0] ? "T" : "F";
                        if (valid) {
                            this.target.fireEvent("valid", this, data);
                        } else {
                            this.target.fireEvent("invalid", this);                            
                        }
                    }
                },
                scope: this
            }
        }));
        return output;
    }
    
});

Ext.preg(TsuDat2.SimulationParameters.prototype.ptype, TsuDat2.SimulationParameters);