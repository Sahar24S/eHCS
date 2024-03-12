const calculateBtn = document.getElementById("calculateBtn");

// Define static values for each device ID
const staticValues = {
  1: { latency: 50, responseTime: 120, packetDeliveryRatio: 1, satisfaction: 1 },
  2: { latency: 60, responseTime: 150, packetDeliveryRatio: 0, satisfaction: 1 },
  3: { latency: 45, responseTime: 130, packetDeliveryRatio: 1, satisfaction: 1 },
  4: { latency: 55, responseTime: 140, packetDeliveryRatio: 1, satisfaction: 0 },
  5: { latency: 48, responseTime: 145, packetDeliveryRatio: 1, satisfaction: 1 },
  6: { latency: 52, responseTime: 155, packetDeliveryRatio: 0, satisfaction: 1 },
  7: { latency: 52, responseTime: 128, packetDeliveryRatio: 1, satisfaction: 0 },
  8: { latency: 58, responseTime: 149, packetDeliveryRatio: 0, satisfaction: 1 },
  9: { latency: 47, responseTime: 133, packetDeliveryRatio: 1, satisfaction: 1 },
  10: { latency: 53, responseTime: 126, packetDeliveryRatio: 1, satisfaction: 1 }
};
deviceId.addEventListener("input", () => {
    errorMessage.style.display = "none";
  });
calculateBtn.addEventListener("click", async () => {
  const deviceId = document.getElementById("deviceId").value;
  
  // Check if device ID exists in static values
  if (!(deviceId in staticValues)) {
    document.getElementById("errorMessage").style.display = "block";
    // Clear previous output
    document.getElementById("output").textContent = "";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/calculateTrustScore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        deviceId,
        ...staticValues[deviceId] // Include static parameter values for the device ID
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    const trustScore = data.trustScore !== undefined ? `${data.trustScore}` : `${getRandomTrustScore()}`;
    document.getElementById("output").textContent = `Trust Score for Device ${deviceId}: ${trustScore}`;
  } catch (error) {
    console.error("Error calculating trust score:", error.message);
    document.getElementById("output").textContent = "Error calculating trust score";
  }
});

function getRandomTrustScore() {
    return Math.random().toFixed(1);  
  }