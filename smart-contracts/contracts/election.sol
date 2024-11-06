// contracts/Election.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Election {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 vote;
    }

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public admin;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    address[] public voterAddresses;
    bool public electionEnded;

    event VoteCast(address voter, uint256 candidate);
    event ElectionEnded();
    event ElectionReset();

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor(string[] memory candidateNames) {
        admin = msg.sender;
        for (uint256 i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate({ name: candidateNames[i], voteCount: 0 }));
        }
    }

    // Function to register a voter
    function registerVoter(address voterAddress) public onlyAdmin {
        require(!voters[voterAddress].isRegistered, "Voter is already registered");
        voters[voterAddress].isRegistered = true;
        voterAddresses.push(voterAddress);
    }

    // Function to cast a vote
    function vote(uint256 candidateIndex) public {
        Voter storage sender = voters[msg.sender];
        require(sender.isRegistered, "Not registered to vote");
        require(!sender.hasVoted, "Already voted");
        require(!electionEnded, "Election has ended");
        require(candidateIndex < candidates.length, "Invalid candidate");

        sender.hasVoted = true;
        sender.vote = candidateIndex;

        candidates[candidateIndex].voteCount += 1;
        emit VoteCast(msg.sender, candidateIndex);
    }

    // Function to end the election
    function endElection() public onlyAdmin {
        require(!electionEnded, "Election already ended");
        electionEnded = true;
        emit ElectionEnded();
    }

    // Function to reset the election
    function resetElection(string[] memory newCandidateNames) public onlyAdmin {
        // Reset election state
        electionEnded = false;

        // Clear candidates array
        delete candidates;

        // Initialize new candidates
        for (uint256 i = 0; i < newCandidateNames.length; i++) {
            candidates.push(Candidate({ name: newCandidateNames[i], voteCount: 0 }));
        }

        // Reset voters mapping
        for (uint256 i = 0; i < voterAddresses.length; i++) {
            address voterAddress = voterAddresses[i];
            voters[voterAddress] = Voter({
                isRegistered: false,
                hasVoted: false,
                vote: 0
            });
        }
        delete voterAddresses;

        emit ElectionReset();
    }

    // Function to get candidate details
    function getCandidate(uint256 candidateIndex) public view returns (string memory, uint256) {
        require(candidateIndex < candidates.length, "Candidate does not exist");
        Candidate storage candidate = candidates[candidateIndex];
        return (candidate.name, candidate.voteCount);
    }

    // Function to get the number of candidates
    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }

    // Function to get all candidates
    function getAllCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }
}
