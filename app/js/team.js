var team_ready = function(){

	$('#team_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);

	}
};


$(document).ready(team_ready);

// add the user's skills to the team when adding a member
function addTeamSkills(teamSkills, userSkills) {
    userSkills.forEach(function(userSkill) {
        if (!teamSkills.includes(userSkill)) {
            teamSkills.push(userSkill);
        }
    });

    return teamSkills;
}

// remove the user's skills from the team when removing a member
function removeTeamSkills(teamSkills, teamMembers, member) {
    return teamSkills.filter(function(teamSkill) {
        // keep the skill if the member does not have it
        if (!member.skills.includes(teamSkill)) {
            return true;
        }

        // check if any other members also have the skill
        for (var i in teamMembers) {
            if (teamMembers[i].uid === member.uid) {
                continue;
            }

            // keep the skill if another member has it
            if (teamMembers[i].skills.includes(teamSkill)) {
                return true;
            }
        }

        return false;
    });
}

angular.module('teamform-team-app', ['firebase', "ngMaterial"])
.controller('TeamCtrl', ['$scope', '$firebaseObject', '$firebaseArray',
    function($scope, $firebaseObject, $firebaseArray) {

	// Call Firebase initialization code defined in site.js
   initializeFirebase();


    $scope.user = null;

    var userRef = null;
    $scope.userObj = null;

    // observe the auth state change
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user);

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = user;

                // get the user object from the database
                userRef = firebase.database().ref().child("users").child(user.uid);
                $scope.userObj = $firebaseObject(userRef);
            });
        } else {
            // No user is signed in.
            console.log('no user is signed in');

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = null;

                userRef = null;
                $scope.userObj = null;
            });
        }
    });


    // var refPath = "";
    var eventName = getURLParameter("event");
    var teamName = getURLParameter("team");
    if (eventName === null) {
        eventName = "test";
    }
    if (teamName === null) {
        teamName = "test";
    }
    var eventRef = firebase.database().ref().child("events").child(eventName);


    var eventAdminParamRef = eventRef.child("admin").child("param");
    var eventAdminParamObj = $firebaseObject(eventAdminParamRef);
    eventAdminParamObj.$loaded().then(function(admin) {
        $scope.minTeamSize = admin.minTeamSize;
        $scope.maxTeamSize = admin.maxTeamSize;
    });


    var eventTeamRef = eventRef.child("team").child(teamName);
    var eventTeamObj = $firebaseObject(eventTeamRef);
    eventTeamObj.$loaded().then(function(team) {
        $scope.size = team.size;
        $scope.currentTeamSize = team.currentTeamSize;
    });

    var eventTeamMembersRef = eventTeamRef.child("teamMembers");
    $scope.members = $firebaseArray(eventTeamMembersRef);
    var membersArray = [];
    $scope.members.$loaded().then(function(members) {
        angular.forEach(members, function(member) {
            membersArray.push({uid: member.uid, name: member.name, skills: member.skills});
        });
    });

    var skillsRef = eventTeamRef.child("skills");
    $scope.skills = $firebaseArray(skillsRef);

    var teamSkillsRef = eventTeamRef.child("teamSkills");
    $scope.teamSkills = $firebaseArray(teamSkillsRef);
    var teamSkillsArray = [];
    $scope.teamSkills.$loaded().then(function(teamSkills) {
        angular.forEach(teamSkills, function(teamSkill) {
            teamSkillsArray.push(teamSkill.$value);
        });
    });


    var eventTeamMemberRequestsRef = eventRef.child("member");
    var eventTeamMemberRequestsArray = $firebaseArray(eventTeamMemberRequestsRef);
    eventTeamMemberRequestsArray.$loaded().then(function(members) {
        $scope.requests = [];

        angular.forEach(members, function(member) {
            if (member.selection !== undefined && member.selection.includes(teamName)) {
                $scope.requests.push({uid: member.$id, name: member.name, skills: member.skills});
            }
        });
    });


    $scope.changeCurrentTeamSize = function(change) {
        if ($scope.size + change >= $scope.currentTeamSize && $scope.size + change >= $scope.minTeamSize && $scope.size + change <= $scope.maxTeamSize) {
            eventTeamRef.update({size: $scope.size + change});
            $scope.size += change;
        }
    };


    // add member function
    $scope.addMember = function(request) {
        if ($scope.currentTeamSize < $scope.size) {
            // add the member to the team
            var member = {};
            member[$scope.currentTeamSize] = {uid: request.uid, name: request.name, skills: request.skills};
            console.log(member);
            eventTeamMembersRef.update(member);

            // update the skills that the team have
            teamSkillsRef.set(addTeamSkills(teamSkillsArray, request.skills));

            // update the request for the user
            var eventTeamMemberRequestRef = eventTeamMemberRequestsRef.child(request.uid);
            eventTeamMemberRequestRef.update({selection: null});

            // update the team for the event in the user's profile
            var userEventRef = firebase.database().ref().child("users").child(request.uid).child("events").child(eventName);
            userEventRef.update({team: teamName, selection: null});

            // remove the request
            var requestIndex = $scope.requests.indexOf(request);
            $scope.requests.splice(requestIndex, 1);

            // increase the current team size by 1
            eventTeamRef.update({currentTeamSize: $scope.currentTeamSize + 1});
            $scope.currentTeamSize += 1;
        }
    };

    // remove member function
    $scope.removeMember = function(member) {
        // remove the member from the team
        $scope.members.$remove(member);

        // update the skills that the team have
        teamSkillsRef.set(removeTeamSkills(teamSkillsArray, membersArray, member));

        // update the team for the event in the user's profile
        var userEventRef = firebase.database().ref().child("users").child(member.uid).child("events").child(eventName);
        userEventRef.update({team: ""});

        // decrease the current team size by 1
        eventTeamRef.update({currentTeamSize: $scope.currentTeamSize - 1});
        $scope.currentTeamSize -= 1;
    };


    // add skill function
    $scope.addSkill = function() {
        var skillsArray = $firebaseArray(skillsRef);

        skillsArray.$loaded().then(function(skills) {
            var skill = {};
            skill[skills.length.toString()] = $scope.skillInput;

            skillsRef.update(skill);

            $scope.skillInput = null;
        });
    };
}])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('indigo');
});


