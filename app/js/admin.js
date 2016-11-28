
var admin_ready = function(){

	$('#admin_page_controller').hide();
	var eventName = getURLParameter("event");
	$('#text_event_name').text("Event name: " + eventName);
	if(eventName == null || eventName.trim() == ""){
		$('#text_event_name').text("Error: Invalid event name ");
	}

}


$(document).ready(admin_ready);


angular.module("teamform-admin-app", ["firebase", "ngMaterial", "ngMessages"])
.controller("AdminCtrl", function($scope, $firebaseObject, $firebaseArray, $window, $mdDialog) {

    // TODO: implementation of AdminCtrl
    // Initialize $scope.param as an empty JSON object
    $scope.param = {};
    // Call Firebase initialization code defined in site.js
    initializeFirebase();
    var refPath, ref, eventName;
    eventName = getURLParameter("event");
    if (eventName === null) {
        eventName = "test";
    }
    refPath = eventName + "/admin/param";
    ref = firebase.database().ref("events/" + refPath);
    // Link and sync a firebase object
    $scope.param = $firebaseObject(ref);
    $scope.paramMess="";
    $scope.paramLdMess=function(){
//  $scope.param.$loaded()
//      .then(function(data) {

            // Fill in some initial values when the DB entry doesn't exist
            if(typeof $scope.param.maxTeamSize == "undefined"){
                $scope.param.maxTeamSize = 10;
                $scope.paramMess+="NoMax "
            }
            if(typeof $scope.param.minTeamSize == "undefined"){
                $scope.param.minTeamSize = 1;
                $scope.paramMess+="NoMin "
            }

            // Enable the UI when the data is successfully loaded and synchornized
            $('#admin_page_controller').show();
        };
        $scope.param.$loaded().then($scope.paramLdMess);
    refPath = eventName + "/team";
    $scope.team = [];
    $scope.team = $firebaseArray(firebase.database().ref("events/" + refPath));
    refPath = eventName + "/member";
    $scope.member = [];
    $scope.member = $firebaseArray(firebase.database().ref("events/" + refPath));
    $scope.changeMinTeamSize = function(delta) {
        var newVal = $scope.param.minTeamSize + delta;
        if (newVal >= 1 && newVal <= $scope.param.maxTeamSize) {
            $scope.param.minTeamSize = newVal;
        }
        $scope.param.$save();
    };
    $scope.changeMaxTeamSize = function(delta) {
        var newVal = $scope.param.maxTeamSize + delta;
        if (newVal >= 1 && newVal >= $scope.param.minTeamSize) {
            $scope.param.maxTeamSize = newVal;
        }
        $scope.param.$save();
    };
    $scope.saveFunc = function() {
        $scope.param.$save();
        // Finally, go back to the front-end
        $window.open("index.html", "_self");
    };

    // Date
    $scope.startDate = new Date();
    $scope.endDate = new Date();

    var eventAdminParamRef = firebase.database().ref().child("events").child(eventName).child("admin").child("param");
    var eventAdminParamObj = $firebaseObject(eventAdminParamRef);
    eventAdminParamObj.$loaded().then(function(admin) {
        $scope.startDate = new Date(admin.startDate);
        $scope.endDate = new Date(admin.endDate);
        $scope.details = admin.details;
        console.log($scope.startDate);
        console.log($scope.endDate);
        console.log($scope.details);

        if (admin.startDate == null && admin.endDate == null) {
            $scope.startDate = new Date();
            $scope.endDate = new Date();
        }
        if (admin.details == null) {
            $scope.details = null;
        }
    });

    $scope.minDate = new Date();
    $scope.startChange = function() {
        $scope.minDate = $scope.startDate;
    };

    $scope.saveContent = function() {
        if ($scope.details == null || $scope.startDate == null || $scope.endDate == null) {
            return;
        }

        //console.log($scope.startDate);
        //console.log($scope.details);
        ref.update({'startDate': $scope.startDate.getTime(), 'endDate': $scope.endDate.getTime(),
            'details': $scope.details});
    };

    $scope.zeroMember = function(teamMembers) {
        if (teamMembers === undefined) {
            return true;
        } else {
            return false;
        }
    };


    // confirm automatic team form
    $scope.confirmAutomaticTeamForm = function(callback) {
        var confirm = $mdDialog.confirm()
            .title("Automatic Team Form")
            .ok("Form")
            .cancel("Cancel");

        $mdDialog.show(confirm)
            .then(function() {
                callback(true);
            }, function() {
                callback(false);
            });
    };

    // automatic team form
    $scope.automaticTeamForm = function() {
        $scope.confirmAutomaticTeamForm(function(confirm) {
            if (!confirm) {
                // document.querySelector(".mdl-js-snackbar").MaterialSnackbar.showSnackbar({message: "Cancel automatic team form"});
                return;
            }

            console.log("automatic team form");
        });
    };
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});