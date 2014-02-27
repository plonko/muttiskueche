var app = angular.module("kueche", ["ngRoute", "firebase"]);

app.value('fbURL', 'https://fiery-fire-291.firebaseio.com/');

app.factory('Recipes', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL));
});

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        controller:'ListCtrl',
        templateUrl:'list.html'
    })
    .when('/edit/:recipeId', {
        controller:'EditCtrl',
        templateUrl:'detail.html'
    })
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

app.controller('EditCtrl',
  function($scope, $location, $routeParams, $firebase, fbURL) {
    var recipeUrl = fbURL + $routeParams.recipeId;
    $scope.recipe = $firebase(new Firebase(recipeUrl));

    $scope.destroy = function() {
      $scope.recipe.$remove();
      $location.path('/');
    };

    $scope.save = function() {
      $scope.recipe.$save();
      $location.path('/');
    };
});