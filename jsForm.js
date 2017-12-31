/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function(jsForm, $) {

    jsForm.controlType = {
        checkbox: 0,
        radiobutton: 1,
        readonly: 2,
        select: 3,
        text: 4,
        textArea: 5
    }

    const defaultConfig = {};

    $.fn.jsForm = function(config) {
        $.extend({}, config, defaultConfig);
        var form = new Form(config);
        form.initialize($(this));
        return form;
    };

    const TEMPLATE = {
        MODAL_BACKDROP: '<div class="modal-backdrop"></div>',
        FORM_PANEL: `
                    <div class="panel panel-info edit-panel">
                        <div class="panel-heading">
                            <h2 class="panel-title">{0}</h2>
                            <span class="closeIcon cancel-button">
                                <span class="glyphicon glyphicon-remove"></span>
                            </span>
                        </div>
                        <div class="panel-body"></div>
                    </div>`,
        FORM: '<form class="form form-horizontal">',
        INPUT_LABEL: '<label class="form-label" for="{0}">{1}</label>',
        INPUT_CHECKBOX: '<input class="checkbox-inline" type="checkbox" value="" name="{0}" id="{0}">',
        INPUT_RADIOBUTTON: '<label class="form-control"><input type="radio" name="{0}" value="{1}">{2}</label>',
        INPUT_READONLY: '<input type="text" class="form-control-plaintext" name="{0}" id="{0}" readonly>',
        INPUT_SELECT: '<select class="form-control" name="{0}" id="{0}">',
        INPUT_SELECT_OPTION: '<option value="{0}">{1}</option>',
        INPUT_TEXT: '<input type="text" class="form-control" name="{0}" id="{0}">',
        INPUT_TEXTAREA: '<textarea rows="{2}" class="form-control" name="{0}" id="{0}">',
        BUTTON_GROUP: `
                    <div class="button-group">
                    </div>`,
        SAVE_BUTTON: '<button type="button" class="btn btn-primary save-button">Save</button>',
        CANCEL_BUTTON: '<button type="button" class="btn btn-secondary cancel-button">Cancel</button>'
    };

    function ControlFactory() {
        this.getTemplate = function(field) {
            var type = field.type;
            var name = field.name;
            var displayName = field.displayName;
            var options = field.options;
            var rows = field.rows;

            var $label = $(String.format(TEMPLATE.INPUT_LABEL, name, displayName));

            switch (type) {
                case jsForm.controlType.checkbox:
                    return $label.add($(String.format(TEMPLATE.INPUT_CHECKBOX, name)));

                case jsForm.controlType.radiobutton:
                    $.each(options, function(index, value) {
                        $label.add($(String.format(TEMPLATE.INPUT_RADIOBUTTON, name, value.value, value.name)));
                    });
                    return $label;

                case jsForm.controlType.readonly:
                    return $label.add($(String.format(TEMPLATE.INPUT_READONLY, name, displayName)));

                case jsForm.controlType.select:
                    var $select = $(String.format(TEMPLATE.INPUT_SELECT, name, displayName));
                    $.each(options, function(index, value) {
                        $select.append(String.format(TEMPLATE.INPUT_SELECT_OPTION, value.value, value.name));
                    });
                    return $label.add($select);

                case jsForm.controlType.textArea:
                    return $label.add($(String.format(TEMPLATE.INPUT_TEXTAREA, name, displayName, rows)));

                default:
                    return $label.add($(String.format(TEMPLATE.INPUT_TEXT, name, displayName)));
            }
        }
    }

    var Form = function(config) {
        this.$formContainer = null;
        this.config = config;
    }

    Form.prototype.add = function() {
        this.$formContainer.show();
    };

    Form.prototype.cancel = function() {
        console.log('cancel');
        this.$formContainer.hide();
    };

    Form.prototype.edit = function(row) {
        var $formGroups = this.$formContainer.find('div.form-group');
        $.each($formGroups, function(index) {
            var $inputs = $(this).find(':input');
            var groupIndex = index;
            $.each($inputs, function(index) {
                var $input = $(this);
                if ($input.is('checkbox')) {
                    $input.prop('checked', row[groupIndex]);
                } else if ($input.is('input')) {
                    $(this).attr('value', row[groupIndex]);
                } else if ($input.is('textarea')) {
                    $(this).text(row[groupIndex]);
                }
            });
        });

        this.$formContainer.show();
    };

    Form.prototype.initialize = function($container) {
        var that = this;
        this.$formContainer = $container;

        // Make sure that the previous guests have left the room before renting it out.
        this.$formContainer.empty();
        this.$formContainer.unbind();

        var $modalBackdrop = $(TEMPLATE.MODAL_BACKDROP);
        this.$formContainer.append($modalBackdrop);

        var $formPanel = $.parseHTML(String.format(TEMPLATE.FORM_PANEL, this.config.title));
        this.$formContainer.append($formPanel);
        var $panelBody = this.$formContainer.find('.panel-body');

        var $form = $(TEMPLATE.FORM);

        var controlFactory = new ControlFactory();

        // Sort the fields by position
        var sortedFields = this.config.fields.sort(function(a, b) {
            var aPos = a.position === undefined ? 999999 : a.position;
            var bPos = b.position === undefined ? 999999 : b.position;
            return aPos - bPos;
        });

        for (var i = 0; i < this.config.fields.length; i++) {
            var $control = controlFactory.getTemplate(this.config.fields[i]);
            $form.append($control);
        }

        // Buttons
        var buttonGroup = $(TEMPLATE.BUTTON_GROUP);
        var saveButton = $(TEMPLATE.SAVE_BUTTON);
        var cancelButton = $(TEMPLATE.CANCEL_BUTTON);

        this.$formContainer.on('click', '.save-button', function() {
            that.save();
        });

        this.$formContainer.on('click', '.cancel-button', function() {
            that.cancel();
        });

        buttonGroup.append(saveButton);
        buttonGroup.append(cancelButton);
        $form.append(buttonGroup);

        $panelBody.append($form);

        this.$formContainer.hide();
    };

    Form.prototype.save = function() {
        var $form = $(event.target).closest('form');
        var data = $form.serialize();
        $.ajax({
            type: "POST",
            url: this.config.post.url,
            data: data,
            success: function() {
                if ($.isFunction(this.config.post.success)) {
                    this.config.post.success();
                }
            },
            error: function() {
                console.log("error");
            }
        });
    };

})(window.jsForm = window.jsForm || {}, jQuery);