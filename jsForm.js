/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function(jsForm, $) {

    const defaultConfig = {

    };

    jsForm.controlType = {
        readonly: 0,
        text: 1
    }

    const TEMPLATE = {
        MODAL_BACKDROP: '<div class="modal-backdrop"></div>',
        FORM_PANEL: '<div class="panel panel-info edit-panel" id="edit-panel"><div class="panel-heading"><span class="closeIcon"><span class="glyphicon glyphicon-remove" data-bind="click: cancel"></span></span><h2 class="panel-title"></h2></div><div class="panel-body"></div></div>',
        FORM: '<form class="form form-horizontal">',
        FORM_GROUP: `<div class="form-group">
                        <label for="{0}">{1}</label>
                        {2}
                     </div>`,
        INPUT_READONLY: '<input type="text" class="form-control" readonly name="{0}">',
        INPUT_CHECKBOX: '<input type="text" class="form-control" name="{0}">',
        INPUT_HIDDEN: '<input type="text" class="form-control" name="{0}">',
        INPUT_TEXT: '<input type="text" class="form-control" name="{0}" id="{0}">',
        BUTTON_GROUP: `<div class="form-group">
                         <div class="col-sm-offset-2 col-sm-10">
                         </div>
                      </div>`,
        SAVE_BUTTON: '<button type="button" class="btn btn-default">Save</button>'
    };

    function ControlFactory() {
        this.getTemplate = function(type) {
            switch (type) {
                case jsForm.controlType.readonly:
                    return TEMPLATE.INPUT_READONLY;
                default:
                    return TEMPLATE.INPUT_TEXT;
            }
        }
    }

    var $formContainer = null;

    function Form(config) {
        this.config = config;
        this.edit = function(row) {
            var $inputs = $('form input[type="text"]');
            $.each($inputs, function(index) {
                $(this).attr("value", row[index]);
            });
            $formContainer.show();
        };
        var self = this;

        this.initialize = function($container) {
            $formContainer = $container;

            // Make sure that the previous guests have left the room before renting it out.
            $formContainer.empty();
            $formContainer.unbind();

            var $modalBackdrop = $(TEMPLATE.MODAL_BACKDROP);
            $formContainer.append($modalBackdrop);

            var $formPanel = $.parseHTML(TEMPLATE.FORM_PANEL);
            $formContainer.append($formPanel);
            var $panelBody = $formContainer.find('.panel-body');

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
            $formContainer.on('click', saveButton, function() {
                self.save();
            });
            buttonGroup.children('div').append(saveButton);
            $form.append(buttonGroup);

            $panelBody.append($form);

            $formContainer.hide();
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

    $.fn.jsForm = function(config) {
        $.extend({}, config, defaultConfig);
        var form = new Form(config);
        form.initialize($(this));
        return form;
    };

})(window.jsForm = window.jsForm || {}, jQuery);