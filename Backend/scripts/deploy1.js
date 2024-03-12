const Web3 = require("web3");
const aclContractArtifact = require("../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json"); // Update the path accordingly

async function deployContract() {
  const web3 = new Web3("http://127.0.0.1:8545"); // Assuming Ganache is running on the default URL

  const accounts = await web3.eth.getAccounts();
  
  console.log("Deploying the contract...");

  const AclcontractAbi = new web3.eth.Contract(aclContractArtifact.abi);

  const aclcontractAbi = await AclcontractAbi
    .deploy({
      data: aclContractArtifact.bytecode,
    })
    .send({
      from: accounts[0],
      gas: 6721975, // Adjust gas according to your needs
      gasPrice: 50000000000, // Adjust gas price according to your needs
    });

  console.log("ACLstorage contract deployed to:", aclcontractAbi.options.address);
}

deployContract();


