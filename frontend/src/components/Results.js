// src/components/Results.js
import React, { useEffect, useState } from 'react';
import { electionContract } from '../Election';

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [electionEnded, setElectionEnded] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const electionEnded = await electionContract.methods.electionEnded().call();
        setElectionEnded(electionEnded);

        if (electionEnded) {
          const candidatesCount = await electionContract.methods.getCandidatesCount().call();
          const candidatesArray = [];
          for (let i = 0; i < candidatesCount; i++) {
            const candidate = await electionContract.methods.getCandidate(i).call();
            candidatesArray.push({ name: candidate[0], voteCount: candidate[1] });
          }
          setCandidates(candidatesArray);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);

  if (!electionEnded) {
    return <p>The election is still ongoing. Results will be available once it ends.</p>;
  }

  return (
    <div>
      <h2>Election Results</h2>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>
            {candidate.name}: {candidate.voteCount} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
