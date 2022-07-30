// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    //Variable de estado, se almacena de forma permanente en el almacenamiento por contrato.

    constructor() {
        console.log("Hi!! I'm a contract");
    }

    function wave() public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender); //La persona que llamo a la funcion;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have $d total waves!!", totalWaves);
        return totalWaves;
    }
}
