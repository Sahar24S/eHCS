const express = require("express");
const Web3 = require("web3");
const path = require("path"); 
const bodyParser = require("body-parser");

const contractAbi = require("./contract/TrustCalculation.json");

const app = express();
const port = 3001;

const web3 = new Web3("http://127.0.0.1:8545"); // Replace with your Ethereum node URL
const privateKey = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Replace with your private key

const abi = contractAbi.abi;
const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // Replace with your contract address
const storage = new web3.eth.Contract(abi, contractAddress);


const sha1 = require("sha1");
const fs = require("fs-extra");


// Example testing Blockchain call
// addAdmin();
// async function addAdmin() {
//   const currentValue = await storage.addAdmin(
//     "456",
//     "0xb89320878CBD7Df4946Aa81fE4cA800Bb098cDc9",
//     "ffada"
//   );
//   await currentValue.wait(1);
// }

//app.use(express.json());
// Serve static files from the public folder
// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "../Frontend")));
app.use(bodyParser.json());
// Where we will keep personal Information about a Doctor
let doctors = [
  {
    ssn: "1001",
    name: "Sara Kiyani",
    address: "F-6, Islamabad",
    phone: "03478894388",
    wallet: "0xEdD16B9c7ccf81b2D17076c77732f7030865db0B",
    meta: "c519606dc066f5ddc9ca21f5b923cef7889bf9c8",
  },
  {
    ssn: "1002",
    name: "Aimen Iftikhar",
    address: "g9, Lahore",
    phone: "03254865895",
    wallet: "0x7d131118eb2486B6F178Ee4A4496273CcfF54f48",
    meta: "432808a8a5f418e8dcc7276d10d086fc0623884e",
  },
];


// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/adddoctors", async function (req, res) {
  const per = req.body;

  // Calculate hash of all inputs
  const inputHash = sha1(JSON.stringify(per));

  // Find the doctor with the same SSN
  const existingDoctor = doctors.find(doctor => doctor.ssn === per.ssn);

  if (existingDoctor) {
    // Compare the hash of inputs with the existing doctor's meta hash
    if (existingDoctor.meta === inputHash) {
      return res.status(400).send("Doctor already present in data. You cannot do double registration.");
    }
  }

  // Update doctor's meta hash with the hash of new inputs
  per.meta = inputHash;
  doctors.push(per);
  console.log(doctors);
  res.send("Doctor is added to the database");
});

async function checkAdmin() {
  const currentValue = await storage.methods.getAdmin(user);
  if (currentValue[0]) {
    console.log(`Current admin Value is: ${currentValue[0]}`);
    return true;
  } else {
    return false;
  }
}
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await getDoctors();
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Error fetching doctors");
  }
});


app.listen(port, () => {
console.log(`Server is running on http://localhost:${port}`);
});
