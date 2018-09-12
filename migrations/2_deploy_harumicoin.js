var HarumiCoin = artifacts.require("./HarumiCoin.sol");

module.exports = function(deployer) {
    deployer.deploy(HarumiCoin);
}
