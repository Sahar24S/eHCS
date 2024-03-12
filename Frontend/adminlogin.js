async function checkMetaMask() {
    // Check if MetaMask is installed
    if (window.ethereum) {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // MetaMask is connected
            return true;
        } catch (error) {
            // User denied account access
            console.error('User denied MetaMask account access');
            return false;
        }
    } else {
        // MetaMask is not installed
        console.error('MetaMask is not installed');
        return false;
    }
}

async function loginWithMetaMask() {
    // Check if MetaMask is installed and user is logged in
    const loggedIn = await checkMetaMask();
    const loginStatusElement = document.getElementById('loginStatus');

    if (loggedIn) {
        // Redirect to view admin page
        loginStatusElement.textContent = 'Logged in successfully!';
        // Add logic to redirect to viewadmin.html or perform any other actions after successful login
    } else {
        // MetaMask not installed or user not logged in
        loginStatusElement.textContent = 'Please install MetaMask and login with your account to proceed';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Attach click event listener to login button
    const loginButton = document.getElementById('loginBtn');
    if (loginButton) {
        loginButton.addEventListener('click', loginWithMetaMask);
    }
});
