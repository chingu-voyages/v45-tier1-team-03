export default function updateChart(filteredResults) {
  
    const average = document.getElementById("averageStrikes");
    const total = document.getElementById("totalStrikes");

    // Extract the years and composition data
    const years = filteredResults.map(item => item.year ? item.year.substring(0, 4) : "Unknown");
  
    // Count the occurrences of each year and composition
    const yearCounts = {};
    years.forEach(year => yearCounts[year] = (yearCounts[year] || 0) + 1);
  
    // Update the year histogram data
    yearHistogram.data.labels = Object.keys(yearCounts);
    yearHistogram.data.datasets[0].data = Object.values(yearCounts);

    yearHistogram.update();
    
    // Calculate and log the average strikes
  const averageStrikes = calculateAverageStrikes(yearCounts);
  console.log("Average Strikes per Year:", averageStrikes);
  average.innerHTML = `Average strikes: ${averageStrikes}`;
  // Calculate and log the total strikes
  const totalStrikes = calculateTotalStrikes(yearCounts);
  console.log("Total Strikes:", totalStrikes);
  total.innerHTML = `Total strikes: ${totalStrikes}`; 
  }
  
  // Initialize the year histogram
  const yearHistogram = new Chart(document.getElementById("yearHistogram"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Number of Strikes by Year",
          data: [],
          backgroundColor: "rgb(225, 85, 33, 0.2)",
          borderColor: "rgb(225, 85, 33, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Calculate the average number of strikes
function calculateAverageStrikes(yearCounts) {
  const totalYears = Object.keys(yearCounts).length;
  const totalStrikes = Object.values(yearCounts).reduce((total, count) => total + count, 0);

  if (totalYears === 0) {
    return 0; 
  }

  const averageStrikes = Math.round(totalStrikes / totalYears);
  return averageStrikes;
}

// Calculate the total number of strikes
function calculateTotalStrikes(yearCounts) {
  const totalStrikes = Object.values(yearCounts).reduce((total, count) => total + count, 0);
  return totalStrikes;
}