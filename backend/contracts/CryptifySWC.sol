// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CryptifySWC {
    enum ContractStatus { Pending, Approved, InProgress, Completed, Cancelled, Disputed }
    enum ContractType { Simple, Milestone }

    struct Milestone {
        string title;
        uint256 amount;
        uint256 deadline;
        bool isCompleted;
        bool isApproved;
        string deliverables;
        uint256 completedTimestamp;
        uint256 approvedTimestamp;
    }

    struct SWCContract {
        address payable creator;
        address payable receiver;
        string title;
        string description;
        uint256 amount;
        string coinType;
        uint256 duration;
        uint256 createdAt;
        uint256 remainingBalance;
        ContractType contractType;
        ContractStatus status;
        bool creatorApproved;
        bool receiverApproved;
        Milestone[] milestones;
    }

    uint256 public contractCounter;
    mapping(uint256 => SWCContract) public contracts;

    bool private locked;
    bool public paused;
    address public owner;
    uint256 public constant MAX_MILESTONES = 10;
    uint256 public constant MAX_DURATION = 365 days;

    // Events
    event ContractFunded(uint256 indexed contractId, uint256 amount);
    event ContractApproved(uint256 indexed contractId);
    event MilestoneAdded(uint256 indexed contractId, uint256 milestoneId);
    event MilestoneCompleted(uint256 indexed contractId, uint256 milestoneId, uint256 timestamp);
    event MilestoneApproved(uint256 indexed contractId, uint256 milestoneId, uint256 timestamp);
    event FundsReleased(uint256 indexed contractId, uint256 milestoneId, uint256 amount);
    event ContractCompleted(uint256 indexed contractId, uint256 timestamp);
    event ContractCancelled(uint256 indexed contractId, uint256 timestamp);
    event ContractDisputed(uint256 indexed contractId, uint256 timestamp);
    event EmergencyPause(bool isPaused);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    modifier onlyCreator(uint256 _contractId) {
        require(msg.sender == contracts[_contractId].creator, "Only creator can perform this action");
        _;
    }

    modifier onlyReceiver(uint256 _contractId) {
        require(msg.sender == contracts[_contractId].receiver, "Only receiver can perform this action");
        _;
    }

    modifier onlyParticipants(uint256 _contractId) {
        require(
            msg.sender == contracts[_contractId].creator || 
            msg.sender == contracts[_contractId].receiver, 
            "Only participants can perform this action"
        );
        _;
    }

    modifier withinDeadline(uint256 _contractId) {
        require(
            block.timestamp <= contracts[_contractId].createdAt + contracts[_contractId].duration,
            "Contract deadline exceeded"
        );
        _;
    }

    modifier contractExists(uint256 _contractId) {
        require(_contractId > 0 && _contractId <= contractCounter, "Contract does not exist");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    modifier noReentrant() {
        require(!locked, "No re-entrancy allowed");
        locked = true;
        _;
        locked = false;
    }

    constructor() {
        owner = msg.sender;
        paused = false;
    }

    receive() external payable {}

    // Contract Management Functions
    function createContract(
        address payable _receiver,
        string memory _title,
        string memory _description,
        string memory _coinType,
        uint256 _duration,
        ContractType _contractType
    ) external payable whenNotPaused {
        require(msg.value > 0, "Contract must be funded");
        require(_receiver != address(0), "Invalid receiver address");
        require(_duration > 0 && _duration <= MAX_DURATION, "Invalid duration");
        require(_receiver != msg.sender, "Cannot create contract with yourself");

        contractCounter++;
        SWCContract storage newContract = contracts[contractCounter];

        newContract.creator = payable(msg.sender);
        newContract.receiver = _receiver;
        newContract.title = _title;
        newContract.description = _description;
        newContract.amount = msg.value;
        newContract.remainingBalance = msg.value;
        newContract.coinType = _coinType;
        newContract.duration = _duration;
        newContract.contractType = _contractType;
        newContract.status = ContractStatus.Pending;
        newContract.createdAt = block.timestamp;

        emit ContractFunded(contractCounter, msg.value);
    }

    function approveContract(uint256 _contractId) 
        external 
        whenNotPaused 
        contractExists(_contractId) 
        withinDeadline(_contractId) 
    {
        SWCContract storage c = contracts[_contractId];
        require(c.status == ContractStatus.Pending, "Contract not pending");
        
        if (msg.sender == c.creator) {
            require(!c.creatorApproved, "Creator already approved");
            c.creatorApproved = true;
        } else if (msg.sender == c.receiver) {
            require(!c.receiverApproved, "Receiver already approved");
            c.receiverApproved = true;
        } else {
            revert("Unauthorized");
        }

        if (c.creatorApproved && c.receiverApproved) {
            c.status = ContractStatus.InProgress;
            emit ContractApproved(_contractId);
        }
    }

    function addMilestone(
        uint256 _contractId,
        string memory _title,
        uint256 _amount,
        uint256 _deadline,
        string memory _deliverables
    ) 
        external 
        whenNotPaused 
        onlyCreator(_contractId) 
        contractExists(_contractId)
        withinDeadline(_contractId) 
    {
        SWCContract storage c = contracts[_contractId];
        require(c.contractType == ContractType.Milestone, "Not a milestone contract");
        require(c.status == ContractStatus.InProgress, "Contract not in progress");
        require(c.milestones.length < MAX_MILESTONES, "Maximum milestones reached");
        require(_deadline > block.timestamp, "Deadline must be future-dated");
        require(_deadline <= c.createdAt + c.duration, "Deadline exceeds contract duration");
        require(_amount <= c.remainingBalance, "Insufficient balance for milestone");

        c.milestones.push(Milestone({
            title: _title,
            amount: _amount,
            deadline: _deadline,
            isCompleted: false,
            isApproved: false,
            deliverables: _deliverables,
            completedTimestamp: 0,
            approvedTimestamp: 0
        }));

        c.remainingBalance -= _amount;
        emit MilestoneAdded(_contractId, c.milestones.length - 1);
    }

    function completeMilestone(uint256 _contractId, uint256 _milestoneId)
        external
        whenNotPaused
        onlyReceiver(_contractId)
        contractExists(_contractId)
        withinDeadline(_contractId)
    {
        SWCContract storage c = contracts[_contractId];
        require(_milestoneId < c.milestones.length, "Invalid milestone ID");
        Milestone storage milestone = c.milestones[_milestoneId];

        require(c.status == ContractStatus.InProgress, "Contract not in progress");
        require(!milestone.isCompleted, "Already completed");
        require(block.timestamp <= milestone.deadline, "Deadline passed");

        milestone.isCompleted = true;
        milestone.completedTimestamp = block.timestamp;
        emit MilestoneCompleted(_contractId, _milestoneId, block.timestamp);
    }

    function approveMilestone(uint256 _contractId, uint256 _milestoneId)
        external
        whenNotPaused
        onlyCreator(_contractId)
        contractExists(_contractId)
        noReentrant
    {
        SWCContract storage c = contracts[_contractId];
        require(_milestoneId < c.milestones.length, "Invalid milestone ID");
        Milestone storage milestone = c.milestones[_milestoneId];

        require(c.status == ContractStatus.InProgress, "Contract not in progress");
        require(milestone.isCompleted, "Milestone not completed");
        require(!milestone.isApproved, "Already approved");

        milestone.isApproved = true;
        milestone.approvedTimestamp = block.timestamp;

        c.receiver.transfer(milestone.amount);
        emit MilestoneApproved(_contractId, _milestoneId, block.timestamp);
        emit FundsReleased(_contractId, _milestoneId, milestone.amount);

        if (allMilestonesApproved(c)) {
            c.status = ContractStatus.Completed;
            emit ContractCompleted(_contractId, block.timestamp);
        }
    }

    function completeSimpleContract(uint256 _contractId)
        external
        whenNotPaused
        onlyCreator(_contractId)
        contractExists(_contractId)
        withinDeadline(_contractId)
        noReentrant
    {
        SWCContract storage c = contracts[_contractId];
        require(c.contractType == ContractType.Simple, "Not a simple contract");
        require(c.status == ContractStatus.InProgress, "Contract not in progress");

        c.status = ContractStatus.Completed;
        c.receiver.transfer(c.amount);
        emit ContractCompleted(_contractId, block.timestamp);
    }

    function cancelContract(uint256 _contractId)
        external
        whenNotPaused
        onlyParticipants(_contractId)
        contractExists(_contractId)
        noReentrant
    {
        SWCContract storage c = contracts[_contractId];
        require(c.status == ContractStatus.Pending, "Can only cancel pending contracts");

        c.status = ContractStatus.Cancelled;
        c.creator.transfer(c.amount);
        emit ContractCancelled(_contractId, block.timestamp);
    }

    function initiateDispute(uint256 _contractId)
        external
        whenNotPaused
        onlyParticipants(_contractId)
        contractExists(_contractId)
    {
        SWCContract storage c = contracts[_contractId];
        require(c.status == ContractStatus.InProgress, "Contract not in progress");
        
        c.status = ContractStatus.Disputed;
        emit ContractDisputed(_contractId, block.timestamp);
    }

    // View Functions
    function allMilestonesApproved(SWCContract storage c) internal view returns (bool) {
        if (c.milestones.length == 0) return false;
        for (uint256 i = 0; i < c.milestones.length; i++) {
            if (!c.milestones[i].isApproved) return false;
        }
        return true;
    }

    function getMilestoneDetails(uint256 _contractId, uint256 _milestoneId)
        external
        view
        contractExists(_contractId)
        returns (
            string memory title,
            uint256 amount,
            uint256 deadline,
            bool isCompleted,
            bool isApproved,
            string memory deliverables,
            uint256 completedTimestamp,
            uint256 approvedTimestamp
        )
    {
        SWCContract storage c = contracts[_contractId];
        require(_milestoneId < c.milestones.length, "Invalid milestone ID");
        Milestone storage m = c.milestones[_milestoneId];
        return (
            m.title,
            m.amount,
            m.deadline,
            m.isCompleted,
            m.isApproved,
            m.deliverables,
            m.completedTimestamp,
            m.approvedTimestamp
        );
    }

    function getContractBalance(uint256 _contractId)
        external
        view
        contractExists(_contractId)
        returns (
            uint256 totalAmount,
            uint256 remainingBalance,
            uint256 releasedAmount
        )
    {
        SWCContract storage c = contracts[_contractId];
        return (
            c.amount,
            c.remainingBalance,
            c.amount - c.remainingBalance
        );
    }

    // Admin Functions
    function pause() external onlyOwner {
        paused = true;
        emit EmergencyPause(true);
    }

    function unpause() external onlyOwner {
        paused = false;
        emit EmergencyPause(false);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }
}