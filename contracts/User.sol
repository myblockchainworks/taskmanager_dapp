pragma solidity ^0.4.6;

// Base contract for User
contract UserBase {
	address public owner; // address of the user object

	function UserBase() {
		owner = msg.sender;
	}

	// modifier to allow only owner has full control on the function
	modifier onlyOwnder {
		if (msg.sender != owner) {
			throw;
		} else {
			_;
		}
	}

	// Delete / kill the contract... only the owner has rights to do this
	function kill() onlyOwnder {
		suicide(owner);
	}
}

// User contract
contract User is UserBase {

	string public phoneNumber;

	string public homeAddress;

	string public fullName;

	function User(string _name, string _phoneNumber, string _homeAddress) {
		fullName = _name;
		phoneNumber = _phoneNumber;
		homeAddress = _homeAddress;
	}

	// Set user with name, phoneNumber, and homeAddress
	function setUserDetail(string _name, string _phoneNumber, string _homeAddress) onlyOwnder {
		fullName = _name;
		homeAddress = _homeAddress;
		phoneNumber = _phoneNumber;
	}

	function getUserDetail() public constant returns (string, string, string) {
		return (fullName, phoneNumber, homeAddress);
	}

	// Task object
	struct Task {
		string name;
		string description;
		uint createdDate;
		bool taskCompleted;
		bool taskAccepted;
		address completedBy;
		uint updatedDate;
		bool completedVerified;
		uint256 reward;
		bool sentReward;
	}

	//uint index;
	//mapping(uint=>Task) public tasks; // create a task list with uint as indexing

	Task[] public tasks;

	// Create a task by owner and return the task id
	function addTask(string _name, string _desc, uint256 _taskReward) onlyOwnder  {

		uint task_id = tasks.length++;

		tasks[task_id].name = _name;
		tasks[task_id].description = _desc;
		tasks[task_id].createdDate = now;
		tasks[task_id].taskCompleted = false;
		tasks[task_id].taskAccepted = false;
		tasks[task_id].completedBy = 0x123;
		tasks[task_id].updatedDate = now;
		tasks[task_id].completedVerified = false;
		tasks[task_id].reward = _taskReward;
		tasks[task_id].sentReward = false;

	//	return tasks.length;
	}

	function getTasksCount() public constant returns (uint) {
		return tasks.length;
	}

	function getTask(uint index) public constant returns(string, string, uint256, bool, bool, bool, address) {
		return (tasks[index].name, tasks[index].description, tasks[index].reward, tasks[index].taskAccepted, tasks[index].taskCompleted, tasks[index].completedVerified, tasks[index].completedBy);
	}

	// Any user can respondToTask and mark the status as completed
	function acceptTask(uint index) payable {
		if (tasks.length > index) {
			if (tasks[index].taskAccepted == false) {
				tasks[index].taskAccepted = true;
				tasks[index].updatedDate = now;
				tasks[index].completedBy = msg.sender;
			}
		}
	}

	function completeTask(uint index) payable {
		if (tasks.length > index) {
			if (tasks[index].taskAccepted == true  && tasks[index].completedBy == msg.sender) {
				tasks[index].taskCompleted = true;
				tasks[index].updatedDate = now;
			}
		}
	}

	// Owner user only can verify the task completed status and send reward to the user one who completed
	function verifyTaskAndSendReward(uint index) onlyOwnder {

		if (tasks.length > index) {
			if (tasks[index].taskCompleted && tasks[index].completedVerified == false) {
				if (owner.balance >= tasks[index].reward) {
					tasks[index].completedVerified = true;
					tasks[index].updatedDate = now;
					address user2 = tasks[index].completedBy;
					if (user2.send(tasks[index].reward)) {
						tasks[index].sentReward = true;
						throw;
					}
				}
			}
		}
	}
}
