var updateSlotInModal = "";
var deleteSlotInModal = "";

const cookies = document.cookie;
//console.log(cookies);

function reloadTable(){
    fetch(getApiAddress()+'/slot',{
        credentials: 'include',
        headers:{
            'token': cookies
            }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            console.log(data.length);
            recieveData(data);   // send to filter
            var table = document.getElementById("addtable");
            table.innerHTML = '';
            for (let i = 0; i < data.length; i++) 
            {
                var element = data[i];
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td><b>${element.slot_id}</b></td>
                    <td>${element.player_name}</td>
                    <td>${element.date.toString().substring(0, 10)}</td>
                    <td>${element.start_time.split(":").slice(0, 2).join(":")}</td>
                    <td>${element.end_time.split(":").slice(0, 2).join(":")}</td>
                    <td>${element.court_id}</td>
                    <td>
                        <button onclick="deleteSlotModal('${element.slot_id}')" type="button" class="btn btn-danger" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" data-bs-toggle="modal" data-bs-target="#deletemodal"> Delete</button>
                        <button onclick="updateSlotModal('${element.slot_id}','${element.player_name}' ,'${element.date.toString().substring(0, 10)}' ,'${element.start_time}' ,'${element.end_time}' ,'${element.court_id}')" type="button" class="btn btn-primary" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" data-bs-toggle="modal" data-bs-target="#updatemodal"> Update</button>
                    </td>
                `;
                table.appendChild(row);
            }

            var rowout = document.createElement('tr');
                rowout.innerHTML = `
                <td></td>
                        <td><input type="text" class="form-control" placeholder="Customer" id="username"></td>
                        <td><input type="date" class="form-control" placeholder="Date" id="date"></td>
                        <td><input type="time" class="form-control" placeholder="Starttime" id="starttime"></td>
                        <td><input type="time" class="form-control" placeholder="Endtime" id="endtime"></td>
                        <td>
                            <select class="form-select" aria-label="Court no" id="courtno">
                                <option selected value="">#Court</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </td>
                        <td>
                            <button onclick="addSlot()" type="button" class="btn btn-success" style="--bs-btn-padding-y: .5rem; --bs-btn-padding-x: .7rem; --bs-btn-font-size: .8rem;">Add Slot</button>
                        </td>
                `;
            table.appendChild(rowout);
        })
        .catch(error => console.error('Error fetching data:', error));
}



// ========= DELETE SLOT ========== //
function deleteSlot() {
    fetch(getApiAddress()+`/slot/${deleteSlotInModal}`, {
        credentials: 'include',
        method: 'DELETE',
        headers:{
            'token': cookies
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('User deleted successfully');
            response.json().then(data => {
                document.getElementById("errorMessage").innerHTML = `<div class="bg-success text-white p-2 mb-2">${data.message}</div>`;
            });
            setInterval(function() {
                location.reload();
            }, 850);


        } else {
            console.error('Failed to delete user. Status: ' + response.status);
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
    });
   
}

function deleteSlotModal(id){
    deleteSlotInModal = id;
    document.getElementById("deletemodalbody").innerHTML = `
        Are you sure to <b>DELETE</b> Slot Id: <b>${deleteSlotInModal}</b> ?
   
        
    `;
}

// ========= DELETE SLOT ========== //


// ========== ADD SLOT ========= //
function addSlot() {
    const username = document.getElementById("username").value;
    const date = document.getElementById("date").value; 
    const starttime = document.getElementById("starttime").value;
    const endtime = document.getElementById("endtime").value;
    const courtno = document.getElementById("courtno").value;
    fetch(getApiAddress()+`/slot`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'token': cookies
        },
        body: JSON.stringify({
            "username": username,
            "date": date ,
            "starttime": starttime,
            "endtime": endtime,
            "courtno": courtno
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Slot added successfully');
            response.json().then(data => {
                document.getElementById("errorMessage").innerHTML = `<div class="bg-success text-white p-2 mb-2">${data.message}</div>`;
            });
            setInterval(function() {
                location.reload();
            }, 850);
        } else 
        {
            console.error('Failed to add slot. Status: ' + response.status);
            response.json().then(data => {
                document.getElementById("errorMessage").innerHTML = `<div class="bg-danger text-white p-2 mb-2">${data.message}</div>`;
                setInterval(function() {
                    document.getElementById("errorMessage").innerHTML = ``;
                }, 5000);
            });
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
    });
    
}
// ========== ADD SLOT ========= //


// ========== UPDATE SLOT ========= //
function updateUser() {

    fetch(getApiAddress()+`/slot/${updateSlotInModal}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'token': cookies
        },
        body: JSON.stringify({
            "username": document.getElementById("modelusernameupdate").value,
            "date": document.getElementById("modaldateupdate").value ,
            "starttime": document.getElementById("modelstarttimeupdate").value,
            "endtime": document.getElementById("modelendtimeupdate").value,
            "courtno": document.getElementById("modelcourtnoupdate").value
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Slot updated successfully');
            response.json().then(data => {
                document.getElementById("errorModalMessage").innerHTML = `<div class="bg-success text-white p-2 mb-2">${data.message}</div>`;
            });
            setInterval(function() {
                location.reload();
            }, 850);
        } else {
            console.error('Failed to update user. Status: ' + response.status);
            response.json().then(data => {
                document.getElementById("errorModalMessage").innerHTML = `<div class="bg-danger text-white p-2 mb-2">${data.message}</div>`;
                setInterval(function() {
                    document.getElementById("errorModalMessage").innerHTML = ``;
                }, 5000);
            });
        }
    })
    .catch(error => {
        console.error('Error deleting user:', error);
    });
    
}

function updateSlotModal(id,username,date,starttime,endtime,courtno)
{
    updateSlotInModal = id;
    document.getElementById("updatemodalId").innerHTML = `Slot #Id: <b>${updateSlotInModal}</b>`;
    document.getElementById("modelusernameupdate").placeholder = `${username}`;

    document.querySelector('label[for="modelusernameupdate"]').textContent = `Customer: (${username})`;
    document.querySelector('label[for="modaldateupdate"]').textContent = `Date: (${date})`;
    document.querySelector('label[for="modelstarttimeupdate"]').textContent = `Starttime: (${starttime})`;
    document.querySelector('label[for="modelendtimeupdate"]').textContent = `Endtime: (${endtime})`;
    document.querySelector('label[for="modelcourtnoupdate"]').textContent = `Court: (#${courtno})`;
}
// ========== UPDATE SLOT ========= //

// ========== FILTER SLOT ========= //