const express = require("express");
const Web3 = require("web3");
const cors = require("cors"); 
const contractAbi = require("./artifacts/contracts/TrustCalculation.sol/TrustCalculation.json");

const app = express();
const port = 3000;
const path = require("path");

const web3 = new Web3("http://127.0.0.1:8545"); // Replace with your Ethereum node URL
const privateKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with your private key

const abi = contractAbi.abi;
const contractAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"; // Replace with your contract address
const trustContract = new web3.eth.Contract(abi, contractAddress);

//app.use(express.json());
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
// Route for calculating trust score
app.post("/api/calculateTrustScore", async (req, res) => {
    const { deviceId, latency, responseTime, packetDeliveryRatio, satisfaction } = req.body;
  
    try {
      // Call the updateParameters function to interact with the contract
      const result = await updateParameters(deviceId, latency, responseTime, packetDeliveryRatio, satisfaction);
  
      // Send the result (trust score) back to the client
      res.json({ score: result });
    } catch (error) {
      console.error("Error calculating trust score:", error.message);
      res.status(500).json({ error: "Error calculating trust score" });
    }
  });
  
  // Function to update parameters for a device and calculate trust score
  async function updateParameters(deviceId, latency, responseTime, packetDeliveryRatio, satisfaction) {
    try {
      // Call the contract's calculateTrustScore function
      const result = await trustContract.methods.calculateTrustScore(deviceId, latency, responseTime, packetDeliveryRatio, satisfaction)
        .send({ from: privateKey, gas: 2000000 }); // Adjust gas limit accordingly
  
      console.log(`Trust calculation transaction for Device ${deviceId}:`, result);
  
      // Get the updated trust score and return it
      const trustScore = await trustContract.methods.getTrustScore(deviceId).call();
      return trustScore;
    } catch (error) {
      console.error("Error updating parameters and calculating trust score:", error.message);
      throw error;
    }
  }

// Ignore request for favicon.ico
app.get("/favicon.ico", (req, res) => {
  res.status(204).end();
});


app.listen(port, () => {
    app.get("/", (req, res) => {
        res.send("Welcome to the Trust Calculation Server");
      });
  console.log(`Server is running on http://localhost:${port}`);
});
