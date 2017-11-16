/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function ($) {

    const defaultConfig = {
       
    };

    const TEMPLATE = {
        FORM: '<form class="form-horizontal">'
    };

    $.fn.jsForm = function (config) {
        $.extend(config, defaultConfig);
        initialize(config, $(this);
    };

    function initialize(config, $forms) {
        $.each($grids, function () {
            $container = $(this);

            // Make sure that the previous guests have left the room before renting it out.
            $container.empty();
            $container.unbind();
        });
    }

    function show() {

    }

    function hide() {
      
    }

})(jQuery);