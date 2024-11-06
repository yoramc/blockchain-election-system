// src/Election.js

import Web3 from 'web3';
import ElectionArtifact from './contracts/Election.json';

let web3;
let electionContract;

const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error('User denied account access:', error);
    }
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
};

const initContract = async () => {
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = ElectionArtifact.networks[networkId];
  if (deployedNetwork) {
    electionContract = new web3.eth.Contract(
      ElectionArtifact.abi,
      deployedNetwork.address
    );
  } else {
    alert('Contract not deployed on the current network. Please deploy your contract and try again.');
  }
};

const initApp = async () => {
  await initWeb3();
  await initContract();
};

export { web3, electionContract, initApp };
