// migrations/2_deploy_contracts.js
const Election = artifacts.require('Election');

module.exports = function (deployer) {
  // Define the array of candidate names
  const candidateNames = ['Alice', 'Bob', 'Charlie'];

  // Deploy the Election contract with the candidate names
  deployer.deploy(Election, candidateNames);
};
