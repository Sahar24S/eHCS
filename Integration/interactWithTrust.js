const Web3 = require("web3");
const fs = require("fs");
const path = require("path");
const contractAbi = require("./contract/TrustCalculation.json");

const web3 = new Web3("http://127.0.0.1:8545"); // Replace with your Ethereum node URL
const privateKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with your private key

// Check if the private key is valid
if (!web3.utils.isHexStrict(privateKey) || !web3.utils.isHex(privateKey.slice(2))) {
    console.error("Invalid private key format");
    process.exit(1);
} else {
    console.log("Private key format is valid");
}

const abi = contractAbi.abi;
// Replace with your contract address
const contractAddress = "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9";

// Define trustContract outside the try block
let trustContract;

try {
    const checksumAddress = web3.utils.toChecksumAddress(contractAddress);
    trustContract = new web3.eth.Contract(abi, checksumAddress);

    // Function to generate a hash for a device's parameters
    function generateHash(deviceId, latency, responseTime, packetDeliveryRatio) {
        const data = `${deviceId}${latency}${responseTime}${packetDeliveryRatio}`;
        const hash = web3.utils.soliditySha3(data);
        return hash;
    }

    // Function to update parameters for a device and create a hash
    async function updateParameters(deviceId, latency, responseTime, packetDeliveryRatio, satisfaction) {
        try {
            // Call the contract's calculateTrustScore function
            const result = await trustContract.methods
                .calculateTrustScore(deviceId, latency, responseTime, packetDeliveryRatio, satisfaction)
                .send({ from: privateKey, gas: 2000000 }); // Adjust gas limit accordingly

            console.log(`Trust calculation transaction for Device ${deviceId}:`, result);

            // Get the updated trust score and other information
            const trustScore = await trustContract.methods.getTrustScore(deviceId).call();
            const deviceTrust = await trustContract.methods.deviceTrustMapping(deviceId).call();
            const alpha = deviceTrust.alpha;
            const beta = deviceTrust.beta;

            console.log(`Trust score for Device ${deviceId}: ${trustScore}%`);
            console.log(`Alpha for Device ${deviceId}: ${alpha}`);
            console.log(`Beta for Device ${deviceId}: ${beta}`);

            // Generate a hash for the updated parameters
            const hash = generateHash(deviceId, latency, responseTime, packetDeliveryRatio);
            console.log(`Hash for Device ${deviceId} parameters: ${hash}`);
        } catch (error) {
            console.error("Error:", error.message);
        }
    }

    // Example usage
    const deviceId = 1;
    const newLatency = 60;
    const newResponseTime = 180;
    const newPacketDeliveryRatio = 1;
    const satisfaction = 1;

    updateParameters(deviceId, newLatency, newResponseTime, newPacketDeliveryRatio, satisfaction);

} catch (error) {
    console.error("Error:", error.message);
}
