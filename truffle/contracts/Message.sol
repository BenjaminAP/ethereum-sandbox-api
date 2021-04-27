pragma solidity >=0.4.24 <0.9.0;

contract Message {

    string my_message;

    function setMessage(string memory msg) public {
        my_message = msg;
    }

    function getMessage() public view returns (string memory) {
        return my_message;
    }
}
