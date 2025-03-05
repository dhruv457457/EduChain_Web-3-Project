// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CryptifySWC {
    enum ContractStatus { Pending, Approved, InProgress, Completed, Cancelled, Disputed }
    enum ContractType { Basic, Milestone }

    struct Milestone {
        string title;
        uint256 amount;
        uint256 deadline;
        bool isCompleted;
        bool isApproved;
        bool isPaid;
        string deliverables;
        uint256 completedTimestamp;
        uint256 approvedTimestamp;
        uint256 approvalCooldown; // Added cooldown period
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

    struct WorkPost {
        uint256 postId;
        address payable creator;
        string title;
        string description;
        uint256 budget;
        uint256 duration;
        bool isOpen;
    }

    struct Proposal {
        uint256 proposalId;
        uint256 postId;
        address payable proposer;
        string message;
        uint256 timestamp;
        bool accepted;
    }

    uint256 public contractCounter;
    uint256 public postCounter;
    uint256 public proposalCounter;

    mapping(uint256 => SWCContract) public contracts;
    mapping(uint256 => WorkPost) public workPosts;
    mapping(uint256 => Proposal[]) public postProposals;

    bool private locked;
    bool public paused;
    address public owner;
    uint256 public constant MAX_MILESTONES = 10;
    uint256 public constant MAX_DURATION = 365 days;

    // Events
    event ContractFunded(uint256 indexed contractId, uint256 amount);
    event ContractApproved(uint256 indexed contractId);
    event ContractCompleted(uint256 indexed contractId, uint256 timestamp);
    event WorkPostCreated(uint256 indexed postId);
    event ProposalSubmitted(uint256 indexed postId, uint256 indexed proposalId);
    event ProposalAccepted(uint256 indexed postId, uint256 indexed proposalId);
    event ContractCreated(uint256 indexed contractId, address indexed creator, address indexed receiver, string title);
    event MilestoneAdded(uint256 indexed contractId, uint256 indexed milestoneId, string title, uint256 amount);
    event MilestoneCompleted(uint256 indexed contractId, uint256 indexed milestoneId);
    event MilestoneApproved(uint256 indexed contractId, uint256 indexed milestoneId);
    event MilestonePaid(uint256 indexed contractId, uint256 indexed milestoneId, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
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

    // Option 1: Direct Contract Creation
    function createContract(
        address payable _receiver,
        string memory _title,
        string memory _description,
        string memory _coinType,
        uint256 _duration,
        ContractType _contractType
    ) public payable whenNotPaused {
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

        emit ContractCreated(contractCounter, msg.sender, _receiver, _title);
        emit ContractFunded(contractCounter, msg.value);
    }

    // Approve Contract by Creator or Receiver
    function approveContract(uint256 _contractId) external {
        SWCContract storage c = contracts[_contractId];
        require(msg.sender == c.creator || msg.sender == c.receiver, "Not a party");
        if (msg.sender == c.creator) {
            c.creatorApproved = true;
        } else {
            c.receiverApproved = true;
        }
        if (c.creatorApproved && c.receiverApproved) {
            c.status = ContractStatus.Approved;
            emit ContractApproved(_contractId);
        }
    }

    // Add Milestone to Contract
    function addMilestone(
        uint256 _contractId,
        string memory _title,
        uint256 _amount,
        uint256 _deadline,
        string memory _deliverables
    ) external {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0), "Contract does not exist");
        require(msg.sender == c.creator, "Only creator can add milestones");
        require(c.milestones.length < MAX_MILESTONES, "Maximum milestones reached");
        require(_deadline > block.timestamp, "Deadline must be in the future"); // Added check

        // Ensure milestone amount does not exceed remaining balance
        uint256 totalMilestones = c.amount;
        uint256 sum = _amount;
        for (uint i = 0; i < c.milestones.length; i++) {
            sum += c.milestones[i].amount;
        }
        require(sum <= totalMilestones, "Exceeds contract amount");

        c.milestones.push(Milestone({
            title: _title,
            amount: _amount,
            deadline: _deadline,
            isCompleted: false,
            isApproved: false,
            isPaid: false,
            deliverables: _deliverables,
            completedTimestamp: 0,
            approvedTimestamp: 0,
            approvalCooldown: 0 // Initialize cooldown
        }));

        emit MilestoneAdded(_contractId, c.milestones.length - 1, _title, _amount);
    }

    // Approve Milestone by Receiver
    function approveMilestone(uint256 _contractId, uint256 _milestoneId) external {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0), "Contract does not exist");
        require(_milestoneId < c.milestones.length, "Milestone does not exist");
        require(msg.sender == c.receiver, "Only receiver can approve milestones");

        Milestone storage m = c.milestones[_milestoneId];
        require(m.isCompleted, "Milestone is not completed");
        require(!m.isApproved, "Milestone already approved");

        m.isApproved = true;
        m.approvedTimestamp = block.timestamp;
        m.approvalCooldown = block.timestamp + 1 days; // Set cooldown period

        emit MilestoneApproved(_contractId, _milestoneId);

        // Update contract status
        if (c.status < ContractStatus.InProgress) {
            c.status = ContractStatus.InProgress;
        }
    }

    // Complete Milestone by Creator
    function completeMilestone(uint256 _contractId, uint256 _milestoneId) external {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0), "Contract does not exist");
        require(_milestoneId < c.milestones.length, "Milestone does not exist");
        require(msg.sender == c.creator, "Only creator can complete milestones");

        Milestone storage m = c.milestones[_milestoneId];
        require(!m.isCompleted, "Milestone already completed");

        m.isCompleted = true;
        m.completedTimestamp = block.timestamp;

        emit MilestoneCompleted(_contractId, _milestoneId);

        // Update contract status
        if (c.status < ContractStatus.InProgress) {
            c.status = ContractStatus.InProgress;
        }
    }

    // Release Payment for Approved Milestone
    function releaseMilestonePayment(uint256 _contractId, uint256 _milestoneId) external noReentrant {
        SWCContract storage c = contracts[_contractId];
        require(c.status >= ContractStatus.Approved, "Contract not approved"); // Fixed line
        require(msg.sender == c.receiver || msg.sender == c.creator, "Not a party");

        Milestone storage m = c.milestones[_milestoneId];
        require(m.isApproved, "Milestone not approved");
        require(!m.isPaid, "Already paid");
        require(m.amount <= c.remainingBalance, "Insufficient balance");

        c.remainingBalance -= m.amount;
        (bool sent, ) = c.receiver.call{value: m.amount}("");
        require(sent, "Payment failed");
        m.isPaid = true;

        emit MilestonePaid(_contractId, _milestoneId, m.amount);

        if (c.remainingBalance == 0) {
            c.status = ContractStatus.Completed;
        }
    }

    // Option 2: Worker Search & Proposal System
    function createWorkPost(
        string memory _title,
        string memory _description,
        uint256 _budget,
        uint256 _duration
    ) external whenNotPaused {
        require(_budget > 0, "Budget must be greater than zero");
        require(_duration > 0 && _duration <= MAX_DURATION, "Invalid duration");

        postCounter++;
        workPosts[postCounter] = WorkPost({
            postId: postCounter,
            creator: payable(msg.sender),
            title: _title,
            description: _description,
            budget: _budget,
            duration: _duration,
            isOpen: true
        });

        emit WorkPostCreated(postCounter);
    }

    function submitProposal(uint256 _postId, string memory _message) external whenNotPaused {
        require(workPosts[_postId].isOpen, "Post is not open");
        require(msg.sender != workPosts[_postId].creator, "Cannot propose on your own post");

        proposalCounter++;
        postProposals[_postId].push(Proposal({
            proposalId: proposalCounter,
            postId: _postId,
            proposer: payable(msg.sender),
            message: _message,
            timestamp: block.timestamp,
            accepted: false
        }));

        emit ProposalSubmitted(_postId, proposalCounter);
    }

    function acceptProposal(uint256 _postId, uint256 _proposalId) external payable whenNotPaused noReentrant {
        WorkPost storage post = workPosts[_postId];
        require(msg.sender == post.creator, "Only post creator can accept proposals");
        require(post.isOpen, "Post already closed");

        Proposal storage proposal = postProposals[_postId][_proposalId - 1];
        require(!proposal.accepted, "Proposal already accepted");
        require(msg.value == post.budget, "Funding must match budget");

        proposal.accepted = true;
        post.isOpen = false;

        // Transition to direct contract flow
        createContract(
            proposal.proposer,
            post.title,
            post.description,
            "EDU Coin",
            post.duration,
            ContractType.Basic
        );

        emit ProposalAccepted(_postId, _proposalId);
    }

    // Admin Functions
    function pause() external onlyOwner {
        paused = true;
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid new owner address");
        owner = newOwner;
    }

    // Contract Details
    function getContractDetails(uint256 _contractId) public view returns (
        address creator,
        address receiver,
        string memory title,
        string memory description,
        uint256 amount,
        string memory coinType,
        uint256 duration,
        uint256 createdAt,
        uint256 remainingBalance,
        ContractType contractType,
        ContractStatus status,
        bool creatorApproved,
        bool receiverApproved
    ) {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0), "Contract does not exist");

        return (
            c.creator,
            c.receiver,
            c.title,
            c.description,
            c.amount,
            c.coinType,
            c.duration,
            c.createdAt,
            c.remainingBalance,
            c.contractType,
            c.status,
            c.creatorApproved,
            c.receiverApproved
        );
    }

    // Get Milestones for a Contract
    function getMilestones(uint256 _contractId) public view returns (Milestone[] memory) {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0), "Contract does not exist");
        return c.milestones;
    }
}