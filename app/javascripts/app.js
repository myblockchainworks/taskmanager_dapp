var accounts;
var account;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshTaskList() {
  listTasks();
};

function setUserDetail() {
  var user = User.deployed();
  user.setUserDetail('Gopal', '9876543210', 'Velachary', {from: account}).then(function() {
    showUserDetail();
    setStatus("User Details Set!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error in updating user details. see log.");
  });
}

function showUserDetail() {
  var user = User.deployed();
  user.getUserDetail.call({from: account}).then(function(detail) {
    var userName_element = document.getElementById("userName");
    var phoneNumber_element = document.getElementById("phoneNumber");
    var homeAddress_element = document.getElementById("homeAddress");
    userName_element.innerHTML = detail[0];
    phoneNumber_element.innerHTML = detail[1];
    homeAddress_element.innerHTML = detail[2];
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting user details; see log.");
  });
}

function addNewTask(){
  var userAccount = document.getElementById("userAccount").value;
  var user = User.deployed();
  var taskName = document.getElementById("taskName").value;
  var taskDesc = document.getElementById("taskDesc").value;
  var taskReward = parseInt(document.getElementById("taskReward").value);
  if (taskName == '') {
    alert ("Task Name is empty!");
    return;
  } else if (taskDesc == '') {
    alert ("Task description is empty!")
    return;
  } else if (isNaN(taskReward)) {
    alert ("Reward is empty!");
    return;
  }
  user.addTask(taskName, taskDesc, taskReward, {from: userAccount, gas: 4712388}).then(function() {
    //var taskcount_element = document.getElementById("taskCount");
    //taskcount_element.innerHTML = value.valueOf();
    //getTask();
    listTasks();
    document.getElementById("taskName").value = '';
    document.getElementById("taskDesc").value = '';
    document.getElementById("taskReward").value = '';
    setStatus("New Task Added!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error in adding new task. see log.");
  });
}

function clearTable(){
   var table = document.getElementById("tasks");
   var rowCount = table.rows.length;
   for (var i = 1; i < rowCount; i++) {
      table.deleteRow(1);
   }
}

function getTaskDetails(taskCount) {
  clearTable();
  var user = User.deployed();
  var index = 1;
  for (var i = 0; i < taskCount; i++){
    user.getTask.call(i, {from: account}).then(function(detail) {
      var table = document.getElementById("tasks");
      var row = table.insertRow(index);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      cell1.innerHTML = (index++);
      cell2.innerHTML = detail[0];
      cell3.innerHTML = detail[1];
      cell4.innerHTML = detail[2].valueOf() + ' ETH';
      var actionButton = "";
      if (detail[3] == false) {
        actionButton = "<button onclick='acceptTaskByOther("+(index-2)+")'>Accept</button>";
      } else if (detail[4] == false) {
        actionButton = "<button onclick='completeTaskByOther("+(index-2)+")'>Complete</button>";
      } else if (detail[5] == false) {
          actionButton = "<button onclick='verifyTaskAndSendRewarByOwner("+(index-2)+")'>Verify and Reward</button>";
      } else {
        actionButton = "Completed and Rewarded";
      }
      cell5.innerHTML = actionButton;
      cell6.innerHTML = detail[6];
    }).catch(function(e) {
      console.log(e);
      setStatus("Error getting task detail; see log.");
    });
  }
}

function acceptTaskByOther(index) {
  var userAccount = document.getElementById("userAccount").value;
  var user = User.deployed();
  user.acceptTask(parseInt(index), {from: userAccount}).then(function() {
    listTasks();
    setStatus("Task Accepted!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error in accepting task. see log.");
  });
}

function completeTaskByOther(index) {
  var userAccount = document.getElementById("userAccount").value;
  var user = User.deployed();
  user.completeTask(parseInt(index), {from: userAccount}).then(function() {
    listTasks();
    setStatus("Task Completed!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error in completing task. see log.");
  });
}

function verifyTaskAndSendRewarByOwner(index) {
  var userAccount = document.getElementById("userAccount").value;
  var user = User.deployed();
  user.verifyTaskAndSendReward(parseInt(index), {from: userAccount}).then(function() {
    listTasks();
    setStatus("Task Verifed and Rewared!");
  }).catch(function(e) {
    console.log(e);
    setStatus("Error in verifing task. see log.");
  });
}


function listTasks() {
  var user = User.deployed();
  user.getTasksCount.call({from: account}).then(function(value) {
    var taskcount_element = document.getElementById("taskCount");
    taskcount_element.innerHTML = value.valueOf();
    getTaskDetails(value.valueOf());
  }).catch(function(e) {
    console.log(e);
    setStatus("Error getting task count; see log.");
  });

}

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
    //setUserDetail();
    showUserDetail();
    listTasks();
  });
}
