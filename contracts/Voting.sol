// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Voting is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public Ids;

    // address of the contract owner
    address public contractOwner;

    // struct to store each candidate data
    struct candidate {
        uint256 id;
        string fullName;
        string party;
        string pdfUrl;
        string imageUrl;
        string projectDescription;
        uint256 numberOfVotes;
        bool created;
    }

    // mapping to link each id with his candidate
    mapping(uint256 => candidate) public candidateMap;

    // mapping to check if a candidate already exists
    mapping(string => uint256) public candidateToId;

    // array to store candidates created
    candidate[] public candidateArray;

    // struct to store users data
    struct user {
        string cin;
        string city;
        string country;
        string gender;
        uint256 age;
        uint256 voteFor;
        bool voted;
    }

    // mapping to link each cin with his user
    mapping(string => user) public userMap;
    mapping(address => string) public userAddressToCin;

    // array to store users that participate
    user[] public userArray;

    constructor() {
        contractOwner = msg.sender;
    }

    // function to create candidates called only by the contract owner
    function createCandidate(
        string memory candidateName,
        string memory candidateParty,
        string memory pdf_url,
        string memory imageURL,
        string memory description
    ) public nonReentrant {
        require(msg.sender == contractOwner, "You are not the contract owner!");
        require(candidateToId[candidateName] == 0, "Candidate already exists!");

        Ids.increment();
        uint256 currentId = Ids.current();
        candidateMap[currentId] = candidate(
            currentId,
            candidateName,
            candidateParty,
            pdf_url,
            imageURL,
            description,
            0,
            true
        );
        candidateArray.push(candidateMap[currentId]);

        candidateToId[candidateName] = currentId;
    }

    // function to allow users to vote for a candidate
    function vote(
        uint256 candidateId,
        string memory _cin,
        string memory _city,
        string memory _country,
        string memory _gender,
        uint256 _age
    ) public nonReentrant {
        require(candidateMap[candidateId].created, "No candidate with this Id");
        require(userMap[_cin].voted == false, "You already voted!");
        require(
            userMap[userAddressToCin[msg.sender]].voted == false,
            "This wallet address is already linked to a CIN that has voted!"
        );
        userMap[_cin] = user(
            _cin,
            _city,
            _country,
            _gender,
            _age,
            candidateId,
            true
        );
        userArray.push(userMap[_cin]);
        candidateMap[candidateId].numberOfVotes =
            candidateMap[candidateId].numberOfVotes +
            1;
        userAddressToCin[msg.sender] = _cin;
        for (uint256 i = 0; i < candidateArray.length; i++) {
            if (candidateArray[i].id == candidateId) {
                candidateArray[i].numberOfVotes =
                    candidateArray[i].numberOfVotes +
                    1;
            }
        }
    }

    // function to get the array of candidates
    function getCandidates() public view returns (candidate[] memory) {
        return candidateArray;
    }

    // function to get the array of users
    function getUsers() public view returns (user[] memory) {
        return userArray;
    }

    // function to get candidate info
    function getCandidateInfo(
        uint256 _id
    ) public view returns (candidate memory) {
        return candidateMap[_id];
    }
}
