function makeCarTable(allPreferences, cars, day, driver, showDays, haveDeleteButtons, userToHighlight) {
  // Create a new table
  var carTable = document.createElement('table');
  var carTableBody = document.createElement('tbody');
  carTable.className = 'table fullcartable table-bordered';

  // If we want to show the day, do it
  if (showDays) {
    var dayRow = document.createElement('tr');
    var dayCell = document.createElement('td');
    dayCell.appendChild(document.createTextNode(day));
    dayCell.setAttribute('colspan', 2);
    dayRow.appendChild(dayCell);
    dayRow.className = 'day';
    carTableBody.appendChild(dayRow);
  }


  // Put the driver's name in
  var driverRow = document.createElement('tr');
  var driverCell = document.createElement('td');
  // The name itself goes in a <span>, and the text " (driver)" goes after it.
  // This is so we can find the driver's name easily
  var driverNameSpan = document.createElement('span');
  driverNameSpan.appendChild(document.createTextNode(allPreferences[driver].name));
  driverNameSpan.className = 'drivername';
  if (userToHighlight == driver) {
    var strong = document.createElement('strong');
    strong.appendChild(driverNameSpan);
    driverCell.appendChild(strong);
  } else {
    driverCell.appendChild(driverNameSpan);
  }
  driverCell.appendChild(document.createTextNode(' (driver)'));
  driverCell.setAttribute('colspan', 2);

  if (haveDeleteButtons) {
    // Make a delete button for the car
    var deleteWholeCarBtn = document.createElement('button');
    deleteWholeCarBtn.className = 'close';
    var deleteWholeCarBtnIcon = document.createElement('span');
    deleteWholeCarBtnIcon.className = "glyphicon glyphicon-remove";
    deleteWholeCarBtnIcon.setAttribute('aria-hidden',"true");
    deleteWholeCarBtn.appendChild(deleteWholeCarBtnIcon);
    // This is weird... basically, we want to make a copy of these parameters
    // so that the closure has its own copy. Making a function lets us do that.
    function setDeleteWholeCarBtnOnClick(day, driver) {
      deleteWholeCarBtn.onclick = function() {deleteWholeCar(day, driver);};
    }
    setDeleteWholeCarBtnOnClick(day, driver);
    deleteWholeCarBtn.setAttribute('type', 'button');
    driverCell.appendChild(deleteWholeCarBtn);
  }

  driverRow.appendChild(driverCell);
  driverRow.className = 'driver';
  carTableBody.appendChild(driverRow);

  // Put the time in
  var timeRow = document.createElement('tr');
  timeRow.className = 'timerow';
  for (var halfdayIdx=0; halfdayIdx<2; ++halfdayIdx) {
    var halfday = ['AM', 'PM'][halfdayIdx];
    var timeCell = document.createElement('td');
    if (cars[day][driver][halfday]) {
      var timeString = parseTime(day+halfday+cars[day][driver][halfday].time);
      timeCell.appendChild(document.createTextNode(timeString));

      if (haveDeleteButtons) {
        // Make a delete button for the halfday
        var deleteCarBtn = document.createElement('button');
        deleteCarBtn.className = 'close';
        var deleteCarBtnIcon = document.createElement('span');
        deleteCarBtnIcon.className = "glyphicon glyphicon-remove";
        deleteCarBtnIcon.setAttribute('aria-hidden',"true");
        deleteCarBtn.appendChild(deleteCarBtnIcon);
        // This is weird... basically, we want to make a copy of these parameters
        // so that the closure has its own copy. Making a function lets us do that.
        function setDeleteCarBtnOnClick(day, driver, halfday) {
          deleteCarBtn.onclick = function() {deleteCar(day, driver, halfday);};
        }
        setDeleteCarBtnOnClick(day, driver, halfday);
        deleteCarBtn.setAttribute('type', 'button');

        timeCell.appendChild(deleteCarBtn);
      }
    }
    timeRow.appendChild(timeCell);
  }
  carTableBody.appendChild(timeRow);

  // Put passengers in
  for (var passengerIdx=0;
           (cars[day][driver].AM && passengerIdx < cars[day][driver].AM.passengers.length)
        || (cars[day][driver].PM && passengerIdx < cars[day][driver].PM.passengers.length);
        ++passengerIdx) {
    // Keep putting a pair of passengers in the table until there's no more
    // in both AM and PM
    var row = document.createElement('tr');
    row.className = 'passengerrow';
    for (var halfdayIdx=0; halfdayIdx<2; ++halfdayIdx) {
      var halfday = ['AM', 'PM'][halfdayIdx];
      var cell = document.createElement('td');
      if (cars[day][driver][halfday] && cars[day][driver][halfday].passengers.length > passengerIdx) {
        var passenger = cars[day][driver][halfday].passengers[passengerIdx];
        if (userToHighlight == passenger) {
          var strong = document.createElement('strong');
          strong.appendChild(document.createTextNode(allPreferences[passenger].name));
          cell.appendChild(strong);
        } else {
          cell.appendChild(document.createTextNode(allPreferences[passenger].name));
        }


      }
      row.appendChild(cell);
    }
    carTableBody.appendChild(row);
  }

  carTable.appendChild(carTableBody);

  return carTable;
}

//This is a helper function which parses a time into a viuallly apealling
//and uniform way
function parseTime(time){
  //Get rid of the first part which has the day.

  var timeString = time.split('y')[1]

  //save the AM vs PM
  var endOfTime = timeString.substring(0,2)

  //make the time with a colon in it. We need seperate cases for when
  //we have 4 digits vs 3 digits of time.
  if (timeString.length == 5){
    var startOfTime = timeString.substring(2,3).concat(':')
    startOfTime = startOfTime.concat(timeString.substring(3))

    //add a space for astetic
    startOfTime = startOfTime.concat(' ')
  }else{
    var startOfTime = timeString.substring(2,4).concat(':')
    startOfTime = startOfTime.concat(timeString.substring(4))

    //add a space for astetic
    startOfTime = startOfTime.concat(' ')
  }

  return startOfTime.concat(endOfTime)
}
