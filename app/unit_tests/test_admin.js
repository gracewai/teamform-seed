describe('Test admin.js', function(){

//  beforeEach(module('teamform-admin-app'));
  var controller;
  var $scope;
  	if(firebase.apps.length === 0) {
		initalizeFirebase();
	}
  beforeEach(module('teamform-admin-app'));
//  var $controller;
//  var $firebaseObject;
//  var $firebaseArray;

  beforeEach(inject(function(_$controller_,$rootScope){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $scope=$rootScope.$new();
    controller = _$controller_('AdminCtrl', { $scope: $scope });
    // $firebaseObject = _$firebaseObject_;
    // $firebaseArray = _$firebaseArray_;
  }));


 /* beforeEach(function() {
    $scope = {};
    controller = $controller('AdminCtrl', { $scope: $scope });
  });
*/
//  describe('test', function (){
	it('test paramLoaded', function() {
		$scope.param={};
		$scope.paramLdMess();
		expect($scope.paramMess).toEqual("NoMax NoMin ");
	});


    it('test changeMinTeamSize function',function(){
      admin_ready();
      $scope.param.minTeamSize=1;
      $scope.param.maxTeamSize=10;
      $scope.changeMinTeamSize(2);
      $scope.changeMinTeamSize(-10);
      expect($scope.param.minTeamSize).toEqual(3);
      $scope.changeMaxTeamSize(8);
      $scope.changeMaxTeamSize(-10);
      $scope.saveFunc();
    });


//  });

});
