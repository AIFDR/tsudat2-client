/*
 * @require TsuDat2.js
 */

TsuDat2.SimulationParameters = Ext.extend(gxp.plugins.WizardStep, {
    
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
    
    addOutput: function(config) {
        var data; // result data
        var output = TsuDat2.SimulationParameters.superclass.addOutput.call(this, {
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
                    value: 0,
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
                    value: 3600,
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
                value: 0.1,
                allowBlank: false
            }, {
                xtype: "radiogroup",
                name: "model_setup",
                fieldLabel: this.modelSetupLabel,
                columns: 1,
                items: [{
                    xtype: "radio",
                    name: "model_setup_value",
                    boxLabel: this.trialLabel,
                    checked: true,
                    value: "T"
                }, {
                    xtype: "radio",
                    name: "model_setup_value",
                    boxLabel: this.finalLabel,
                    value: "F"
                }]
            }],
            listeners: {
                "clientvalidation": function(fp, valid) {
                    if (valid) {
                        values = output.getForm().getFieldValues();
                        values.model_setup = values.model_setup.value;
                        var newData = Ext.encode(values);
                        if (data != newData) {
                            data = newData;
                            this.setValid(valid, values);
                        }
                    }
                },
                scope: this
            }
        });
        return output;
    }
    
});

Ext.preg(TsuDat2.SimulationParameters.prototype.ptype, TsuDat2.SimulationParameters);