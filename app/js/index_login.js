(function(){
  var config = {
    apiKey: "AIzaSyCYkV0-0g47RwZcLh4VbOOT1FtTqnyAuNA",
    authDomain: "comp3111-project-c4f22.firebaseapp.com",
    databaseURL: "https://comp3111-project-c4f22.firebaseio.com",
    storageBucket: "comp3111-project-c4f22.appspot.com",
    messagingSenderId: "801945913687"
  };
  firebase.initializeApp(config);


  //menu login section
  var menu_email = document.getElementById('menu_email');
  var menu_password = document.getElementById('menu_password');
  var menu_btnlogin = document.getElementById('menu_btnlogin');

  //Sign up section variable
  var txtName = document.getElementById('txtName');
  var txtEmail = document.getElementById('txtEmail');
  var txtPassword = document.getElementById('txtPassword');
  var btnSignup = document.getElementById('btnSignUp');

  menu_btnlogin.addEventListener('click', e=>{
  var email = menu_email.value;
  var password = menu_password.value;
  var auth = firebase.auth();
  auth.signInWithEmailAndPassword(email,password);
});


  //sign up event
  btnSignup.addEventListener('click', e=>{

    var email = txtEmail.value;
    var password = txtPassword.value;
    var name = txtName.value;

    console.log('email');
    console.log('name');
    var auth = firebase.auth();
    auth.createUserWithEmailAndPassword(email,password);

    //TODO: get user uid, then create the profile of the users
    //idk how to get the uid after call the funtion: createUserWithEmailAndPassword()


    // var createAccount = firebase.database().ref('users/' + user.uid);
    //
    // createAccount.set({
    //   Name: name,
    //   Email: email
    // });
    //
    // createAccount.set({
    //   EventName: null
    // });

  });
}()) ;
