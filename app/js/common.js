function isAvailable(team) {
	return team.currentTeamSize < team.size;
}

/**
 * filter teams that still have places left
 *
 * @param teams array of teams
 * @return filtered teams
 */
function getAvailableTeam(teams) {
	return teams.filter(isAvailable);
}


/**
 * calculate the number of missing skills matched
 *
 * @param preferredSkills preferred skills of a team
 * @param foundSkills skills that the team have already
 * @param currentSkills skills of the signed in user
 * @return missing skills matched and number of missing skills matched
 */
function missingSkillsMatched(preferredSkills, foundSkills, currentSkills){
	if (preferredSkills === undefined || currentSkills === undefined) {
		return {match: [], number: 0};
	}

	if (foundSkills === undefined) {
		foundSkills = [];
	}

	var missingSkillsArray = preferredSkills.filter(
	function(preferredSkill){
		return !foundSkills.includes(preferredSkill);
	}
	);
	var missingSkillsMatchedArray = missingSkillsArray.filter(
	function(missingSkill){
		return currentSkills.includes(missingSkill);
	}
	);
	return {match: missingSkillsMatchedArray, number:missingSkillsMatchedArray.length};
	}


/**
 * calculate the number of skills matched
 *
 * @param preferredSkills preferred skills of a team
 * @param currentSkills skills of the signed in user
 * @return skills match and number of skills matched
 */
function isMatched(preferredSkills, currentSkills){
	if (preferredSkills === undefined || currentSkills === undefined) {
		return {match: [], number: 0};
	}

	var filteredArray = preferredSkills.filter(
	function(each){
		for (var i=0;i<currentSkills.length;i++){
			if(each==currentSkills[i]){
				return true;
			}
		}
		return false;
	}
	);
	return {match: filteredArray, number: filteredArray.length};
}


function hasNoTeam(member){
	return member.team === undefined;
}

/**
 * filter members that do not have a team yet
 *
 * @param members array of members
 * @return filtered members
 */
function membersWithNoTeam(members){
	return members.filter(hasNoTeam);
}


function insufficientMemberTeams(teams)
{
    var insufficentTeams = getAvailableTeam(teams);

    //if(insufficentTeams.length===0)
        //return;

    var uids = [];
    for( i=0; i<insufficentTeams.length; i++)
    {
        for(var j=0; j<insufficentTeams[i].teamMembers.length; j++)
        {
            uids.push(insufficentTeams[i].teamMembers[j].uid);

        }
    }
    return uids;

}
