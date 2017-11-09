/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function ($) {

    var defaultConfig = {
        paging: {
            enabled: false,
            pageSize: 2
        }
    };

    const previousButtonId = 'previous-button';
    const nextButtonId = 'next-button';

    const TEMPLATE = {
        TABLE: '<table>',
        THEAD: '<thead>',
        TBODY: '<tbody>',
        TH: '<th>{0}</th>',
        TR: '<tr>',
        TD: '<td>{0}</td>',
        PAGE: '<span>Page {0}</span>',
        NEXT_BUTTON: String.format('<button id="{0}">Next</button>', nextButtonId),
        PREVIOUS_BUTTON: String.format('<button id="{0}">Previous</button>', previousButtonId)
    };

    $.fn.jsGrid = function (config) {
        $.extend( config, defaultConfig );
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

            var pageStartRow = page * config.paging.pageSize;
            var pageEndRow = Math.min(pageStartRow + config.paging.pageSize, rowCount);

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

            // Paging buttons
            if (page > 0) {
                var $previousButton = $(TEMPLATE.PREVIOUS_BUTTON);
                $this.on('click', String.format('#{0}', previousButtonId), function () {
                    renderGrid(config, $this, page - 1);
                });

                $this.append($previousButton);
            }

            if (rowCount > pageEndRow) {
                var $nextButton = $(TEMPLATE.NEXT_BUTTON);
                $this.on('click', String.format('#{0}', nextButtonId), function () {
                    renderGrid(config, $this, page + 1);
                });

                $this.append($nextButton);
            }
        });
    }

})(jQuery);