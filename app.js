$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyA1lQqBsBsOTKkcJRCdUo6D2BpFYv_huK8",
        authDomain: "train-schedule-3b38e.firebaseapp.com",
        databaseURL: "https://train-schedule-3b38e.firebaseio.com",
        projectId: "train-schedule-3b38e",
        storageBucket: "train-schedule-3b38e.appspot.com",
        messagingSenderId: "295689574195"
      };
    firebase.initializeApp(config);


    /** grab user input data to add additional train **/
    var database = firebase.database();
    $("#newTrain").on("click", function (event) {
      event.preventDefault();

      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var freq = $("#interval").val().trim();
  
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq
      });
    });
  
    database.ref().on("child_added", function (childSnapshot) {
  
      var newTrain = childSnapshot.val().trainName;
      var newLocation = childSnapshot.val().destination;
      var newFirstTrain = childSnapshot.val().firstTrain;
      var newFreq = childSnapshot.val().frequency;
  
        /** variables to calculate time **/
      var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
      var currentTime = moment();
      var diffTime = moment().diff(moment(startTimeConverted), "minutes");
      var tRemainder = diffTime % newFreq;
      var tMinutesTillTrain = newFreq - tRemainder;
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var catchTrain = moment(nextTrain).format("HH:mm");
  
      /** display new train information **/
      $("#display").append(
        ' <tr><td>' + newTrain +
        ' </td><td>' + newLocation +
        ' </td><td>' + newFreq +
        ' </td><td>' + catchTrain +
        ' </td><td>' + tMinutesTillTrain + ' </td></tr>');
  
      
      $("#trainName, #destination, #firstTrain, #interval").val("");
      return false;
    },
      
      function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
  
  }); 
  