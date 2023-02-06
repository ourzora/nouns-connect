// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {console2} from "forge-std/console2.sol";

import {NounsConnectEchoer} from "../src/NounsConnectEchoer.sol";

import {ImmutableDeployerBase} from "./ImmutableDeployerBase.sol";

contract DeployRegistry is ScriptBase {
    function run() public {
        setUp();
        bytes memory creationCode = type(JSONExtensionRegistry).creationCode;
        console2.logBytes32(keccak256(creationCode));
        bytes32 salt = bytes32(0x0000000000000000000000000000000000000000dcfbbaa66376ca0378b91b7c);

        vm.broadcast(deployer);
        IMMUTABLE_CREATE2_FACTORY.safeCreate2(salt, creationCode);
    }
}