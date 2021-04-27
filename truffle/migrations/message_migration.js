let Message = require('../contracts/Message.sol');

module.exports = function (deployer) {
    deployer.deploy(Message);
}
