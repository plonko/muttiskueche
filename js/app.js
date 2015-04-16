var app = angular.module("kueche", ["ngRoute", "firebase"]);

app.run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
          $location.path("/");
        }
    });
}]);

//Firebase.enableLogging(true, true);

app.factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        var ref = new Firebase("https://fiery-fire-291.firebaseio.com/");
        return $firebaseAuth(ref);
    }
]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        controller:'ListCtrl',
        templateUrl:'list.html'
    })
    .when('/edit/:recipeId', {
        controller:'EditCtrl',
        templateUrl:'detail.html',
        resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
            // $waitForAuth returns a promise so the resolve waits for it to complete
            return Auth.$requireAuth();
        }]
      }
    })
    .when('/new', {
        controller:'CreateCtrl',
        templateUrl:'detail.html',
        resolve: {
        // controller will not be loaded until $waitForAuth resolves
        // Auth refers to our $firebaseAuth wrapper in the example above
        "currentAuth": ["Auth", function(Auth) {
            // $waitForAuth returns a promise so the resolve waits for it to complete
            return Auth.$requireAuth();
        }]
      }
    })
    .otherwise({
        redirectTo:'/'
    });
});



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
            console.log($scope.authData)
        });
    }
])

app.controller('CreateCtrl', ["$scope", "$location", "$timeout", "Recipes", "currentAuth",
    function($scope, $location, $timeout, Recipes, currentAuth) {
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
    }
]);


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
