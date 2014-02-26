var app = angular.module("kueche", ["firebase"]);

app.factory('Recipes', function($firebase) {
  return $firebase(new Firebase('https://fiery-fire-291.firebaseio.com/'));
});


app.controller('ListCtrl', function ($scope, Recipes) {
    $scope.recipes = Recipes;
});
