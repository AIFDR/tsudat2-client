/*
 * @require TsuDat2.js
 */

TsuDat2.SimulationArea = Ext.extend(gxp.plugins.Tool, {
    
    ptype: "app_simulationarea",
    
    addOutput: function(config) {
        return (this.form = TsuDat2.SimulationArea.superclass.addOutput.call(this, {
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
                html: "<b>Define the area for the tsunami simulation.</b> Draw or upload the area over which to run the simulation, add and rank elevetion data, then define the default mesh resolution."
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: "Simulation Area",
                items: [{
                    xtype: "button",
                    text: "Draw"
                }, {
                    xtype: "label",
                    text: "or",
                    cls: "composite"
                }, {
                    xtype: "button",
                    text: "Import"
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: "Mesh Resolution",
                items: [{
                    xtype: "numberfield",
                    value: 1000000,
                    width: 60
                }, {
                    xtype: "label",
                    text: "m²",
                    cls: "composite"
                }]
            }, {
                xtype: "container",
                layout: "hbox",
                fieldLabel: "Elevation Data",
                items: [{
                    xtype: "button",
                    text: "Add data"
                }]
            }]
        }));
    }
    
});

Ext.preg(TsuDat2.SimulationArea.prototype.ptype, TsuDat2.SimulationArea);