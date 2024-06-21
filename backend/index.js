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

//Cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.REACT_APP_cloudName_Cloudinary,
    api_key: process.env.REACT_APP_apiKey_Cloudinary,
    api_secret: process.env.REACT_APP_apiSecret_Cloudinary
});

const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(express.json());
app.use(cors());
const socketIo = require("socket.io")(server, {
    cors: {
        origin: "*",
    }
});

server.listen(3000);

// Model
const Accounts = require("./model/Accounts");
const getAccounts = mongoose.model("Accounts");
const Blogs = require("./model/Blogs");
const getBlogs = mongoose.model("Blogs");
const Samples = require("./model/Samples");
const getSamples = mongoose.model("Samples");
const Gallerys = require("./model/Gallerys");
const getGallerys = mongoose.model("Gallerys");

// Api

// Register
app.post("/api/v1/Register", (req, res) => {
    bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
        const user = new Accounts({
            phonenumber: req.body.phone,
            password: hashedPassword,
            role: parseInt(req.body.role),
        });
        user.save().then((resa) => {
            if (req.body.avatar) {
                cloudinary.uploader.upload(req.body.avatar, {
                    public_id: resa._id, folder: "Avatar"
                }).then((result) => {
                    getAccounts.updateOne({ _id: resa._id }, {
                        userimage: result.url
                    }).exec()
                }).catch(() => {
                    return res.status(500).send("Đăng ký thất bại!")
                })
            }
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
                if (user.status.state === 2) { return res.status(400).send("Tài khoản đã bị khóa!", user.status.reason) }
            } else {
                if (user.role !== 2) { return res.status(400).send("Tài khoản không hợp lệ!") }
            }
            bcrypt.compare(req.body.password, user.password).then((passwordCheck) => {
                if (!passwordCheck) {
                    return res.status(400).send("Sai mật khẩu!")
                }
                getAccounts.updateOne({ _id: user._id }, {
                    lastLogin: Date.now()
                }).exec()
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
        const dataToSend = { phone: resa.phonenumber, image: resa.userimage }
        res.status(201).send(dataToSend)
    }).catch((err) => {
        res.status(404).send(err)
    })
})

// Get All Accounts
app.get("/api/v1/GetAllAccounts", async (req, res) => {
    const sortedSwitch = parseInt(req.query.sorted)
    const getOrder = await getAccounts.find(req.query.search ? { phonenumber: new RegExp(req.query.search, 'i') } : {}).sort(sortedSwitch === 1 ? { phonenumber: -1 } : sortedSwitch === -1 ? { phonenumber: 1 } : sortedSwitch === 2 ? { createdAt: -1 } : sortedSwitch === -2 ? { createdAt: 1 } : sortedSwitch === 3 ? { lastLogin: -1 } : sortedSwitch === -3 ? { lastLogin: 1 } : sortedSwitch === 4 ? { role: -1 } : sortedSwitch === -4 ? { role: 1 } : sortedSwitch === 5 ? { "status.state": -1 } : sortedSwitch === -5 ? { "status.state": 1 } : { "status.state": 1, role: -1, createdAt: -1 })
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const start = (page - 1) * limit
    const end = page * limit

    const results = {}
    results.total = getOrder.length
    results.pageCount = Math.ceil(getOrder.length / limit)

    if (end < getOrder.length) {
        results.next = {
            page: page + 1
        }
    }
    if (start > 0) {
        results.prev = {
            page: page - 1
        }
    }

    results.result = getOrder.slice(start, end)
    res.send({ results });
})

// Delete Account
app.post("/api/v1/DeleteAccount", (req, res) => {
    getAccounts.deleteOne({ _id: req.body.id }).then(async () => {
        await cloudinary.uploader.destroy(`Avatar/${req.body.id}`).then(() => {
            res.status(201).send("Xóa tài khoản thành công!")
        }).catch(() => {
            res.status(500).send("Xóa tài khoản thất bại!")
        })
    }).catch(() => {
        res.status(500).send("Xóa tài khoản thất bại!")
    })
})

// Ban Account
app.post("/api/v1/BanAccount", (req, res) => {
    getAccounts.updateOne({ _id: req.body.id }, {
        "status.state": 2,
        "status.reason": req.body.reason
    }).then(() => {
        res.status(201).send("Khóa tài khoản thành công!")
    }).catch(() => {
        res.status(500).send("Khóa tài khoản thất bại!")
    })
})

// Unban Account
app.post("/api/v1/UnbanAccount", (req, res) => {
    getAccounts.updateOne({ _id: req.body.id }, {
        "status.state": 1,
        "status.reason": null
    }).then(() => {
        res.status(201).send("Mở tài khoản thành công!")
    }).catch(() => {
        res.status(500).send("Mở tài khoản thất bại!")
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

// Change Avatar
app.post("/api/v1/ChangeAvatar", async (req, res) => {
    const { base64 } = req.body
    await cloudinary.uploader.destroy(`Avatar/${req.body.id}`).then(() => {
        cloudinary.uploader.upload(base64, {
            public_id: req.body.id, folder: "Avatar"
        }).then((result) => {
            getAccounts.updateOne({ _id: req.body.id }, {
                userimage: result.url
            }).then(() => {
                res.status(201).send("Thay avatar thành công!")
            })
        }).catch(() => {
            res.status(500).send("Thay avatar thất bại!")
        })
    })
})

// Add blog
app.post("/api/v1/AddBlog", (req, res) => {
    const blog = new Blogs({
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
    });
    blog.save().then((resa) => {
        cloudinary.uploader.upload(req.body.thumbnail, {
            public_id: resa._id, folder: "Blog"
        }).then((result) => {
            getBlogs.updateOne({ _id: resa._id }, {
                thumbnail: result.url
            }).then(() => {
                res.status(201).send("Tạo blog thành công!")
            })
        }).catch(() => {
            res.status(500).send("Tạo blog thất bại!")
        })
    }).catch(() => {
        res.status(500).send("Tạo blog thất bại!")
    })
})

// Get blogs
app.get("/api/v1/GetBlogs", async (req, res) => {
    const getOrder = await getBlogs.find(req.query.search ? { title: new RegExp(req.query.search, 'i') } : {}).sort({ createdAt: -1 })
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const start = (page - 1) * limit
    const end = page * limit

    const results = {}
    results.total = getOrder.length
    results.pageCount = Math.ceil(getOrder.length / limit)

    if (end < getOrder.length) {
        results.next = {
            page: page + 1
        }
    }
    if (start > 0) {
        results.prev = {
            page: page - 1
        }
    }

    results.result = getOrder.slice(start, end)
    res.send({ results });
})

// Get specific blog
app.get("/api/v1/GetSpecificBlog", async (req, res) => {
    await getBlogs.findOne({ _id: req.query.id }).then((resa) => {
        res.status(201).send(resa)
    })
})

// Delete Blog
app.post("/api/v1/DeleteBlog", async (req, res) => {
    await cloudinary.uploader.destroy(`Blog/${req.body.id}`).then(() => {
        getBlogs.deleteOne({ _id: req.body.id }).then(() => {
            res.status(201).send("Xóa blog thành công!")
        }).catch(() => {
            res.status(500).send("Xóa blog thất bại!")
        })
    }).catch(() => {
        res.status(500).send("Xóa blog thất bại!")
    })
})

// Update Blog
app.post("/api/v1/UpdateBlog", async (req, res) => {
    function updateThis(updateWhat) {
        getBlogs.updateOne({ _id: req.body.id }, updateWhat).exec()
    }
    if (req.body.title !== "") {
        updateThis({ title: req.body.title })
    }
    if (req.body.subtitle !== "") {
        updateThis({ subtitle: req.body.subtitle })
    }
    if (req.body.content !== "") {
        updateThis({ content: req.body.content })
    }
    if (req.body.thumbnail !== "") {
        await cloudinary.uploader.destroy(`Blog/${req.body.id}`).then(() => {
            cloudinary.uploader.upload(req.body.thumbnail, {
                public_id: req.body.id, folder: "Blog"
            }).then((result) => {
                updateThis({ thumbnail: result.url })
            }).catch(() => {
                return res.status(500).send("Cập nhật blog thất bại!")
            })
        }).catch(() => {
            return res.status(500).send("Cập nhật blog thất bại!")
        })
    }
    res.status(201).send("Cập nhật blog thành công!")
})

// add sample
app.post("/api/v1/AddSample", (req, res) => {
    const blog = new Samples({
        title: req.body.title,
        content: req.body.content,
        price: req.body.price,
        "rate.count": 0,
        "categories.data": req.body.categories,
        "categories.count": req.body.categories.length,
        "session.data": req.body.session,
        "session.count": req.body.session.length
    });
    blog.save().then((resa) => {
        cloudinary.uploader.upload(req.body.thumbnail, {
            public_id: resa._id, folder: "Sample"
        }).then((result) => {
            getSamples.updateOne({ _id: resa._id }, {
                thumbnail: result.url
            }).then(() => {
                res.status(201).send("Tạo hình thành công!")
            })
        }).catch(() => {
            res.status(500).send("Tạo hình thất bại!")
        })
    }).catch(() => {
        res.status(500).send("Tạo hình thất bại!")
    })
})

// Get all samples
app.get("/api/v1/GetAllSample", async (req, res) => {
    var getOrder = null
    if (parseInt(req.query.type) === 2) {
        getOrder = await getSamples.find(req.query.search ? { title: new RegExp(req.query.search, 'i') } : {}).sort({ createdAt: -1 })
    } else {
        const forSort = req.query.sorted === "Newtoold" ? { createdAt: -1 } : req.query.sorted === "Oldtonew" ? { createdAt: 1 } : req.query.sorted === "Bigsession" ? { "session.count": -1 } : req.query.sorted === "Smallsession" ? { "session.count": 1 } : req.query.sorted === "Highprice" ? { price: -1 } : req.query.sorted === "Lowprice" ? { price: 1 } : null
        getOrder = await getSamples.find(req.query.cate !== "All" ? { "categories.data.cate": { $in: req.query.cate.split(",").slice(1) } } : {}).sort(forSort)
    }
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const start = (page - 1) * limit
    const end = page * limit

    const results = {}
    results.total = getOrder.length
    results.pageCount = Math.ceil(getOrder.length / limit)

    if (end < getOrder.length) {
        results.next = {
            page: page + 1
        }
    }
    if (start > 0) {
        results.prev = {
            page: page - 1
        }
    }

    results.result = getOrder.slice(start, end)
    res.send({ results });
})

// Get Favourite
app.get("/api/v1/GetFavourites", async (req, res) => {
    const forSort = req.query.sorted === "Newtoold" ? { createdAt: -1 } : req.query.sorted === "Oldtonew" ? { createdAt: 1 } : req.query.sorted === "Bigsession" ? { "session.count": -1 } : req.query.sorted === "Smallsession" ? { "session.count": 1 } : req.query.sorted === "Highprice" ? { price: -1 } : req.query.sorted === "Lowprice" ? { price: 1 } : null
    const getOrder = await getSamples.find(req.query.cate !== "All" ? { "categories.data.cate": { $in: req.query.cate.split(",").slice(1), _id: { $in: JSON.parse(req.query.id) } } } : { _id: { $in: JSON.parse(req.query.id) } }).sort(forSort)
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const start = (page - 1) * limit
    const end = page * limit

    const results = {}
    results.total = getOrder.length
    results.pageCount = Math.ceil(getOrder.length / limit)

    if (end < getOrder.length) {
        results.next = {
            page: page + 1
        }
    }
    if (start > 0) {
        results.prev = {
            page: page - 1
        }
    }

    results.result = getOrder.slice(start, end)
    res.send({ results });
})

// Delete Sample
app.post("/api/v1/DeleteSample", async (req, res) => {
    await cloudinary.uploader.destroy(`Sample/${req.body.id}`).then(() => {
        getSamples.deleteOne({ _id: req.body.id }).then(() => {
            res.status(201).send("Xóa hình thành công!")
        }).catch(() => {
            res.status(500).send("Xóa hình thất bại!")
        })
    }).catch(() => {
        res.status(500).send("Xóa hình thất bại!")
    })
})

// Update Sample
app.post("/api/v1/UpdateSample", async (req, res) => {
    function updateThis(updateWhat) {
        getSamples.updateOne({ _id: req.body.id }, updateWhat).exec()
    }
    if (req.body.title !== "") {
        updateThis({ title: req.body.title, lastUpdate: Date.now() })
    }
    if (req.body.categories.length > 0) {
        updateThis({ "categories.data": req.body.categories, "categories.count": req.body.categories.length, lastUpdate: Date.now() })
    }
    if (req.body.session.length > 0) {
        updateThis({ "session.data": req.body.session, "session.count": req.body.session.length, lastUpdate: Date.now() })
    }
    if (req.body.content !== "") {
        updateThis({ content: req.body.conten, lastUpdate: Date.now() })
    }
    if (req.body.price && req.body.price !== "") {
        updateThis({ price: req.body.price, lastUpdate: Date.now() })
    } else {
        updateThis({ price: null, lastUpdate: Date.now() })
    }
    if (req.body.thumbnail !== "") {
        await cloudinary.uploader.destroy(`Sample/${req.body.id}`).then(() => {
            cloudinary.uploader.upload(req.body.thumbnail, {
                public_id: req.body.id, folder: "Sample"
            }).then((result) => {
                updateThis({ thumbnail: result.url, lastUpdate: Date.now() })
            }).catch(() => {
                return res.status(500).send("Cập nhật hình thất bại!")
            })
        }).catch(() => {
            return res.status(500).send("Cập nhật hình thất bại!")
        })
    }
    res.status(201).send("Cập nhật hình thành công!")
})

app.post("/api/v1/RateStar", (req, res) => {
    getSamples.updateOne({ _id: req.body.id }, {
        $push: {
            "rate.data": req.body.dataSend
        },
        $inc: {
            "rate.count": req.body.dataSend.star
        }
    }).then(() => {
        res.status(201).send("Đánh giá sao thành công!")
    }).catch(() => {
        res.status(500).send("Đánh giá sao thất bại!")
    })
})

// Add video gallery
app.post("/api/v1/AddVideoGallery", (req, res) => {
    const gallery = new Gallerys({
        title: "video",
        data: req.body.video
    });
    gallery.save().then(() => {
        res.status(201).send("Thêm video thành công!")
    }).catch(() => {
        res.status(500).send("Thêm video thất bại!")
    })
})

// Update video gallery
app.post("/api/v1/UpdateVideoGallery", (req, res) => {
    getGallerys.updateOne({ _id: req.body.id }, {
        data: req.body.video
    }).then(() => {
        res.status(201).send("Cập nhật video thành công!")
    }).catch(() => {
        res.status(500).send("Cập nhật video thất bại!")
    })
})

// Get all gallerys
app.get("/api/v1/GetGallerys", async (req, res) => {
    await getGallerys.find({}).then((resa) => {
        res.status(201).send(resa)
    })
})

// Add image gallery
app.post("/api/v1/AddImageGallery", (req, res) => {
    const gallery = new Gallerys({
        title: "image",
        data: req.body.image
    });
    gallery.save().then((resa) => {
        cloudinary.uploader.upload(req.body.image, {
            public_id: resa._id, folder: "Gallery"
        }).then((result) => {
            getGallerys.updateOne({ _id: resa._id }, {
                data: result.url
            }).exec()
            res.status(201).send("Thêm ảnh thành công!")
        }).catch(() => {
            res.status(500).send("Thêm ảnh thất bại!")
        })
    }).catch(() => {
        res.status(500).send("Thêm ảnh thất bại!")
    })
})

// Update image gallery
app.post("/api/v1/UpdateImageGallery", async (req, res) => {
    await cloudinary.uploader.destroy(`Gallery/${req.body.id}`).then(() => {
        cloudinary.uploader.upload(req.body.image, {
            public_id: req.body.id, folder: "Gallery"
        }).then((result) => {
            getGallerys.updateOne({ _id: req.body.id }, {
                data: result.url
            }).exec()
            res.status(201).send("Cập nhật ảnh thành công!")
        }).catch(() => {
            return res.status(500).send("Cập nhật ảnh thất bại!")
        })
    }).catch(() => {
        return res.status(500).send("Cập nhật ảnh thất bại!")
    })
})

//Delete image gallery
app.post("/api/v1/DeleteGallery", async (req, res) => {
    if (req.body.type === 1) {
        await cloudinary.uploader.destroy(`Gallery/${req.body.id}`).then(() => {
            getGallerys.deleteOne({ _id: req.body.id }).exec()
            res.status(201).send("Xóa ảnh thành công!")
        }).catch(() => {
            return res.status(500).send("Xóa ảnh thất bại!")
        })
    }
    else {
        getGallerys.deleteOne({ _id: req.body.id }).then(() => {
            res.status(201).send("Xóa video thành công!")
        }).catch(() => {
            return res.status(500).send("Xóa video thất bại!")
        })
    }
})




//                                              SOCKET IO

socketIo.on("connection", (socket) => {
    socket.on("BanAccount", function (data) {
        getAccounts.updateOne({ _id: data.id }, {
            "status.state": 2,
            "status.reason": data.reason
        }).then(() => {
            socketIo.emit("BanAccountSuccess", { id: data.id, Tokenid: data.Tokenid });
        }).catch(() => {
            socketIo.emit("BanAccountFail", { Tokenid: data.Tokenid });
        })
    })
})