// Fetch data from the URL
fetch("https://data.nasa.gov/resource/gh4g-9sfh.json")
  .then((response) => {
    // If status was not 200, throw the error
    if (!response.ok) {
      throw new Error("Network response error");
    }
    return response.json(); // Parse response as JSON
  })
  .then((data) => {
    console.log(data);
    // Process the data and for each meteor get the information
    data.forEach((meteor) => {
      // Extract and use meteor information
      const name = meteor.name;
      const year = meteor.year;
      const mass = meteor.mass;
      const reclat = meteor.reclat;
      const reclong = meteor.reclong;
      const fall = meteor.fall;
      const nametype = meteor.nametype;
      const recclass = meteor.recclass;

      // Display the information and use data in the code like this
      console.log(
        `Meteor Name: ${name}, Year: ${year}, Mass: ${mass}, Latitude: ${reclat}, Longitude: ${reclong}, Fall: ${fall}, Nametype: ${nametype}, Recclass: ${recclass}`
      );
    });
  })
  // If error occurred, display in console
  .catch((error) => {
    console.error("Error fetching data:", error);
  });
