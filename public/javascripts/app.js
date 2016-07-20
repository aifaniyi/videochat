'use strict';

var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/welcome");

  $stateProvider
    .state('welcome', {
      url: "/welcome",
      controller: "welcome",
      templateUrl: "partials/welcome.html"
    })
});
