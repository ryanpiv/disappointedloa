// Code goes here

(function() {
    var app = angular.module("Disappointed", ['ui.grid', 'ui.grid.pagination', 'ui.grid.selection', 'ui.grid.autoResize']);

    var MainController = function(
        $scope,
        dataGet,
        $interval, $log, $location, $anchorScroll, uiGridConstants) {

        $scope.pageHeader = 'Pending Reviews';
        //<a href="http://ptr.wowhead.com/item=49286"></a>
        $scope.gridColumns = [
            { field: 'player', name: 'Player' }, {
                field: 'date',
                name: 'Date Acquired (EST)',
                sort: { direction: uiGridConstants.DESC }
            }, {
                field: 'item',
                name: 'Item',
                cellTemplate: '<div class="ui-grid-cell-contents"><a target="_blank" href="http://wowhead.com/item={{ grid.appScope.returnItemId(grid, row) }}">{{ grid.appScope.returnItem(grid,row) }}</a></div>'
            },
            { field: 'votes', name: 'Votes' },
            { field: 'boss', name: 'Boss' }, {
                field: 'instance',
                name: 'Instance',
                filter: {
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        { value: 'Tomb of Sargeras-Heroic', label: 'ToS-Heroic' },
                        { value: 'Tomb of Sargeras-Normal', label: 'ToS-Normal' },
                        { value: 'Tomb of Sargeras-Mythic', label: 'ToS-Mythic' }
                    ]
                }
            },
            { field: 'response', name: 'Response' },
            { field: 'dateCreated', name: 'Date Added (UTC)' }
        ];
        $scope.gridColumns2 = [
            { field: 'discordusername', name: 'Discord Username' },
            { field: 'date', name: 'Date Entered' },
            { field: 'type', name: 'Type' },
            { field: 'reason', name: 'Reason' },
            { field: 'dateModified', name: 'Date Last Changed' }
        ];

        $scope.returnItemId = function(grid, row) {
            return row.entity.itemId;
        };
        $scope.returnItem = function(grid, row) {
            return row.entity.item;
        };

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 10,
            sort: null,
            sortCol: null
        };
        var paginationOptions2 = {
            pageNumber: 1,
            pageSize: 10,
            sort: null,
            sortCol: null
        };

        $scope.init = function() {
            //grid stuff
            $scope.gridPagedLoot = {
                columnDefs: $scope.gridColumns,
                enableFiltering: true,
                enablePaginationControls: true,
                paginationPageSize: paginationOptions.pageSize,
                totalItems: dataGet.getTotalRecords().then(onTotalRecordsComplete, onError),
                paginationPageSizes: [10, 25, 50],
                useExternalPagination: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                data: dataGet.getPagedLoot(paginationOptions).then(onPagedGridComplete, onError),
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            paginationOptions.sort = null;
                        } else {
                            paginationOptions.sort = sortColumns[0].sort.direction;
                            paginationOptions.sortCol = sortColumns[0].colDef.field;
                            dataGet.getPagedLoot(paginationOptions).then(onPagedGridComplete, onError);
                            dataGet.getTotalRecords().then(onTotalRecordsComplete, onError);
                        }
                    });
                    gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        dataGet.getPagedLoot(paginationOptions).then(onPagedGridComplete, onError);
                        dataGet.getTotalRecords().then(onTotalRecordsComplete, onError);
                    });
                    /*gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                        $log.info('edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                        $scope.$apply();
                    });*/
                    gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                        //fillGameData([row.entity]);
                        //activateEditMode(row.entity.game_formal_name);
                    });
                }
            };
            $scope.gridPagedLoas = {
                columnDefs: $scope.gridColumns2,
                enableFiltering: true,
                enablePaginationControls: true,
                paginationPageSize: paginationOptions2.pageSize,
                totalItems: dataGet.getTotalLoas().then(onTotalRecordsComplete2, onError),
                paginationPageSizes: [10, 25, 50],
                useExternalPagination: true,
                enableRowSelection: true,
                enableRowHeaderSelection: false,
                multiSelect: false,
                data: dataGet.getPagedLoas(paginationOptions2).then(onPagedGridComplete2, onError),
                onRegisterApi: function(gridApi) {
                    $scope.gridApi = gridApi;
                    $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            paginationOptions2.sort = null;
                        } else {
                            paginationOptions2.sort = sortColumns[0].sort.direction;
                            paginationOptions2.sortCol = sortColumns[0].colDef.field;
                            dataGet.getPagedLoas(paginationOptions2).then(onPagedGridComplete2, onError);
                            dataGet.getTotalRecords().then(onTotalRecordsComplete2, onError);
                        }
                    });
                    gridApi.pagination.on.paginationChanged($scope, function(newPage, pageSize) {
                        paginationOptions2.pageNumber = newPage;
                        paginationOptions2.pageSize = pageSize;
                        dataGet.getPagedLoas(paginationOptions2).then(onPagedGridComplete2, onError);
                        dataGet.getTotalLoas().then(onTotalRecordsComplete2, onError);
                    });
                    /*gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                        $log.info('edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue);
                        $scope.$apply();
                    });*/
                    gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                        //fillGameData([row.entity]);
                        //activateEditMode(row.entity.game_formal_name);
                    });
                }
            };
        };

        var onPagedGridComplete = function(data) {
            $scope.gridPagedLoot.data = data;
        };
        var onTotalRecordsComplete = function(data) {
            $scope.gridPagedLoot.totalItems = parseInt(data);
        };
        var onPagedGridComplete2 = function(data) {
            $scope.gridPagedLoas.data = data;
        };
        var onTotalRecordsComplete2 = function(data) {
            $scope.gridPagedLoas.totalItems = parseInt(data);
        };

        $scope.getTotalRecords = function() {
            dataGet.getTotalRecords().then(onTotalRecordsComplete, onError);
        };
        $scope.getPagedGames = function(pageNumber, pageSize) {
            dataGet.getPagedGames(pageNumber, pageSize).then(onPagedGridComplete, onError);
        };
        $scope.getTotalLoas = function() {
            dataGet.getTotalLoas().then(onTotalRecordsComplete2, onError);
        };
        $scope.getPagedLoas = function(pageNumber, pageSize) {
            dataGet.getPagedLoas(pageNumber, pageSize).then(onPagedGridComplete2, onError);
        };

        var onError = function(reason) {
            $scope.error = "Could not fetch the data";
        };


    }

    app.controller("MainController", MainController);


}());
