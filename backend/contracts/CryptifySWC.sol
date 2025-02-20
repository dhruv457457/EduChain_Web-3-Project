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
    event MilestoneApproved(uint256 indexed contractId, uint256 indexed milestoneId);
    event MilestoneCompleted(uint256 indexed contractId, uint256 indexed milestoneId);

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
        SWCContract storage contractData = contracts[_contractId];
        require(contractData.creator != address(0), "Contract does not exist");

        return (
            contractData.creator,
            contractData.receiver,
            contractData.title,
            contractData.description,
            contractData.amount,
            contractData.coinType,
            contractData.duration,
            contractData.createdAt,
            contractData.remainingBalance,
            contractData.contractType,
            contractData.status,
            contractData.creatorApproved,
            contractData.receiverApproved
        );
    }

    // Milestone Management
    function addMilestone(
        uint256 _contractId,
        string memory _title,
        uint256 _amount,
        uint256 _deadline,
        string memory _deliverables
    ) external {
        SWCContract storage contractData = contracts[_contractId];
        require(contractData.creator != address(0), "Contract does not exist");
        require(msg.sender == contractData.creator, "Only creator can add milestones");
        require(contractData.milestones.length < MAX_MILESTONES, "Maximum milestones reached");

        contractData.milestones.push(Milestone({
            title: _title,
            amount: _amount,
            deadline: _deadline,
            isCompleted: false,
            isApproved: false,
            deliverables: _deliverables,
            completedTimestamp: 0,
            approvedTimestamp: 0
        }));

        emit MilestoneAdded(_contractId, contractData.milestones.length - 1, _title, _amount);
    }

    function approveMilestone(uint256 _contractId, uint256 _milestoneId) external {
        SWCContract storage contractData = contracts[_contractId];
        require(contractData.creator != address(0), "Contract does not exist");
        require(_milestoneId < contractData.milestones.length, "Milestone does not exist");
        require(msg.sender == contractData.receiver, "Only receiver can approve milestones");

        Milestone storage milestone = contractData.milestones[_milestoneId];
        milestone.isApproved = true;
        milestone.approvedTimestamp = block.timestamp;

        emit MilestoneApproved(_contractId, _milestoneId);
    }

    function completeMilestone(uint256 _contractId, uint256 _milestoneId) external {
        SWCContract storage contractData = contracts[_contractId];
        require(contractData.creator != address(0), "Contract does not exist");
        require(_milestoneId < contractData.milestones.length, "Milestone does not exist");
        require(msg.sender == contractData.creator, "Only creator can complete milestones");

        Milestone storage milestone = contractData.milestones[_milestoneId];
        milestone.isCompleted = true;
        milestone.completedTimestamp = block.timestamp;

        emit MilestoneCompleted(_contractId, _milestoneId);
    }
}