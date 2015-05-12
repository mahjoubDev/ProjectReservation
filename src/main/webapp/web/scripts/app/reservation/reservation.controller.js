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

        //--------------------------------
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        //----------------------------

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

        $scope.changeTo = 'Hungarian';
        /* event source that pulls from google.com */
        $scope.eventSource = {
            url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
            className: 'gcal-event',           // an option!
            currentTimezone: 'America/Chicago' // an option!
        };
        $scope.events = [
            {title: 'All Day Event', start: new Date(y, m, 1)},
            {title: 'Long Event', start: new Date(y, m, d - 5), end: new Date(y, m, d - 2)},
            {id: 999, title: 'Repeating Event', start: new Date(y, m, d - 3, 16, 0), allDay: false},
            {id: 999, title: 'Repeating Event', start: new Date(y, m, d + 4, 16, 0), allDay: false},
            {
                title: 'Birthday Party',
                start: new Date(y, m, d + 1, 19, 0),
                end: new Date(y, m, d + 1, 22, 30),
                allDay: false
            },
            {title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/'}
        ];

        /* alert on eventClick */
        $scope.alertOnEventClick = function (date, jsEvent, view) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };

        /* alert on Drop */
        $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        };
        /* alert on Resize */
        $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
            $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        };
        /* add and removes an event source of choice */
        $scope.addRemoveEventSource = function (sources, source) {
            var canAdd = 0;
            angular.forEach(sources, function (value, key) {
                if (sources[key] === source) {
                    sources.splice(key, 1);
                    canAdd = 1;
                }
            });
            if (canAdd === 0) {
                sources.push(source);
            }
        };
        /* add custom event*/
        $scope.addEvent = function () {
            $scope.events.push({
                title: 'Open Sesame',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                className: ['openSesame']
            });
        };
        /* remove event */
        $scope.remove = function (index) {
            $scope.events.splice(index, 1);
        };
        /* Change View */
        $scope.changeView = function (view, calendar) {
            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
        };
        /* Change View */
        $scope.renderCalender = function (calendar) {
            if (uiCalendarConfig.calendars[calendar]) {
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };
        /* Render Tooltip */
        $scope.eventRender = function (event, element, view) {
            element.attr({
                'tooltip': event.title,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };
        $scope.changeLang = function () {
            if ($scope.changeTo === 'Hungarian') {
                $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétf?", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
                $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
                $scope.changeTo = 'English';
            } else {
                $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                $scope.changeTo = 'Hungarian';
            }
        };
        /* event sources array*/
        $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
        $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];

        //======================================================================================================
        //-----------------------------------    Calendar  ------------------------------------------------------
        //=======================================================================================================

        /*  $scope.events = [
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



         $scope.events = [
         {title: 'All Day Event',start: new Date(y, m, 1)},
         {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
         {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
         {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
         {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
         {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
         ];

         $scope.uiConfig = {
         calendar:{
         height: 450,
         editable: true,
         header:{
         left: 'title',
         center: '',
         right: 'today prev,next'
         },
         eventClick: $scope.alertOnEventClick,
         eventDrop: $scope.alertOnDrop,
         eventResize: $scope.alertOnResize,
         eventRender: $scope.eventRender
         }
         };

         $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
         $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];*/

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
            scheduler.init($element[0], $scope.scheduler.mode, $scope.scheduler.date);
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