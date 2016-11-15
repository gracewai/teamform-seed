describe('Test team.js', function(){

  beforeEach(module('teamform-team-app'));

  var $controller;
  var $firebaseObject;
  var $firebaseArray;

  var controller;
  var $scope;


  beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $firebaseObject = _$firebaseObject_;
    $firebaseArray = _$firebaseArray_;
  }));


  beforeEach(function() {
    $scope = {};
    controller = $controller('TeamCtrl', { $scope: $scope });
  });

  describe('test', function (){


    it('test',function(){
      team_ready();
      // $scope.refreshViewRequestsReceived();

      // $scope.range.minTeamSize = 0;
      // $scope.range.maxTeamSize = 10;
      // $scope.changeCurrentTeamSize(4);
      $scope.saveFunc();
      $scope.loadFunc();
      $scope.processRequest();
      $scope.removeMember();
    });


  });

});
