'use strict';

angular.module('jhipsterApp')
    .controller('ReservationController', function ($scope, $http, Category, Resource, Reservation) {
        $scope.categorie = [];
        $scope.events = [];
        $scope.events = []
        $scope.reservations = [];
        $scope.toggle = '!toggle';
        $scope.reservationInfo = {};
        $scope.eventSources = [];

        /**
         * Get all the categories in the system.
         */
        Category.findAll({}, function (response) {
            $scope.categories = response;
        });

        /**
         * Get all the resources in the system.
         */
        Resource.findAll({}, function (response) {
            $scope.resources = response;

        });

        Reservation.findAll({}, function (response) {
            console.log('reservations  ' + JSON.stringify(response));
            $scope.reservations = response;

        });

        /**
         *
         */
        $scope.add = function (reservationInfo) {
            console.log('call method add reservation');
            console.log("reservationInfo   " + JSON.stringify(reservationInfo));

            var promise = Reservation.add({}, reservationInfo).$promise;
            promise.then(function (data) {
                    console.log('reservation has been added successfully')
                    $scope.reservations = Reservation.findAll();                    // $route.reload();
                    $scope.showModalAdd = !$scope.showModalAdd;
                    $scope.reservationInfo = {};

                }, function (error) {
                    console.log("there is an error " + error);
                }
            );
        };


        /**
         *
         */
        $scope.toggleModalAdd = function () {
            $scope.showModalAdd = !$scope.showModalA;
            scope: $scope;
        };

        //======================================================================================================
        //-----------------------------------    Calendar  ------------------------------------------------------
        //=======================================================================================================

          $scope.events = [
         { id:1, text:"Reservation sale reunion",
         start_date: new Date(2015, 4, 11,9,0,0),
         end_date: new Date(2015, 4, 12,11,0,0) },
         { id:2, text:"Reservation tablette",
         start_date: new Date(2015, 4, 22 ),
         end_date: new Date(2015, 4, 24 ) },

         { id:3, text:"Reservation pc",
         start_date: new Date(2015, 4, 30 ),
         end_date: new Date(2015, 5, 4 ) }
         ];

         $scope.scheduler = { date : new Date() };


    });


angular.module('jhipsterApp').directive('dhxScheduler', function () {
    return {
        restrict: 'A',
        scope: false,
        transclude: true,
        template: '<div class="dhx_cal_navline"' +
        ' ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',


        link: function ($scope, $element, $attrs, $controller) {
            //default state of the scheduler
            if (!$scope.scheduler)
                $scope.scheduler = {};
            $scope.scheduler.mode = $scope.scheduler.mode || "month";
            $scope.scheduler.date = $scope.scheduler.date || new Date();

            //watch data collection, reload on changes
            $scope.$watch($attrs.data, function (collection) {
                scheduler.clearAll();
                scheduler.parse(collection, "json");
            }, true);

            //mode or date
            $scope.$watch(function () {
                return $scope.scheduler.mode + $scope.scheduler.date.toString();
            }, function (nv, ov) {
                var mode = scheduler.getState();
                if (nv.date != mode.date || nv.mode != mode.mode)
                    scheduler.setCurrentView($scope.scheduler.date, $scope.scheduler.mode);
            }, true);

            //size of scheduler
            $scope.$watch(function () {
                return $element[0].offsetWidth + "." + $element[0].offsetHeight;
            }, function () {
                scheduler.setCurrentView();
            });

            //styling for dhtmlx scheduler
            $element.addClass("dhx_cal_container");
            //init scheduler
            scheduler.config.dblclick_create = false;
            scheduler.config.drag_create = false;
            scheduler.config.drag_move = true;
            scheduler.config.readonly = false;
            scheduler.config.touch= true;
            scheduler.config.collision_limit = 1; //this does not give an error but does not work

            //init scheduler
            scheduler.init($element[0], $scope.scheduler.mode, $scope.scheduler.date);

            this.sayHello = function() {
                console.log("called from the driective")
            };


        }

    }
});

angular.module('jhipsterApp').directive('dhxTemplate', ['$filter', function ($filter) {
    scheduler.aFilter = $filter;

    return {
        restrict: 'AE',
        terminal: true,

        link: function ($scope, $element, $attrs, $controller) {
            $element[0].style.display = 'none';

            var template = $element[0].innerHTML;
            template = template.replace(/[\r\n]/g, "").replace(/"/g, "\\\"").replace(/\{\{event\.([^\}]+)\}\}/g, function (match, prop) {
                if (prop.indexOf("|") != -1) {
                    var parts = prop.split("|");
                    return "\"+scheduler.aFilter('" + (parts[1]).trim() + "')(event." + (parts[0]).trim() + ")+\"";
                }
                return '"+event.' + prop + '+"';
            });
            var templateFunc = Function('sd', 'ed', 'event', 'return "' + template + '"');
            scheduler.templates[$attrs.dhxTemplate] = templateFunc;
        }
    };
}]);

angular.module('jhipsterApp').directive('jqdatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "yy-mm-dd 00:00:00",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            element.datepicker(options);
        }
    };
});