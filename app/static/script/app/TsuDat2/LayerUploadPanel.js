/**
 * @require FileUploadField.js
 */

Ext.ns("TsuDat2");

TsuDat2.LayerUploadPanel = Ext.extend(Ext.FormPanel, {

    /** private: property[fileUpload]
     *  ``Boolean``
     */
    fileUpload: true,

    /** api: config[url]
     *  ``String``
     *  URL for upload endpoint.
     */

    /** i18n */
    baseFileEmptyText: "Select a layer data file",
    baseFileLabel: "Data",
    titleLabel: "Title",
    sldEmptyText: "Select a .sld style file (optional)",
    sldLabel: "SLD",
    abstractLabel: "Abstract",
    dbfEmptyText: "Select a .dbf data file",
    dbfLabel: "DBF",
    dbfInvalidText: "Invalid DBF File.",
    shxEmptyText: "Select a .shx data file",
    shxLabel: "SHX",
    shxInvalidText: "Invalid SHX File.",
    prjEmptyText: "Select a .prj data file (optional)",
    prjLabel: "PRJ",
    prjInvalidText: "Invalid PRJ File.", 
    uploadButtonText: "Upload",
    waitMsg: "Uploading your data...",
    errorTitle: "Error",
    permissionsText: "Permissions",

    /** private: method[initComponent]
     */
    initComponent: function() {
        var me = this;
        var listeners = {
            "fileselected": function(cmp, value) {
                // remove the path from the filename - avoids C:/fakepath etc.
                cmp.setValue(value.split(/[/\\]/).pop());
            }
        };
        var initialPermissions = {"anonymous":"layer_readonly","users":[]};
        this.items = [{
            xtype: "textfield",
            name: "layer_title",
            fieldLabel: this.titleLabel,
            allowBlank: true
        }, {
            xtype: "fileuploadfield",
            emptyText: this.baseFileEmptyText,
            fieldLabel: this.baseFileLabel,
            name: "base_file",
            buttonText: "",
            buttonCfg: {
                iconCls: "gxp-icon-filebrowse"
            },
            listeners: {
                "fileselected": function(cmp, value) {
                    // remove the path from the filename - avoids C:/fakepath etc.
                    cmp.setValue(value.split(/[/\\]/).pop());
                    var isSHP = (/\.shp$/i).test(value);
                    var fields = ["dbf_file", "shx_file", "prj_file"];
                    for (var key in fields) {
                        var fld = this.getForm().findField(fields[key]);
                        if (fld) {
                            fld.setVisible(isSHP);
                        }
                    }
                },
                scope: this
            }
        }, {
            xtype: "fileuploadfield",
            emptyText: this.dbfEmptyText,
            fieldLabel: this.dbfLabel,
            name: 'dbf_file',
            hidden: true,
            hideMode:'offsets',
            allowBlank: true,
            buttonText: "",
            buttonCfg: {
                iconCls: "gxp-icon-filebrowse"
            },
            listeners: listeners,
            validator: function(name) {
                if ((name.length > 0) && (name.search(/\.dbf$/i) == -1)) {
                    return me.dbfInvalidText;
                } else {
                    return true;
                }
            }
        }, {
            xtype: "fileuploadfield",
            emptyText: this.shxEmptyText,
            fieldLabel: this.shxLabel,
            name: 'shx_file',
            hidden: true,
            hideMode:'offsets',
            allowBlank: true,
            buttonText: "",
            buttonCfg: {
                iconCls: "gxp-icon-filebrowse"
            },
            listeners: listeners,
            validator: function(name) {
                if ((name.length > 0) && (name.search(/\.shx$/i) == -1)) {
                    return me.shxInvalidText;
                } else {
                    return true;
                }
            }
        }, {
            xtype: "fileuploadfield",
            emptyText: this.prjEmptyText,
            fieldLabel: this.prjLabel,
            name: 'prj_file',
            hidden: true,
            hideMode:'offsets',
            allowBlank: true,
            buttonText: "",
            buttonCfg: {
                iconCls: "gxp-icon-filebrowse"
            },
            listeners: listeners,
            validator: function(name) {
                if ((name.length > 0) && (name.search(/\.prj$/i) == -1)) {
                    return me.prjInvalidText;
                } else {
                    return true;
                }
            }
        }, {
            xtype: "fileuploadfield",
            emptyText: this.sldEmptyText,
            fieldLabel: this.sldLabel,
            name: 'sld_file',
            buttonText: "",
            buttonCfg: {
                iconCls: "gxp-icon-filebrowse"
            },
            listeners: listeners,
            allowBlank: true
        }, {
            xtype: "textfield",
            fieldLabel: this.abstractLabel,
            name: 'abstract',
            allowBlank: true
        }, {
            xtype: "hidden",
            name: "permissions",
            value: Ext.util.JSON.encode(initialPermissions)
        }, {
            xtype: "hidden",
            name: "csrfmiddlewaretoken",
            value: "NOTPROVIDED"
        }];

        this.buttons = [{
            text: this.permissionsText,
            handler: function() {
                new Ext.Window({
                    title: this.permissionsText,
                    resizable: false,
                    width: 260,
                    items: [{xtype: 'container', id: 'permissionsPanel'}]
                }).show();
                var permissions = Ext.util.JSON.decode(me.getForm().findField('permissions').getValue());
                var editor = new GeoNode.PermissionsEditor({
                    renderTo: 'permissionsPanel',
                    userLookup: "/accounts/ajax_lookup",
                    permissions: permissions,
                    listeners: {
                        updated: function(pe) {
                            me.getForm().findField('permissions').setValue(Ext.util.JSON.encode(pe.writePermissions()));
                        }
                    }
                });
            },
            scope: this
        }, {
            text: this.uploadButtonText,
            handler: function(){
                if (this.getForm().isValid()) {
                   this.getForm().submit({
                        url: this.url,
                        waitMsg: this.waitMsg,
                        success: function(fp, o) {
                            this.fireEvent("uploadcomplete", this);
                        },
                        failure: function(fp, o) {
                            var error_message = '<ul>';
                            for (var i = 0; i < o.result.errors.length; i++) {
                                error_message += '<li>' + o.result.errors[i] + '</li>';
                            }
                            error_message += '</ul>';

                            Ext.Msg.show({
                                title: this.errorTitle,
                                msg: error_message,
                                minWidth: 200,
                                modal: true,
                                icon: Ext.Msg.ERROR,
                                buttons: Ext.Msg.OK
                            });
                        },
                        scope: this
                    });
                }
            },
            scope: this
        }];

        this.addEvents(
            /**
             * Event: uploadcomplete
             * Fires upon successful upload.
             *
             * Listener arguments:
             * panel - {<gxp.LayerUploadPanel} This form panel.
             */
            "uploadcomplete"
        );

        TsuDat2.LayerUploadPanel.superclass.initComponent.call(this);

    }

});

/** api: xtype = app_layeruploadpanel */
Ext.reg("app_layeruploadpanel", TsuDat2.LayerUploadPanel);
