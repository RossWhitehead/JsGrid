/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function ($) {

    const TEMPLATE = {
        TABLE: '<table>',
        THEAD: '<thead>',
        TBODY: '<tbody>',
        TH: '<th>{0}</th>',
        TR: '<tr>',
        TD: '<td>{0}</td>',
        PAGE: '<span>Page {0}</span>'
    };

    $.fn.jsGrid = function (config) {
        $.each(this, function () {
            var columnCount = config.columns.length;
            var rowCount = 2;
            var $table = $(TEMPLATE.TABLE);
            var $thead = $(TEMPLATE.THEAD);
            var $tbody = $(TEMPLATE.TBODY);

            for (col = 0; col < columnCount; col++) {
                $thead.append(String.format(TEMPLATE.TH, config.columns[col]));
            }

            var page = 1;
            var offset = page * config.pageSize;

            for (row = 0; row < rowCount; row++) {
                var $row = $(TEMPLATE.TR);
                for (col = 0; col < columnCount; col++) {
                    $row.append(String.format(TEMPLATE.TD, config.data[row][col]));
                }
                $tbody.append($row);
            }

            $table.append($thead).append($tbody);

            $(this).append($table);

            $(this).append(String.format(TEMPLATE.PAGE, page));
        });
    };

})(jQuery);