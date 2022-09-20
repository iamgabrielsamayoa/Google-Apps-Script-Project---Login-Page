function doGet(e) {
   var pictures = getPictures();  
  
  var x = HtmlService.createTemplateFromFile("Index");
  x.pictures = pictures;
  var y = x.evaluate();
  var z = y.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
 
 

  return z;
}

function checkLogin(username, password) {
  var url = 'https://docs.google.com/spreadsheets/d/1suretFCjEgPGDdsLIlXxFiHNd_0s_phaMxIBZnqVaEs/edit#gid=0';
  var ss= SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("DATA");
  var getLastRow =  webAppSheet.getLastRow();
  var found_record = '';
  for(var i = 1; i <= getLastRow; i++)
  {
   if(webAppSheet.getRange(i, 1).getValue().toUpperCase() == username.toUpperCase() && 
     webAppSheet.getRange(i, 2).getValue().toUpperCase() == password.toUpperCase())
   {
     found_record = 'TRUE';
   }    
  }
  if(found_record == '')
  {
    found_record = 'FALSE'; 
  }
  
  return found_record;
  
}

function AddRecord(username, password, email, last_name) {
  var url = 'https://docs.google.com/spreadsheets/d/1suretFCjEgPGDdsLIlXxFiHNd_0s_phaMxIBZnqVaEs/edit#gid=0';
  var ss= SpreadsheetApp.openByUrl(url);
  var webAppSheet = ss.getSheetByName("DATA");
  webAppSheet.appendRow([usernamee,passwordd,email,last_name]);
}

//Add users through the UMG API REST located on EC2 Server
function AddUser(name, last_name, password, email){
  var usrname = addUser(name,last_name);
  var text = "we're glad to confirm your account registration! \nWelcome you can login now!\n\nYour Username is: "+usrname+" \n\n"+
  "Your Password is: "+ password;
      var message = "Dear " + name + "\n\n" + text;
      var subject = "Registration Form Umg - user: "+ name;


  const url = 'http://18.220.94.192:5000/api/';

  const formData = {
      "password": password,
      "name": name,
      "last_name": last_name,
      "email": email
  };

  /*const headers = { 
      "Client-Id": "28100",
      "Api-Key": "65db5b96-cbb6-4b68-8f33-c8c000000000"
    };*/

  Logger.log(JSON.stringify(formData));

  const options = { 
    'method' : 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(formData)
  };

  const response = UrlFetchApp.fetch(url, options);
  //Logger.log(response);
  var data = JSON.parse(response);
  Logger.log("API response"+data);
    
      MailApp.sendEmail(email, subject, message);

};


function checkUser(username, password){
  
  const url = 'http://18.220.94.192:5000/api/'+username;
  var found_record = '';
  let usernameR = '';
  let passwordR = '';
  let email = '';

  const options = { 
    'method' : 'get',
    'contentType': 'application/json',
   // 'headers': headers,
    //'payload': JSON.stringify(formData)
  };

  const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
  if (response.getResponseCode() == 404) {
    Logger.log("Web page not found");
    var data = JSON.parse(response);
    found_record = 'FALSE';
  } else {

  Logger.log(response);
  var data = JSON.parse(response);
  Logger.log("API response"+data);
  usernameR = data.data.username;
   passwordR = data.data.password;
   email = data.data.email;

  }

   

  const apiData = [usernameR, passwordR]


  Logger.log("Lo que enviamos a la API: " + url);
  Logger.log("lo que viene en username: " + username);
  Logger.log("lo que viene en usernameR: " + usernameR);
  Logger.log("lo que viene en pass: " + password);
  Logger.log("lo que viene en passR: " + passwordR);
  Logger.log("lo que viene en email: " + email);


  
  
   if(usernameR == username && password == passwordR )
   {
     found_record = 'TRUE';
   }    
   if (email == username && password == passwordR)
{
     found_record = 'TRUE';
   }
  if(found_record == '')
  {
    found_record = 'FALSE'; 
  
  }
  return found_record;
}

//Creates username based on name and last name
function  addUser(name, last_name){
   
    //Gets first name intial
    let initial = name.charAt(0);
    //concats with the last name
    let result1 = initial.concat(last_name);

    return result1.toLowerCase();
}


function recoverUserPass(name, last_name, email){
  var username = addUser(name,last_name);
  const url = 'http://18.220.94.192:5000/api/'+username;
  //We get the username by using name and last name to avoid asking it to the user
  
  var password = '';
  var found_record = '';
  let usernameR = '';
  let passwordR = '';
  let emailR = '';

  const options = { 
    'method' : 'get',
    'contentType': 'application/json',
   // 'headers': headers,
    //'payload': JSON.stringify(formData)
  };

  const response = UrlFetchApp.fetch(url, {muteHttpExceptions: true});
  if (response.getResponseCode() == 404) {
    Logger.log("Web page not found");
    var data = JSON.parse(response);
    found_record = 'FALSE';
  } else {

  Logger.log(response);
  var data = JSON.parse(response);
  Logger.log("API response"+data);
  usernameR = data.data.username;
   passwordR = data.data.password;
   emailR = data.data.email;

  }

   

  const apiData = [usernameR, passwordR]


  Logger.log("Lo que enviamos a la API: " + url);
  Logger.log("lo que viene en username: " + username);
  Logger.log("lo que viene en usernameR: " + usernameR);
  Logger.log("lo que viene en pass: " + password);
  Logger.log("lo que viene en passR: " + passwordR);
  Logger.log("lo que viene en email: " + email);


  
  
   if(usernameR == username && email == emailR )
   {
     found_record = 'TRUE';
     var text = "Recovering your Password is not an issue! \nFind your acccount details so you can regain access\n\nYour Username is: "+username+" \n\n"+
  "Your Password is: "+ passwordR;
      var message = "Dear " + name + "\n\n" + text;
      var subject = "Password Recovery Form Umg - user: "+ name;
      MailApp.sendEmail(email, subject, message);
   }    
   
  if(found_record == '')
  {
    found_record = 'FALSE'; 
  
  }
  return found_record;
}





function getPictures()
{
    var destination_id = '1CYUv7Ibk8cbfEdWsoTHe1ae2iYEujnJm';  // ID OF GOOGLE DRIVE DIRECTORY;
    var destination = DriveApp.getFolderById(destination_id);
    
    var files = destination.getFiles();
    var file_array = [];
    
    while (files.hasNext()) 
    {
      var file = files.next();
      file_array.push(file.getId());
    }

    return file_array;
}