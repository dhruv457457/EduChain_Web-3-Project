// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface UsernameRegistry {
    function getAddressFromUsername(string memory _username) external view returns (address);
    function getUsernameFromAddress(address _user) external view returns (string memory);
    function isRegistered(address _user) external view returns (bool);
}

contract CryptifySWC {
    enum ContractStatus { Pending, Approved, InProgress, Completed, Cancelled, Disputed }
    enum ContractType { Basic, Milestone }

    struct Milestone { string title; 
    uint256 amount; 
    uint256 deadline;
     bool isCompleted; 
     bool isApproved;
      bool isPaid;
       string deliverables;
        uint256 completedTimestamp;
         uint256 approvedTimestamp; 
         uint256 approvalCooldown; }
    struct SWCContract { address payable creator; 
    address payable receiver;
     string creatorUsername; 
    string receiverUsername;
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
    Milestone[] milestones; }
    struct Proposal { uint256 proposalId;
     uint256 postId;
      address payable proposer;
       string message;
        uint256 timestamp; 
        bool accepted; }

    UsernameRegistry public registry;
    uint256 public contractCounter;
    uint256 public postCounter; uint256 public proposalCounter;
    mapping(uint256 => SWCContract) public contracts; 
    mapping(uint256 => Proposal[]) public postProposals; 
    mapping(address => uint256) public reputationScores;
    bool private locked; bool public paused; 
    address public owner;
    uint256 public constant MAX_MILESTONES = 10; 
    uint256 public constant MAX_DURATION = 365 days;
    uint256 constant MAX_SCORE = 1000;
     uint256 constant BASE_SCORE = 500;

    event ContractCreated(uint256 indexed contractId, address indexed creator, address indexed receiver, string title);
    event ContractFunded(uint256 indexed contractId, uint256 amount);
    event ContractApproved(uint256 indexed contractId);
    event ContractCompleted(uint256 indexed contractId, uint256 timestamp);
    event ProposalSubmitted(uint256 indexed postId, uint256 indexed proposalId);
    event ProposalAccepted(uint256 indexed postId, uint256 indexed proposalId);
    event MilestoneAdded(uint256 indexed contractId, uint256 indexed milestoneId, string title, uint256 amount);
    event MilestoneCompleted(uint256 indexed contractId, uint256 indexed milestoneId);
    event MilestoneApproved(uint256 indexed contractId, uint256 indexed milestoneId);
    event MilestonePaid(uint256 indexed contractId, uint256 indexed milestoneId, uint256 amount);
    event ReputationUpdated(address indexed user, uint256 newScore);

    modifier onlyOwner() { require(msg.sender == owner, "Only owner"); _; }
    modifier whenNotPaused() { require(!paused, "Paused"); _; }
    modifier noReentrant() { require(!locked, "No re-entrancy"); locked = true; _; locked = false; }

    constructor(address _registryAddress) { owner = msg.sender; registry = UsernameRegistry(_registryAddress); }

    receive() external payable {}

    function createContract(string memory _receiverUsername, string memory _title, string memory _description, string memory _coinType, uint256 _duration, ContractType _contractType) public payable whenNotPaused {
        require(msg.value > 0, "Funding required");
        address payable receiver = payable(registry.getAddressFromUsername(_receiverUsername));
        require(receiver != address(0) && receiver != msg.sender, "Invalid receiver");
        require(_duration > 0 && _duration <= MAX_DURATION, "Invalid duration");
        require(registry.isRegistered(msg.sender), "Sender not registered");
        contractCounter++;
        SWCContract storage newContract = contracts[contractCounter];
        newContract.creator = payable(msg.sender);
        newContract.receiver = receiver;
        newContract.creatorUsername = registry.getUsernameFromAddress(msg.sender);
        newContract.receiverUsername = _receiverUsername;
        newContract.title = _title;
        newContract.description = _description;
        newContract.amount = msg.value;
        newContract.remainingBalance = msg.value;
        newContract.coinType = _coinType;
        newContract.duration = _duration;
        newContract.contractType = _contractType;
        newContract.status = ContractStatus.Pending;
        newContract.createdAt = block.timestamp;
        emit ContractCreated(contractCounter, msg.sender, receiver, _title);
        emit ContractFunded(contractCounter, msg.value);
    }

    function approveContract(uint256 _contractId) external {
        SWCContract storage c = contracts[_contractId];
        require(msg.sender == c.creator || msg.sender == c.receiver, "Not a party");
        if (msg.sender == c.creator) c.creatorApproved = true; else c.receiverApproved = true;
        if (c.creatorApproved && c.receiverApproved) { c.status = ContractStatus.Approved; emit ContractApproved(_contractId); }
    }

    function addMilestone(uint256 _contractId, string memory _title, uint256 _amount, uint256 _deadline, string memory _deliverables) external {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0) && msg.sender == c.creator, "Unauthorized");
        require(c.milestones.length < MAX_MILESTONES && _deadline > block.timestamp, "Invalid milestone");
        uint256 sum = _amount; for (uint i = 0; i < c.milestones.length; i++) sum += c.milestones[i].amount;
        require(sum <= c.amount, "Exceeds funding");
        c.milestones.push(Milestone(_title, _amount, _deadline, false, false, false, _deliverables, 0, 0, 0));
        emit MilestoneAdded(_contractId, c.milestones.length - 1, _title, _amount);
    }

    function completeMilestone(uint256 _contractId, uint256 _milestoneId) external {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0) && msg.sender == c.creator, "Unauthorized");
        Milestone storage m = c.milestones[_milestoneId];
        require(!m.isCompleted, "Already completed");
        m.isCompleted = true; m.completedTimestamp = block.timestamp;
        emit MilestoneCompleted(_contractId, _milestoneId);
        if (c.status < ContractStatus.InProgress) c.status = ContractStatus.InProgress;
        _updateReputation(c.creator, 10, true);
    }

    function approveMilestone(uint256 _contractId, uint256 _milestoneId) external {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0) && msg.sender == c.receiver, "Unauthorized");
        Milestone storage m = c.milestones[_milestoneId];
        require(m.isCompleted && !m.isApproved, "Invalid state");
        m.isApproved = true; m.approvedTimestamp = block.timestamp; m.approvalCooldown = block.timestamp + 1 days;
        emit MilestoneApproved(_contractId, _milestoneId);
    }

    function releaseMilestonePayment(uint256 _contractId, uint256 _milestoneId) external noReentrant {
        SWCContract storage c = contracts[_contractId];
        require(c.status >= ContractStatus.Approved, "Not approved");
        require(msg.sender == c.receiver || msg.sender == c.creator, "Not a party");
        Milestone storage m = c.milestones[_milestoneId];
        require(m.isApproved && !m.isPaid && m.amount <= c.remainingBalance, "Invalid milestone");
        c.remainingBalance -= m.amount;
        (bool sent, ) = c.receiver.call{value: m.amount}("");
        require(sent, "Payment fail");
        m.isPaid = true;
        emit MilestonePaid(_contractId, _milestoneId, m.amount);
        if (c.remainingBalance == 0) { c.status = ContractStatus.Completed; emit ContractCompleted(_contractId, block.timestamp); _updateReputation(c.receiver, 20, true); _updateReputation(c.creator, 20, true); }
    }

    function _updateReputation(address _user, uint256 _points, bool _positive) internal {
        uint256 score = reputationScores[_user] == 0 ? BASE_SCORE : reputationScores[_user];
        if (_positive) { score += _points; if (score > MAX_SCORE) score = MAX_SCORE; }
        else { score = score > _points ? score - _points : 0; }
        reputationScores[_user] = score;
        emit ReputationUpdated(_user, score);
    }

    function getReputation(address _user) external view returns (uint256) {
        return reputationScores[_user] == 0 ? BASE_SCORE : reputationScores[_user];
    }

    function getContractDetails(uint256 _contractId) public view returns (address, address, string memory, string memory, string memory, string memory, uint256, string memory, uint256, uint256, uint256, ContractType, ContractStatus, bool, bool) {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0), "Not found");
        return (c.creator, c.receiver, c.creatorUsername, c.receiverUsername, c.title, c.description, c.amount, c.coinType, c.duration, c.createdAt, c.remainingBalance, c.contractType, c.status, c.creatorApproved, c.receiverApproved);
    }

    function getMilestones(uint256 _contractId) public view returns (Milestone[] memory) {
        SWCContract storage c = contracts[_contractId];
        require(c.creator != address(0), "Not found");
        return c.milestones;
    }
}
