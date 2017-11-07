/// <reference path="node_modules/jquery/dist/jQuery.js" />

(function ($) {

    $.fn.jsGrid = function (config) {
        $.each(this, function () {
            var columnCount = 3;
            var rowCount = 2;
            var $table = $("<table>");
            var $thead = $("<thead>");
            var $tbody = $("<tbody>");

            for (col = 0; col < columnCount; col++) {
                $thead.append("<th>" + config.columns[col] + "</th>");
            }

            for (row = 0; row < rowCount; row++) {
                var $row = $("<tr>");
                for (col = 0; col < columnCount; col++) {
                    $row.append("<td>" + config.data[row][col] + "</td>");
                }
                $tbody.append($row);
            }

            $table.append($thead).append($tbody);

            $(this).append($table);
        });
    };

})(jQuery);