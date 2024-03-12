const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const app = express();
const port = 3001;
const sha1 = require("sha1");
const fs = require("fs-extra");
//logged in as
let user = "";
//For sig verification
const ethUtil = require("ethereumjs-util");
const sigUtil = require("eth-sig-util");
//Blockchain Setup
const { ethers } = require("ethers");
//const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const HARDHAT_NETWORK_URL = "http://localhost:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
//used solc compiler to generate fresh ABI and the fs package to read abi file
const abi = fs.readFileSync(
  "./contracts_SimpleStorage_sol_SimpleStorage.abi",
  "utf8"
);
let provider = new ethers.providers.JsonRpcProvider(HARDHAT_NETWORK_URL);
let wallet = new ethers.Wallet(PRIVATE_KEY, provider);
let storage = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

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
getAdmin();
async function getAdmin() {
  const currentValue = await storage.getDoctor(
    "0xEdD16B9c7ccf81b2D17076c77732f7030865db0B"
  );
  console.log(`Current Docotor Value is: ${currentValue}`);
  const phiValue = await storage.getPhi(
    "0xEdD16B9c7ccf81b2D17076c77732f7030865db0B"
  );
  console.log(`Current phi Value is: ${phiValue}`);
  const subValue = await storage.getSub("123");
  console.log(`Current prescription Value is: ${subValue}`);
}

// Where we will keep personal Information about a Doctor
let doctors = [
  {
    ssn: "1001",
    name: "Jugan Kazmi",
    address: "F-11, Islamabad",
    phone: "03258745894",
    wallet: "0xEdD16B9c7ccf81b2D17076c77732f7030865db0B",
    meta: "c519606dc066f5ddc9ca21f5b923cef7889bf9c8",
  },
  {
    ssn: "1002",
    name: "Saad Hassan",
    address: "F-12, Lahore",
    phone: "03254865895",
    wallet: "0x7d131118eb2486B6F178Ee4A4496273CcfF54f48",
    meta: "432808a8a5f418e8dcc7276d10d086fc0623884e",
  },
];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/adddoctors", async function (req, res) {
  const per = req.body;
  const meta = sha1(JSON.stringify(per));
  console.log(meta);
  per.meta = meta;
  console.log(per);
  //check admin priviliges
  let value = await checkAdmin();
  console.log(value);
  if (value == true) {
    doctors.push(per);
    console.log(doctors);
    await doctorToBlockchain(per);
    res.send("Doctor is added to the database");
  } else {
    res.send("Permission denied! You are not admin");
  }
});

async function checkAdmin() {
  const currentValue = await storage.getAdmin(user);
  if (currentValue[0]) {
    console.log(`Current admin Value is: ${currentValue[0]}`);
    return true;
  } else {
    return false;
  }
}

async function doctorToBlockchain(per) {
  const currentValue = await storage.addDoctor(per.ssn, per.wallet, per.meta);
  await currentValue.wait(1);
}

app.get("/doctors", (req, res) => {
  res.json(doctors);
});

//working on authentication part
function web3_metamask_hash() {
    var hashed_string = "";
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var total_chars = chars.length;
    for (var i = 0; i < 256; i++) {
      hashed_string += chars.charAt(Math.floor(Math.random() * total_chars));
    }
    return hashed_string;
  }
  
  app.get("/getnounce", (req, res) => {
    let hash = web3_metamask_hash();
    console.log(hash);
    res.json(hash);
  });
  
  app.post("/loginadmin", function (req, res) {
    const per = req.body;
    console.log(per);
  
    let usig = per.sign;
    let umsg = per.hello;
    let uwallet = per.wallet.toLowerCase();
    // console.log(`signature=${usig},message=${umsg},account=${uwallet}`);
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(umsg, "utf8"));
    const calcAddress = sigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: usig,
    });
    console.log(uwallet);
    console.log(calcAddress);
    user = uwallet;
    console.log(user);
    let success = "Logged in successfully";
    let failure = "Failed to verify signature";
    if (uwallet == calcAddress) {
      res.send(success);
    } else {
      res.send(failure);
    }
  });

  app.listen(port, () => console.log(`Doctors API listening on ${port}!`));