const express = require('express');
require('dotenv').config();
const path = require('path')
const jwt = require('jsonwebtoken');
const port = process.env.FRONT_PORT;
const app = express();
const secret = "thefuckingmysecret";
const cookieParser = require("cookie-parser");

const router = express.Router();
app.use(router)
router.use(cookieParser());

const bodyParser = require('body-parser');

router.use(express.json());
router.use(express.urlencoded({extended: true}));

// const cors = require('cors');
// app.use(cors);

// const cp = require("cookie-parser");
// router.use(cp())

// ============ MIDDLE WARE ============
const verifyLoginJWT = (req, res, next) => {   // VERIFY USER BY JWT
    const token = req.cookies.token; 
    console.log("I got cookie: ", token);
    if (!token) {
        res.sendFile(path.join(`${__dirname}/html/admin.html`));
    }
    try {
        const decoded = jwt.verify(token, secret);
        console.log("Passing Token: ", decoded);
        console.log("Passing By: ", decoded.username);
        req.username = decoded.username;
        res.redirect('/adminhome');
    } catch (err) {
        next();
    }
};

const verifyJWT = (req, res, next) => {   // VERIFY USER BY JWT
    const token = req.cookies.token; 
    console.log("I got cookie: ", token);
    if (!token) {
        res.redirect('/admin');
        return;
    }
    try {
        const decoded = jwt.verify(token, secret);
        console.log("Passing Token: ", decoded);
        console.log("Passing By: ", decoded.username);
        req.username = decoded.username;
        next();
    } catch (err) {
        return res.status(500).send('Veficication Error');
    }
};
// ============ MIDDLE WARE ============
     
router.get('/', (req,res) => {   //start page
    console.log('Response index.html');
    res.sendFile(path.join(`${__dirname}/html/index.html`))
})

router.get('/home', (req,res) => {   //start page
    console.log('Response home.html');
    res.sendFile(path.join(`${__dirname}/html/home.html`))
})

router.get('/team', (req,res) => {   //start page
    console.log('Response team.html');
    res.sendFile(path.join(`${__dirname}/html/team.html`))
})

router.get('/reserve', (req,res) => {   //start page
    console.log('Response reserve.html');
    res.sendFile(path.join(`${__dirname}/html/reserve.html`))
})

// ====== for admin below
router.get('/admin',verifyLoginJWT, (req,res) => {   //start page
    console.log('Response admin.html or redirect to adminhome.html');
})

router.get('/usermanage', verifyJWT,(req,res) => {   //start page
    console.log('Response usermanage.html');
    res.sendFile(path.join(`${__dirname}/html/admin/usermanage.html`))
})

router.get('/courtmanage',verifyJWT, (req,res) => {   //start page
    console.log('Response courtmanage.html');
    res.sendFile(path.join(`${__dirname}/html/admin/courtmanage.html`))
})

router.get('/adminhome', verifyJWT,  (req,res) => {   //start page
    console.log('Response adminhome.html');
    res.sendFile(path.join(`${__dirname}/html/admin/adminhome.html`))
})

router.get('/detail/:id', (req,res) => {   //start page
    console.log('Response detail.html');
    const id = req.params.id
    res.sendFile(path.join(`${__dirname}/html/detail.html`));
});


router.post('/login-post',  async (req, res) => {   //login handles
    console.log(req.method);
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;

    try {
        const response = await fetch("http://localhost:3070/auth-login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.status === 200) {
            // Authentication success
            const token = jwt.sign({username, role: 'admin'}, secret , {expiresIn: '1h'}) // token created
            res.cookie('token', token, {
                maxAge: 3000000,
		domain: 'smashbook.mahumeaw.com',
		path: '/',
                Secure: false,
                httpOnly: true,
                SameSite: "None", 
            });
            //res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly`);
            res.setHeader('Set-Cookie', `token=${token}; Path=/; SameSite=Lax`);
            console.log("TOKEN CREATED" + token);
            console.log('Authentication SUCCESSFUL!');
            res.redirect('/adminhome');
        } else if (response.status === 401) {
             // Authentication failed
           console.log('Authentication failed');
            res.status(401).send('Authentication FAILED');
        } else {
            // Handle other status codes if needed
            console.log('Unexpected status code:', response.status);
            res.status(500).send('Can not Authorized');
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).send('Can not Authorized');
    }
});










app.use('/',express.static(path.join(__dirname,'static'))); // กำหนด static สำหรับภาพ

app.listen(port, () => {
    console.log("Server listen on port: "+port);
})
