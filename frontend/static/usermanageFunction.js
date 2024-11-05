var updateUsernameInModal = "";
var deleteUsernameInModal = "";

const cookies = document.cookie;
//console.log(cookies);

function reloadTable(){
    console.log(getApiAddress());
    fetch(getApiAddress()+'/user' ,{
	credentials: 'include',
	headers:{
		'token': cookies
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            console.log(data.length)
        
            var table = document.getElementById("addtable");
            table.innerHTML = '';
            for (let i = 0; i < data.length; i++) 
            {
                var user = data[i];
                var row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td>
                        <button onclick="deleteUserModal('${user.username}')" type="button" class="btn btn-danger" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" data-bs-toggle="modal" data-bs-target="#deletemodal"> Delete</button>
                        <button onclick="updateUserModal('${user.username}')" type="button" class="btn btn-primary" style="--bs-btn-padding-y: .25rem; --bs-btn-padding-x: .5rem; --bs-btn-font-size: .75rem;" data-bs-toggle="modal" data-bs-target="#updatemodal">Update</button>
                    </td>
                `;
                table.appendChild(row);
            }

            var rowout = document.createElement('tr');
                rowout.innerHTML = `
                <td><input type="text" class="form-control" id="usernameInput" placeholder="Username"></td>
                <td><input type="text" class="form-control" id="passwordInput" placeholder="Password"></td>
                <td>
                    <button onclick="addUser()" type="button" class="btn btn-success" style="--bs-btn-padding-y: .5rem; --bs-btn-padding-x: .7rem; --bs-btn-font-size: .8rem;"> Add</button>
                </td>
                `;
            table.appendChild(rowout);

        })
        .catch(error => console.error('Error fetching data:', error));
}


// ========= DELETE USER ========== //
function deleteUser() {
    fetch(getApiAddress()+`/user/${deleteUsernameInModal}`, {
        headers:{
            'token': cookies
            },
        credentials: 'include',
        method: 'DELETE'
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

function deleteUserModal(username){
    deleteUsernameInModal = username;
    document.getElementById("deletemodalbody").innerHTML = `Are you sure to <b>DELETE</b> Username: <b>${deleteUsernameInModal}</b> ?
    `;
}

// ========= DELETE USER ========== //



// ========== ADD USER ========= //
function addUser() {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch(getApiAddress()+`/user`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'token': cookies
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('User added successfully');
            response.json().then(data => {
                document.getElementById("errorMessage").innerHTML = `<div class="bg-success text-white p-2 mb-2">${data.message}</div>`;
            });
            setInterval(function() {
                location.reload();
            }, 850);
        } else 
        {
            console.error('Failed to delete user. Status: ' + response.status);
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
// ========== ADD USER ========= //

// ========== UPDATE USER ========= //
function updateUser() {
    const newusername = document.getElementById("modelusernameupdate").value;
    const newpassword = document.getElementById("modalpasswordupdate").value;

    fetch(getApiAddress()+`/user/${updateUsernameInModal}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'token': cookies
        },
        body: JSON.stringify({
            username: newusername,
            password: newpassword
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('User updated successfully');
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

function updateUserModal(username)
{
    updateUsernameInModal = username;
    document.getElementById("updatemodalUsername").innerText = updateUsernameInModal;
}
// ========== UPDATE USER ========= //
