Ext.ns("TsuDat2.plugins");

TsuDat2.plugins.Language = Ext.extend(gxp.plugins.Tool, {

    emptyText: "Select language",

    /** api: ptype = app_language */
    ptype: "app_language",

    /** api: method[addOutput]
     */
    addOutput: function(config) {
        return TsuDat2.plugins.Language.superclass.addOutput.call(this, {
            xtype: "combo",
            store: [["en", "English"], ["id", "Indonesian"]],
            mode: 'local',
            emptyText: this.emptyText,
            value: GeoExt.Lang.locale,
            listeners: {
                "select": this.onComboSelect,
                scope: this
            },
            triggerAction: "all"
        });
    },

    /** private: method[onComboSelect]
     *  Listener for combo's select event.
     */
    onComboSelect: function(combo, record) {
        var language = combo.getValue();
        if (language != GeoExt.Lang.locale) {
            window.location.search = Ext.urlEncode({"lang":language});
        }
    }

});

Ext.preg(TsuDat2.plugins.Language.prototype.ptype, TsuDat2.plugins.Language);
