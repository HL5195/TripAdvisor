
      let startingCity = document.getElementById('StartingCity');
      let startingState = document.getElementById('StartingState');
      let destinationCity = document.getElementById('DestinationCity');
      let destinationState = document.getElementById('DestinationState');
      let WaypointCity1 = document.getElementById('WaypointCity1');
      let WaypointState1 = document.getElementById('WaypointState1');
      let WaypointCity2 = document.getElementById('WaypointCity2');
      let WaypointState2 = document.getElementById('WaypointState2');
      let WaypointCity3 = document.getElementById('WaypointCity3');
      let WaypointState3 = document.getElementById('WaypointState3');
      let submit = document.getElementById("submit");
      let WaypointCheckbox = document.getElementById("WaypointCheckbox");
      let WaypointLocation1 = document.getElementById("WaypointLocation1");
      let WaypointLocation2 = document.getElementById("WaypointLocation2");
      let WaypointLocation3 = document.getElementById("WaypointLocation3");


      let startingLocationText = document.getElementById("startingLocationText");
      let destinationLocationText = document.getElementById("destinationLocationText");
      let WaypointLocationText = document.getElementById("WaypointLocationText");
      let distanceInfo = document.getElementById("distanceInfo");
      let mapIframe = document.getElementById("mapIframe");
      let eventList = document.getElementById("eventList");


      let savedTrips = document.getElementById('savedTrips');
      let savedEventsList = document.getElementById('savedEventsList');


      // Show or hide Waypoint location input based on the checkbox
      WaypointCheckbox.addEventListener('change', function () {
          WaypointLocation1.style.display = this.checked ? "block" : "none";
          WaypointLocation2.style.display = this.checked ? "block" : "none";
          WaypointLocation3.style.display = this.checked ? "block" : "none";
      });


      // Display Data
      function AddData() {
          let destinationStateValue = destinationState.value.trim();
          let destinationCityValue = destinationCity.value.trim();
          let WaypointStateValue1 = WaypointState1.value.trim();
          let WaypointCityValue1 = WaypointCity1.value.trim();
          let WaypointStateValue2 = WaypointState2.value.trim();
          let WaypointCityValue2 = WaypointCity2.value.trim();
          let WaypointStateValue3 = WaypointState3.value.trim();
          let WaypointCityValue3 = WaypointCity3.value.trim();
          let startingStateValue = startingState.value.trim();
          let startingCityValue = startingCity.value.trim();


          if (startingStateValue === "" || startingCityValue === "" || destinationStateValue === "" || destinationCityValue === "") {
              alert("Please fill in all required fields.");
              return;
          }


          const startLocation = `${startingCityValue}, ${startingStateValue}`;
          const destinationLocation = `${destinationCityValue}, ${destinationStateValue}`;


          const waypoints = [];
          if (WaypointCityValue1 && WaypointStateValue1) {
              waypoints.push(`${WaypointCityValue1}, ${WaypointStateValue1}`);
          }
          if (WaypointCityValue2 && WaypointStateValue2) {
              waypoints.push(`${WaypointCityValue2}, ${WaypointStateValue2}`);
          }
          if (WaypointCityValue3 && WaypointStateValue3) {
              waypoints.push(`${WaypointCityValue3}, ${WaypointStateValue3}`);
          }


          startingLocationText.innerHTML = "Starter Location: " + startLocation;
          destinationLocationText.innerHTML = "Destination Location: " + destinationLocation;


          if (waypoints.length > 0) {
              WaypointLocationText.innerHTML = "Waypoint Locations: " + waypoints.join(' | ');
          } else {
              WaypointLocationText.innerHTML = "";
          }


          // Update map
          updateMap(startLocation, destinationLocation, waypoints);
      }
      submit.addEventListener('click', AddData);


      // Update the Google Map iframe with the route
      function updateMap(start, end, waypoints = []) {
          const googleMapsAPIKey;// Replace with your Google Maps API key
          let mapUrl = `https://www.google.com/maps/embed/v1/directions?key=${googleMapsAPIKey}&origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}&mode=driving`;


          if (waypoints.length > 0) {
              mapUrl += `&waypoints=${encodeURIComponent(waypoints.join('|'))}`;
          }


          mapIframe.src = mapUrl;
      }


      // Handle chat options
      async function handleChatOption(option) {
          const API_KEY; //OPENAI_API_KEY
          const responseDiv = document.getElementById('response');


          // Replace placeholders with actual values from input fields
          const replaceStartingCity = startingCity.value;
          const replaceStartingState = startingState.value;
          const replaceDestinationCity = destinationCity.value;
          const replaceDestinationState = destinationState.value;
          const replaceMidpointCity1 = WaypointCity1.value;
          const replaceMidpointState1 = WaypointState1.value;
          const replaceMidpointCity2 = WaypointCity2.value;
          const replaceMidpointState2 = WaypointState2.value;
          const replaceMidpointCity3 = WaypointCity3.value;
          const replaceMidpointState3 = WaypointState3.value;


          let userInput = '';
          switch (option) {
              case 'events':
                  userInput = "Give me a list of 5 events with a small description of them in " + replaceDestinationCity + ", " + replaceDestinationState + "?";
                  break;
              case 'cost_week':
                  userInput = "What does a week of fun cost in " + replaceDestinationCity + ", " + replaceDestinationState + "?";
                  break;
              case 'drive_cost':
                  userInput = "Give me an estimate on gas cost and flight costs " + replaceStartingCity + ", " + replaceStartingState + " to " + replaceDestinationCity + ", " + replaceDestinationState + "?";
                  break;
              default:
                  responseDiv.innerHTML = "Invalid option selected.";
                  return;
          }


          responseDiv.innerHTML = 'Processing...';


          try {
              const response = await fetch('https://api.openai.com/v1/chat/completions', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${API_KEY}`,
                  },
                  body: JSON.stringify({
                      model: 'gpt-4o-mini',
                      messages: [{
                          role: "system",
                          content: "You will answer any questions about these locations and also provide recent events to do for travel in the specified locations when asked: " + replaceStartingState + ", " + replaceStartingCity + " and " + replaceDestinationState + ", " + replaceDestinationCity + ", with midpoints at " + replaceMidpointState1 + ", " + replaceMidpointCity1 + "; " + replaceMidpointState2 + ", " + replaceMidpointCity2 + "; " + replaceMidpointState3 + ", " + replaceMidpointCity3 + ". Only consider the midpoints if they are not empty. If the user asks questions unrelated to these locations, inform them that you are only here to help them with questions about the submitted locations. Keep the answer easy to read and concise."
                      }, {
                          role: 'user',
                          content: userInput
                      }],
                  }),
              });


              const data = await response.json();
              responseDiv.innerHTML = data.choices[0].message.content;


           if (option === 'events') {
   const events = data.choices[0].message.content.split('\n');
   eventList.innerHTML = '<h2>Events in the Destination City:</h2>';
   events.forEach((event, index) => {
       if (event.trim() !== '' && /^\d/.test(event.trim())) {
           let eventItem = document.createElement('div');
           eventItem.className = 'eventItem';
           eventItem.textContent = event;
           eventItem.addEventListener('click', () => {
               addEventToTrip(event);
           });
           eventList.appendChild(eventItem);
       }
   });
}
          } catch (error) {
              responseDiv.innerHTML = 'Error: ' + error.message;
          }
      }


      // Add event to the saved events list
      function addEventToTrip(event) {
          const selectedEvent = event;
          let eventItem = document.createElement('div');
          eventItem.className = 'eventItem';
          eventItem.textContent = `Event in ${destinationCity.value}: ${selectedEvent}`;
          savedEventsList.appendChild(eventItem);
      }


      // Save trip to the "Saved Trips" list
      document.getElementById('saveTripButton').addEventListener('click', () => {
          const tripDetails = {
              starting: `${startingCity.value}, ${startingState.value}`,
              destination: `${destinationCity.value}, ${destinationState.value}`,
              waypoints: []
          };


          if (WaypointCheckbox.checked) {
              if (WaypointCity1.value && WaypointState1.value) {
                  tripDetails.waypoints.push(`${WaypointCity1.value}, ${WaypointState1.value}`);
              }
              if (WaypointCity2.value && WaypointState2.value) {
                  tripDetails.waypoints.push(`${WaypointCity2.value}, ${WaypointState2.value}`);
              }
              if (WaypointCity3.value && WaypointState3.value) {
                  tripDetails.waypoints.push(`${WaypointCity3.value}, ${WaypointState3.value}`);
              }
          }


          let tripItem = document.createElement('li');
          tripItem.textContent = `Start: ${tripDetails.starting}, Destination: ${tripDetails.destination}` +
              (tripDetails.waypoints.length > 0 ? `, Waypoints: ${tripDetails.waypoints.join(' | ')}` : '');
          tripItem.addEventListener('click', () => {
              // Reload trip details when clicking on a saved trip
              startingCity.value = tripDetails.starting.split(', ')[0];
              startingState.value = tripDetails.starting.split(', ')[1];
              destinationCity.value = tripDetails.destination.split(', ')[0];
              destinationState.value = tripDetails.destination.split(', ')[1];
              if (tripDetails.waypoints.length > 0) {
                  WaypointCheckbox.checked = true;
                  WaypointLocation1.style.display = "block";
                  WaypointLocation2.style.display = "block";
                  WaypointLocation3.style.display = "block";
                  if (tripDetails.waypoints[0]) {
                      WaypointCity1.value = tripDetails.waypoints[0].split(', ')[0];
                      WaypointState1.value = tripDetails.waypoints[0].split(', ')[1];
                  }
                  if (tripDetails.waypoints[1]) {
                      WaypointCity2.value = tripDetails.waypoints[1].split(', ')[0];
                      WaypointState2.value = tripDetails.waypoints[1].split(', ')[1];
                  }
                  if (tripDetails.waypoints[2]) {
                      WaypointCity3.value = tripDetails.waypoints[2].split(', ')[0];
                      WaypointState3.value = tripDetails.waypoints[2].split(', ')[1];
                  }
              } else {
                  WaypointCheckbox.checked = false;
                  WaypointLocation1.style.display = "none";
                  WaypointLocation2.style.display = "none";
                  WaypointLocation3.style.display = "none";
              }
          });


          savedTrips.appendChild(tripItem);


          // Clear the form fields after saving the trip
          startingCity.value = "";
          startingState.value = "";
          destinationCity.value = "";
          destinationState.value = "";
          WaypointCity1.value = "";
          WaypointState1.value = "";
          WaypointCity2.value = "";
          WaypointState2.value = "";
          WaypointCity3.value = "";
          WaypointState3.value = "";
          WaypointCheckbox.checked = false;
          WaypointLocation1.style.display = "none";
          WaypointLocation2.style.display = "none";
          WaypointLocation3.style.display = "none";


          // Clear ChatGPT response when saving the trip
          document.getElementById('response').innerHTML = '';
          document.getElementById('eventList').innerHTML = '';
      });
