describe('Test admin.js', function(){

  beforeEach(module('teamform-admin-app'));

  var $controller;
  var $firebaseObject;
  var $firebaseArray;

  var controller;
  var $scope;


  beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    // $firebaseObject = _$firebaseObject_;
    // $firebaseArray = _$firebaseArray_;
  }));


  beforeEach(function() {
    $scope = {};
    controller = $controller('AdminCtrl', { $scope: $scope });
  });

  describe('test', function (){
    it('test changeMinTeamSize function',function(){
      admin_ready();
      $scope.changeMinTeamSize(2);
      $scope.changeMaxTeamSize(8);
      $scope.saveFunc();
    });


  });

});
