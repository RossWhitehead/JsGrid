/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function(jsForm, $) {

    jsForm.controlType = {
        checkbox: 0,
        readonly: 1,
        text: 2
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
        FORM_GROUP: `<div class="form-group">
                        <label for="{0}">{1}</label>
                        {2}
                     </div>`,
        INPUT_CHECKBOX: '<input type="checkbox" name="{0}">',
        INPUT_READONLY: '<input type="text" class="form-control" readonly name="{0}">',
        INPUT_TEXT: '<input type="text" class="form-control" name="{0}" id="{0}">',
        BUTTON_GROUP: `<div class="form-group">
                         <div class="col-sm-offset-2 col-sm-10">
                         </div>
                      </div>`,
        SAVE_BUTTON: '<button type="button" class="btn btn-default save-button">Save</button>'
    };

    function ControlFactory() {
        this.getTemplate = function(type) {
            switch (type) {
                case jsForm.controlType.checkbox:
                    return TEMPLATE.INPUT_CHECKBOX;
                case jsForm.controlType.readonly:
                    return TEMPLATE.INPUT_READONLY;
                default:
                    return TEMPLATE.INPUT_TEXT;
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
                var inputTemplate = controlFactory.getTemplate(config.fields[i].type);
                var input = String.format(inputTemplate, config.fields[i].name);
                var $formGroup = $(String.format(TEMPLATE.FORM_GROUP, config.fields[i].name, config.fields[i].displayName, input));
                $form.append($formGroup);
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