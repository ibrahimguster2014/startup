
$(document).ready(function(){


// Initialize Firebase
  var config = {
    apiKey: "AIzaSyCckzlbIBbfQgSxGFiLkmgYmUCBut2K6-g",
    authDomain: "startuptalk-54b60.firebaseapp.com",
    databaseURL: "https://startuptalk-54b60.firebaseio.com",
    storageBucket: "startuptalk-54b60.appspot.com",
    messagingSenderId: "891593272071"
  };
  firebase.initializeApp(config);


///////////////////////Login///////////////////////////////////////////////////////////////////////////////
$("#loginbutton").click(
    function(){

        var email = $("#email_login").val();
        var password = $("#password_login").val();
        var notexists = false;
        
        //alert(email);
        //alert(password);
        
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) 
{
  // Handle Errors here.
        document.getElementById("error_login").innerHTML = error.message;
        
        $("#error_login").fadeIn(1000);   
        
        notexists = true;
  // ...
});

setTimeout(function(){
    if(notexists == false)
        authenticate_user(); // Call Function
},1000);

    notexists = false;
    
               });

///////////////////////Sign Up/////////////////////////////////////////////////////////////////////////////

$("#signupbutton").click(
    function()
{     
        var username = $("#username").val(); // get the value of the Input with "id" username
        var type = $(".type:checked").val(); // get the value of the Radio button with "class" type
        var check_term = $("#brand1:checked").val(); // get the value of the checkbox with "id" = brand1
        //alert(username);
        
        if(username == "" || username.length < 2 || usernameIsValid(username) == false || username.length > 20) // if username is invalid
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

    setTimeout(function(){
        $("#loader").show();
        $("#loader2").show();
        $("#loginbutton").hide();
        $("#signupbutton").hide();
        $("#error_signup").hide();
        $("#error_login").hide();
    },500)

        firebase.auth().onAuthStateChanged(function(user) {
    
        if (user) { // User is signed in.
        
        //sessionStorage.setItem("status",1);
        sessionStorage.setItem("userid",user.uid);
        sessionStorage.setItem("currentuserid",user.uid);
        
        firebase.database().ref('users/' + user.uid).once('value').then(function(snapshot) 
        {
            //alert(snapshot.val().type);
            sessionStorage.setItem("type",snapshot.val().type);   

        //alert("Signed In as User: " + sessionStorage.getItem("type"));// check the type of the User
        
        //alert("Signed In");
        /*
        if( snapshot.val().type == "Entrepreneur")
            setTimeout(function(){window.location.href = "Entrepreneur.html"}, 2000);
        else if( snapshot.val().type == "Investor")
            setTimeout(function(){window.location.href = "others.html"}, 2000);
        else if( snapshot.val().type == "Lecturer")
            setTimeout(function(){window.location.href = "others.html"}, 2000);
        else if( snapshot.val().type == "Instructor")
            setTimeout(function(){window.location.href = "others.html"}, 2000);        
        */
            setTimeout(function(){window.location.href = "others.html"}, 2000);
        });
        
        } 
        
  
        else { // No user is signed in.
      
        //alert("Only entrepreneurs can access create startup");
        $("#loader").hide();
        $("#loader1").hide();
        $("#loginbutton").show();
        $("#signupbutton").show();
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
var today = new Date();  
var dd = today.getDate();  
  
var mm = today.getMonth()+1;   
var yyyy = today.getFullYear();  
if(dd<10)   
{  
    dd='0'+dd;  
}   
  
if(mm<10)   
{  
    mm='0'+mm;  
}   
today = mm+'-'+dd+'-'+yyyy;  

/*if(sessionStorage.getItem("status") == 1)
{
    var userID = firebase.auth().currentUser.uid; 
    
    var type;
    
    firebase.database().ref('users/' + userID).once('value').then(function(snapshot) 
    {
        //alert(snapshot.val().type);
        
       if(snapshot.val().type == "Entrepreneur")
        { */
        
            var userID = firebase.auth().currentUser.uid; 
        
            startup_title = $("#startup_title").val();
            var contact_number = $("#contact_number").val();
            //var startup_logo = $("#startup_logo").val();
            var startup_category = $("#startup_category").val();    
            var startup_description = $("#description").val();
            var startup_status = $("#startup_status").val();
            
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
                    $("#loader").fadeIn(500);
                    $("#create_startup").hide();
                    
                    // Insert Create startup Values in the Database of the user
                    firebase.database().ref('users/' + userID + '/startups/').push().set({
                            title: startup_title,
                            category: startup_category,
                            contactnumber: contact_number,
                            description: startup_description,
                            logo: 'none',
                            status: startup_status,
                            date: today,
                            rating: 'Not rated',
                            num_raters: 0,
                            total_rating: 0,
                            avg_rating: 0
                    });
                    
                    firebase.database().ref('users/' + userID + '/startups/').orderByChild("title").equalTo(startup_title).on('child_added', function(snapshot) {
                        sessionStorage.setItem("StartupID",snapshot.key)
                     });
                    
                    sessionStorage.setItem("userid",userID);  // Get Current user's ID
                
                    setTimeout(Uploadfile(), 500); // call function UploadFile
        
                    //sessionStorage.setItem("number_of_followings",snapshot.val() + 1); 
                    alert("Startup has been created successfully");
                }
        //}
    //else
        //alert("You have to be an Entrepreneur to create startup!");
        
    });

//}// for the first if statement

//else
   // alert("You have to be an Entrepreneur to create startup!");
    


//});


//////////////////////////////////////////////Upload Startup Logo//////////////////////////////////////////////


$("#startup_logo").on("change", function(event)
{
    getfile = event.target.files[0];    
});

function Uploadfile()
{

var file = getfile.name;
var storageRef = firebase.storage().ref('users/' + sessionStorage.getItem("userid") + '/startups/' + sessionStorage.getItem("StartupID") + '/' + file);
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
            firebase.database().ref('users/' + sessionStorage.getItem("userid") + '/startups/' + sessionStorage.getItem("StartupID")).update(
            {logo: downloadURL}
            ); 
  
    //alert(downloadURL);
    sessionStorage.setItem("Type",'/startups/');
    window.location.href = "Mycontents.html";
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



//Global Variables
var event_name;
var getfile = "";
var type;

//////////////////////////////////////////Post Event Or Workshop//////////////////////////////////////////
$("#post_event").click(
    function()
{     
            var userID = firebase.auth().currentUser.uid; 
        
            event_name = $("#event_name").val();
            var contact_number = $("#contact_number").val();
            //var startup_logo = $("#startup_logo").val();
            type = $(".type:checked").val();
            var event_category = $("#startup_category").val();    
            var event_description = $("#description").val();
            var event_date = $("#date").val();
            
            var today = new Date();  
            var dd = today.getDate();  
              
            var mm = today.getMonth()+1;  
            
            var month = event_date.substr(5, 2);
            //today.getMonth()+1; // without 0 
            
            var year = event_date.substr(0, 4);
            
            var yyyy = today.getFullYear();  
            if(dd<10)   
            {  
                dd='0'+dd;  
            }   
              
            if(mm<10)   
            {  
                mm='0'+mm;  
            }   
            today = mm+'/'+dd+'/'+yyyy;  
            
            if(event_name == "")
                {
                document.getElementById("error_create1").innerHTML = "Error: Please enter the name!";
                $("#error_create1").fadeIn(1000);
                $("#error_create1").fadeOut(3000);
                }
                
            else if(contact_number == "") 
                {
                document.getElementById("error_create2").innerHTML = "Error: Please enter the contact number!";
                $("#error_create2").fadeIn(500);
                $("#error_create2").fadeOut(3000);
                }
            /*else if(getfile == "") 
                {
                document.getElementById("error_create3").innerHTML = "Error: Please upload a Startup Logo!";
                $("#error_create3").fadeIn(500); 
                $("#error_create3").fadeOut(3000); 
                }  */
            else if(event_date == "") 
                {
                document.getElementById("error_create6").innerHTML = "Error: Please select a Date!";
                $("#error_create6").fadeIn(500);
                $("#error_create6").fadeOut(3000); 
                } 
                
            else if(event_category == "" || event_category == "Category.") 
                {
                document.getElementById("error_create4").innerHTML = "Error: Please select a Category!";
                $("#error_create4").fadeIn(500); 
                $("#error_create4").fadeOut(3000);
                } 
            else if(event_description == "") 
                {
                document.getElementById("error_create5").innerHTML = "Error: Please enter the Description!";
                $("#error_create5").fadeIn(500);
                $("#error_create5").fadeOut(3000); 
                } 
              
            else
                {
                    $("#loader").fadeIn(500);
                    $("#post_event").hide();
                    
                    // Insert Create event/workshop Values in the Database of the user
                    firebase.database().ref('users/' + userID + '/' + type + 's/').push().set({
                            title: event_name,
                            category: event_category,
                            contactnumber: contact_number,
                            description: event_description,
                            logo: "https://firebasestorage.googleapis.com/v0/b/startuphub-cdc58.appspot.com/o/Startup_Default.png?alt=media&token=944a655c-af9e-4db4-a8be-ac1e259647bc",
                            date: event_date,
                            month: month,
                            year: year,
                            views: 0
                    });
                    
                    firebase.database().ref('users/' + userID + '/' + type + 's/').orderByChild("title").equalTo(event_name).on('child_added', function(snapshot) {
                        sessionStorage.setItem("StartupID",snapshot.key)
                     });
                    
                    sessionStorage.setItem("userid",userID);  // Get Current user's ID
                
                    if(getfile != "")
                        {
                        EventUploadfile(); // call function UploadFile
                        alert( type + " has been created successfully");
                        }
                    else
                        {
                        sessionStorage.setItem("Type", '/' + type +'s/');
                        window.location.href = "Mycontents.html";
                        alert( type + " has been created successfully");
                        }
                }
        
    });



//////////////////////////////////////////////Upload Startup Logo//////////////////////////////////////////////


$("#event_logo").on("change", function(event)
{
    getfile = event.target.files[0];    
});

function EventUploadfile()
{

var file = getfile.name;
var storageRef = firebase.storage().ref('users/' + sessionStorage.getItem("userid") + '/' + type + 's/' + sessionStorage.getItem("StartupID") + '/' + file);
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
            firebase.database().ref('users/' + sessionStorage.getItem("userid") + '/' + type + 's/' + sessionStorage.getItem("StartupID")).update(
            {logo: downloadURL}
            ); 
  
  //alert(downloadURL);
  
    sessionStorage.setItem("Type", '/' + type +'s/');
   window.location.href = "Mycontents.html";
});
}




//.............................................................................................................................



//.............................................................My Startups.....................................................
$(document).on('click', '#mystartups', function () 
    {
        sessionStorage.setItem("Type","/startups/"); //Store the Type Either (Startups,Events,Workshops)
        window.location.href ='Mycontents.html';   
    });

//.............................................................................................................................

//.............................................................My Events.....................................................
$(document).on('click', '#myevents', function () 
    {
        sessionStorage.setItem("Type","/Events/"); //Store the Type Either (Startups,Events,Workshops)
        window.location.href ='Mycontents.html';   
    });

//.............................................................................................................................

//.............................................................My Workshops.....................................................
$(document).on('click', '#myworkshops', function () 
    {
        sessionStorage.setItem("Type","/Workshops/"); //Store the Type Either (Startups,Events,Workshops)
        window.location.href ='Mycontents.html'; 
    });

//.............................................................................................................................


//.............................................................Rated Startups..................................................
$(document).on('click', '#ratedstartups', function () 
    {
        sessionStorage.setItem("Type","/rated-startups/"); //Store the Type Either Rated startups
        window.location.href ='RatedStartups.html'; 
    });

//.............................................................................................................................


//..............................................................Update Startup..................................................

$("#update_startup").click(
    function()
{     
            var userID = firebase.auth().currentUser.uid; 
        
            startup_title = $("#startup_title").val();
            var contact_number = $("#contact_number").val();
            //var startup_logo = $("#startup_logo").val();
            var startup_category = $("#startup_category").val();    
            var startup_description = $("#description").val();
            var startup_status = $("#startup_status").val();
            
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
                    $("#loader").fadeIn(500);
                    $("#update_startup").hide();
                    $("#delete_startup").hide();
                    
                    // Insert Create startup Values in the Database of the user
                    firebase.database().ref('users/' + userID + '/startups/' + sessionStorage.getItem("StartupID")).update({
                            title: startup_title,
                            category: startup_category,
                            contactnumber: contact_number,
                            description: startup_description,
                            status: startup_status
                    });
                    
 
                    
                    sessionStorage.setItem("userid",userID);  // Get Current user's ID
                
                    if(getfile != "")
                        {
                        Uploadfile();// call function UploadFile
                        alert("Startup has been updated successfully");
                        }
                    else
                        {
                        window.location.href = "Mycontents.html";
                        alert("Startup has been updated successfully");
                        }
                    //sessionStorage.setItem("number_of_followings",snapshot.val() + 1); 
                }
        
    });
//.............................................................................................................................



$("#update_event").click(
    function()
{     
            var userID = firebase.auth().currentUser.uid; 
        
            event_name = $("#event_name").val();
            var contact_number = $("#contact_number").val();
            //var startup_logo = $("#startup_logo").val();
            //type = $(".type:checked").val();
            type = sessionStorage.getItem("Type_Event");
            var event_category = $("#startup_category").val();    
            var event_description = $("#description").val();
            var event_date = $("#date").val();
            
            var month = event_date.substr(5, 2);
            
            var year = event_date.substr(0, 4);
            
            if(event_name == "")
                {
                document.getElementById("error_create1").innerHTML = "Error: Please enter the name!";
                $("#error_create1").fadeIn(1000);
                $("#error_create1").fadeOut(3000);
                }
                
            else if(contact_number == "") 
                {
                document.getElementById("error_create2").innerHTML = "Error: Please enter the contact number!";
                $("#error_create2").fadeIn(500);
                $("#error_create2").fadeOut(3000);
                }
            /*else if(getfile == "") 
                {
                document.getElementById("error_create3").innerHTML = "Error: Please upload a Startup Logo!";
                $("#error_create3").fadeIn(500); 
                $("#error_create3").fadeOut(3000); 
                }  */
            else if(event_date == "") 
                {
                document.getElementById("error_create6").innerHTML = "Error: Please select a Date!";
                $("#error_create6").fadeIn(500);
                $("#error_create6").fadeOut(3000); 
                } 
                
            else if(event_category == "" || event_category == "Category.") 
                {
                document.getElementById("error_create4").innerHTML = "Error: Please select a Category!";
                $("#error_create4").fadeIn(500); 
                $("#error_create4").fadeOut(3000);
                } 
            else if(event_description == "") 
                {
                document.getElementById("error_create5").innerHTML = "Error: Please enter the Description!";
                $("#error_create5").fadeIn(500);
                $("#error_create5").fadeOut(3000); 
                } 
              
            else
                {
                    $("#loader").fadeIn(500);
                    $("#update_event").hide();
                    $("#delete_event").hide();
                    
                    // Insert Create event/workshop Values in the Database of the user
                    firebase.database().ref('users/' + userID + '/' + type + 's/' + sessionStorage.getItem("StartupID")).update({
                            title: event_name,
                            category: event_category,
                            contactnumber: contact_number,
                            description: event_description,
                            date: event_date,
                            month: month,
                            year: year
                    });
                    
                    sessionStorage.setItem("userid",userID);  // Get Current user's ID
                
                    if(getfile != "")
                        {
                        EventUploadfile(); // call function UploadFile
                        alert( type + " has been updated successfully");
                        }
                    else
                        {
                        window.location.href = "Mycontents.html";
                        alert( type + " has been updated successfully");
                        }
                    //sessionStorage.setItem("number_of_followings",snapshot.val() + 1); 

                }
        
    });


/*...........................................Contact Us Message Submission.............................................*/

//////////////////////////////////////////Create Startup//////////////////////////////////////////
$("#submit_message").click(
    function()
{     
    //alert(firebase.auth().currentUser.uid);
var today = new Date();  
var dd = today.getDate();  
  
var mm = today.getMonth()+1;   
var yyyy = today.getFullYear();  
if(dd<10)   
{  
    dd='0'+dd;  
}   
  
if(mm<10)   
{  
    mm='0'+mm;  
}   
today = mm+'-'+dd+'-'+yyyy;  

        
            var userID = firebase.auth().currentUser.uid; 
        
            var title = $("#title").val();
            var contact_number = $("#contact_number").val();   
            var message = $("#message").val();
            
            if(title == "")
                {
                document.getElementById("error_create1").innerHTML = "Error: Please enter a title!";
                $("#error_create1").fadeIn(1000);
                $("#error_create1").fadeOut(3000);
                }
            else if(contact_number == "") 
                {
                document.getElementById("error_create2").innerHTML = "Error: Please enter the contact number!";
                $("#error_create2").fadeIn(500);
                $("#error_create2").fadeOut(3000);
                }
            else if(message == "") 
                {
                document.getElementById("error_create5").innerHTML = "Error: Please enter a message!";
                $("#error_create5").fadeIn(500);
                $("#error_create5").fadeOut(3000); 
                } 
            else
                {
                    $("#loader").fadeIn(500);
                    $("#submit_message").hide();
                    
                    // Insert Create startup Values in the Database of the user
                    firebase.database().ref('messages/' + userID + '/messages/').push().set({
                            title: title,
                            contactnumber: contact_number,
                            message: message,
                            date: today
                    });
                    
                    
                    sessionStorage.setItem("userid",userID);  // Get Current user's ID
                    
                    alert("The Message sent Successfuly");
                    
                    setTimeout(function(){window.location.href ='others.html';},1000);

                }

        
    });


















});             