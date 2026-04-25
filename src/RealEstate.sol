// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RealEstate {

    struct Property {
        uint id;
        string name;
        uint price;
        address owner;
        bool forSale;
    }

    uint public propertyCount;

    mapping(uint => Property) public properties;

    function addProperty(string memory _name, uint _price) public {
        propertyCount++;

        properties[propertyCount] = Property(
            propertyCount,
            _name,
            _price,
            msg.sender,
            true
        );
    }

    function buyProperty(uint _id) public payable {
        Property storage prop = properties[_id];

        require(prop.forSale, "Not for sale");
        require(msg.value >= prop.price, "Not enough ETH");

        address previousOwner = prop.owner;

        prop.owner = msg.sender;
        prop.forSale = false;

        payable(previousOwner).transfer(msg.value);
    }

    function listForSale(uint _id, uint _price) public {
        Property storage prop = properties[_id];

        require(msg.sender == prop.owner, "Not owner");

        prop.price = _price;
        prop.forSale = true;
    }
}