// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Investment {
    struct Startup {
        string name;
        string description;
        uint256 fundingGoal;
        uint256 fundsRaised;
        address owner;
    }

    mapping(uint256 => Startup) public startups;
    uint256 public startupCount;

    function createStartup(string memory _name, string memory _description, uint256 _goal) public {
        startupCount++;
        startups[startupCount] = Startup(_name, _description, _goal, 0, msg.sender);
    }

    function invest(uint256 _startupId) public payable {
        require(startups[_startupId].fundingGoal > 0, "Startup does not exist");
        startups[_startupId].fundsRaised += msg.value;
    }
}
