var app = angular.module("kueche", ["ngRoute", "firebase"]);

app.factory('Recipes', function($firebase) {
  return $firebase(new Firebase('https://fiery-fire-291.firebaseio.com/'));
});

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        controller:'ListCtrl',
        templateUrl:'list.html'
    })
    // .when('/edit/:projectId', {
    //     controller:'EditCtrl',
    //     templateUrl:'detail.html'
    // })
    .when('/new', {
        controller:'CreateCtrl',
        templateUrl:'detail.html'
    })
    .otherwise({
        redirectTo:'/'
    });
});

app.controller('ListCtrl', function ($scope, Recipes) {
    $scope.recipes = Recipes;
});

app.controller('CreateCtrl', function($scope, $location, $timeout, Recipes) {
    $scope.save = function() {
        console.log('ooh la la deux!');
        Recipes.$add($scope.recipe);
        $location.path('/');
        // Cannot get this add callback to work!! Need to revisit. Location change works sychronously for now.
        // function() {
        //            console.log('ooh la la une!');
        //            $timeout(function() {
        //                console.log('ooh la la!');
        //                $location.path('/');
        //            }, 400);
        //        }
    };
});