// src/components/AdminDashboard.js

import React, { useEffect, useState } from 'react';
import { web3, electionContract, initApp } from '../Election';

const AdminDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [voterAddress, setVoterAddress] = useState('');
  const [electionEnded, setElectionEnded] = useState(false);
  const [candidateNames, setCandidateNames] = useState('');
  const [newCandidateNames, setNewCandidateNames] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize web3 and electionContract
        await initApp();

        // Check if web3 was initialized properly
        if (!web3) {
          alert('Failed to initialize web3. Please make sure MetaMask is installed and connected.');
          return;
        }

        // Get accounts
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        if (!accounts || accounts.length === 0) {
          alert('No accounts found. Please connect your MetaMask wallet.');
          return;
        }

        // Check if electionContract is initialized
        if (!electionContract) {
          alert('Election contract not initialized. Please ensure the contract is deployed and MetaMask is connected to the correct network.');
          return;
        }

        // Get admin address from the contract
        const adminAddress = await electionContract.methods.admin().call();
        setIsAdmin(accounts[0].toLowerCase() === adminAddress.toLowerCase());

        // Get election status
        const electionEnded = await electionContract.methods.electionEnded().call();
        setElectionEnded(electionEnded);

        // Get candidates
        const candidatesCount = await electionContract.methods.getCandidatesCount().call();
        const candidatesArray = [];
        for (let i = 0; i < candidatesCount; i++) {
          const candidate = await electionContract.methods.getCandidate(i).call();
          candidatesArray.push(candidate[0]);
        }
        setCandidateNames(candidatesArray.join(', '));
      } catch (error) {
        console.error('Error initializing admin dashboard:', error);
        alert('Error initializing admin dashboard: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const registerVoter = async (e) => {
    e.preventDefault();
    try {
      if (!accounts || accounts.length === 0) {
        alert('No accounts available. Please connect your wallet.');
        return;
      }

      await electionContract.methods.registerVoter(voterAddress).send({ from: accounts[0] });
      alert('Voter registered successfully');
      setVoterAddress('');
    } catch (error) {
      console.error('Error registering voter:', error);
      alert('Error registering voter: ' + error.message);
    }
  };

  const endElection = async () => {
    try {
      if (!accounts || accounts.length === 0) {
        alert('No accounts available. Please connect your wallet.');
        return;
      }

      await electionContract.methods.endElection().send({
        from: accounts[0],
        gas: 3000000,
        gasPrice: '20000000000',
      });
      alert('Election ended');
      setElectionEnded(true);
    } catch (error) {
      console.error('Error ending election:', error);
      alert('Error ending election: ' + error.message);
    }
  };

  const resetElection = async (e) => {
    e.preventDefault();
    try {
      if (!accounts || accounts.length === 0) {
        alert('No accounts available. Please connect your wallet.');
        return;
      }

      const namesArray = newCandidateNames
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      if (namesArray.length === 0) {
        alert('Please enter at least one candidate name.');
        return;
      }

      await electionContract.methods.resetElection(namesArray).send({
        from: accounts[0],
        gas: 5000000,
        gasPrice: '20000000000',
      });
      alert('Election reset successfully');
      setNewCandidateNames('');
      setElectionEnded(false);
      // Update candidate names
      setCandidateNames(namesArray.join(', '));
    } catch (error) {
      console.error('Error resetting election:', error);
      alert('Error resetting election: ' + error.message);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return <p>Access denied. You are not the admin.</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Current Candidates: {candidateNames}</p>
      {!electionEnded ? (
        <div>
          <form onSubmit={registerVoter}>
            <input
              type="text"
              value={voterAddress}
              onChange={(e) => setVoterAddress(e.target.value)}
              placeholder="Voter Address"
              required
            />
            <button type="submit">Register Voter</button>
          </form>
          <button onClick={endElection}>End Election</button>
          <form onSubmit={resetElection}>
            <input
              type="text"
              value={newCandidateNames}
              onChange={(e) => setNewCandidateNames(e.target.value)}
              placeholder="New Candidates (comma-separated)"
              required
            />
            <button type="submit">Reset Election</button>
          </form>
        </div>
      ) : (
        <div>
          <p>The election has ended.</p>
          <form onSubmit={resetElection}>
            <input
              type="text"
              value={newCandidateNames}
              onChange={(e) => setNewCandidateNames(e.target.value)}
              placeholder="New Candidates (comma-separated)"
              required
            />
            <button type="submit">Start New Election</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
