var app = angular.module("kueche", ["ngRoute", "firebase"]);

//Firebase.enableLogging(true, true);


app.config(function($routeProvider, $locationProvider) {
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

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase("https://fiery-fire-291.firebaseio.com/");
        return $firebaseAuth(ref);
    }
]);

// and use it in our controller
app.controller("LoginCtrl", ["$scope", "Auth",
    function($scope, Auth) {
        $scope.login = function() {
            $scope.auth = Auth;
            $scope.authData = null;
            $scope.error = null;

            $scope.auth.$authWithPassword({
                email: $scope.loginEmail,
                password: $scope.loginPassword
            }).then(function(authData) {
                $scope.authData = authData;
            }).catch(function(error) {
                $scope.error = error;
            });
            $scope.auth.$onAuth(function(authData) {
                  $scope.authData = authData;
            });
        };
    }
]);

app.factory("Recipes", ["$firebaseArray",
    function($firebaseArray) {
        var ref = new Firebase("https://fiery-fire-291.firebaseio.com/");
        return $firebaseArray(ref);
    }
]);

app.controller("ListCtrl", ["$scope", "Recipes", "Auth",
    function($scope, Recipes, Auth) {
        $scope.auth = Auth;
        var authData = null;
        $scope.recipes = Recipes;

        $scope.auth.$onAuth(function(authData) {
            $scope.authData = authData;
        });
    }
])

app.controller('CreateCtrl', function($scope, $location, $timeout, Recipes) {
    $scope.recipe = {ingredients: [{id:1}]};
    $scope.save = function() {
        Recipes.$add($scope.recipe);
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


app.controller('EditCtrl', function($scope, $location, $routeParams, $firebaseObject) {
    var recipeUrl = 'https://fiery-fire-291.firebaseio.com/' + $routeParams.recipeId;
    $scope.recipe = $firebaseObject(new Firebase(recipeUrl));

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
        $scope.recipe.ingredients.forEach(function(ingredient, index) {
            ingredient.id = index+1;
        });
    };
});
