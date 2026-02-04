// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract Burn {
    address constant BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;
    address public token;

    constructor(address _token) {
        token = _token;
    }

    function burn(uint256 amount) external {
        IERC20(token).transferFrom(
            msg.sender,
            BURN_ADDRESS,
            amount
        );
    }
}