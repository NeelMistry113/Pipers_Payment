// SPDX-License-Identifier: unlicense

pragma solidity >= 0.7.0;

contract pipers {
    event transactions(address indexed from, address to, uint amount, string symbol);
    event recipeints(address indexed  recipientof, address recipient, string recipentName);

    function _transfer(address payable _to, string memory symbol) public payable {
        _to.transfer(msg.value);
        emit transactions(msg.sender, _to, msg.value, symbol);
    }

    function saveTx(address from, address to, uint amount, string memory symbol) public {
        emit transactions(from, to, amount, symbol);
    }

    function addRecipient(address recipient, string memory name) public {
        emit recipeints(msg.sender, recipient, name);
    }
}

// 0xD43E17ae054c60FB2e9B9afB7e54d630b73DfF04 polygon network
// 0x698c6DFc6692e7cb17369A4d206c93F0BD137835 Ropsten network
// 0x0c6C6cf873123Ccd93BcE6afFB6fA9D3740C50be Rinkeby network