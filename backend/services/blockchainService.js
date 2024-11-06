const Web3 = require('web3').Web3; // Adjusted import statement

const contractABI = require('../../smart-contracts/build/contracts/Election.json').abi;
const contractAddress = '0xC4e31Fd5816216Abc8c9Fd11C7df03133d00ddB1'; // Replace with your actual address

const web3 = new Web3('http://127.0.0.1:8545'); // Adjust port if necessary
const electionContract = new web3.eth.Contract(contractABI, contractAddress);

module.exports = electionContract;
