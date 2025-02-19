// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FundTransferWithRegistry.sol";

contract CryptifyFreelance {
    enum ContractStatus { Pending, Approved, InProgress, Completed }

    struct Freelancer {
        address wallet;
        string name;
        string skills;
        string profileLink;
        uint256 hourlyRate;
        bool registered;
    }

    struct WorkContract {
        address client;
        address freelancer;
        uint256 amount;
        uint256 duration;
        ContractStatus status;
        bool fundsReleased;
    }

    mapping(address => Freelancer) public freelancers;
    mapping(uint256 => WorkContract) public contracts;
    address[] public freelancerList;
    uint256 public contractCount;
    FundTransferWithRegistry public fundTransferContract;

    event FreelancerRegistered(address indexed freelancer, string name);
    event FreelancerUpdated(address indexed freelancer, string name);
    event FreelancerDeleted(address indexed freelancer);
    event ContractCreated(uint256 contractId, address indexed client, address indexed freelancer, uint256 amount);
    event ContractApproved(uint256 contractId);
    event WorkStarted(uint256 contractId);
    event WorkCompleted(uint256 contractId);
    event FundsReleased(uint256 contractId, address indexed freelancer);
    event ContractCancelled(uint256 contractId, address indexed client);

    constructor(address _fundTransferContract) {
        fundTransferContract = FundTransferWithRegistry(_fundTransferContract);
    }

    // 🚀 Register as a Freelancer
    function registerFreelancer(
        string memory _name,
        string memory _skills,
        string memory _profileLink,
        uint256 _hourlyRate
    ) external {
        require(!freelancers[msg.sender].registered, "Already registered");

        freelancers[msg.sender] = Freelancer(msg.sender, _name, _skills, _profileLink, _hourlyRate, true);
        freelancerList.push(msg.sender);

        emit FreelancerRegistered(msg.sender, _name);
    }

    // 🚀 Update Freelancer Profile
    function updateFreelancerProfile(
        string memory _name,
        string memory _skills,
        string memory _profileLink,
        uint256 _hourlyRate
    ) external {
        require(freelancers[msg.sender].registered, "Not registered");

        Freelancer storage freelancer = freelancers[msg.sender];
        freelancer.name = _name;
        freelancer.skills = _skills;
        freelancer.profileLink = _profileLink;
        freelancer.hourlyRate = _hourlyRate;

        emit FreelancerUpdated(msg.sender, _name);
    }

    // 🚀 Delete Freelancer Profile
    function deleteFreelancer() external {
        require(freelancers[msg.sender].registered, "Not registered");

        delete freelancers[msg.sender];

        for (uint i = 0; i < freelancerList.length; i++) {
            if (freelancerList[i] == msg.sender) {
                freelancerList[i] = freelancerList[freelancerList.length - 1];
                freelancerList.pop();
                break;
            }
        }

        emit FreelancerDeleted(msg.sender);
    }

    // 🚀 Fetch Freelancer Details
    function getFreelancer(address _wallet) external view returns (
        string memory name,
        string memory skills,
        string memory profileLink,
        uint256 hourlyRate,
        bool registered
    ) {
        require(freelancers[_wallet].registered, "Freelancer not found");
        Freelancer memory freelancer = freelancers[_wallet];
        return (freelancer.name, freelancer.skills, freelancer.profileLink, freelancer.hourlyRate, freelancer.registered);
    }

    // 🚀 Get All Registered Freelancers
    function getAllFreelancers() public view returns (Freelancer[] memory) {
        uint256 totalFreelancers = 0;

        // Count registered freelancers
        for (uint256 i = 0; i < freelancerList.length; i++) {
            if (freelancers[freelancerList[i]].registered) {
                totalFreelancers++;
            }
        }

        // Populate the array
        Freelancer[] memory allFreelancers = new Freelancer[](totalFreelancers);
        uint256 index = 0;
        for (uint256 i = 0; i < freelancerList.length; i++) {
            if (freelancers[freelancerList[i]].registered) {
                allFreelancers[index] = freelancers[freelancerList[i]];
                index++;
            }
        }

        return allFreelancers;
    }

    // 🚀 Create Work Contract
    function createContract(address _freelancer, uint256 _amount, uint256 _duration) external payable {
        require(msg.value == _amount, "Payment must match contract amount");
        require(freelancers[_freelancer].registered, "Freelancer not registered");

        contractCount++;
        contracts[contractCount] = WorkContract(msg.sender, _freelancer, _amount, _duration, ContractStatus.Pending, false);

        payable(address(fundTransferContract)).transfer(msg.value);

        emit ContractCreated(contractCount, msg.sender, _freelancer, _amount);
    }

    // 🚀 Approve Work Contract (Freelancer)
    function approveContract(uint256 _contractId) external {
        WorkContract storage work = contracts[_contractId];
        require(msg.sender == work.freelancer, "Only freelancer can approve");
        require(work.status == ContractStatus.Pending, "Invalid contract status");

        work.status = ContractStatus.Approved;
        emit ContractApproved(_contractId);
    }

    // 🚀 Start Work (Client)
    function startWork(uint256 _contractId) external {
        WorkContract storage work = contracts[_contractId];
        require(msg.sender == work.client, "Only client can start work");
        require(work.status == ContractStatus.Approved, "Contract not approved yet");

        work.status = ContractStatus.InProgress;
        emit WorkStarted(_contractId);
    }

    // 🚀 Complete Work (Freelancer)
    function completeWork(uint256 _contractId) external {
        WorkContract storage work = contracts[_contractId];
        require(msg.sender == work.freelancer, "Only freelancer can complete work");
        require(work.status == ContractStatus.InProgress, "Work must be in progress");

        work.status = ContractStatus.Completed;
        emit WorkCompleted(_contractId);
    }

    // 🚀 Release Funds (Client)
    function releaseFunds(uint256 _contractId) external {
        WorkContract storage work = contracts[_contractId];
        require(msg.sender == work.client, "Only client can release funds");
        require(work.status == ContractStatus.Completed, "Work is not completed");
        require(!work.fundsReleased, "Funds already released");

        work.fundsReleased = true; // ✅ Prevent reentrancy attack
        fundTransferContract.releaseEscrow(work.freelancer, work.amount);

        emit FundsReleased(_contractId, work.freelancer);
    }

    // 🚀 Cancel Contract (Client)
    function cancelContract(uint256 _contractId) external {
        WorkContract storage work = contracts[_contractId];
        require(msg.sender == work.client, "Only client can cancel");
        require(work.status == ContractStatus.Pending, "Cannot cancel this contract");

        work.fundsReleased = true;
        fundTransferContract.releaseEscrow(work.client, work.amount);

        delete contracts[_contractId];

        emit ContractCancelled(_contractId, msg.sender);
    }
}
