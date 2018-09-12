const { expectThrow } = require('./helpers/expectThrow');

var HarumiCoin = artifacts.require("./HarumiCoin.sol");

contract('HarumiCoin_ERC20', function(accounts) {
    it('should give coin to deployer when deployment', async function(){
        let harumi = await HarumiCoin.deployed();
        let balance = await harumi.balanceOf.call(accounts[0]);
        let initialSupply = 240000000 * (10 ** 18);
        assert.equal(balance.valueOf(), initialSupply);
    });

    it('should transfer coin', async function(){
        let harumi = await HarumiCoin.deployed();
        await harumi.transfer(accounts[1], 1000); 
        let balance = await harumi.balanceOf.call(accounts[1]);
        assert.equal(balance.valueOf(), 1000);
    });
});

contract('HarumiCoin_ERC20Burnable', function(accounts) {
    it('should reduce token when call burn', async function(){
        let harumi = await HarumiCoin.deployed();
        let initialSupply = 240000000 * (10 ** 18);
        await harumi.burn(10000);
        let balance = await harumi.balanceOf.call(accounts[0]);
        assert.equal(balance.valueOf(), initialSupply - 1000);
    });

    it('should burn other account when call from approve account', async function(){
        let harumi = await HarumiCoin.deployed();
        await harumi.transfer(accounts[1], 1000); 
        await harumi.approve(accounts[0], 500, {'from': accounts[1]});
        await harumi.burnFrom(accounts[1], 500);
        let balance = await harumi.balanceOf.call(accounts[1]);
        assert.equal(balance.valueOf(), 500);
    });

    it('should not burn more than allowed amount', async function(){
        let harumi = await HarumiCoin.deployed();
        await harumi.transfer(accounts[1], 1000); 
        await harumi.approve(accounts[0], 500, {'from': accounts[1]});
        await expectThrow(harumi.burnFrom(accounts[1], 1000)); //more than allowed amount
    });
});

contract('HarumiCoin_ERC20Capped,ERC20Mintable', function(accounts) {
    it('should not mint when have a token over the cap', async function(){
        let harumi = await HarumiCoin.deployed(); //cap: initialSupply + 1000
        let initialSupply = 240000000 * (10 ** 18);
        await expectThrow(harumi.mint(accounts[0], 10000));
    });

    it('should mint when added to minter', async function(){
        let harumi = await HarumiCoin.deployed();
        await harumi.addMinter(accounts[1]);
        let isMinter = await harumi.isMinter(accounts[1]);
        assert.equal(isMinter, true);
        await harumi.mint(accounts[1], 500, {'from': accounts[1]});
        let balance = await harumi.balanceOf.call(accounts[1]);
        assert.equal(balance.valueOf(), 500);
    });

    it('not mint after finishMinting is called', async function(){
        let harumi = await HarumiCoin.deployed();
        await harumi.finishMinting();
        await expectThrow(harumi.mint(accounts[0], 10));
    });
});

contract('HarumiCoin_ERC20Pausable', function(accounts) {
    it('shoukd not send coin while pausing', async function(){
        let harumi = await HarumiCoin.deployed();
        await harumi.pause();
        await expectThrow(harumi.transfer(accounts[1], 1000));
    });

    it('should be canceled pause', async function(){
        let harumi = await HarumiCoin.deployed();
        await expectThrow(harumi.transfer(accounts[1], 1000));
        await harumi.unpause();
        harumi.transfer(accounts[1], 1000);
        let balance = await harumi.balanceOf.call(accounts[1]);
        assert.equal(balance.valueOf(), 1000);
    });
});