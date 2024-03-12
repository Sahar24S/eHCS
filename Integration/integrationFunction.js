// Import Web3 library
const Web3 = require('web3');
const contractAbi = require("./contract/SimpleStorage.json");


// Instantiate Web3 with the provider (for example, MetaMask)
//const web3 = new Web3(Web3.givenProvider);

// Initialize a Web3 instance with an HTTP provider
const web3 = new Web3('http://localhost:8545'); // Replace with your Ethereum node URL
const adminAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

if (!web3.utils.isHexStrict(adminAddress) || !web3.utils.isHex(adminAddress.slice(2))) {
    console.error("Invalid address  format");
    process.exit(1);
} else {
    console.log("adminAddress format is valid");
}
// Contract ABI (you can get this from your compiled contract)
const abi = contractAbi.abi;
// Contract address (the deployed address of your contract)
const contractAddress = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853';
let contract;

try {
  // Load the contract with the ABI and address
  const checksumAddress = web3.utils.toChecksumAddress(contractAddress);
  contract = new web3.eth.Contract(abi, checksumAddress);
} catch (error) {
  console.error("Error:", error.message);
  if (error.reason) {
    console.error('Reason:', error.reason);
  } else if (error.message.includes('revert')) {
    console.error('Reason:', 'Transaction reverted');
  }
}

// Example function to interact with the contract: Get admin info
async function getAdmin(adminAddress) {
  try {
    const result = await contract.methods.getAdmin(adminAddress).call();
    console.log('Transaction hash:', tx.transactionHash);
    console.log('Admin SSN:', result[0]);
    console.log('Admin Meta:', result[1]);
  } catch (error) {
    console.error('Error:', error);
    if (error.reason) {
      console.error('Reason:', error.reason);
    } else if (error.message.includes('revert')) {
      console.error('Reason:', 'Transaction reverted');
    }
  }
}

// Example function to interact with the contract: Add admin
async function addAdmin(ssn, adminAddress, meta) {
  try {
    const tx = await contract.methods.addAdmin(ssn, adminAddress, meta).send({ from: adminAddress, gas: 2000000 });
    console.log('Transaction hash:', tx.transactionHash);
  } catch (error) {
    console.error('Error:', error);
    if (error.reason) {
      console.error('Reason:', error.reason);
    } else if (error.message.includes('revert')) {
      console.error('Reason:', 'Transaction reverted');
    }
  }
}


// Example function to interact with the contract: Get patient info
async function getPatient(patientAddress) {
  try {
    const result = await contract.methods.getPatient(patientAddress).call();
    console.log('Patient SSN:', result[0]);
    console.log('Patient Doctor:', result[1]);
    console.log('Patient Meta:', result[2]);
  } catch (error) {
    console.error('Error:', error);
    if (error.reason) {
      console.error('Reason:', error.reason);
    } else if (error.message.includes('revert')) {
      console.error('Reason:', 'Transaction reverted');
    }
  }
}

// Example function to interact with the contract: Add patient
async function addPatient(ssn, patientAddress, doctorAddress, meta) {
  try {
    const tx = await contract.methods.addPatient(ssn, patientAddress, doctorAddress, meta).send({ from: adminAddress, gas: 2000000 });
    console.log('Transaction hash:', tx.transactionHash);
  } catch (error) {
    console.error('Error:', error);
    if (error.reason) {
      console.error('Reason:', error.reason);
    } else if (error.message.includes('revert')) {
      console.error('Reason:', 'Transaction reverted');
    }
  }
}

// Example function to interact with the contract: Get doctor info
async function getDoctor(doctorAddress) {
  try {
    const result = await contract.methods.getDoctor(doctorAddress).call({ gas: '3000000' });
    console.log('Doctor SSN:', result[0]);
    console.log('Doctor Meta:', result[1]);
  } catch (error) {
    console.error('Error:', error);
    if (error.reason) {
      console.error('Reason:', error.reason);
    } else if (error.message.includes('revert')) {
      console.error('Reason:', 'Transaction reverted');
    }
  }
}

// Example function to interact with the contract: Add doctor
async function addDoctor(ssn, doctorAddress, meta) {
  try {
    const tx = await contract.methods.addDoctor(ssn, doctorAddress, meta).send({ from: adminAddress, gas: 30000000 });
    console.log('Transaction hash:', tx.transactionHash);
  } catch (error) {
    console.error('Error:', error);
    if (error.reason) {
      console.error('Reason:', error.reason);
    } else if (error.message.includes('revert')) {
      console.error('Reason:', 'Transaction reverted');
    }
  }
}

// Example usage: Call your functions with sample data for testing
//getAdmin('0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266');
//addAdmin('123456789', '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', 'Admin Meta');
//getPatient('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC');
//addPatient('987654321', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'Patient Meta');
addDoctor('456789133', '0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'Doctor Meta');
//getDoctor('0x70997970C51812dc3A010C7d01b50e0d17dc79C8');

// Export the functions
module.exports = {
  getAdmin,
  addAdmin,
  getPatient,
  addPatient,
  getDoctor,
  addDoctor,
};
