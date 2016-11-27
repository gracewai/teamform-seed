function recommendationSort(team1, team2) {
    if (team1.placesLeft !== 0 && team2.placesLeft === 0) {
        return -1;
    }

    if (team1.placesLeft === 0 && team2.placesLeft !== 0) {
        return 1;
    }

    if (team1.missingSkillsMatch.number > team2.missingSkillsMatch.number) {
        return -1;
    }

    if (team1.missingSkillsMatch.number < team2.missingSkillsMatch.number) {
        return 1;
    }

    if (team1.skillsMatch.number > team2.skillsMatch.number) {
        return -1;
    }

    if (team1.skillsMatch.number < team2.skillsMatch.number) {
        return 1;
    }

    if (team1.placesLeft > team2.placesLeft) {
        return -1;
    }

    if (team1.placesLeft < team2.placesLeft) {
        return 1;
    }

    return 0;
}

angular.module("teamform-user-app", ["firebase", "ngMaterial", "ngMessages"])
.controller("UserCtrl", function($scope, $firebaseObject, $firebaseArray) {
    initializeFirebase();

    $scope.user = null;

    var userRef = null;
    $scope.userObj = null;

    var skillsRef = null;
    $scope.skills = null;

    var eventTeamRef = null;
    $scope.eventTeamObj = null;

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

                skillsRef = userRef.child("skills");
                $scope.skills = $firebaseArray(skillsRef);

                $scope.userObj.$loaded().then(function() {
                    // get the events object from the database after the user object is loaded
                    eventTeamRef = firebase.database().ref().child("events");
                    $scope.eventTeamObj = $firebaseObject(eventTeamRef);
                    $scope.eventTeamObj.$loaded().then(function() {
                        console.log($scope.eventTeamObj);
                        $scope.recommend();
                    });
                });

                // change the title in the navigation to the name of the signed in user
                $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html($scope.user.displayName);
            });
        } else {
            // No user is signed in.
            console.log('no user is signed in');

            // refresh the scope
            $scope.$apply(function() {
                $scope.user = null;

                userRef = null;
                $scope.userObj = null;

                skillsRef = null;
                $scope.skills = null;

                eventTeamRef = null;
                $scope.eventTeamObj = null;

                // change the title in the navigation to "User"
                $(".mdl-layout>.mdl-layout__header>.mdl-layout__header-row>.mdl-layout__title").html("User");
            });
        }
    });


    $scope.skillInput = null;

    // add skill function
    $scope.addSkill = function() {
        // return if no user is signed in
        if (!$scope.user) {
            return;
        }

        // return if the skill input is invalid
        if (!$scope.skillInput) {
            return;
        }

        var skillsArray = $firebaseArray(skillsRef);
        skillsArray.$loaded().then(function(skills) {
            var skill = {};
            skill[skills.length.toString()] = $scope.skillInput;

            // add the skill to the user's profile
            skillsRef.update(skill);

            // add the skill to the member object of all the events that the user joined
            for (var i in $scope.userObj.events) {
                var eventRef = firebase.database().ref().child("events").child(i).child("member").child($scope.user.uid).child("skills");
                eventRef.update(skill);
            }

            $scope.skillInput = null;
            $("#skillInput").blur();
        });
    };


    /* recommendations */
    $scope.recommendations = [];

    // filter the events to events that the user joined
    $scope.filterEvents = function(eventTeamObj, userObj) {
        var eventTeam = {};

        angular.forEach(eventTeamObj, function(eventValue, eventKey) {
            var c = eventKey.charAt(0);
            if (c !== "_" && c !== "$" && c !== ".") {
                if (userObj.events[eventKey] !== undefined) {
                    eventTeam[eventKey] = eventValue;
                }
            }
        });

        return eventTeam;
    };

    // construct the recommendations array object
    $scope.constructRecommendations = function(eventTeamObj, userObj) {
        var recommendations = [];

        angular.forEach(eventTeamObj, function(eventValue, eventKey) {
            var recommendation = {
                eventName: eventKey,
                teams: []
            };

            angular.forEach(eventValue.team, function(teamValue, teamKey) {
                recommendation.teams.push({
                    teamName: teamKey,
                    placesLeft: teamValue.size - teamValue.currentTeamSize,
                    skillsMatch: isMatched(teamValue.skills, userObj.skills),
                    missingSkillsMatch: missingSkillsMatched(teamValue.skills, teamValue.teamSkills, userObj.skills),
                    skills: teamValue.skills,
                    teamSkills: teamValue.teamSkills
                });
            });

            recommendations.push(recommendation);
        });

        return recommendations;
    };

    /*
     * Provide recommendations
     *
     * 1. separate the teams into 2 sets (teams with places left, teams without places left)
     * 2. sort each set by the number of missing skills match
     * 3. sort each set by the number of skills match
     * 4. sort each set by the number of places left
     *
     * @param recommendations recommendations object
     */
    $scope.provideRecommendations = function(recommendations) {
        angular.forEach(recommendations, function(recommendation, index, recommendationsArray) {
            recommendationsArray[index].teams = recommendation.teams.sort(recommendationSort);
        });
    };

    // limit the number of recommendations for each event
    $scope.limitRecommendations = function(recommendations, limit) {
        angular.forEach(recommendations, function(recommendation, index, recommendationsArray) {
            if (recommendation.teams.length > limit) {
                recommendationsArray[index].teams = recommendation.teams.slice(0, limit);
            }
        });
    };

    $scope.recommend = function() {
        $scope.recommendations = [];

        var eventsFiltered = $scope.filterEvents($scope.eventTeamObj, $scope.userObj);

        $scope.recommendations = $scope.constructRecommendations(eventsFiltered, $scope.userObj);

        $scope.provideRecommendations($scope.recommendations);

        $scope.limitRecommendations($scope.recommendations, 5);
        console.log($scope.recommendations);
    };


    // request team function
    $scope.requestTeam = function(eventName, teamName) {
        var eventMemberTeamRef = firebase.database().ref().child("events").child(eventName).child("member").child($scope.user.uid).child("selection");
        var userEventRef = firebase.database().ref().child("users").child($scope.user.uid).child("events").child(eventName).child("selection");
        var eventMemberTeamArray = $firebaseArray(eventMemberTeamRef);

        eventMemberTeamArray.$loaded().then(function(selections) {
            var requests = [];

            // add the selections stored in the database
            selections.forEach(function(selection) {
                requests.push(selection.$value);
            });

            // add the request team if it was not in the database
            if (!requests.includes(teamName)) {
                requests.push(teamName);
            }

            // update the record in the event
            eventMemberTeamRef.set(requests);
            // update the record in the user's profile
            userEventRef.set(requests);

            // refresh the recommendations
            $scope.recommend();
        });
    };
})
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('orange')
    .accentPalette('indigo');
});
var member_ready = function(){

	$('#member_page_controller').hide();
	$('#text_event_name').text("Error: Invalid event name ");
	var eventName = getURLParameter("q");
	if (eventName != null && eventName !== '' ) {
		$('#text_event_name').text("Event name: " + eventName);
		$('#member_page_controller').show();
	}

}

$(document).ready(member_ready);



angular.module('teamform-member-app', ['firebase'])
.controller('MemberCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray) {

	// TODO: implementation of MemberCtrl


	// Call Firebase initialization code defined in site.js
	initalizeFirebase();

	$scope.userID = "";
	$scope.userName = "";
	$scope.teams = {};



	$scope.loadFunc = function() {
		var userID = $scope.userID;
		if ( userID !== '' ) {

			var refPath = getURLParameter("q") + "/member/" + userID;
			retrieveOnceFirebase(firebase, refPath, function(data) {

				if ( data.child("name").val() != null ) {
					$scope.userName = data.child("name").val();
				} else {
					$scope.userName = "";
				}


				if (data.child("selection").val() != null ) {
					$scope.selection = data.child("selection").val();
				}
				else {
					$scope.selection = [];
				}
				$scope.$apply();
			});
		}
	}

	$scope.saveFunc = function() {


		var userID = $.trim( $scope.userID );
		var userName = $.trim( $scope.userName );

		if ( userID !== '' && userName !== '' ) {

			var newData = {
				'name': userName,
				'selection': $scope.selection
			};

			var refPath = getURLParameter("q") + "/member/" + userID;
			var ref = firebase.database().ref(refPath);

			ref.set(newData, function(){
				// complete call back
				//alert("data pushed...");

				// Finally, go back to the front-end
				window.location.href= "index.html";
			});




		}
	}

	$scope.refreshTeams = function() {
		var refPath = getURLParameter("q") + "/team";
		var ref = firebase.database().ref(refPath);

		// Link and sync a firebase object
		$scope.selection = [];
		$scope.toggleSelection = function (item) {
			var idx = $scope.selection.indexOf(item);
			if (idx > -1) {
				$scope.selection.splice(idx, 1);
			}
			else {
				$scope.selection.push(item);
			}
		}


		$scope.teams = $firebaseArray(ref);
		$scope.teams.$loaded()
			.then( function(data) {



			})
			.catch(function(error) {
				// Database connection error handling...
				//console.error("Error:", error);
			});


	}


	$scope.refreshTeams(); // call to refresh teams...

}]);
