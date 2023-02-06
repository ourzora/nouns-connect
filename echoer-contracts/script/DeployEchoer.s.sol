// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {console2} from "forge-std/console2.sol";

import {NounsConnectEchoer} from "../src/NounsConnectEchoer.sol";

import {ImmutableDeployerBase} from "./ImmutableDeployerBase.sol";

contract DeployRegistry is ImmutableDeployerBase {
    function run() public {
        setUp();
        bytes memory creationCode = type(NounsConnectEchoer).creationCode;
        console2.log("Creation code hash: ");
        console2.logBytes32(keccak256(creationCode));
        bytes32 salt = bytes32(0x0000000000000000000000000000000000000000170caad02cd6c2020bbe91b6);

        vm.broadcast(deployer);
        IMMUTABLE_CREATE2_FACTORY.safeCreate2(salt, creationCode);
    }
}