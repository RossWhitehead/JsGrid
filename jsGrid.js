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
        PAGE: '<span>Page {0}</span>',
        NEXT_BUTTON: '<button id="next-button">Next</button>',
        PREVIOUS_BUTTON: '<button id="previous-button">Previous</button>'
    };

    $.fn.jsGrid = function (config) {
        console.log("start");
        renderGrid(config, $(this), 0);
    };

    function renderGrid(config, $grids, page) {
        $.each($grids, function () {
            var $this = $(this);
            const columnCount = config.columns.length;
            const rowCount = config.data.length;
            var $table = $(TEMPLATE.TABLE);
            var $thead = $(TEMPLATE.THEAD);
            var $tbody = $(TEMPLATE.TBODY);

            $this.empty();
            $this.unbind();

            for (col = 0; col < columnCount; col++) {
                $thead.append(String.format(TEMPLATE.TH, config.columns[col]));
            }

            var pageStartRow = page * config.pageSize;
            var pageEndRow = Math.min(pageStartRow + config.pageSize, rowCount);

            for (row = pageStartRow; row < pageEndRow; row++) {
                var $row = $(TEMPLATE.TR);
                for (col = 0; col < columnCount; col++) {
                    $row.append(String.format(TEMPLATE.TD, config.data[row][col]));
                }
                $tbody.append($row);
            }

            $table.append($thead).append($tbody);

            $this.append($table);

            $this.append(String.format(TEMPLATE.PAGE, page + 1));

            if (page > 0) {
                var $previousButton = $(TEMPLATE.PREVIOUS_BUTTON);
                $this.on('click', '#previous-button', function () {
                    renderGrid(config, $this, page - 1);
                });
                
                $this.append($previousButton);
            }

            if (rowCount > pageEndRow) {
                var $nextButton = $(TEMPLATE.NEXT_BUTTON);
                $this.on('click', '#next-button', function () {
                    renderGrid(config, $this, page + 1);
                });
                
                $this.append($nextButton);
            }
        });
    }

})(jQuery);