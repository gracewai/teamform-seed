var url_check;

//click admin button
var admin_click = function(name){
    var val = name;
    if ( val !== '' ) {
      var url = "admin.html?q=" + val;
      url_check = url;
      window.location.href = url ;
      return false;
    }
  };

//click team button
var team_click = function(name){
    var val = name ;
    if ( val !== '' ) {
      var url = "team.html?q=" + val;
      url_check = url;
      window.location.href = url ;
      return false;
    }
  };

//click member button
var member_click = function(name){
    var val = name;
    if ( val !== '' ) {
      var url = "member.html?q=" + val;
      url_check = url;
      window.location.href = url ;
      return false;
    }
  };


var onReady = function(){

  $("#btn_admin")[0].setAttribute('onclick', "admin_click($('#input_text').val())");

  $("#btn_leader")[0].setAttribute('onclick', "team_click($('#input_text').val())");

  $("#btn_member")[0].setAttribute('onclick', "member_click($('#input_text').val())");


}

$(document).ready(onReady);
