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
        INPUT_TEXT: '<input type="text" class="form-control" name="{0}">',
        SAVE_BUTTON: `<div class="form-group">
                         <div class="col-sm-offset-2 col-sm-10">
                            <button type="button" class="btn btn-default" onclick="jsForm.save('{0}')">Save</button>
                         </div>
                      </div>`
    };

    $.fn.jsForm = function (config) {
        $.extend(config, defaultConfig);
        initialize(config, $(this));
    };

    function initialize(config, $forms) {
        $.each($forms, function () {
            $container = $(this);

            // Make sure that the previous guests have left the room before renting it out.
            $container.empty();
            $container.unbind();

            var $form = $(TEMPLATE.FORM);

            for(var i = 0; i < config.fields.length; i ++) {
                var input = String.format(TEMPLATE.INPUT_TEXT, config.fields[i].name);
                var $formGroup = $(String.format(TEMPLATE.FORM_GROUP, config.fields[i].name, config.fields[i].displayName, input));
                $form.append($formGroup);
            }

            $form.append(String.format(TEMPLATE.SAVE_BUTTON, config.postUrl));

            $container.append($form);
        });
    }

    jsForm.save = function(postUrl) {
        var $form = $(event.target).closest('form');
        var data = $form.serialize();
        $.post(postUrl, data);
        console.log(data);
    }

})(window.jsForm = window.jsForm || {}, jQuery);