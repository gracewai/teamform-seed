describe('Test member.js', function(){

  beforeEach(module('teamform-member-app'));

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
    controller = $controller('MemberCtrl', { $scope: $scope });
  });

  describe('test',function(){
    it('test',function(){
      member_ready();
      $scope.userID = "test";
      $scope.loadFunc();
      $scope.saveFunc();
      $scope.toggleSelection();
    });

  });
});
