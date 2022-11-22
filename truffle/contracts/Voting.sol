// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title A voting smart contract for one-time elections

/** @notice How to use this contract ? 
* You can use this contract for a simple one-time election, ie this contract can be
* used only once as the different variables of it (list of proposals, winning proposal, voters etc) 
* aren't reset to zero at the end.
* To use it, first you need an administrator that will handle all the different steps of the voting session
* and also will define the addresses allowed to submit proposals and allowed to vote for the different
* proposals that have been submitted. The winner doesn't need the majority 
*
* The different steps of the session : 
*
* First step : 
*       The administrator will whitelist the different voters addresses one by one by using the 
*       addVoter function
* Second step : 
*       The administrator will enable the users to submit proposals with the 
*       startProposalsRegistering function
* Third step : 
*       The administrator will end the users's ability to submit proposals and will use the 
*       endProposalsRegistering function
* Forth step : 
*       The administrator will enable the users to vote for the proposals submitted with the
*       startVotingSession function
* Fifth step : 
*       The administrator will stop the voting session with the 
*       endVotingSession function
* Last step : 
*       The administrator will count the votes and "designate" the winner (even if the winner is determined
*       votes after the votes and not at the end). Administrator will use the 
*       tallyVotes function
*       
* Few remarks : 
*
* The different proposals can be viewed by the voters with the getOneProposal function 
* The winning proposal ID is accessed through the value of winningProposalID
* Any voter can check the vote status of an other voter with the getVoter function
* A voter can vote only once
*/

contract Voting is Ownable {

    uint public winningProposalID;
    
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //


    /** 
    * @notice This function returns a struct (object) that contains informations about the voter
    * you need the voter address in order to use it
    * @param _addr : voter address
    * @return voter informations
    */
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    /** 
    * @notice This function returns a struct (object) that contains informations about the proposal
    * you need the proposal ID in order to use it
    * @param _id : proposal Id
    * @return proposal informations
    */
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

 
    // ::::::::::::: REGISTRATION ::::::::::::: // 

    /** 
    * @notice This function allows the owner to whitelist voters addresses 
    * @param _addr : voter address to be whitelisted
    */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 

    // ::::::::::::: PROPOSAL ::::::::::::: // 

    /** 
    * @notice This function allows the voters (whitelisted addresses) to submit proposals
    * proposals can't be empty 
    * proposals can be added between steps 2 and 3
    * @param _desc : proposal content (a text)
    */
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals are not allowed yet");
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), "Vous ne pouvez pas ne rien proposer"); // facultatif
        Proposal memory proposal;
        /*
        proposalsArrayBis = proposalsArray ; 
        bool existsAlready ; 
        for (uint i = 0 ; i < proposalsArrayBis.length ; i++){
            if (keccak256(abi.encode(proposalsArrayBis[i].description)) == keccak256(abi.encode(_desc))){
                existsAlready = true ;
            }
        }
        require (existsAlready == false, "proposition already exists") ;
        */
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /** 
    * @notice This function allows the voters (whitelisted addresses) to vote for their favourite proposal
    * voter must not have voted before
    * important to note : the winner is determined directly when the users are casting their votes
    * by comparing imediately the proposals votes with the "temporary" winner
    * proposals can be added between steps 4 and 5
    * @param _id : the ID of the proposal the voter vote for
    */
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found');

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        if (proposalsArray[_id].voteCount > proposalsArray[winningProposalID].voteCount){
            (winningProposalID , _id) = (_id , winningProposalID) ;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /** 
    * @notice This function allows the administrator, after he whitelisted voters, to open the 
    * proposals submition process for the voters
    */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /** 
    * @notice This function allows the administrator, after voters have submitted proposals, 
    * to close the proposals registration process
    */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /** 
    * @notice This function allows the administrator to open the voting session
    */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /** 
    * @notice This function allows the administrator to close the voting session
    */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }


    /** 
    * @notice This function isn't very useful as the winner is determined during the voting session,
    * vote after vote
    */
   function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       /*
       uint _winningProposalId;
        for (uint256 p = 0; p < proposalsArray.length; p++) {
           if (proposalsArray[p].voteCount > proposalsArray[_winningProposalId].voteCount) {
               _winningProposalId = p;
          }
       }
       winningProposalID = _winningProposalId;
       */
       
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}
