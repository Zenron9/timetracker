Ext.define('Netresearch.widget.Admin', {
    extend: 'Ext.tab.Panel',

    requires: [
        'Netresearch.store.AdminCustomers',
        'Netresearch.store.AdminProjects',
        'Netresearch.store.AdminTeams',
        'Netresearch.store.AdminUsers',
        'Netresearch.store.AdminPresets',
        'Netresearch.store.TicketSystems',
    ],

    /* Load all neccessary stores */
    customerStore: Ext.create('Netresearch.store.AdminCustomers'),
    projectStore: Ext.create('Netresearch.store.AdminProjects'),
    userStore: Ext.create('Netresearch.store.AdminUsers'),
    teamStore: Ext.create('Netresearch.store.AdminTeams'),
    ticketSystemStore: Ext.create('Netresearch.store.TicketSystems'),
    activityStore: Ext.create('Netresearch.store.Activities'),
    presetStore: Ext.create('Netresearch.store.AdminPresets'),

    /* Strings */
    _tabTitle: 'Administration',
    _nameTitle: 'Name',
    _teamsTitle: 'Teams',
    _activeTitle: 'Active',
    _globalTitle: 'Global',
    _addCustomerTitle: 'Add customer',
    _editTitle: 'Edit',
    _editCustomerTitle: 'Edit customer',
    _forAllTeamsTitle: 'for all teams',
    _saveTitle: 'Save',
    _deleteTitle: 'Delete',
    _seriousErrorTitle: 'A serious error occured. Find more details in Firebug or the Chrome Developer Tools.',
    _customerTitle: 'Customer',
    _ticketPrefixTitle: 'Ticket prefix',
    _ticketSystemTitle: 'Ticket system',
    _projectTitle: 'Project',
    _addProjectTitle: 'Add project',
    _editProjectTitle: 'Edit project',
    _forAllCustomersTitle: 'for all customers',
    _userNameTitle: 'User name',
    _abbreviationTitle: 'Abbr',
    _typeTitle: 'Type',
    _addUserTitle: 'Add user',
    _editUserTitle: 'Edit user',
    _languageTitle: 'Language',
    _developerTitle: 'Developer',
    _projectManagerTitle: 'Project manager',
    _controllingTitle: 'Controlling',
    _teamTitle: 'Team',
    _teamLeadTitle: 'Team lead',
    _customerManagementTitle: 'Customer management',
    _projectManagementTitle: 'Project management',
    _userManagementTitle: 'User management',
    _teamManagementTitle: 'Team management',
    _presetManagementTitle: 'Preset management',
    _presetSavedTitle: 'The preset has been successfully saved.',
    _addPresetTitle: 'Add preset',
    _editPresetTitle: 'Edit preset',
    _activityTitle: 'Activity',
    _descriptionTitle: 'Description',
    _ticketSystemManagementTitle: 'Ticket system management',
    _ticketSystemSavedTitle: 'The ticket system has been successfully saved.',
    _urlTitle: 'URL',
    _timebookingTitle: 'Time booking',
    _loginTitle: 'Login',
    _passwordTitle: 'Password',
    _publicKeyTitle: 'Public key',
    _privateKeyTitle: 'Private key',
    _addTicketSystemTitle: 'Add ticket system',
    _errorsTitle: 'Errors',
    _errorTitle: 'Error',
    _successTitle: 'Success',
    _estimationTitle: 'Estimated Duration',
    _offerTitle: 'Offer',
    _billingTitle: 'Billing',
    _costCenterTitle: 'Cost Center',
    _projectLeadTitle: 'Project Lead',
    _technicalLeadTitle: 'Technical Lead',
    _max31CharactersTitle: 'At maximum 31 characters are allowed here',

    initComponent: function () {
        var panel = this;

        var billingStore = new Ext.data.ArrayStore({
            fields: ['value', 'displayname'],
            data: [
                [0, 'None'],
                [1, 'Time And Material'],
                [2, 'Fixed Price']
            ]
        });

        var customerGrid = Ext.create('Ext.grid.Panel', {
            store: this.customerStore,
            teamStore: this.teamStore,
            columns: [
                {
                    header: 'Id',
                    dataIndex: 'id',
                    hidden: true
                }, {
                    header: this._nameTitle,
                    dataIndex: 'name',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._teamsTitle,
                    dataIndex: 'teams',
                    flex: 1,
                    renderer: function(value) {
                        var output = '';
                        /* Display space seperated list of related teams */
                        Ext.each(value, function(teamId) {
                            if (isNaN(teamId)) {
                              return;
                            }
                            var team = customerGrid.teamStore.getById(parseInt(teamId));
                            if (null == team) {
                              return;
                            }
                            if (output != '')
                                output += ', ';
                            output += team.data.name;
                        });
                        return output;
                    }
                },
                {
                    header: this._activeTitle,
                    dataIndex: 'active',
                    field: {
                        xtype: 'checkbox'
                    },
                    renderer: function(value) {
                        return renderCheckbox(value);
                    }
                },
                {
                    header: this._globalTitle,
                    dataIndex: 'global',
                    field: {
                        xtype: 'checkbox'
                    },
                    renderer: function(value) {
                        return renderCheckbox(value);
                    }
                }
            ],
            tbar: [
                {
                    text: this._addCustomerTitle,
                    iconCls: 'icon-add',
                    scope: this,
                    handler: function() {
                        customerGrid.editCustomer();
                    }
                }
            ],
            listeners: {
                /* Right-click menu */
                itemcontextmenu: function(grid, record, item, index, event, options) {
                    event.stopEvent();

                    var contextMenu = Ext.create('Ext.menu.Menu', {
                        items: [
                            {
                                text: panel._editTitle,
                                iconCls: 'icon-edit',
                                scope: this,
                                handler: function() {
                                    this.editCustomer(record.data);
                                }
                            }
                        ]
                    });

                    contextMenu.showAt(event.xy);
                }
            },
            editCustomer: function(record) {
                if(!record) record = {};

                var teamStore = Ext.create('Netresearch.store.AdminTeams', {
                    autoLoad: false
                });

                var window = Ext.create('Ext.window.Window', {
                    title: panel._editCustomerTitle,
                    modal: true,
                    width: 400,
                    id: 'edit-customer-window',
                    layout: 'fit',
                    listeners: {
                        /* Reload on destroy */
                        destroy: {
                            scope: this,
                            fn: function() {
                                this.getStore().load();
                            }
                        }
                    },
                    items: [
                        new Ext.form.Panel({
                            bodyPadding: 5,
                            defaultType: 'textfield',
                            items: [
                                new Ext.form.field.Hidden({
                                    name: 'id',
                                    value: record.id ? record.id : 0
                                }), {
                                    fieldLabel: panel._nameTitle,
                                    name: 'name',
                                    anchor: '100%',
                                    allowBlank: false,
                                    minLength: 3,
                                    value: record.name ? record.name : ''
                                },
                                new Ext.form.field.Checkbox({
                                    fieldLabel: panel._activeTitle,
                                    name: 'active',
                                    inputValue: 1,
                                    checked: record.active ? record.active : 0
                                }),
                                new Ext.form.field.Checkbox({
                                    fieldLabel: panel._globalTitle + '(' + panel._forAllTeamsTitle + ')',
                                    name: 'global',
                                    inputValue: 1,
                                    checked: record.global ? record.global : 0
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._teamsTitle,
                                    name: 'teams[]',
                                    store: teamStore,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    anchor: '100%',
                                    typeAhead: true,
                                    multiSelect: true,
                                    triggerAction: 'all',
                                    //disabled: record.global ? true : false,
                                    listeners: {
                                        /* Reload teams column to fit information */
                                        afterrender: function(field, value) {
                                            teamStore.load({ 
                                                params: { 
                                                    team: field.getValue()
                                                }
                                            });
                                        },
                                        select: function(field, value) {
                                            teamStore.load({ 
                                                params: { 
                                                    team: field.getValue()
                                                }
                                            });
                                        }
                                    },
                                    value: record.teams ? record.teams : []
                                })
                            ],
                            buttons: [
                                {
                                    text: panel._saveTitle,
                                    scope: this,
                                    handler: function(btn) {
                                        var form = btn.up('form').getForm();
                                        if (!form.isValid()) {
                                            var fields = form.getFields();
                                            var errors = [];

                                            /* Create Error-String and display Error-Window */
                                            for (i = 0; i < fields.length; i++) {
                                                errors.push(fields.items[i].getErrors().join(', '));
                                            }

                                            var errorsWindow = new Ext.Window({
                                                title: panel._errorsTitle,
                                                html: errors,
                                                width: 350
                                            });

                                            return errorsWindow.show();
                                        }

                                        var values = form.getValues();
                                        Ext.Ajax.request({
                                            url: url + 'customer/save',
                                            params: values,
                                            scope: this,
                                            success: function(response) {
                                                window.close();
                                            },
                                            failure: function(response) {
                                                /* If responsetext is less than 200 chars long (means not an exception
                                                 * stack trace), use responsetext. If not, show common help/error text
                                                 */
                                                message = response.responseText.length < 200
                                                    ? response.responseText
                                                    : panel._seriousErrorTitle;
                                                showNotification(panel._errorTitle, message, false);
                                            }
                                        });
                                    }
                                }
                            ]
                        })
                    ]
                });

                window.show();
            }
        });

        var projectGrid = Ext.create('Ext.grid.Panel', {
            ticketSystemStore: this.ticketSystemStore,
            customerStore: this.customerStore,
            ticketSystemStore: this.ticketSystemStore,
            store: this.projectStore,
            columns: [
                {
                    header: 'Id',
                    dataIndex: 'id',
                    hidden: true
                }, {
                    header: this._nameTitle,
                    dataIndex: 'name',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._customerTitle,
                    dataIndex: 'customer',
                    flex: 1,
                    field: {
                        xtype: 'textfield',
                        lazyRender: true,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        anchor: '100%'
                    },
                    renderer: function(id) {
                        var record = this.customerStore.getById(id);
                        return record ? record.get('name') : id;
                    }
                },
                {
                    header: this._ticketPrefixTitle,
                    dataIndex: 'jiraId',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._ticketSystemTitle,
                    dataIndex: 'ticket_system',
                    flex: 1,
                    field: {
                        xtype: 'textfield',
                        lazyRender: true,
                        queryMode: 'local',
                        store: this.ticketSystemStore,
                        displayField: 'name',
                        valueField: 'id',
                        anchor: '100%'
                    },
                    renderer: function(id) {
                        if (1 > parseInt(id))
                            return '';

                        var record = this.ticketSystemStore.getById(id);
                        return record ? record.get('name') : id;
                    }
                },
                {
                    header: this._additionalInformationFromExternal,
                    dataIndex: 'additionalInformationFromExternal',
                    field: {
                        xtype: 'checkbox'
                    },
                    renderer: function(value) {
                        return renderCheckbox(value);
                    }
                },
                {
                    header: this._activeTitle,
                    dataIndex: 'active',
                    field: {
                        xtype: 'checkbox'
                    },
                    renderer: function(value) {
                        return renderCheckbox(value);
                    }
                },
                {
                    header: this._globalTitle,
                    dataIndex: 'global',
                    field: {
                        xtype: 'checkbox'
                    },
                    renderer: function(value) {
                        return renderCheckbox(value);
                    }
                },
                {
                    header: this._offerTitle,
                    dataIndex: 'offer',
                    width: 70,
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._costCenterTitle,
                    dataIndex: 'cost_center',
                    width: 70,
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._billingTitle,
                    dataIndex: 'billing',
                    width: 70,
                    flex: 1,
                    field: {
                        xtype: 'textfield',
                        queryMode: 'local',
                        store: billingStore,
                        displayField: 'displayname',
                        valueField: 'value',
                        anchor: '100%'
                    },
                    renderer: function(value) {
                        var record = billingStore.findRecord('value', value);
                        return record ? record.get('displayname') : value;
                    }
                },
                {
                    header: this._estimationTitle,
                    dataIndex: 'estimation',
                    width: 100,
                    flex: 1,
                    align: 'right',
                    field: {
                        xtype: 'textfield'
                    },
                    renderer: function(value) {
                        return formatDuration(value, true);
                    }
                }
            ],
            tbar: [
                {
                    text: this._addProjectTitle,
                    iconCls: 'icon-add',
                    scope: this,
                    handler: function() {
                        projectGrid.editProject();
                    }
                }
            ],
            listeners: {
                /* Right-click menu */
                itemcontextmenu: function(grid, record, item, index, event, options) {
                    event.stopEvent();

                    var contextMenu = Ext.create('Ext.menu.Menu', {
                        items: [
                            {
                                text: panel._editTitle,
                                iconCls: 'icon-edit',
                                scope: this,
                                handler: function() {
                                    this.editProject(record.data);
                                }
                            }
                        ]
                    });

                    contextMenu.showAt(event.xy);
                }
            }, // end listeners
            editProject: function(record) {
                var projectLeadStore = Ext.create('Netresearch.store.AdminUsers');
                var technicalLeadStore = Ext.create('Netresearch.store.AdminUsers');
                var projectStore = Ext.create('Netresearch.store.AdminProjects', {
                    autoLoad: false
                });

                if (!record) {
                    record = {};
                }

                var window = Ext.create('Ext.window.Window', {
                    title: panel._editProjectTitle,
                    modal: true,
                    width: 400,
                    id: 'edit-project-window',
                    layout: 'fit',
                    listeners: {
                        destroy: {
                            scope: this,
                            fn: function() {
                                this.getStore().load();
                            }
                        }
                    },
                    items: [
                        new Ext.form.Panel({
                            bodyPadding: 5,
                            defaultType: 'textfield',
                            items: [
                                new Ext.form.field.Hidden({
                                    name: 'id',
                                    value: record.id ? record.id : 0
                                }), {
                                    fieldLabel: panel._nameTitle,
                                    name: 'name',
                                    anchor: '100%',
                                    value: record.name ? record.name : ''
                                },
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._customerTitle,
                                    name: 'customer',
                                    store: this.customerStore,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    anchor: '100%',
                                    disabled: record.customer ? true : false,
                                    listeners: {
                                        afterrender: function(field, value) {
                                            projectStore.load({ 
                                                params: { 
                                                    customer: field.getValue()
                                                }
                                            });
                                        },
                                        select: function(field, value) {
                                            projectStore.load({ 
                                                params: { 
                                                    customer: field.getValue()
                                                }
                                            });
                                        }
                                    },
                                    value: record.customer ? record.customer : ''
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._ticketSystemTitle,
                                    name: 'ticket_system',
                                    allowBlank: true,
                                    store: this.ticketSystemStore,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    anchor: '100%',
                                    value: record.ticket_system ? record.ticket_system : ''
                                }),
                                {
                                    fieldLabel: panel._ticketPrefixTitle,
                                    name: 'jiraId',
                                    anchor: '100%',
                                    value: record.jiraId ? record.jiraId : ''
                                },
                                new Ext.form.field.Checkbox({
                                    fieldLabel: panel._additionalInformationFromExternal,
                                    name: 'additionalInformationFromExternal',
                                    inputValue: 1,
                                    checked: record.additionalInformationFromExternal ? record.additionalInformationFromExternal : 0
                                }),
                                new Ext.form.field.Checkbox({
                                    fieldLabel: panel._activeTitle,
                                    name: 'active',
                                    inputValue: 1,
                                    checked: record.active ? record.active : 0
                                }),
                                new Ext.form.field.Checkbox({
                                    fieldLabel: panel._globalTitle + '(' + panel._forAllCustomersTitle + ')',
                                    name: 'global',
                                    inputValue: 1,
                                    checked: record.global ? record.global : 0
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._projectLeadTitle,
                                    name: 'project_lead',
                                    allowBlank: true,
                                    store: projectLeadStore,
                                    queryMode: 'local',
                                    displayField: 'username',
                                    valueField: 'id',
                                    anchor: '100%',
                                    value: record.project_lead ? record.project_lead : ''
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._technicalLeadTitle,
                                    name: 'technical_lead',
                                    allowBlank: true,
                                    store: technicalLeadStore,
                                    queryMode: 'local',
                                    displayField: 'username',
                                    valueField: 'id',
                                    anchor: '100%',
                                    value: record.technical_lead ? record.technical_lead : ''
                                }),
                                {
                                    fieldLabel: panel._offerTitle,
                                    name: 'offer',
                                    anchor: '100%',
                                    enforceMaxLength: true,
                                    maxLength: 31,
                                    maxLengthText: panel._max31CharactersTitle,
                                    value: record.offer ? record.offer : ''
                                },
                                {
                                    fieldLabel: panel._costCenterTitle,
                                    name: 'cost_center',
                                    anchor: '100%',
                                    enforceMaxLength: true,
                                    maxLength: 31,
                                    maxLengthText: panel._max31CharactersTitle,
                                    value: record.cost_center ? record.cost_center : ''
                                }, new Ext.form.ComboBox({
                                    fieldLabel: panel._billingTitle,
                                    name: 'billing',
                                    store: billingStore,
                                    queryMode: 'local',
                                    lazyRenderer: true,
                                    displayField: 'displayname',
                                    valueField: 'value',
                                    multiSelect: false,
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    anchor: '100%',
                                    value: record.billing ? record.billing : 0
                                }),
                                {
                                    fieldLabel: panel._estimationTitle,
                                    name: 'estimation',
                                    anchor: '100%',
                                    value: record.estimationText ? record.estimationText : ''
                                }
                            ],
                            buttons: [
                                {
                                    text: panel._saveTitle,
                                    scope: this,
                                    handler: function(btn) {
                                        var form = btn.up('form').getForm();
                                        var values = form.getValues();

                                        Ext.Ajax.request({
                                            url: url + 'project/save',
                                            params: values,
                                            scope: this,
                                            success: function(response) {
                                                window.close();
                                            },
                                            failure: function(response) {
                                                /* 
                                                 * If responsetext is less than 200 chars long (means not an exception
                                                 * stack trace), use responsetext. If not, show common help/error text
                                                 */
                                                var message = response.responseText.length < 200
                                                    ? response.responseText
                                                    : panel._seriousErrorTitle;
                                                showNotification(panel._errorTitle, message, false);
                                            }
                                        });
                                    }
                                }
                            ]
                        })
                    ]
                });

                window.show();
            }
        });

        var userGrid = Ext.create('Ext.grid.Panel', {
            store: this.userStore,
            teamStore: this.teamStore,
            columns: [
                {
                    header: 'Id',
                    dataIndex: 'id',
                    hidden: true
                }, {
                    header: this._userNameTitle,
                    dataIndex: 'username',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._abbreviationTitle,
                    dataIndex: 'abbr',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._typeTitle,
                    dataIndex: 'type',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._teamsTitle,
                    dataIndex: 'teams',
                    flex: 1,
                    renderer: function(value) {
                        /* Display space seperated list of related teams */
                        var output = '';
                        Ext.each(value, function(teamId) {
                            if (isNaN(teamId)) {
                              return;
                            }
                            var team = userGrid.teamStore.getById(parseInt(teamId));
                            if (null == team) {
                              return;
                            }
                            if (output != '')
                                output += ', ';
                            output += team.data.name;
                        });
                        return output;
                    }
                }
            ],
            tbar: [
                {
                    text: this._addUserTitle,
                    iconCls: 'icon-add',
                    scope: this,
                    handler: function() {
                        userGrid.editUser();
                    }
                }
            ],
            listeners: {
                /* Right-click menu */
                itemcontextmenu: function(grid, record, item, index, event, options) {
                    event.stopEvent();

                    var contextMenu = Ext.create('Ext.menu.Menu', {
                        items: [
                            {
                                text: panel._editTitle,
                                iconCls: 'icon-edit',
                                scope: this,
                                handler: function() {
                                    this.editUser(record.data);
                                }
                            }
                        ]
                    });

                    contextMenu.showAt(event.xy);
                }
            },
            editUser: function(record) {
                if(!record) record = {};

                var teamStore = Ext.create('Netresearch.store.AdminTeams', {
                    autoLoad: false
                });

                var localesStore = new Ext.data.ArrayStore({
                    fields: ['value', 'displayname'],
                    data: [
                        ['de', 'Deutsch'],
                        ['en', 'English'],
                        ['es', 'Español'],
                        ['fr', 'Français'],
                        ['ru', 'Русский'],
                    ]
                });

                var window = Ext.create('Ext.window.Window', {
                    title: panel._editUserTitle,
                    modal: true,
                    width: 400,
                    layout: 'fit',
                    id: 'edit-user-window',
                    layout: 'fit',
                    listeners: {
                        destroy: {
                            scope: this,
                            fn: function() {
                                this.getStore().load();
                            }
                        }
                    },
                    items: [
                        new Ext.form.Panel({
                            bodyPadding: 5,
                            defaultType: 'textfield',
                            items: [
                                new Ext.form.field.Hidden({
                                    name: 'id',
                                    value: record.id ? record.id : 0
                                }), {
                                    fieldLabel: panel._userNameTitle,
                                    name: 'username',
                                    anchor: '100%',
                                    value: record.username ? record.username : ''
                                }, {
                                    fieldLabel: panel._abbreviationTitle,
                                    name: 'abbr',
                                    anchor: '100%',
                                    value: record.abbr ? record.abbr : ''
                                }, new Ext.form.ComboBox({
                                    fieldLabel: panel._languageTitle,
                                    name: 'locale',
                                    store: localesStore,
                                    queryMode: 'local',
                                    displayField: 'displayname',
                                    valueField: 'value',
                                    multiSelect: false,
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    anchor: '100%',
                                    value: record.locale ? record.locale : 'de'
                                }), new Ext.form.ComboBox({
                                    fieldLabel: 'Typ',
                                    name: 'type',
                                    anchor: '100%',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['type', 'name'],
                                        data: [
                                            { 'type':'DEV', 'name': panel._developerTitle},
                                            { 'type':'PL', 'name': panel._projectManagerTitle},
                                            { 'type':'CTL', 'name': panel._controllingTitle}
                                        ]
                                    }),
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'type',
                                    value: record.type ? record.type : ''
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._teamsTitle,
                                    name: 'teams[]',
                                    store: teamStore,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    multiSelect: true,
                                    typeAhead: true,
                                    triggerAction: 'all',
                                    anchor: '100%',
                                    listeners: {
                                        afterrender: function(field, value) {
                                            teamStore.load({ 
                                                params: { 
                                                    team: field.getValue()
                                                }
                                            });
                                        },
                                        select: function(field, value) {
                                            teamStore.load({ 
                                                params: { 
                                                    team: field.getValue()
                                                }
                                            });
                                        }
                                    },
                                    value: record.teams ? record.teams : ''
                                })
                            ],
                            buttons: [
                                {
                                    text: panel._saveTitle,
                                    scope: this,
                                    handler: function(btn) {
                                        var form = btn.up('form').getForm();
                                        var values = form.getValues();

                                        Ext.Ajax.request({
                                            url: url + 'user/save',
                                            params: values,
                                            scope: this,
                                            success: function(response) {
                                                window.close();
                                            },
                                            failure: function(response) {
                                                /* 
                                                 * If responsetext is less than 200 chars long (means not an exception
                                                 * stack trace), use responsetext. If not, show common help/error text
                                                 */
                                                var message = response.responseText.length < 200
                                                    ? response.responseText
                                                    : panel._seriousErrorTitle;
                                                showNotification(panel._errorTitle, message, false);
                                            }
                                        });
                                    }
                                }
                            ]
                        })
                    ]
                });

                window.show();
            }
        });

        var teamGrid = Ext.create('Ext.grid.Panel', {
            userStore: this.userStore,
            store: this.teamStore,
            columns: [
                {
                    header: this._teamTitle,
                    dataIndex: 'name',
                    flex: 1,
                    field: {
                        xtype: 'textfield'     
                    }
                }, {
                    header: this._teamLeadTitle,
                    dataIndex: 'lead_user_id',
                    flex: 1,
                    field: {
                        xtype: 'textfield',
                        lazyRender: true,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'lead_user_id',
                        anchor: '100%'
                    },
                    renderer: function(id) {
                        var record = this.userStore.getById(id);
                        return record ? record.get('username') : id;
                    }
                }
            ]
        });


        var presetGrid = Ext.create('Ext.grid.Panel', {
            customerStore: this.customerStore,
            projectStore: this.projectStore,
            activityStore: this.activityStore,
            store: this.presetStore,
            columns: [
                {
                    header: this._nameTitle,
                    dataIndex: 'name',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                },
                {
                    header: this._customerTitle,
                    dataIndex: 'customer',
                    flex: 1,
                    field: {
                        xtype: 'textfield',
                        lazyRender: true,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        anchor: '100%'
                    },
                    renderer: function(id) {
                        var record = this.customerStore.getById(id);
                        return record ? record.get('name') : id;
                    }
                },
                {
                    header: this._projectTitle,
                    dataIndex: 'project',
                    flex: 1,
                    field: {
                        xtype: 'textfield',
                        lazyRender: true,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        anchor: '100%'
                    },
                    renderer: function(id) {
                        var record = this.projectStore.getById(id);
                        return record ? record.get('name') : id;
                    }
                },
                {
                    header: this._activityTitle,
                    dataIndex: 'activity',
                    flex: 1,
                    field: {
                        xtype: 'textfield',
                        lazyRender: true,
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'id',
                        anchor: '100%'
                    },
                    renderer: function(id) {
                        var record = this.activityStore.getById(id);
                        return record ? record.get('name') : id;
                    }
                },
                {
                    header: this._descriptionTitle,
                    dataIndex: 'description',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                }
            ],
            tbar: [
                {
                    text: this._addPresetTitle,
                    iconCls: 'icon-add',
                    scope: this,
                    handler: function() {
                        presetGrid.editPreset();
                    }
                }
            ],
            listeners: {
                /* Right-click menu */
                itemcontextmenu: function(grid, record, item, index, event, options) {
                    event.stopEvent();

                    var contextMenu = Ext.create('Ext.menu.Menu', {
                        items: [
                            {
                                text: panel._editTitle,
                                iconCls: 'icon-edit',
                                scope: this,
                                handler: function() {
                                    this.editPreset(record.data);
                                }
                            }, {
                                text: panel._deleteTitle,
                                iconCls: 'icon-delete',
                                scope: this,
                                handler: function() {
                                    this.deletePreset(record);
                                }
                            }
                        ]
                    });

                    contextMenu.showAt(event.xy);
                }
            }, // end listeners
            deletePreset: function(record) {
                var grid = this;
                var id = parseInt(record.data.id);
                Ext.Msg.confirm('Achtung', 'Wirklich löschen?<br />' + record.data.name, function(btn) {
                    if (btn == 'yes') {
                        Ext.Ajax.request({
                            url: url + 'preset/delete',
                            params: {
                                    id: id
                            },
                            scope: this,
                            success: function(response) {
                                grid.getStore().remove(record);
                                grid.getView().refresh();
                            },
                            failure: function(response) {
                                showNotification(grid._errorTitle, response.responseText, false);
                            }
                        });
                    }
                });
            },
            editPreset: function(record) {
                var projectStore = Ext.create('Netresearch.store.AdminProjects');
                var presetStore = Ext.create('Netresearch.store.AdminPresets', {
                    autoLoad: false
                });

                if(!record) record = {};

                var window = Ext.create('Ext.window.Window', {
                    title: panel._editPresetTitle,
                    modal: true,
                    width: 400,
                    id: 'edit-preset-window',
                    layout: 'fit',
                    listeners: {
                        destroy: {
                            scope: this,
                            fn: function() {
                                this.getStore().load();
                            }
                        }
                    },
                    items: [
                        new Ext.form.Panel({
                            bodyPadding: 5,
                            defaultType: 'textfield',
                            items: [
                                new Ext.form.field.Hidden({
                                    name: 'id',
                                    value: record.id ? record.id : 0
                                }), {
                                    fieldLabel: panel._nameTitle,
                                    name: 'name',
                                    anchor: '100%',
                                    value: record.name ? record.name : ''
                                },
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._customerTitle,
                                    name: 'customer',
                                    id: 'preset-edit-customer',
                                    store: this.customerStore,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    anchor: '100%',
                                    value: record.customer ? record.customer : ''
                                }),
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._projectTitle,
                                    name: 'project',
                                    store: projectStore,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    anchor: '100%',
                                    value: record.project ? record.project : '',
                                    listeners: {
                                        scope: this,
                                        focus: function() {
                                            projectStore.load({
                                                params: { 
                                                    customer: Ext.getCmp('preset-edit-customer').getValue()
                                                }
                                            });
                                        }
                                    }

                                }), 
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._activityTitle,
                                    name: 'activity',
                                    store: this.activityStore,
                                    queryMode: 'local',
                                    displayField: 'name',
                                    valueField: 'id',
                                    anchor: '100%',
                                    value: record.activity ? record.activity : ''
                                }), {
                                    fieldLabel: panel._descriptionTitle,
                                    name: 'description',
                                    anchor: '100%',
                                    value: record.description ? record.description : ''
                                }
                            ],
                            buttons: [
                                {
                                    text: 'Speichern',
                                    scope: this,
                                    handler: function(btn) {
                                        var form = btn.up('form').getForm();
                                        var values = form.getValues();

                                        Ext.Ajax.request({
                                            url: url + 'preset/save',
                                            params: values,
                                            scope: this,
                                            success: function(response) {
                                                window.close();
                                                showNotification(this._successTitle, this._presetSavedTitle, true);
                                            },
                                            failure: function(response) {
                                                /* 
                                                 * If responsetext is less than 200 chars long (means not an exception
                                                 * stack trace), use responsetext. If not, show common help/error text
                                                 */
                                                var message = response.responseText.length < 200
                                                    ? response.responseText
                                                    : panel._seriousErrorTitle;
                                                showNotification(panel._errorTitle, message, false);
                                            }
                                        });
                                    }
                                }
                            ]
                        })
                    ]
                });

                window.show();
            }
        });


        var ticketSystemGrid = Ext.create('Ext.grid.Panel', {
            store: this.ticketSystemStore,
            columns: [
                {
                    header: this._nameTitle,
                    dataIndex: 'name',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                }, {
                    header: this._typeTitle,
                    dataIndex: 'type',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                }, {
                    header: this._timebookingTitle,
                    dataIndex: 'bookTime',
                    field: {
                        xtype: 'checkbox'
                    },
                    renderer: function(value) {
                        return renderCheckbox(value);
                    }
                }, {
                    header: this._urlTitle,
                    dataIndex: 'url',
                    flex: 1,
                    field: {
                        xtype: 'textfield'
                    }
                }
            ],
            tbar: [
                {
                    text: this._addTicketSystemTitle,
                    iconCls: 'icon-add',
                    scope: this,
                    handler: function() {
                        ticketSystemGrid.editTicketSystem();
                    }
                }
            ],
            listeners: {
                /* Right-click menu */
                itemcontextmenu: function(grid, record, item, index, event, options) {
                    event.stopEvent();

                    var contextMenu = Ext.create('Ext.menu.Menu', {
                        items: [
                            {
                                text: panel._editTitle,
                                iconCls: 'icon-edit',
                                scope: this,
                                handler: function() {
                                    this.editTicketSystem(record.data);
                                }
                            }
                        ]
                    });

                    contextMenu.showAt(event.xy);
                }
            }, // end listeners
            editTicketSystem: function(record) {
                var ticketSytemStore = Ext.create('Netresearch.store.TicketSystems', {
                    autoLoad: false
                });

                var ticketSystemTypeStore = new Ext.data.ArrayStore({
                    fields: ['type'],
                    data: [
                            ['JIRA'], ['OTRS']
                        ]
                });

                if(!record) record = {};

                var window = Ext.create('Ext.window.Window', {
                    title: panel._editTicketSystemTitle,
                    modal: true,
                    width: 600,
                    id: 'edit-ticket-system-window',
                    layout: 'fit',
                    listeners: {
                        destroy: {
                            scope: this,
                            fn: function() {
                                this.getStore().load();
                            }
                        }
                    },
                    items: [
                        new Ext.form.Panel({
                            bodyPadding: 5,
                            defaultType: 'textfield',
                            items: [
                                new Ext.form.field.Hidden({
                                    name: 'id',
                                    value: record.id ? record.id : 0
                                }), {
                                    fieldLabel: panel._nameTitle,
                                    name: 'name',
                                    anchor: '100%',
                                    value: record.name ? record.name : ''
                                },
                                new Ext.form.ComboBox({
                                    fieldLabel: panel._typeTitle,
                                    name: 'type',
                                    id: 'ticketsystem-edit-type',
                                    store: ticketSystemTypeStore,
                                    queryMode: 'local',
                                    displayField: 'type',
                                    valueField: 'type',
                                    anchor: '100%',
                                    value: record.type ? record.type : ''
                                }),
                                new Ext.form.field.Checkbox({
                                    fieldLabel: panel._timebookingTitle,
                                    name: 'bookTime',
                                    inputValue: 1,
                                    checked: record.bookTime ? record.bookTime : 0
                                }), {
                                    fieldLabel: panel._urlTitle,
                                    name: 'url',
                                    anchor: '100%',
                                    value: record.url ? record.url : ''
                                }, {
                                    fieldLabel: panel._loginTitle,
                                    name: 'login',
                                    anchor: '100%',
                                    value: record.login ? record.login : ''
                                }, {
                                    fieldLabel: panel._passwordTitle,
                                    name: 'password',
                                    anchor: '100%',
                                    value: record.password ? record.password : ''
                                },
                                new Ext.form.field.TextArea({
                                    fieldLabel: panel._publicKeyTitle,
                                    name: 'publicKey',
                                    anchor: '100%',
                                    grow: true,
                                    value: record.publicKey ? record.publicKey : ''
                                }),
                                new Ext.form.field.TextArea({
                                    fieldLabel: panel._privateKeyTitle,
                                    name: 'privateKey',
                                    anchor: '100%',
                                    grow: true,
                                    growMin: 130,
                                    value: record.privateKey ? record.privateKey : ''
                                })
                            ],
                            buttons: [
                                {
                                    text: panel._saveTitle,
                                    scope: this,
                                    handler: function(btn) {
                                        var form = btn.up('form').getForm();
                                        var values = form.getValues();

                                        Ext.Ajax.request({
                                            url: url + 'ticketsystem/save',
                                            params: values,
                                            scope: this,
                                            success: function(response) {
                                                window.close();
                                                showNotification(panel._successTitle, panel._ticketSystemSavedTitle, true);
                                            },
                                            failure: function(response) {
                                                /*
                                                 * If responsetext is less than 200 chars long (means not an exception
                                                 * stack trace), use responsetext. If not, show common help/error text
                                                 */
                                                var message = response.responseText.length < 200
                                                    ? response.responseText
                                                    : panel._seriousErrorTitle;
                                                showNotification(panel._errorTitle, message, false);
                                            }
                                        });
                                    }
                                }
                            ]
                        })
                    ]
                });

                window.show();
            }
        });



        /* Create container panels for grids */
        var customerPanel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            frame: true,
            title: this._customerManagementTitle,
            collapsible: false,
            width: '100%',
            margin: '0 0 10 0',
            items: [ customerGrid ]
        });

        var projectPanel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            frame: true,
            title: this._projectManagementTitle,
            collapsible: false,
            width: '100%',
            margin: '0 0 10 0',
            items: [ projectGrid ]
        });

        var userPanel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            frame: true,
            title: this._userManagementTitle,
            collapsible: false,
            width: '100%',
            margin: '0 0 10 0',
            items: [ userGrid ]
        });

        var teamPanel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            frame: true,
            title: this._teamManagementTitle,
            collapsible: false,
            width: '100%',
            margin: '0 0 10 0',
            items: [ teamGrid ]
        });

        var presetPanel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            frame: true,
            title: this._presetManagementTitle,
            collapsible: false,
            width: '100%',
            margin: '0 0 10 0',
            items: [ presetGrid ]
        });

        var ticketSystemPanel = Ext.create('Ext.panel.Panel', {
            layout: 'fit',
            frame: true,
            title: this._ticketSystemManagementTitle,
            collapsible: false,
            width: '100%',
            margin: '0 0 10 0',
            items: [ ticketSystemGrid ]
        });

        var config = {
            title: this._tabTitle,
            items: [ customerPanel, projectPanel, userPanel, teamPanel, presetPanel, ticketSystemPanel ]
        };

        /* Apply config */
        Ext.applyIf(this, config);
        this.callParent();
    }
});

/*
 * Render image representation of a checkbox instead of 1 and 0
 */
function renderCheckbox(val) {
    var checkedImg = '/bundles/netresearchtimetracker/js/ext-js/resources/themes/images/default/menu/checked.gif';
    var uncheckedImg = '/bundles/netresearchtimetracker/js/ext-js/resources/themes/images/default/menu/unchecked.gif';
    var result = '<div style="text-align:center;height:13px;overflow:visible"><img style="vertical-align:-3px" src="'
        + (val ? checkedImg : uncheckedImg)
        + '" /></div>';

    return result;
}


if ((undefined != settingsData) && (settingsData['locale'] == 'de')) {
    Ext.apply(Netresearch.widget.Admin.prototype, {
        _tabTitle: 'Administration',
        _nameTitle: 'Name',
        _teamsTitle: 'Teams',
        _activeTitle: 'Aktiv',
        _globalTitle: 'Global',
        _addCustomerTitle: 'Neuer Kunde',
        _editTitle: 'Bearbeiten',
        _editCustomerTitle: 'Kunde bearbeiten',
        _forAllTeamsTitle: 'für alle Teams',
        _saveTitle: 'Speichern',
        _deleteTitle: 'Löschen',
        _seriousErrorTitle: ' Ein schwerer Fehler ist aufgetreten. Mehr Details gibts im Firebug/in den Chrome Developer Tools.',
        _customerTitle: 'Kunde',
        _ticketPrefixTitle: 'Ticket-Präfix',
        _ticketSystemTitle: 'Ticket-System',
        _projectTitle: 'Projekt',
        _addProjectTitle: 'Neues Projekt',
        _editProjectTitle: 'Projekt bearbeiten',
        _forAllCustomersTitle: 'für alle Kunden',
        _userNameTitle: 'Username',
        _abbreviationTitle: 'Kürzel',
        _typeTitle: 'Typ',
        _addUserTitle: 'Neuer Nutzer',
        _editUserTitle: 'Nutzer bearbeiten',
        _languageTitle: 'Sprache',
        _developerTitle: 'Entwickler',
        _projectManagerTitle: 'Projektleiter',
        _controllingTitle: 'Controlling',
        _teamTitle: 'Team',
        _teamLeadTitle: 'Teamleiter',
        _customerManagementTitle: 'Verwaltung von Kunden',
        _projectManagementTitle: 'Verwaltung von Projekten',
        _userManagementTitle: 'Verwaltung von Nutzern',
        _teamManagementTitle: 'Verwaltung von Teams',
        _presetManagementTitle: 'Verwaltung von Presets',
        _presetSavedTitle: 'Das Preset wurde erfolgreich gespeichert.',
        _addPresetTitle: 'Neues Preset',
        _editPresetTitle: 'Preset bearbeiten',
        _activityTitle: 'Tätigkeit',
        _descriptionTitle: 'Beschreibung',
        _ticketSystemManagementTitle: 'Verwaltung von Ticket-Systemen',
        _ticketSystemSavedTitle: 'Das Ticket-System wurde erfolgreich gespeichert.',
        _addTicketSystemTitle: 'Neues Ticket-System',
        _urlTitle: 'URL',
        _timebookingTitle: 'Zeitbuchung',
        _loginTitle: 'Login',
        _passwordTitle: 'Passwort',
        _publicKeyTitle: 'Public Key',
        _privateKeyTitle: 'Private Key',
        _errorsTitle: 'Fehler',
        _errorTitle: 'Fehler',
        _successTitle: 'Success',
        _estimationTitle: 'Geschätzte Dauer',
        _offerTitle: 'Angebot',
        _billingTitle: 'Abrechnung',
        _costCenterTitle: 'Kostenstelle',
        _projectLeadTitle: 'Projekt-Leitung',
        _technicalLeadTitle: 'Technische Leitung',
        _max31CharactersTitle: 'Hier sind maximal 31 Zeichen erlaubt',
        _additionalInformationFromExternal: 'weitere Informationen aus (externen) Ticket-System beziehen'
    });
}
