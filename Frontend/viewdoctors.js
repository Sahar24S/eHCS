// import sha1 from "sha1";
let doctors;
let tHash;
const loadDoctors = async () => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", "http://localhost:3001/doctors", false);
  xhttp.send();

  doctors = JSON.parse(xhttp.responseText);
  // console.log(patients);
  for (let doctor of doctors) {
    //copy object meta info
    let tempMeta = doctor.meta;
    // console.log(tempMeta);
    //remove meta hash value calculate hash
    delete doctor.meta;
    // console.log(patient);

    let hash = await sha1(JSON.stringify(doctor));
    // console.log(hash);

    //append meta and recalculated hash
    doctor.meta = tempMeta;
    doctor.calmeta = hash;
    console.log(doctor);
    console.log(doctors);
    //display on screen
  }
};


loadDoctors();

async function sha1(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

let tableFromJson = (Jobject) => {
  // the json data.

  // Extract value from table header.
  // ('Book ID', 'Book Name', 'Category' and 'Price')
  let col = [];
  for (let i = 0; i < Jobject.length; i++) {
    for (let key in Jobject[i]) {
      if (col.indexOf(key) === -1) {
        col.push(key);
      }
    }
  }

  // Create table.
  const table = document.createElement("table");

  // Create table header row using the extracted headers above.
  let tr = table.insertRow(-1); // table row.

  for (let i = 0; i < col.length; i++) {
    let th = document.createElement("th"); // table header.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }

  // add json data to the table as rows.
  for (let i = 0; i < Jobject.length; i++) {
    tr = table.insertRow(-1);

    for (let j = 0; j < col.length; j++) {
      let tabCell = tr.insertCell(-1);
      tabCell.innerHTML = Jobject[i][col[j]];
    }
  }

  // Now, add the newly created table with json data, to a container.
  const divShowData = document.getElementById("showData");
  divShowData.innerHTML = "";
  divShowData.appendChild(table);
};

function tableFrom() {
  tableFromJson(doctors);
}

function tableForAdmin() {
  tableFromJson(admins);
}

async function verify() {
  await connect();
  await getBMeta();
  console.log(`hash is ${tHash}`);
  console.log(`Blockchain hash is ${Bmeta}`);
  if (tHash == Bmeta) {
    document.getElementById("Verify").innerHTML = "Verified";
  } else {
    document.getElementById("Verify").innerHTML = " Not Verified";
  }
  console.log(`Meta from Blockchain is ${Bmeta}`);
  document.getElementById(
    "verifyData"
  ).innerHTML = `Hash from Blockchain is ${Bmeta} `;
}
//verification from blockchain
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    // connectButton.innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    alert("Please install MetaMask");
  }
}

//verify from blockchain
let Bmeta;
async function getBMeta() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transactionResponse = await contract.getPhi(tWallet);
    console.log(transactionResponse);
    Bmeta = transactionResponse[1];
  } else {
    alert("metamask not found");
  }
}
