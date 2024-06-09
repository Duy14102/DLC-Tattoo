const express = require('express');
const http = require("http");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);
// Connect to MongoDB
const mongoose = require('mongoose');
require('dotenv').config({ path: "../.env" })
mongoose.connect(process.env.REACT_APP_mongoCompass).then(() => console.log('Connected To MongoDB')).catch((err) => { console.error(err); });
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(express.json());
app.use(cors());

server.listen(3000);

// Model
const Accounts = require("./model/Accounts");
const getAccounts = mongoose.model("Accounts");

// Api

// Register
app.post("/api/v1/Register", (req, res) => {
    bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
        const user = new Accounts({
            phonenumber: req.body.phone,
            password: hashedPassword,
            role: 1,
        });
        user.save().then(() => {
            res.status(201).send("Đăng ký thành công!")
        }).catch(() => {
            res.status(500).send("Đăng ký thất bại!")
        });
    })
})

// Login
app.post("/api/v1/Login", (req, res) => {
    Accounts.findOne({ phonenumber: req.body.phone })
        .then((user) => {
            if (req.body.type === "LoginUser") {
                if (user.role !== 1) { return res.status(400).send("Tài khoản không hợp lệ!") }
                if (user.status === 2) { return res.status(400).send("Tài khoản đã bị khóa!") }
            } else {
                if (user.role !== 2) { return res.status(400).send("Tài khoản không hợp lệ!") }
            }
            bcrypt.compare(req.body.password, user.password).then((passwordCheck) => {
                if (!passwordCheck) {
                    return res.status(400).send("Sai mật khẩu!")
                }
                //   create JWT token
                const token = jwt.sign(
                    {
                        userId: user._id,
                        userRole: user.role
                    },
                    "RANDOM-TOKEN",
                    { expiresIn: "24h" }
                );
                res.status(200).send({
                    message: "Đăng nhập thành công!",
                    token,
                });
            }).catch(() => {
                res.status(400).send("Sai mật khẩu!");
            });
        }).catch(() => {
            res.status(404).send("Số điện thoại không tồn tại!")
        });
})

// Get Accounts
app.get("/api/v1/GetAccounts", async (req, res) => {
    await getAccounts.findOne({ _id: req.query.id }).then((resa) => {
        const dataToSend = { phone: resa.phonenumber, image: resa.userImage }
        res.status(201).send(dataToSend)
    }).catch((err) => {
        res.status(404).send(err)
    })
})

// Update phone
app.post("/api/v1/UpdatePhone", async (req, res) => {
    const find = await getAccounts.findOne({ phonenumber: req.body.phone })
    if (find) {
        res.status(404).send("Số điện thoại đã tồn tại!")
    } else {
        getAccounts.updateOne({ _id: req.body.id }, {
            phonenumber: req.body.phone
        }).then(() => {
            res.status(201).send("Thay đổi thành công!")
        }).catch((err) => console.log(err))
    }
})

// Update password
app.post("/api/v1/UpdatePassword", (req, res) => {
    Accounts.findOne({ _id: req.body.id }).then((user) => {
        bcrypt.compare(req.body.oldPassword, user.password).then((passwordCheck) => {
            if (!passwordCheck) {
                return res.status(400).send("Sai mật khẩu!")
            }
            bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
                getAccounts.updateOne({ _id: req.body.id }, {
                    password: hashedPassword
                }).then(() => {
                    res.status(201).send("Đổi mật khẩu thành công!")
                })
            })
        }).catch(() => {
            res.status(400).send("Sai mật khẩu!");
        });
    })
})