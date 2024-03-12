const Web3 = require("web3");
const trustCalculationArtifact = require("../artifacts/contracts/TrustCalculation.sol/TrustCalculation.json"); // Update the path accordingly

async function deployContract() {
  const web3 = new Web3("http://127.0.0.1:8545"); // Assuming Ganache is running on the default URL

  const accounts = await web3.eth.getAccounts();
  
  console.log("Deploying the TrustCalculation contract...");

  const TrustCalculation = new web3.eth.Contract(trustCalculationArtifact.abi);

  const trustCalculation = await TrustCalculation
    .deploy({
      data: trustCalculationArtifact.bytecode,
    })
    .send({
      from: accounts[0],
      gas: 6721975, // Adjust gas according to your needs
      gasPrice: 20000000000, // Adjust gas price according to your needs
    });

  console.log("TrustCalculation contract deployed to:", trustCalculation.options.address);
}

deployContract();