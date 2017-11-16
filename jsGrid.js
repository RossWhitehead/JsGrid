/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function (jsGrid, $) {

    const defaultConfig = {
        paging: {
            enabled: false,
            pageSize: 2
        }
    };

    const previousButtonId = 'previous-button';
    const nextButtonId = 'next-button';

    const TEMPLATE = {
        TABLE: '<table class="table">',
        THEAD: '<thead>',
        TBODY: '<tbody>',
        TH: '<th>{0}</th>',
        TR: '<tr>',
        TD: '<td>{0}</td>',
        PAGE: '<span>Page {0}</span>',
        PAGING_BUTTONS: '<div>',
        NEXT_BUTTON: String.format('<button id="{0}" class="btn btn-default">Next</button>', nextButtonId),
        PREVIOUS_BUTTON: String.format('<button id="{0}" class="btn btn-default">Previous</button>', previousButtonId)
    };

    var $container = null;
    var $table = $(TEMPLATE.TABLE);
    var $thead = $(TEMPLATE.THEAD)
    var $tbody = $(TEMPLATE.TBODY);
    var $pagingButtons = $(TEMPLATE.PAGING_BUTTONS);

    $.fn.jsGrid = function (config) {
        $.extend(config, defaultConfig);
        initialize(config, $(this), 0);
    };

    function initialize(config, $grids, page) {
        const rowCount = config.data.length;

        $.each($grids, function () {
            $container = $(this);

            // Make sure that the previous guests have left the room before renting it out.
            $container.empty();
            $container.unbind();

            // Render header
            renderHeader(config);
            $table.append($thead);

            // Render body
            var page = 0;           
            renderBody(config, page);
            $table.append($tbody);
            
            $container.append($table);

            // Render the paging buttons
            renderPagingButtons(config, page);
            $container.append($pagingButtons);

            //$container.append(String.format(TEMPLATE.PAGE, page + 1));
        });
    }

    function renderHeader(config) {
        for (col = 0; col < config.columns.length; col++) {
            $thead.append(String.format(TEMPLATE.TH, config.columns[col]));
        }
    }

    function renderBody(config, page) {
        const pageSize = config.paging.pageSize;
        const pageStart = page * pageSize;
        const pageEnd = Math.min(pageStart + pageSize, config.data.length);

        $tbody.empty();

        for (row = pageStart; row < pageEnd; row++) {
            var $row = $(TEMPLATE.TR);
            for (col = 0; col < config.columns.length; col++) {
                $row.append(String.format(TEMPLATE.TD, config.data[row][col]));
            }
            $tbody.append($row);
        }
    }

    function renderPagingButtons(config, page) {
        const pageSize = config.paging.pageSize;
        const pageStart = page * pageSize;
        const pageEnd = Math.min(pageStart + pageSize, config.data.length);

        $pagingButtons.empty();

        if (page > 0) {
            var $previousButton = $(TEMPLATE.PREVIOUS_BUTTON);
            $container.on('click', String.format('#{0}', previousButtonId), function () {
                renderBody(config, page - 1);
                renderPagingButtons(config, page - 1);
            });

            $pagingButtons.append($previousButton);
        }

        if (config.data.length > pageEnd) {
            var $nextButton = $(TEMPLATE.NEXT_BUTTON);
            $container.on('click', String.format('#{0}', nextButtonId), function () {
                renderBody(config, page + 1);
                renderPagingButtons(config, page + 1);
            });

            $pagingButtons.append($nextButton);
        }
    }

})(window.jsForm = window.jsForm || {}, jQuery);