(function(){

  var config = {
    apiKey: "AIzaSyCYkV0-0g47RwZcLh4VbOOT1FtTqnyAuNA",
    authDomain: "comp3111-project-c4f22.firebaseapp.com",
    databaseURL: "https://comp3111-project-c4f22.firebaseio.com",
    storageBucket: "comp3111-project-c4f22.appspot.com",
    messagingSenderId: "801945913687"
  };
  firebase.initializeApp(config);
  //Login
  const login_email = document.getElementById('login_email');
  const login_password = document.getElementById('login_password');
  const btnLogin = document.getElementById('btnLogin');

  //Sign Up
  const user_name = document.getElementById('user_name');
  const signUp_email = document.getElementById('signUp_email');
  const signUp_password = document.getElementById('signUp_password');
  const btnSignUp = document.getElementById('btnSignUp');

  //Login event
  btnLogin.addEventListener('click', e=>{
    const user_name =  login_username.value;
    const password = login_password.value;
    const auth = firebase.auth();

    //sign in 
    auth.signInWithEmailAndPassword(email,password);
  });

  //Sign up event
  btnSignUp.addEventListener('click', e=>{
    const name = user_name.value;
    const email = signUp_email.value;
    const password = signUp_password.value;
    const auth = firebase.auth();    

    //create a new authentication
    auth.createUserWithEmailAndPassword(email,password);
    // sign in the new account
    auth.signInWithEmailAndPassword(email,password);


    // create a JSON to store the uid and user name
    var userId = firebase.auth().currentUser.uid;
    var setup = firebase.database().ref('user/' + userId);
    setup.set({
      User_id: userId,
      Name: name
    });
  });

  
  
}());