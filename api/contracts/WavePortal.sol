// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    //Variable de estado, se almacena de forma permanente en el almacenamiento por contrato.

    event NewWave(address indexed from, uint256 timestamp, string message);

    // A struct is basically a custom datatype where we can customize what we want
    // to hold inside it.

    struct Wave {
        address waver; //The address of the user who waved
        string message; //The message the user sent
        uint256 timestamp; //The timestamp when the user waved
    }

    // I declare a variable waves that lets me store an array of structs.
    // This is what lets me hold the waves anyone ever sends to me!

    Wave[] waves;

    constructor() {
        console.log("Hi!! I'm a contract");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender, _message); //La persona que llamo a la funcion;

        waves.push(Wave(msg.sender, _message, block.timestamp));

        emit NewWave(msg.sender, block.timestamp, _message);
    }

    //which will return the struct array waves, to us.

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have $d total waves!!", totalWaves);
        return totalWaves;
    }
}
