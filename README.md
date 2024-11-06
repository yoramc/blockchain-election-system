# Blockchain Election System

A decentralized application (DApp) that allows for secure and transparent elections using blockchain technology.

Prerequisites
Software and tools that need to be installed:

Node.js (version 14.x or 16.x)
npm (comes with Node.js)
Truffle (globally installed)
Ganache (CLI or GUI)
MetaMask browser extension
Installation Instructions
Provide step-by-step instructions for setting up the project.

1. Clone the Repository
bash
Copy code
git clone https://github.com/yourusername/blockchain-election-system.git
cd blockchain-election-system

2. Install Dependencies
For Smart Contracts:
cd smart-contracts
npm install

For Frontend:
cd ../frontend
npm install

3. Start Ganache
Option 1: Ganache GUI

Download and install Ganache from https://www.trufflesuite.com/ganache
Open Ganache and start a new workspace

Option 2: Ganache CLI
npm install -g ganache-cli
ganache-cli

4. Configure MetaMask
Install MetaMask extension in your browser
Add a new network in MetaMask:
Network Name: Localhost 8545
RPC URL: http://127.0.0.1:8545
Chain ID: 1337
Currency Symbol: ETH

Import an account from Ganache into MetaMask:
Copy the private key of the first account from Ganache
In MetaMask, click on your account icon and select "Import Account"
Paste the private key and import

5. Compile and Migrate Smart Contracts
cd ../smart-contracts
truffle compile
truffle migrate --reset

6. Start the Frontend Application
cd ../frontend
npm start

Usage
Access the application at http://localhost:3000
Ensure MetaMask is connected to the correct network and account
Use the Admin Dashboard to register voters, end the election, and reset the election
Use the Voter Dashboard to cast votes (if applicable)