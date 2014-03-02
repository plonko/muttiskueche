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
    $scope.recipe = {ingredients: [{id:1}]};
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
    // Stolen from https://www.twilio.com/blog/2013/12/votr-part-5-angularjs-crud-restful-apis.html
    $scope.addIngredient = function() {
        $scope.recipe.ingredients.push({id: $scope.recipe.ingredients.length+1});
    };
    $scope.removeIngredient = function(ingredient) {
        $scope.recipe.ingredients.splice(ingredient.id-1, 1);
        // need to make sure id values run from 1..x (web service constraint)
        $scope.recipe.ingredients.forEach(function(ingredient, index) {
            ingredient.id = index+1;
        });
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
    $scope.addIngredient = function() {
        $scope.recipe.ingredients.push({id: $scope.recipe.ingredients.length+1});
    };
    $scope.removeIngredient = function(ingredient) {
        $scope.recipe.ingredients.splice(ingredient.id-1, 1);
        // need to make sure id values run from 1..x (web service constraint)
        $scope.recipe.ingredients.forEach(function(ingredient, index) {
            ingredient.id = index+1;
        });
    };
});