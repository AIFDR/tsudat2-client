/*
 * @require TsuDat2.js
 */

TsuDat2.SimulationParameters = Ext.extend(gxp.plugins.Tool, {
    
    ptype: "app_simulationparameters",
    
    addOutput: function(config) {
        return (this.form = TsuDat2.SimulationParameters.superclass.addOutput.call(this, {
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
                html: "<b>Define parameters for the simulation.</b> These include tide, duration, etc."
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
            }]
        }));
    }
    
});

Ext.preg(TsuDat2.SimulationParameters.prototype.ptype, TsuDat2.SimulationParameters);