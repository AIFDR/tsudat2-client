/*
 * @require TsuDat2.js
 */

TsuDat2.WizardStep = Ext.extend(gxp.plugins.Tool, {
    
    autoActivate: false,
    
    /** api: property[index]
     *  ``Number`` index of this tool in the wizard container. Useful for
     *  enabling and disabling step panels when another step changes its valid
     *  state.
     */
    index: null,
    
    /** private: property[valid]
     *  ``Boolean`` Is the wizard step's form currently valid?
     */
    valid: false,
    
    addOutput: function(config) {
        var output = Ext.ComponentMgr.create(config);
        output.on("added",function(cmp, ct) {
            this.index = ct.ownerCt.items.indexOf(ct);
            ct.setDisabled(this.index != 0);
            this.target.on({
                "valid": function(plugin) {
                    if (this.target.previousStepsCompleted(this)) {
                        ct.enable();
                    }
                },
                "invalid": function(plugin) {
                    if (!this.target.previousStepsCompleted(this)) {
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
        }, this);
        return TsuDat2.WizardStep.superclass.addOutput.call(this, output);
    }

});