
$(document).ready(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAT1IHMeZepHdhUoWrdM7E9iwVPzncK89I",
    authDomain: "startuphub-cdc58.firebaseapp.com",
    databaseURL: "https://startuphub-cdc58.firebaseio.com",
    storageBucket: "startuphub-cdc58.appspot.com",
    messagingSenderId: "979117091574"
  };
  firebase.initializeApp(config);
      //firebase.auth().signOut();
//

///////////////////////Login///////////////////////////////////////////////////////////////////////////////
$("#loginbutton").click(
    function(){

        var email = $("#email_login").val();
        var password = $("#password_login").val();
        
        //alert(email);
        //alert(password);
        
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) 
{
  // Handle Errors here.
        document.getElementById("error_login").innerHTML = error.message;
        
        $("#error_login").fadeIn(1000);     
  // ...
});
        authenticate_user(); // Call Function
        
               });

///////////////////////Sign Up/////////////////////////////////////////////////////////////////////////////

$("#signupbutton").click(
    function()
{     
        var username = $("#username").val(); // get the value of the Input with "id" username
        var type = $(".type:checked").val(); // get the value of the Radio button with "class" type
        var check_term = $("#brand1:checked").val(); // get the value of the checkbox with "id" = brand1
        //alert(username);
        
        if(username == "" || username.length < 2 || usernameIsValid(username) == false) // if username is invalid
        {
            document.getElementById("error_signup").innerHTML = "Invalid Username!";
            $("#error_signup").fadeIn(1000);
        }
        
        else if(type == null) // if the user did not check any role
        {
            //alert("Please choose a role!");
            document.getElementById("error_signup").innerHTML = "Please choose a role!";
            $("#error_signup").fadeIn(1000);            
        }
        
        else if(check_term == null) // if user did not check the checkbox for the Term
        {
            //alert("Please you have to accept the rules");
            document.getElementById("error_signup").innerHTML = "Please you have to accept the rules!";
            $("#error_signup").fadeIn(1000);
        }
        
        else
        { 
        insertUserDetails(); // Call function that will create the Account
        } 
}
        );

/////////////////////////////////////Auhentication////////////////////////////////////////////////////////

/*
//Global Variable
var check_status = 0;
//sessionStorage.setItem("status",0);

alert(sessionStorage.getItem("type"));
alert(sessionStorage.getItem("status"));
*/

function authenticate_user()
{

        firebase.auth().onAuthStateChanged(function(user) {
    
        if (user) { // User is signed in.
        
        sessionStorage.setItem("status",1);
        //sessionStorage.setItem("userid",user.uid);
        alert("Signed In");
        
        firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) 
        {
            //alert(snapshot.val().type);
            sessionStorage.setItem("type",snapshot.val().type);            

        alert("Current User: " + sessionStorage.getItem("type"));
        
        if( snapshot.val().type == "Entrepreneur")
            setTimeout(function(){window.location.href = "index.html"}, 2000);
        else if( snapshot.val().type == "Investor")
            setTimeout(function(){window.location.href = "index.html"}, 2000);
        else if( snapshot.val().type == "Lecturer")
            setTimeout(function(){window.location.href = "index.html"}, 2000);
        else
            setTimeout(function(){window.location.href = "index.html"}, 2000);        
        
        
        });
        
        } 
        
  
        else { // No user is signed in.
      
        //alert("Only entrepreneurs can access create startup");
        //$("#loading").hide();
        }
  
        });

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
function usernameIsValid(username) 
{
        var validcharacters = '1234567890-_.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = 0, l = username.length; i < l; ++i) 
        {
            if (username.indexOf(" ") >= 0 || validcharacters.indexOf(username.substr(i, 1)) == -1) 
            {
            return false;
            }
        return true;
        }
        
}


///////////////////////////////////////Creating Account and Insert Information ///////////////////////////////////////////////////
function insertUserDetails() {

    var username = $("#username").val();
    var email = $("#email_signup").val();
    var password = $("#password_signup").val();
    var type = $(".type:checked").val();

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        //console.log("User is authenticated, attempting to enter the user data now...");

        //alert(user.uid);

        // Insert Values in the Database
        firebase.database().ref('users/' + user.uid).set({
        email: email,
        username: username,
        password: password,
        type: type
        });
        
        authenticate_user();

    }, function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
        //console.log("There was an error: " + errorCode + "." + errorMessage);
        
        document.getElementById("error_signup").innerHTML = error.message;
        //alert("There was an error: " + errorCode + "." + errorMessage);
        $("#error_signup").fadeIn(1000);
        // ...
    });
}

//Global Variables
var startup_title;
var getfile = "";

//////////////////////////////////////////Create Startup//////////////////////////////////////////
$("#create_startup").click(
    function()
{     
    //alert(firebase.auth().currentUser.uid);

if(sessionStorage.getItem("status") == 1)
{
    var userID = firebase.auth().currentUser.uid; 
    
    var type;
    
    firebase.database().ref('users/' + userID).once('value').then(function(snapshot) 
    {
        //alert(snapshot.val().type);
        
       if(snapshot.val().type == "Entrepreneur")
        {    
            startup_title = $("#startup_title").val();
            var contact_number = $("#contact_number").val();
            //var startup_logo = $("#startup_logo").val();
            var startup_category = $("#startup_category").val();    
            var startup_description = $("#description").val();
            
            if(startup_title == "")
                {
                document.getElementById("error_create1").innerHTML = "Error: Please enter the Startup title!";
                $("#error_create1").fadeIn(1000);
                $("#error_create1").fadeOut(3000);
                }
                
            else if(contact_number == "") 
                {
                document.getElementById("error_create2").innerHTML = "Error: Please enter the contact number!";
                $("#error_create2").fadeIn(500);
                $("#error_create2").fadeOut(3000);
                }
            else if(getfile == "") 
                {
                document.getElementById("error_create3").innerHTML = "Error: Please upload a Startup Logo!";
                $("#error_create3").fadeIn(500); 
                $("#error_create3").fadeOut(3000); 
                }  
            else if(startup_category == "" || startup_category == "Category.") 
                {
                document.getElementById("error_create4").innerHTML = "Error: Please select the Startup category!";
                $("#error_create4").fadeIn(500); 
                $("#error_create4").fadeOut(3000);
                } 
            else if(startup_description == "") 
                {
                document.getElementById("error_create5").innerHTML = "Error: Please enter the Startup Description!";
                $("#error_create5").fadeIn(500);
                $("#error_create5").fadeOut(3000); 
                } 
              
            else
                {
                    // Insert Create startup Values in the Database of the user
                    firebase.database().ref('users/' + userID + '/startups/' + startup_title).set({
                            title: startup_title,
                            category: startup_category,
                            contactnumber: contact_number,
                            description: startup_description,
                            startuplogo: 'none'
                    });
                    
                    sessionStorage.setItem("userid",userID);  // Get Current user's ID
                
                    setTimeout(Uploadfile(), 1000); // call function UploadFile
        
                    //sessionStorage.setItem("number_of_followings",snapshot.val() + 1); 
                    alert("Startup has been created successfully");
                }
        }
    else
        alert("You have to be an Entrepreneur to create startup!");
        
    });

}// for the first if statement

else
    alert("You have to be an Entrepreneur to create startup!");
    


});


//////////////////////////////////////////////Upload Startup Logo//////////////////////////////////////////////


$("#startup_logo").on("change", function(event)
{
    getfile = event.target.files[0];    
});

function Uploadfile()
{

var file = getfile.name;
var storageRef = firebase.storage().ref('/images/' + file);
// Create the file metadata
/*var metadata = {
  contentType: file.type
};
*/
var uploadTask = storageRef.put(getfile);

// Listen for state changes, errors, and completion of the upload.
uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
  function(snapshot) {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
  switch (error.code) {
    case 'storage/unauthorized':
      // User doesn't have permission to access the object
      break;

    case 'storage/canceled':
      // User canceled the upload
      break;

    case 'storage/unknown':
      // Unknown error occurred, inspect error.serverResponse
      break;
  }
}, function() {
  // Upload completed successfully, now we can get the download URL
  var downloadURL = uploadTask.snapshot.downloadURL;
    // Update Number of followers
            firebase.database().ref('users/' + sessionStorage.getItem("userid") + '/startups/' + startup_title).update(
            {startuplogo: downloadURL}
            ); 
  
  alert(downloadURL);
});
}


/*
//..........................Only Entrepreneur can access the Create Startup Page.............................................
    $(".absolute").click(
    function()
    {
        firebase.auth().signInAnonymously().catch(function(error) {
        // Handle Errors here.
         var errorCode = error.code;
        var errorMessage = error.message;
  // ...
});
       chech_status(); // check if the user is not signed
  
    });


//..........................Only Entrepreneur can access the Create Startup Page.............................................
    $("#menu_createstartup").click(
    function()
    {
       chech_status(); // check if the user is not signed

    });


/////////////////////////////////////Auhentication////////////////////////////////////////////////////////


function chech_status()
{
 
        if (sessionStorage.getItem("status") == 1) { // User is signed in.

            if(sessionStorage.getItem("type") == "Entrepreneur")
            {
                // Go to create startup page within 2 seconds
                window.location.href = "CreateStartup.html";
            }
            else
            {
                alert("You have to be an 'Entrepreneur' to create startup!");     
            }

        } 
  
        else { // No user is signed in.
      
        alert("You have to be an 'Entrepreneur' to create startup!");

        //$("#loading").hide();
        }
  
        }

});
*/

//............................................SignOut...........................................................
   $("#logout").click(
    function()
    {
        alert("Signed Out");
        sessionStorage.setItem("status",0);
        firebase.auth().signOut(); 
        setTimeout(function(){window.location.href ='index.html';},1000);
    });

//..............................................................................................................


//.............................................Dynamic Categories.........................................................
        firebase.database().ref('categories/').orderByChild("category").on("child_added", function(snapshot)       
        {
           
            //alert("Works");          
            var x = document.getElementById("startup_category");
            var option = document.createElement("option");
            option.text = snapshot.val().category;
            x.add(option);

        }); 




});             