/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function(jsForm, $) {

    jsForm.controlType = {
        checkbox: 0,
        radiobutton: 1,
        readonly: 2,
        select: 3,
        text: 4
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
            <div class="panel panel-info edit-panel" id="edit-panel">
                <div class="panel-heading">
                    <span class="closeIcon cancel-button">
                        <span class="glyphicon glyphicon-remove"></span>
                    </span>
                    <h2 class="panel-title"></h2>
                </div>
                <div class="panel-body"></div>
            </div>`,
        FORM: '<form class="form form-horizontal">',
        CONTROL_GROUP: `
            <div class="form-group">
                <label for="{0}">{1}</label>
            </div>`,
        INPUT_CHECKBOX: `
            <div class="checkbox">
                <label><input type="checkbox" value="" name="{0}" id="{0}">{1}</label>
            </div>`,
        INPUT_RADIOBUTTON: `
            <div class="radio">
                <label><input type="radio" name="{0}" value="{1}">{2}</label>
            </div>`,
        INPUT_READONLY: `
            <div class="form-group">
                <label for="{0}">{1}</label>
                <input type="text" class="form-control" name="{0}" id="{0}" readonly>
            </div>`,
        INPUT_SELECT: '<select class="form-control" name="{0}" id="{0}">',
        INPUT_SELECT_OPTION: '<option value="{0}">{1}</option>',
        INPUT_TEXT: `
            <div class="form-group">
                <label for="{0}">{1}</label>
                <input type="text" class="form-control" name="{0}" id="{0}">
            </div>`,
        BUTTON_GROUP: `
            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                </div>
            </div>`,
        SAVE_BUTTON: '<button type="button" class="btn btn-default save-button">Save</button>'
    };

    function ControlFactory() {
        this.getTemplate = function(type, name, displayName, options) {
            var template = null;
            switch (type) {
                case jsForm.controlType.checkbox:
                    return $(String.format(TEMPLATE.INPUT_CHECKBOX, name, displayName));

                case jsForm.controlType.radiobutton:
                    var $template = $(String.format(TEMPLATE.CONTROL_GROUP, name, displayName));
                    $.each(options, function(index, value) {
                        $template.append(String.format(TEMPLATE.INPUT_RADIOBUTTON, name, value.value, value.name));
                    });
                    return $template;

                case jsForm.controlType.readonly:
                    return $(String.format(TEMPLATE.INPUT_READONLY, name, displayName));

                case jsForm.controlType.select:
                    var $template = $(String.format(TEMPLATE.CONTROL_GROUP, name, displayName));
                    var $select = $(String.format(TEMPLATE.INPUT_SELECT, name, displayName));
                    $.each(options, function(index, value) {
                        $select.append(String.format(TEMPLATE.INPUT_SELECT_OPTION, value.value, value.name));
                    });
                    return $template.append($select);

                default:
                    return $(String.format(TEMPLATE.INPUT_TEXT, name, displayName));
            }
        }
    }

    function Form(config) {
        var self = this;

        this.$formContainer = null;

        this.config = config;

        this.add = function() {
            this.$formContainer.show();
        };

        this.cancel = function() {
            console.log('cancel');
            this.$formContainer.hide();
        };

        this.edit = function(row) {
            var $inputs = this.$formContainer.find('form input');
            $.each($inputs, function(index) {
                var $input = $(this);
                if ($input.is(':checkbox')) {
                    $input.prop('checked', row[index]);
                } else {
                    $(this).attr('value', row[index]);
                }
            });
            this.$formContainer.show();
        };

        this.initialize = function($container) {
            this.$formContainer = $container;

            // Make sure that the previous guests have left the room before renting it out.
            this.$formContainer.empty();
            this.$formContainer.unbind();

            var $modalBackdrop = $(TEMPLATE.MODAL_BACKDROP);
            this.$formContainer.append($modalBackdrop);

            var $formPanel = $.parseHTML(TEMPLATE.FORM_PANEL);
            this.$formContainer.append($formPanel);
            var $panelBody = this.$formContainer.find('.panel-body');

            var $form = $(TEMPLATE.FORM);

            var controlFactory = new ControlFactory();

            for (var i = 0; i < config.fields.length; i++) {
                var $control = controlFactory.getTemplate(
                    this.config.fields[i].type,
                    this.config.fields[i].name,
                    this.config.fields[i].displayName,
                    this.config.fields[i].options);
                $form.append($control);
            }

            var buttonGroup = $(TEMPLATE.BUTTON_GROUP);
            var saveButton = $(TEMPLATE.SAVE_BUTTON);
            this.$formContainer.on('click', '.save-button', function() {
                self.save();
            });
            buttonGroup.children('div').append(saveButton);
            $form.append(buttonGroup);

            // Cancel buttons
            this.$formContainer.on('click', '.cancel-button', function() {
                self.cancel();
            });

            $panelBody.append($form);

            this.$formContainer.hide();
        };

        this.save = function() {
            var $form = $(event.target).closest('form');
            var data = $form.serialize();
            $.ajax({
                type: "POST",
                url: config.post.url,
                data: data,
                success: function() {
                    if ($.isFunction(config.post.success)) {
                        config.post.success();
                    }
                },
                error: function() {
                    console.log("error");
                }
            });
        }
    }

})(window.jsForm = window.jsForm || {}, jQuery);