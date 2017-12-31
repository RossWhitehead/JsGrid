/// <reference path="node_modules/jquery/dist/jQuery.js" />
/// <reference path="string.js" />

(function(jsGrid, $) {

    const defaultConfig = {
        paging: {
            enabled: false,
            pageSize: 2
        }
    };

    const previousButtonId = 'previous-button';
    const nextButtonId = 'next-button';

    const TEMPLATE = {
        TABLE_PANEL: `
            <div class="panel panel-primary list-panel" id="list-panel">
                <div class="panel-heading list-panel-heading">
                    <h3 class="panel-title list-panel-title">Products</h3>
                    <button type="button" class="btn btn-default btn-sm refresh-button">
                            <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Refresh</button>
                </div>
                <div class="panel-body"></div>
                <nav>
                    <ul class="pagination">
                    <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                    <li class="page-item"><a class="page-link" href="#">Next</a></li>
                    </ul>
                </nav>
                <div class="panel-footer">
                    <button type="button" class="btn btn-primary btn-sm" id="add-button">
                    <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Add</button>
                </div>
            </div>`,
        TABLE: '<table class="table">',
        THEAD: '<thead>',
        TBODY: '<tbody>',
        TH: '<th>{0}</th>',
        TR: '<tr>',
        TD: '<td>{0}</td>',
        PAGE: '<span>Page {0}</span>',
        PAGING_BUTTONS: '<div>',
        NEXT_BUTTON: String.format('<button id="{0}" class="btn btn-sm btn-default">Next</button>', nextButtonId),
        PREVIOUS_BUTTON: String.format('<button id="{0}" class="btn btn-sm btn-default">Previous</button>', previousButtonId),
        EDIT_BUTTON: '<button id="{0}" class="btn btn-sm btn-default" data-row-number="{1}">Edit</button>'
    };

    var $container = null;
    var $table = $(TEMPLATE.TABLE);
    var $thead = $(TEMPLATE.THEAD)
    var $tbody = $(TEMPLATE.TBODY);
    var $pagingButtons = $(TEMPLATE.PAGING_BUTTONS);

    $.fn.jsGrid = function(config) {
        $.extend(config, defaultConfig);
        initialize(config, $(this), 0);
    };

    function initialize(config, $grids, page) {
        const rowCount = config.data.length;

        $.each($grids, function() {
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

            // Render table panel and insert table
            var tablePanel = $.parseHTML(TEMPLATE.TABLE_PANEL);
            $container.append(tablePanel);
            var $panelBody = $container.find('.panel-body');
            $panelBody.append($table);

            // Add button
            if (config.actions.add.enabled === true) {
                $container.on('click', '#add-button', function(event) {
                    if ($.isFunction(config.actions.add.action)) {
                        console.log(event.target);
                        config.actions.add.action();
                    } else {
                        console.log("config.post.add.action must be a function");
                    }
                });
            }

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
        if (config.actions.edit.enabled === true) {
            $thead.append(String.format(TEMPLATE.TH, "Actions"));
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
            if (config.actions.edit.enabled === true) {
                var id = "edit" + row;
                var $td = $(String.format(TEMPLATE.TD, ""));
                var $editButton = $(String.format(TEMPLATE.EDIT_BUTTON, id, row));
                $container.on('click', '#' + id, function(event) {
                    if ($.isFunction(config.actions.edit.action)) {
                        console.log(event.target);
                        var rowNumber = $(event.target).data("row-number");
                        config.actions.edit.action(config.data[rowNumber]);
                    } else {
                        console.log("config.post.edit.action must be a function");
                    }
                });
                $td.append($editButton);
                $row.append($td);
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
            $container.on('click', String.format('#{0}', previousButtonId), function() {
                renderBody(config, page - 1);
                renderPagingButtons(config, page - 1);
            });

            $pagingButtons.append($previousButton);
        }

        if (config.data.length > pageEnd) {
            var $nextButton = $(TEMPLATE.NEXT_BUTTON);
            $container.on('click', String.format('#{0}', nextButtonId), function() {
                renderBody(config, page + 1);
                renderPagingButtons(config, page + 1);
            });

            $pagingButtons.append($nextButton);
        }
    }

})(window.jsForm = window.jsForm || {}, jQuery);