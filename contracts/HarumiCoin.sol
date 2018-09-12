pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Burnable.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Pausable.sol";

contract HarumiCoin is ERC20Detailed, ERC20Mintable, ERC20Burnable, ERC20Capped, ERC20Pausable {

    uint256 public constant INITIAL_SUPPLY = 240000000 * (10 ** 18);

    constructor()
    ERC20Burnable()
    ERC20Detailed("HarumiCoin", "HARU", 18)
    ERC20Mintable()
    ERC20Capped(INITIAL_SUPPLY + 1000)
    ERC20Pausable() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
