/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function (jsForm, $) {

    const defaultConfig = {

    };

    const TEMPLATE = {
        FORM: '<form class="form-horizontal">',
        FORM_GROUP: `<div class="form-group">
                        <label for="{0}">{1}</label>
                        {2}
                     </div>`,
        INPUT_CHECKBOX: '<input type="text" class="form-control" name="{0}">',
        INPUT_HIDDEN: '<input type="text" class="form-control" name="{0}">',
        INPUT_TEXT: '<input type="text" class="form-control" name="{0}" id="{0}">',
        BUTTON_GROUP: `<div class="form-group">
                         <div class="col-sm-offset-2 col-sm-10">
                         </div>
                      </div>`,
        SAVE_BUTTON: '<button type="button" class="btn btn-default">Save</button>'
    };

    function Form(config) {
        this.config = config; 
        this.edit = function (row) {
            var $inputs = $('form input[type="text"]');
            $.each($inputs, function(index){
                $(this).attr("value", row[index]);
            });
            $container.show();
        };
        var self = this;

        this.initialize = function ($forms) {
            $.each($forms, function () {
                $container = $(this);

                // Make sure that the previous guests have left the room before renting it out.
                $container.empty();
                $container.unbind();

                var $form = $(TEMPLATE.FORM);

                for (var i = 0; i < config.fields.length; i++) {
                    var input = String.format(TEMPLATE.INPUT_TEXT, config.fields[i].name);
                    var $formGroup = $(String.format(TEMPLATE.FORM_GROUP, config.fields[i].name, config.fields[i].displayName, input));
                    $form.append($formGroup);
                }

                var buttonGroup = $(TEMPLATE.BUTTON_GROUP);
                var saveButton = $(TEMPLATE.SAVE_BUTTON);
                $container.on('click', saveButton, function(){
                    self.save();
                });
                buttonGroup.children('div').append(saveButton);
                $form.append(buttonGroup);

                $container.append($form);

                $container.hide();
            });
        };

        this.save = function () {
            var $form = $(event.target).closest('form');
            var data = $form.serialize();
            $.ajax({
                type: "POST",
                url: config.post.url,
                data: data,
                success: function () {
                    if ($.isFunction(config.post.success)) {
                        config.post.success();
                    }
                },
                error: function () {
                    console.log("error");
                }
            });
        }
    }

    $.fn.jsForm = function (config) {
        $.extend({}, config, defaultConfig);
        var form = new Form(config);
        form.initialize($(this));
        return form;
    };

})(window.jsForm = window.jsForm || {}, jQuery);