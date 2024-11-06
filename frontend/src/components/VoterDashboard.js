// src/components/VoterDashboard.js
import React, { useEffect, useState } from 'react';
import { web3, electionContract } from '../Election';

const VoterDashboard = () => {
  const [accounts, setAccounts] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [electionEnded, setElectionEnded] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts);

        const voter = await electionContract.methods.voters(accounts[0]).call();
        setIsRegistered(voter.isRegistered);
        setHasVoted(voter.hasVoted);

        const electionEnded = await electionContract.methods.electionEnded().call();
        setElectionEnded(electionEnded);

        const candidatesCount = await electionContract.methods.getCandidatesCount().call();
        const candidatesArray = [];
        for (let i = 0; i < candidatesCount; i++) {
          const candidate = await electionContract.methods.getCandidate(i).call();
          candidatesArray.push({ id: i, name: candidate[0], voteCount: candidate[1] });
        }
        setCandidates(candidatesArray);
      } catch (error) {
        console.error('Error initializing voter dashboard:', error);
      }
    };

    init();
  }, []);

  const castVote = async (e) => {
    e.preventDefault();
    try {
      await electionContract.methods.vote(selectedCandidate).send({ from: accounts[0] });
      alert('Vote cast successfully');
      setHasVoted(true);
    } catch (error) {
      console.error(error);
      alert('Error casting vote');
    }
  };

  if (!isRegistered) {
    return <p>You are not registered to vote.</p>;
  }

  if (electionEnded) {
    return <p>The election has ended. Thank you for your participation.</p>;
  }

  if (hasVoted) {
    return <p>You have already cast your vote.</p>;
  }

  return (
    <div>
      <h2>Voter Dashboard</h2>
      <form onSubmit={castVote}>
        <select
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a candidate
          </option>
          {candidates.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {candidate.name}
            </option>
          ))}
        </select>
        <button type="submit">Vote</button>
      </form>
    </div>
  );
};

export default VoterDashboard;
