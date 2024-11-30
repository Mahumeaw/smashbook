const express = require('express');
const path = require('path')
require('dotenv').config();
const port = process.env.BACK_PORT;
const app = express();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require("cookie-parser");
const axios = require('axios');
process.env.TZ = 'UTC';

const router = express.Router();
app.use(router)

const bodyParser = require('body-parser')
app.use(express.json());

app.use(bodyParser.json());

const cors = require('cors');

app.use(cookieParser());
//app.use(cors));

const secret = "thefuckingmysecret";

// Message To Garfield :)

function getFormattedTimestamp() {
    return new Date().toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok'
    }).toUpperCase().replace(',', '').replace(/ /g, ' ');
}

function messageToGarfield(errorr,messagee){   // send a message to Garfield when got error
    const messageContent = {
        time: getFormattedTimestamp(),
        error: errorr,
        message: messagee
    }

    axios.post('http://localhost:2060/webError', messageContent)
    .then(console.log("Message Sended to Garfield: "+ JSON.stringify(messageContent))).
    catch(console.error);
    
    
}

// ===== MY SQL CONNECTOR ======
var mysql = require('mysql');
const { connect } = require('http2');

// var con = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     reconnect: true
// });

var con;

let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

const handleDisconnect = () => {

    if (reconnectAttempts >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached, back_server.js restart me to use');
        messageToGarfield('SMASHBOOK-BACKEND','(REDCODE) Max Reconnection attempts reached GARFIELD need to fix it!!!!!');
        return;
    }
    con = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        reconnect: true
    });

    con.connect(err => {
        if (err) {
            console.error('Error connecting to the database:', err);
            messageToGarfield('SMASHBOOK-BACKEND','(Error) Error to connect database, reconnecting... (attempts ' + reconnectAttempts+')');
	        reconnectAttempts++;
            setTimeout(handleDisconnect, 3000);
        } else {
            console.log('Connected to the database on ' + process.env.DB_HOST);
            messageToGarfield('SMASHBOOK-BACKEND','(Success) Database Connected On '+process.env.DB_HOST)
	        reconnectAttempts = 0;
        }
    });

    con.on('error', err => {
        console.error('Database error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') 
	{
	    console.error('Protocol connection lost. Reconnecting...');
        messageToGarfield('SMASHBOOK-BACKEND','(Error) PROTOCOL_CONNECTION_LOST, reconnecting...');
        handleDisconnect();
	}
	else if(err.code === 'PROTOCOL_PACKETS_OUT_OF_ORDER')
	{
	    console.error('Packets out of order. Reconnecting...');
        messageToGarfield('SMASHBOOK-BACKEND','(Error) PROTOCOL_PACKETS_OUT_OF_ORDER, reconnecting...');
	    handleDisconnect();	
        } 
	else 
	{
	    console.log('Another error. Reconnecting...');
        messageToGarfield('SMASHBOOK-BACKEND','(Error) ANOTHER ERROR, reconnecting...');
	    handleDisconnect();
            //throw err;
        }
    });
};

handleDisconnect();

// con.connect(function(err){
//     if(err) throw err;
//     console.log("Database Connected on "+ process.env.DB_HOST);
// });


// ===== MY SQL CONNECTOR ======

// ============== MIDDLE WARE ===============
app.use((req, res, next) => {       // CORS SETUP
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_DOMAIN);  
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, token');
    if (req.method === 'OPTIONS') {
        //res.sendStatus(204);
        res.status(204).send();	    
    } else {
        next();
    }
    //next();
});
 
const verifyJWT = (req, res, next) => {   // VERIFY USER BY JWT
    //const token = req.headers.token.replace(/^token=/, '');
    const token = req.headers.token.split('token=')[1]?.split(';')[0]
    console.log("I got fxing cookie: ", token);
    if (!token) {
        return res.status(403).send('Token is required naja.');
    }
    try {
        const decoded = jwt.verify(token, secret);
        console.log("Passing Token: ", decoded);
        console.log("Passing By: ", decoded.username);
        req.username = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Invalid Token.');
    }
    //next();
};
// =============== MIDDLE WARE =====================

app.post('/auth-login', async(req, res) => {        // login APIs TRADITIONAL
    const username = req.body.username;
    const password = req.body.password;
    const passwordHash = await bcrypt.hash(password,10);
    console.log("[AUTH-LOGIN] " +req.method);
    console.log(req.body);
    console.log(passwordHash);
  
      con.query('SELECT * FROM admin WHERE username = ?', [username, passwordHash], async (err, results) => 
      {
        if(err){
            // console.error("Database error:", err);
            console.log("[AUTH-LOGIN] Can't connect with database for query username and password");
            res.status(500).json({ success: false , message:"Can't connect database"});
            return;
        }
        if(results.length == 0){
            console.log("[AUTH-LOGIN] Username wrong :(");
            res.status(401).json({ success: false , message:"Username wrong:( "});
            return;
        }
        const match = await bcrypt.compare(password, results[0].password);
        if(match)
        {
            res.status(200).json({ success: true, message: "AUTHORIZED" }); // Send A Status for login success
            console.log("[AUTH-LOGIN] Authorized")        
            return
        }
        console.log("[AUTH-LOGIN] Password wrong :(");
        res.status(401).json({ success: false , message:"Password wrong:( "});
        return;
    });
});

app.post('/search-get', (req, res) => {   // Search APIs
    console.log("[SEARCH-POST] " + req.method);
    console.log(req.body);

    const username = req.body.username;
    const date = req.body.date;
    const starttime = req.body.starttime;
    const endtime = req.body.endtime;
    const courtno = req.body.courtno;
    console.log(username);
    console.log(date);
    console.log(starttime);
    console.log(endtime);
    console.log(courtno);
    var sql = "SELECT * FROM slot WHERE 1 = 1";

    if (username != "") {
        sql += ` AND player_name LIKE "%${username}%"`;
    }
    if (date != "") {
        sql += ` AND date = "${date}"`;
    }
    // else if(date == ""){
    //     sql += ` AND date >= "${date}"`
    // }

    if (starttime != "" && endtime != "") {
        sql += ` AND start_time >= "${starttime}:00" AND end_time <= "${endtime}:00"`;
    } 
    else if (starttime != "" && endtime == "") 
    {
        sql += ` AND start_time >= "${starttime}:00"`;
    } 
    else if (endtime != "" && starttime == "") {
        sql += ` AND end_time <= "${endtime}:00"`;
    }

    if (courtno) {
        sql += ` AND court_id = "${courtno}"`;
    }
    console.log("[SEARCH-POST] Query sql: "+ sql);
    con.query(sql ,(error, results)  =>
    {
        if (error)
        {
            console.log("[SEARCH-POST] Can't connect with database for query");
            res.status(500).json({ success: false , message:"Can't connect database"});
            // throw error;
        } 
        // console.log(`[SEARCH-POST] Searching ${results.length} rows returned`);
        if(results.length==0)
        {
            console.log("[SEARCH-POST] Not found")
            res.status(404).send("[SEARCH-POST] Not Found");
        }
        else
        {
            console.log("[SEARCH-POST] Search founded, returning results to client")
            console.log(results);
            res.status(200).send(JSON.stringify(results))
        }
    });
});

app.get('/detail/:id', (req, res) => {        // get users APIs
    const id = req.params.id;
    console.log("[DETAIL-GET] " + req.method);
    
    con.query(`SELECT * FROM slot WHERE slot_id = ${id}`, (err, results) => 
      {
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[USER-GET] Can't connect with database for query username and password");
            res.status(500).json({ success: false , message:"Can't connect to database"});
            return;
        }
        if(results.length === 0){    
            console.log("[USER-GET] 0 User returned");
            res.status(500).json({ success: false , message:"No slot"});
        }
        else
        {
            console.log("[USER-GET] " + results.json)
            res.status(200).send(JSON.stringify(results))
        }
    });
});

// ============== ADMIN USERS APIs ==================

app.get('/user', verifyJWT, (req, res) => {        // get users APIs
    console.log("START OF GET API");
    console.log("[USER-GET] " + req.method);

    con.query('SELECT * FROM admin', (err, results) => 
      {
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[USER-GET] Can't connect with database for query username and password");
            res.status(500).json({ success: false , message:"Can't connect to database"});
            return;
        }
        if(results.length === 0){    
            console.log("[USER-GET] 0 User returned");
            res.status(500).json({ success: false , message:"No user"});
        }
        else
        {
            console.log("[USER-GET] " + results.json)
            res.status(200).send(JSON.stringify(results))
        }
    });
});

app.post('/user', verifyJWT, async (req, res) => {        // Add users APIs
    const username = req.body.username;
    const password = req.body.password;
    console.log("[USER-ADD] " + req.method);
    console.log(req.body);

    if(username == "" || password == ""){
        console.log("[USER-ADD] Username Or Password Invalid");
        res.status(500).json({ success: false, message: "Username or Password Invalid"});
        return;
    }
    
    const passwordHash = await bcrypt.hash(password,10);

    console.log("HASHED: ",passwordHash)
    con.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => 
      {
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[USER-ADD] Can't connect with database for query username and password");
            res.status(500).json({ success: false , message:"Can't connect to database"});
            return;
        }
        if(results.length === 0){    //  ADD USER while no duplicate
            console.log("[USER-ADD] Checking... , Don't have same username, So let insert in to database");

            con.query(`INSERT INTO admin (username , password) VALUES ('${username}' , '${passwordHash}')`, (err,results) => {
            if (err) {
                console.error('[USER-ADD] : ', err);
                console.log("[USER-ADD] Insert Error");
                res.status(500).json({success: false, message: "Insert Error due to database"});
                return;
            }
                console.log('[USER-ADD] Data inserted successfully');
                res.status(200).json({ success: true , message: "User has been inserted"});
            });
        }
        else
        {
            res.status(500).json({ success: false, message:"Can't add this user, Username already exist"}); //     
            console.log("[USER-ADD] Can't add this user, Username already exist");
        }
    });
});

app.delete('/user/:username', verifyJWT,  (req, res) => {        // Delete Users APIs
    const username = req.params.username;
    console.log(req.method);
    console.log(req.body);

    con.query('SELECT * FROM admin WHERE username = ?', [username], (err, results) => 
      {
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[USER-DELETE] Can't connect with database for query username and password");
            res.status(500).json({ success: false , message:"Can't connect to database"});
            return;
        }
        if(results.length === 0){    //  ADD USER while no duplicate
            console.log("[USER-DELETE] Don't have this username, Can not delete");
            res.status(500).json({ success: false , message:"Don't have this username, Can not delete"});
            return;
        }
        con.query('DELETE FROM admin WHERE admin.username = ? ', [username], (err,results) => {

            if (err) {
                // console.error('Deleted Error :( :', err);
                console.log("[USER-DELETE] Can't delete due to database error");
                res.status(500).json({success: false, message: "Can't delete due to database error"});
                return;
            }
                console.log('[USER-DELETE] User deleted successfully (Username: '+username+")");
                res.status(200).json({ success: true , message:"User has been deleted."});
            });
    });
    
});

app.put('/user/:username', verifyJWT,  async(req, res) => {        // Update Users APIs
    const usernamepara = req.params.username;
    const username = req.body.username;
    const password = req.body.password;
    console.log("P "+usernamepara);
    console.log("P "+username);
    console.log("P "+password);
    console.log("[USER-UPDATE] "+ req.method);
    console.log(req.body);

    const passwordHash = await bcrypt.hash(password,10);

    con.query('SELECT * FROM admin WHERE username = ?', [usernamepara], (err, results) => 
      {
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[USER-UPDATE] Can't connect with database for query username and password");
            res.status(500).json({ success: false , message:"Can't connect database"});
            return;
        }
        if(results.length === 0){    //  Don't found this username
            console.log("[USER-UPDATE] Don't have this username, Can not update :(");
            res.status(500).json({ success: false , message:"Don't have this username, Can not update"});
            return;
        }
        // UPDATE admin SET username = 'Drive', password = '6588070' WHERE admin.username = 'Drivee';    (EXAMPLE)

    
        if(username != "" && password != ""){
            var sql  = `UPDATE admin SET username = '${username}', password = '${passwordHash}' WHERE admin.username = '${usernamepara}'`;
        }
        else if(username != ""){
            var sql  = `UPDATE admin SET username = '${username}' WHERE admin.username = '${usernamepara}'`;
        }
        else if(password != ""){
            var sql  = `UPDATE admin SET password = '${passwordHash}' WHERE admin.username = '${usernamepara}'`;
        }
        else{
            console.log("[USER-UPDATE] Input parameter INVALID");
            res.status(500).json({success:false , message: "Please insert username and password"})
            return;
        }
        console.log("[USER-UPDATE] Update Query String: " + sql);
        try{
        con.query(sql , [username], (err,results) => {  // Update table

            if (err) {
                //console.error('Updated Error :( :', err);
                console.log("[USER-UPDATE] Update Database Error");
                res.status(500).json({success : false, message:"Update Database Error, User may duplicate"});
                return;
            }
                console.log('[USER-UPDATE] User updated successfully');
                res.status(200).json({success: true , message:"User has been updated"});
                return;
        });
        }catch(err){
            console.log("[USER-UPDATE] Another Error ??")
            res.status(500).json({success : false, message:"Another error ??"});
        }
    });
    
});

// ============== ADMIN USERs APIs ==================


// ============== Admin Slot Apis ===================

app.get('/slotId/:id', verifyJWT,  (req, res) => {        // get slot APIs specific IDs
    const id = req.params.id;
    console.log("[SLOT-GET-ID] " + req.method);
    
    con.query(`SELECT * FROM slot WHERE slot_id = ${id}`, (err, results) => 
      {
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[SLOT-GET-ID] Can't connect with database for query");
            res.status(500).json({ success: false , message:"Can't connect to database"});
            return;
        }
        if(results.length == 0){    //  Handle dont have this id;
            console.log("[SLOT-GET-ID] Don't have this slot ID");
            res.status(500).json({ success: false , messcage:"Don't have this slot id"});
        }
        else
        {
            console.log("[SLOT-GET-ID] Slot id " + id  + " has been responsed")
            res.status(200).send(JSON.stringify(results))
        }
    });
});



app.get('/slot', verifyJWT, (req, res) => {        // get slot APIs
    console.log("[SLOT-GET] " + req.method);
    
    con.query('SELECT * FROM `slot` ORDER BY `slot_id` ASC', (err, results) => 
      {
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[SLOT-GET] Can't connect with database for query");
            res.status(500).json({ success: false , message:"Can't connect to database"});
            return;
        }
        if(results.length === 0){    //  ADD USER while no duplicate
            console.log("[SLOT-GET] 0 User returned");
            res.status(500).json({ success: false , message:"No SLOT"});
        }
        else
        {
            console.log("[SLOT-GET] " + results.json)
            res.status(200).send(JSON.stringify(results))
        }
    });
});

app.post('/slot', verifyJWT,  async (req, res) => {        // add slot APIs
    const username = req.body.username;
    const date = req.body.date;
    const starttime = req.body.starttime;
    const endtime = req.body.endtime;
    const courtno = req.body.courtno;
    console.log("[SLOT-ADD] "+req.method);
    console.log(req.body);

    if(username == "" || date == "" || starttime == "" || endtime =="" || courtno ==""){
        console.log("[SLOT-ADD] Fill all for add slot");
        res.status(500).json({success: false, message: "Please fill all of requirement for add slot"});
        return;
    }
    con.query(`SELECT * FROM slot WHERE court_id = ${courtno} AND date = '${date}' AND
    ((start_time <= '${starttime}:00' AND end_time > '${starttime}:00') OR 
    (start_time < '${endtime}:00' AND end_time >= '${endtime}:00') OR 
    (start_time > '${starttime}:00' AND end_time < '${endtime}:00') OR 
    (start_time = '${starttime}:00' AND end_time = '${endtime}:00'))`, (err, results) => // check this court no. is avaliable or not
    {
        console.log("[SLOT-ADD] CHECK OVERLAP There are " +results.length+ " row(s) returned");
        console.log(results);
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[SLOT-ADD] Can't connect to database for query");
            res.status(500).json({ success: false , message: 'Database connection Error'});
            return;
        }
        if(results.length == 0){    //  Don't have player in this time slot :)
            console.log("[SLOT-ADD] Don't have pverlap time slot, So can insert:)")
            let sql = `INSERT INTO slot (slot_id, court_id, price, date, start_time, end_time, player_name) VALUES 
            (NULL, ${courtno}, 100, '${date}', '${starttime}:00', '${endtime}:00', '${username}')`  // insert into table :)
            console.log("[SLOT-ADD] This is sql: "+sql);
            con.query(sql,  (err,results) => {
            // console.log("======= WE ARE ONE ========");  // use for debug
            if (err) {
                console.log("[SLOT-ADD] Database Insert ERROR");
                res.status(500).json({ sccess: false ,  message: "Database Insert Error"});
                return;
            }
            // console.log("======= WE ARE THREE ========");
                console.log('[SLOT-ADD] Data inserted successfully');
                res.status(200).json({ sccess: true ,  message: "Slot inserted successfully"});  
                return;
            });
        }
        else{
            console.log("[SLOT-ADD] Can't add this slot because slot overlap");
            res.status(500).json({success: false , message: "Can not add this slot due to slot overlap :("})
            return;
        }
    });
});

app.put('/slot/:id', verifyJWT,  async (req, res) => {        // update slot APIs
    const id = req.params.id;
    
    var username = req.body.username;
    var date = req.body.date;
    var starttime = req.body.starttime;
    var endtime = req.body.endtime;
    var courtno = req.body.courtno;

    if(username == "" && date == "" && starttime == "" && endtime == "" && courtno == ""){
        res.status(500).json({ success: false , message:"Please fill at least one for update"});
        return;
    }

    var slotid_q = ""
    var courtno_q = ""
    var price_q = ""
    var date_q = ""
    var starttime_q = ""
    var endtime_q = ""
    var username_q = ""

    console.log("[SLOT-UPDATE] " + req.method);
    console.log(req.body);
    con.query('SELECT * FROM slot WHERE slot_id = ? ', [id], (err, results) => 
      {
        if(err){   // error
            console.log("[SLOT-UPDATE] Can't connect with database for query username and password");
            res.status(500).json({ success: false , message:"Can not connect to database"});
            return;
        }
        if(results.length == 0){    //  Dont have this id can not update
            console.log("[SLOT-UPDATE] Can not update this id due ID does not exist");
            res.status(500).json({ success: false , message:"Can not update due to ID does not exist"});
            return;
        }
        else{
            results.forEach(results => {
                slotid_q = results.slot_id;
                courtno_q = results.court_id
                price_q = results.price;
                date_q = results.date;
                starttime_q = results.start_time;
                endtime_q = results.end_time;
                username_q = results.player_name;
              });
        if(username == ""){
            username = username_q;
        }
        if(date == ""){      // fix the fxing date
            // date = date_q.toISOString().split('T')[0]; // To transform Long date format to shorter :)
            let year = date_q.getFullYear();
            let month = String(date_q.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-based
            let day = String(date_q.getDate()).padStart(2, '0');
            date = `${year}-${month}-${day}`;
            console.log("[SLOT-UPDATE] Concat date string for query (" + date);
        }
        else{
            console.log("[SLOT-UPDATE] Date case 2, No need to date string");
        }
        if(starttime == ""){
            starttime = starttime_q;
        }
        else{
            starttime += ":00";
        }
        if(endtime == ""){
            endtime = endtime_q;
        }
        else{
            endtime += ":00";
        }
        if(courtno == ""){
            courtno = courtno_q;
        }
        
        // ===== FOR COMPARE before and after =====
        console.log("[SLOT-UPDATE] ==== BEFORE MODIFY ====")
        console.log('[SLOT-UPDATE] Slot:', slotid_q);
        console.log('[SLOT-UPDATE] Court no:', courtno_q);
        // console.log('Price:', price_q);
        console.log('[SLOT-UPDATE] Date:', date_q );
        console.log('[SLOT-UPDATE] Starttime:', starttime_q);
        console.log('[SLOT-UPDATE] Endtime:', endtime_q);
        console.log('[SLOT-UPDATE] Username:', username_q);
        console.log("[SLOT-UPDATE] ===== AFTER MODIFIED =====")
        console.log('[SLOT-UPDATE] Slot:', id);
        console.log('[SLOT-UPDATE] Court no:', courtno);
        console.log('[SLOT-UPDATE] Date:', date);
        console.log('[SLOT-UPDATE] Starttime:', starttime);
        console.log('[SLOT-UPDATE] Endtime:', endtime);
        console.log('[SLOT-UPDATE] Username:', username);
        console.log("[SLOT-UPDATE] ===========================")
        // ===== FOR COMPARE before and after =====

        // vvvvvv For check duplicate or overlap updated slot        ถึ ง ต ร ง ย ี้
        let sql = `SELECT * FROM slot WHERE date = '${date}' AND court_id = ${courtno} AND slot_id != ${id} AND ((start_time <= '${starttime}' AND end_time > '${starttime}') OR  
        (start_time < '${endtime}' AND end_time >= '${endtime}') OR (start_time > '${starttime}' AND end_time < '${endtime}') OR (start_time = '${starttime}' AND end_time = '${endtime}'))`
        console.log("[SLOT-UPDATE] SQL for check duplicate: " + sql);
        con.query(sql , (err, results) => // check this court no. is avaliable or not
        {
        console.log("[SLOT-UPDATE] Check overlap, There are " +results.length+ " row(s) returned"); 
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[SLOT-UPDATE] Can't connect with database for query");
            res.status(500).json({ success: false , message: 'Database Connection Error'});
            return;
        }
        if(results.length === 0){    //  Don't have player in this time slot :)
            console.log("[SLOT-UPDATE] Don't have any overlap time slots, Can update this slot :)")
            con.query(`UPDATE slot SET court_id = ${courtno}, date = '${date}' ,start_time = '${starttime}', end_time = '${endtime}' ,player_name = '${username}' WHERE slot_id = ${id}`, [username], (err, results) => 
            {
              if(err){   // error
                //   console.error("Database error:", err);
                  console.log("[SLOT-UPDATE] Can't connect with database for query");
                  res.status(500).json({ success: false , message:"Can't connect database or some error in database"});
                  return;
              }
                console.log("[SLOT-UPDATE] Slot has been updated");
                res.status(200).json({ success: true , message:"Slot has been updated"});
                return;
    
          });
        }
        else{
            console.log("[SLOT-UPDATE] There are overlap slot(s) VVVV");
            console.log(results);
            res.status(500).json({success: false, message: "Can't update, There are overlap slots(s)"});
            return;
        }
        });
        // res.status(200).json({success: true , username: username, date : date,starttime: starttime, endtime: endtime, courtno: courtno});
        //res.status(500).json({success: false, message: "Another Error"});
        }
    });
});



app.delete('/slot/:id', verifyJWT, (req, res) => {        // Delete Slot APIs
    const id = req.params.id;
    console.log("[SLOT-DELETE] " + req.method);
    console.log(req.body);

    con.query(`SELECT * FROM slot WHERE slot_id = ${id}`, (err, results) => 
      {
        if(err){   // error
            // console.error("Database error:", err);
            console.log("[SLOT-DELETE] Can't connect with database for query username and password");
            res.status(500).json({ success: false , message: "Can't connect database :("});
            return;
        }
        if(results.length === 0){    //  ADD USER while no duplicate
            console.log("[SLOT-DELETE] Can not delete slot, Don't have this slot ID");
            res.status(500).json({ success: false , message: "Can not delete slot, slot ID does not exist"});
            return;
        }
        else{
        con.query('DELETE FROM slot WHERE slot.slot_id = ? ', [id], (err,results) => {
     
            if (err) {
                // console.error('Deleted Error :( :', err);
                console.log("[SLOT-DELETE] Database delete error")
                res.status(500).json({success: false, message : "Database delete error"})
                return;
            }
                console.log('[SLOT-DELETE] Slot deleted successfully (Slot ID: '+id+")");
                res.status(200).json({ success: true , message: "Slot deleted successfully"});
            });
        }
    });

});




// ============== Admin Slot Apis ===================



app.listen(port, () => {
    console.log("Back server listen on port: "+port);
})
