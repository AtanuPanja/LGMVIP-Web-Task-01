const titleInput = document.querySelector(".addTitle__input");
const addBtn = document.querySelector(".addTitle__btn");
const tasksList = document.querySelector(".tasksList");


function createTask(taskTitle,taskNumber,taskCompletedStatus){
    let taskClassString = "taskHeading";
    
    let checkImg = "images/unchecked.png";
    if(taskCompletedStatus) {
        taskClassString = "taskHeading markCompleted";
        
        checkImg = "images/checked.png";
    }
    return `
    <div class="tasksList__entry" id = "task${taskNumber}">
        <button class="taskComplete" id="taskbtn${taskNumber}"><img src="${checkImg}"/></button>
        <div class="${taskClassString}">
            ${taskTitle}
        </div>
        <button class="taskDelete" id="taskdel${taskNumber}"><img src="images/recycle-bin.png"/></button>
    </div>
    `;
}

// Render the task list everytime it is updated
function renderTasksList(arr) {
    let tasksListHTML;
    if(arr && arr.length !== 0) {
        arr.forEach((element,index) => {
            if(index === 0)
                tasksListHTML = createTask(element.title,element.number,element.completed);
            else
                tasksListHTML = createTask(element.title,element.number,element.completed) + tasksListHTML;
        })
    }
    else {
        tasksListHTML = `<p class="tasksList__entry" style="padding: 1.5rem">No tasks added yet</p>`;
    }
    tasksList.innerHTML = tasksListHTML;
}

// TODO: Add task
addBtn.addEventListener('click',(event)=>{
    event.preventDefault();

    if(event.target.parentNode[0].value){
        let previousLocalTaskList = localStorage.getItem("tasksList");
        let arr = JSON.parse(previousLocalTaskList);
        arr = arr ? arr : [];
        const newTaskEntry = {}; 
        newTaskEntry.title = event.target.parentNode[0].value;
        let maxTaskNumberTillNow = 0;
        
        let taskNumbersArr = arr.map(element => parseInt(element.number));
        if(arr.length != 0)
            maxTaskNumberTillNow = taskNumbersArr.reduce((a,b)=> (a>b ? a : b));
        newTaskEntry.number = maxTaskNumberTillNow+1;
        newTaskEntry.completed = false;
        arr.push(newTaskEntry);
        
        event.target.parentNode[0].value = "";
        localStorage.setItem("tasksList",JSON.stringify(arr));
    
        renderTasksList(JSON.parse(localStorage.getItem("tasksList")));
        addCompleteTaskListener();
        addDeleteTaskListener();
    }
})

// TODO: Complete task

function addCompleteTaskListener() {
    let taskCompleteButtons = document.querySelectorAll(".taskComplete > img");
    let localStorageTasksList = JSON.parse(localStorage.getItem("tasksList"));
    taskCompleteButtons.forEach((button) => {
        button.addEventListener("click",(event)=>{
            
            let taskNumber = parseInt((event.target.parentNode.id).substring(7));
            
            localStorageTasksList = localStorageTasksList.map(element => {
                
                if(element.number === taskNumber){
                    element.completed = !element.completed;
                }
                return element;
            })
            
            localStorage.setItem("tasksList",JSON.stringify(localStorageTasksList));
            localStorageTasksList = JSON.parse(localStorage.getItem("tasksList"));
            renderTasksList(localStorageTasksList);
            addCompleteTaskListener();
            addDeleteTaskListener();
        })
    })
}

// TODO: Delete task

function addDeleteTaskListener() {
    let taskDeleteButtons = document.querySelectorAll(".taskDelete > img");
    let localStorageTasksList = JSON.parse(localStorage.getItem("tasksList"));
    
    taskDeleteButtons.forEach(button => {
        button.addEventListener("click",(event)=> {
            let isConfirm = confirm("Do you confirm deleting this todo?");
            if(isConfirm) {

                let taskNumber = parseInt((event.target.parentNode.id).substring(7));
                
                localStorageTasksList = localStorageTasksList.filter(element => (element.number != taskNumber))
                
                localStorage.setItem("tasksList",JSON.stringify(localStorageTasksList));
                localStorageTasksList = JSON.parse(localStorage.getItem("tasksList"));
                renderTasksList(localStorageTasksList);
                addCompleteTaskListener();
                addDeleteTaskListener();
            }
        })
    })
}

// Calling the render methods and the event handler methods once, when the website first loads

renderTasksList(JSON.parse(localStorage.getItem("tasksList")));
addCompleteTaskListener();
addDeleteTaskListener();