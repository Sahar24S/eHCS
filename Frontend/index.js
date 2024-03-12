function web3_check_metamask() {
  if (!window.ethereum) {
    console.error(
      "It seems that the MetaMask extension is not detected. Please install MetaMask first."
    );
    alert(
      "It seems that the MetaMask extension is not detected. Please install MetaMask first."
    );
    return false;
  } else {
    console.log("MetaMask extension has been detected!!");
    return true;
  }
}
/**async function getNounce() {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", "http://localhost:3000/getnounce", false);
  xhttp.send();

  hashed_string = JSON.parse(xhttp.responseText);
  console.log(hashed_string);
  return hashed_string;
} **/
async function web3_metamask_login() {
  // Check first if the user has MetaMask installed
  if (web3_check_metamask()) {
    console.log("Initiate Login Process");

    try {
      // Get the Ethereum provider
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // Get Ethereum accounts
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log("Connected!!");
      // Get the user's Ethereum address
      const userAddress = accounts[0];
      console.log("User Address: " + userAddress);

      // Admin account address
      const adminAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'; // Replace with your admin account address

      // Check if the logged-in user is the admin
      if (userAddress.toLowerCase() === adminAddress.toLowerCase()) {
        // If the user is the admin, proceed with the admin-specific actions
        
        // Update UI to show that the user is logged in
        let x = document.getElementById("user");
        x.innerHTML = "Logged in";
        x.disabled = true;
        
        // Show the "Add new Patient" and "Add new Doctor" buttons
        window.location.href = 'viewadmin.html';
      } else {
        // If the user is not the admin, display a message or perform other actions as needed
        let x = document.getElementById("user");
        x.innerHTML = "Invalid User";
        console.log("User is not the admin.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
}
