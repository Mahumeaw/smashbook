function clearButton(){
    document.getElementById("username").value = "";
    document.getElementById("date").value = "";
    document.getElementById("starttime").value = "";
    document.getElementById("endtime").value = "";
    document.getElementById("courtno").value = "";

    document.getElementById("cardContainer").innerHTML = "";
}

function searchGet() {
    // const username = document.getElementById("username").value.trim() || "";
    // const date = document.getElementById("date").value.trim() || "";
    // const starttime = document.getElementById("starttime").value.trim() || "";
    // const endtime = document.getElementById("endtime").value.trim() || "";
    // const courtno = document.getElementById("courtno").value.trim() || "";
    
    console.log(username);
    console.log(date);
    console.log(starttime);
    console.log(endtime);
    console.log(courtno);
    
    const requestData = {
        username: document.getElementById("username").value,
        date: document.getElementById("date").value,
        starttime: document.getElementById("starttime").value,
        endtime: document.getElementById("endtime").value,
        courtno: document.getElementById("courtno").value
    };
    
    fetch(getApiAddress()+'/search-get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            response.json().then(data => {
                console.log(data);
                
                const cardContainer = document.getElementById("cardContainer");
                cardContainer.innerHTML = "";
                
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    const card = document.createElement("div");
                    card.classList.add("col-card");
                    card.innerHTML = `
                        <img src="img/court.png" alt="">
                        <div class="courtnumres"><b>Court #${item.court_id}</b></div>
                        <h6>${item.date.toString().substring(0, 10)}</h6>
                        <h1>${item.player_name}</h1>
                        <h2 class="st-time">${item.start_time.split(":").slice(0, 2).join(":")}</h2> 
                        <h2 class="end-time">${item.end_time.split(":").slice(0, 2).join(":")}</h2>
                        <a target="_blank" href="detail/${item.slot_id}"><button id="see-detail" type="submit" onClick=seeDetail(${item.slot_id})><b>Click for details</b></button></a>
                    `;
                    cardContainer.appendChild(card);
    }
            });
        } else {
            alert("Not Found");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
}

function seeDetail(id){
    console.log("FXING ID IS "+id);
}


