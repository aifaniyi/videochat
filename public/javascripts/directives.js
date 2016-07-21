app.directive('sounds', function(){
  return {
    restrict: 'E',
    replace: true,
    /*
    scope: {
      tripdetail: '='
    },link: function(scope, element, attribute){
      scope.tripdetail = attribute.tripdetail;
      console.log(scope.tripdetail)
    },*/
    templateUrl: '/javascripts/templates/sounds.html'
  }
});
