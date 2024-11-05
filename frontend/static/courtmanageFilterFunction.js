var data;

function recieveData(recievedata){ // recieve data from fetch and store in global variable
    data = recievedata;
}

function filterAutoToday(){
    var today = new Date();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    var yyyy = today.getFullYear();

    document.getElementById('modaldatefilter').value = yyyy + '-' + mm + '-' + dd;
}

function filterSlot(){
    const username = document.getElementById("modelusernamefilter").value;
    const date = document.getElementById("modaldatefilter").value;

    if(username == "" && date == "")
    {
        document.getElementById("errorModalMessage2").innerHTML = `<div class="bg-danger text-white p-2 mb-2"> Input at least one for filter</div>`;
        setInterval(function() {
            document.getElementById("errorModalMessage2").innerHTML = ``;
        }, 5000);
    }
    else
    {
        if(username == "")
        {
            filterSlotReload("" , date , "1")
        }
        if (date == "")
        {
            filterSlotReload(username , "" , "2")
        }
        else{
            filterSlotReload(username , date , "3")
        }

    }
    
}

function filterSlotClear(){

    document.getElementById("modelusernamefilter").value = "";
    document.getElementById("modaldatefilter").value = "";

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
}

function filterSlotReload(usernameR , dateR , caseR){

    bootstrap.Modal.getInstance(document.getElementById('filtermodal')).hide();  // this command from chat GPT to close modal when filter finished

    if(caseR == 1){

            var table = document.getElementById("addtable");
            table.innerHTML = '';
            for (let i = 0; i < data.length; i++) 
            {
                var element = data[i];
                if(dateR.toString() == element.date.toString().substring(0, 10))
                {
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
            }


    }

    else if(caseR == 2){
            var table = document.getElementById("addtable");
            table.innerHTML = '';
            for (let i = 0; i < data.length; i++) 
            {
                var element = data[i];
                if(element.player_name.toString().includes(usernameR.toString()))
                {
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
            }
    }

    else if(caseR == 3){
        var table = document.getElementById("addtable");
            table.innerHTML = '';
            for (let i = 0; i < data.length; i++) 
            {
                var element = data[i];
                if(element.player_name.toString().includes(usernameR.toString()) && dateR.toString() == element.date.toString().substring(0, 10) )
                {
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
            }
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

}