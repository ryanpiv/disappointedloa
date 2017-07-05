(function() {

    var dataGet = function($http) {
        var getPagedLoot = function(paginationOptions) {
            return $http.get("js/data/get-paged-loot.php?pageNum=" + paginationOptions.pageNumber + "&pageSize=" + paginationOptions.pageSize + "&sort=" + paginationOptions.sort + "&sortCol=" + paginationOptions.sortCol)
                .then(function(response) {
                    return response.data;
                });
        };
        var getTotalRecords = function() {
            return $http.get("js/data/get-total-records.php?")
                .then(function(response) {
                    return response.data;
                });
        };
        return {
            getPagedLoot: getPagedLoot,
            getTotalRecords: getTotalRecords
        };
    }

    var module = angular.module("Disappointed");
    module.factory("dataGet", dataGet);

    angular.module('MyModule', [], function($httpProvider) {
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    });

}());
