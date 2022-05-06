const add=document.querySelector(".add-btn");
const remove=document.querySelector(".remove-btn");
let flag=false;
let removeFlag=false;
//const warning=document.querySelector(".warning");
let main=document.querySelector(".main-cont");
const modal=document.querySelector(".modal");
let colors=["pink","green","blue","purple"];
let allColors=document.querySelectorAll(".modal-color");
let modalPriorityColor=colors[0];
const textArea=document.querySelector("textarea");
let toolBoxColors = document.querySelectorAll(".color");
let lock="fa-lock";
let unlock="fa-lock-open";
let ticketsArr = [];

if(localStorage.getItem("jira_tickets")){
    //displaying stored tickets
    ticketsArr=JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketObj)=>{
        createTicket(ticketObj.color,ticketObj.text,ticketObj.ticketID);
    })
}

for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.color;
        })

        // Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }
        // Display new filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.color, ticketObj.text, ticketObj.ticketID);
        })
    })

    toolBoxColors[i].addEventListener("dblclick", (e) => {
        // Remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }

        ticketsArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.color, ticketObj.text, ticketObj.ticketID);
        })
    })
}



allColors.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        allColors.forEach((elem)=>{
            elem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor=colorElem.classList[1];
    })
})

add.addEventListener("click",(e)=>{
    flag=!flag;
    if(flag)
        modal.style.display="flex";
    else
        modal.style.display="none";
})
remove.addEventListener("click",(e)=>{
    removeFlag=!removeFlag;

    //console.log(removeFlag)
})
textArea.addEventListener("keydown",(e)=>{
    const myKey=e.key;
    if(myKey=="Shift"){
        createTicket(modalPriorityColor,textArea.value);
        modal.style.display="none";
        flag=false;
        textArea.value="";
    }
})
function createTicket(color,text,ticketID){  
    let id = ticketID || shortid();
    let ticket=document.createElement("div");
    ticket.setAttribute("class","ticket-cont");
    ticket.innerHTML=`
    <div class="ticket-color ${color}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="ticket-task">${text}</div>
    <div class="ticket-lock">
    <i class="fas fa-lock"></i>
</div>
    `;
    main.appendChild(ticket);
    handleRemoval(ticket,id);
    handleLock(ticket,id);
    handleColor(ticket,id);
    if (!ticketID) {
        ticketsArr.push({ color, text, ticketID: id });
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    }
}

function handleRemoval(ticket,id){
    ticket.addEventListener("click", (e) => {
        if (!removeFlag){
            return;
        }
        let idx=getTicketIdx(id);
        //DB removal
        ticketsArr.splice(idx,1);
        let strTicketsArr=JSON.stringify(ticketsArr);
        localStorage.setItem("jira_tickets",strTicketsArr);
        //UI removal
        ticket.remove();

    })
}
function handleLock(ticket,id){
    let ticketLock=ticket.querySelector(".ticket-lock");
    let ticketLockElem=ticketLock.children[0];
    let ticketTaskArea=ticket.querySelector(".ticket-task");
    ticketLockElem.addEventListener("click",(e)=>{
        let ticketIdx=getTicketIdx(id);
        console.log("why");
        if(ticketLockElem.classList.contains(lock)){
            ticketLockElem.classList.remove(lock);
            ticketLockElem.classList.add(unlock);
            ticketTaskArea.setAttribute("contenteditable","true");
        }else{
            ticketLockElem.classList.remove(unlock);
            ticketLockElem.classList.add(lock);
            ticketTaskArea.setAttribute("contenteditable","false");
        }
        //Modify data in LocalStorage
        ticketsArr[ticketIdx].text=ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    })
}
function handleColor(ticket,id){
    let ticketColor=ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click",(e)=>{
        let ticketIdx=getTicketIdx(id);
        let currColor=ticketColor.classList[1];
        let currColorIdx=colors.findIndex((color)=>{
            return currColor==color;
        })
        currColorIdx++;
        let newColorIdx=currColorIdx%colors.length;
        let newColor=colors[newColorIdx]; 
        ticketColor.classList.remove(currColor);
        ticketColor.classList.add(newColor);
        //changing data in localStorage
        ticketsArr[ticketIdx].color = newColor;
        localStorage.setItem("jira_tickets",JSON.stringify(ticketsArr));
    })
}

function getTicketIdx(id){
    let ticketIdx=ticketsArr.findIndex((ticketsObj)=>{
        return ticketsObj.ticketID === id;
    })
    return ticketIdx;
}