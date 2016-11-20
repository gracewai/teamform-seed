describe('Test team.js', function(){
  var controller;
  var $scope;

  if(firebase.apps.length === 0) {
    initalizeFirebase();
  }

  beforeEach(module('teamform-team-app'));

  var $controller;
  var $firebaseObject;
  var $firebaseArray;


  beforeEach(inject(function(_$controller_, _$firebaseObject_, _$firebaseArray_,$rootScope){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $scope=$rootScope.$new();
    controller = _$controller_('TeamCtrl', { $scope: $scope });
    $firebaseObject = _$firebaseObject_;
    $firebaseArray = _$firebaseArray_;
  }));

  it("change teamsize",function(){
    $scope.param.currentTeamSize=3;
    $scope.range = {
      minTeamSize: 1, maxTeamSize: 5
    };
    $scope.changeCurrentTeamSize(1);
    expect($scope.param.currentTeamSize).toEqual(4);
    $scope.changeCurrentTeamSize(-6);

    //process request
    $scope.param.teamMembers=["one","two"];
    $scope.param.currentTeamSize=3;
    $scope.processRequest("one");
    $scope.processRequest("aaa");
    $scope.processRequest("bbb");
    $scope.processRequest("");

    //remove member
    $scope.removeMember("one");
    $scope.param.teamMembers = ["aaa","bbb"];
    $scope.removeMember("member");

    //view requestreceive
    $scope.param = {teamName: "team1"};
    $scope.member = [
      {$id: "123", selection: ["team1", "team2"]},
      {$id: "456", selection: ["team3", "team2"]},
      {$id: "789", selection: ["team1", "team3"]}
    ];
    $scope.refreshViewRequestsReceived();
    expect($scope.requests).toEqual(["123", "789"]);

    //loadFunc
    $scope.loadFunc();
  });
  it("test saveFunc", function() {
    team_ready();
    spyOn(window, 'getURLParameter').and.callFake(function(){return 'peter'});
    team_ready();

    $scope.param.currentTeamSize=10;
    $scope.param.teamName = "tName";
    $scope.param.teamMembers =["member"];
    $scope.saveFunc();
  });



});
