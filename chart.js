export default function updateChart(filteredResults) {
  
    const average = document.getElementById("averageStrikes");
    const total = document.getElementById("totalStrikes");

    // Extract the years and composition data
    const years = filteredResults.map(item => item.year ? item.year.substring(0, 4) : "Unknown");
    const compositions = filteredResults.map(item => item.recclass || "Unknown");
  
    // Count the occurrences of each year and composition
    const yearCounts = {};
    const compositionCounts = {};
    years.forEach(year => yearCounts[year] = (yearCounts[year] || 0) + 1);
    compositions.forEach(composition => compositionCounts[composition] = (compositionCounts[composition] || 0) + 1);
  
    // Update the year histogram data
    yearHistogram.data.labels = Object.keys(yearCounts);
    yearHistogram.data.datasets[0].data = Object.values(yearCounts);
  
    // Update the composition histogram data
    compositionHistogram.data.labels = Object.keys(compositionCounts);
    compositionHistogram.data.datasets[0].data = Object.values(compositionCounts);
  
    // Update the charts
    yearHistogram.update();
    compositionHistogram.update();
    
    // Calculate and log the average strikes
  const averageStrikes = calculateAverageStrikes(yearCounts);
  console.log("Average Strikes per Year:", averageStrikes);
  average.innerHTML = `Average strikes per year: ${averageStrikes}`;
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
  
  // Initialize the composition histogram
  const compositionHistogram = new Chart(document.getElementById("compositionHistogram"), {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Number of Strikes by Composition",
          data: [],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          color: "rgb(255, 255, 255)",
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