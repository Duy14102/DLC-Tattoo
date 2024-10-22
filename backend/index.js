const express = require('express');
const rateLimit = require('express-rate-limit');
const http = require("http");
const https = require("https")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const app = express();
const server = http.createServer(app);

const apiLimiter = rateLimit({
    windowMs: 1000, // 1 second
    max: 10,
    handler: function (req, res) {
        res.status(429).send({
            status: 500,
            message: 'Truy vấn thất bại!',
        });
    },
    skip: (req, res) => {
        if (req.ip === '::ffff:127.0.0.1')
            return true;
        return false;
    }
});

// Refresh server
setInterval(() => {
    https.get(process.env.REACT_APP_apiAddress, () => {
        console.log("Refresh");
    })
}, 600000);

const cors = require('cors');
const corsOptions = {
    origin: 'https://dlctattoo.netlify.app',
    optionsSuccessStatus: 200,
};

const socketIo = require("socket.io")(server, {
    cors: {
        origin: "https://dlctattoo.netlify.app",
    }
});
app.use(cors(corsOptions));

// Connect to MongoDB
const mongoose = require('mongoose');
require('dotenv').config({ path: "../.env" })
mongoose.connect(process.env.REACT_APP_mongoAtlas).then(() => console.log('Connected To MongoDB')).catch((err) => { console.error(err); });

//Cloudinary
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.REACT_APP_cloudName_Cloudinary,
    api_key: process.env.REACT_APP_apiKey_Cloudinary,
    api_secret: process.env.REACT_APP_apiSecret_Cloudinary
});

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(express.json());

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
const Chats = require("./model/Chats");
const getChats = mongoose.model("Chats");
const Bookings = require("./model/Bookings");
const getBookings = mongoose.model("Bookings");

// Api

// Register
app.post("/api/v1/Register", apiLimiter, (req, res) => {
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
app.post("/api/v1/Login", apiLimiter, (req, res) => {
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
                        phone: user.phonenumber,
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
app.get("/api/v1/GetAccounts", apiLimiter, async (req, res) => {
    await getAccounts.findOne({ _id: req.query.id }).then((resa) => {
        const dataToSend = { phone: resa.phonenumber, image: resa.userimage, notification: resa.notification, todolist: resa.todolist }
        res.status(201).send(dataToSend)
    }).catch((err) => {
        res.status(404).send(err)
    })
})

// Get All Accounts
app.get("/api/v1/GetAllAccounts", apiLimiter, async (req, res) => {
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
app.post("/api/v1/DeleteAccount", apiLimiter, (req, res) => {
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
app.post("/api/v1/BanAccount", apiLimiter, (req, res) => {
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
app.post("/api/v1/UnbanAccount", apiLimiter, (req, res) => {
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
app.post("/api/v1/UpdatePhone", apiLimiter, async (req, res) => {
    const find = await getAccounts.findOne({ phonenumber: req.body.phone })
    if (find) {
        return res.status(404).send("Số điện thoại đã tồn tại!")
    }
    getAccounts.updateOne({ _id: req.body.id }, {
        phonenumber: req.body.phone
    }).then(() => {
        res.status(201).send("Thay đổi thành công!")
    }).catch((err) => console.log(err))
})

// Update password
app.post("/api/v1/UpdatePassword", apiLimiter, (req, res) => {
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
app.post("/api/v1/ChangeAvatar", apiLimiter, async (req, res) => {
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

// Update Notification
app.post("/api/v1/UpdateNotification", apiLimiter, async (req, res) => {
    const findEach = await getAccounts.findOne({ _id: req.body.id })
    const dataPush = []
    for (var i = 0; i < findEach.notification.length; i++) {
        findEach.notification[i].status = 2
        dataPush.push(findEach.notification[i])
    }
    getAccounts.updateOne({ _id: req.body.id }, {
        notification: dataPush
    }).then(() => {
        res.status(201).send({})
    })
})

// Update Notification Side
app.post("/api/v1/UpdateNotificationSide", apiLimiter, async (req, res) => {
    const findEach = await getAccounts.findOne({ _id: req.body.id })
    const dataPush = []
    for (var i = 0; i < findEach.notification.length; i++) {
        if (findEach.notification[i].place === req.body.update) {
            findEach.notification[i].status = 2
        }
        dataPush.push(findEach.notification[i])
    }
    getAccounts.updateOne({ _id: req.body.id }, {
        notification: dataPush
    }).then(() => {
        res.status(201).send({})
    })
})

// Add todoList
app.post("/api/v1/AddTodoList", apiLimiter, (req, res) => {
    const id = new mongoose.Types.ObjectId().toString()
    const addThis = { id: id, jobs: req.body.jobs, time: Date.now(), status: 1 }
    getAccounts.updateOne({ _id: req.body.id }, {
        $push: {
            todolist: addThis
        }
    }).then(() => {
        res.status(201).send("Thêm việc cần làm thành công!")
    }).catch(() => {
        res.status(500).send("Thêm việc cần làm thất bại!")
    })
})

// Update todoList
app.post("/api/v1/UpdateTodoList", apiLimiter, (req, res) => {
    getAccounts.updateOne({ _id: req.body.id, "todolist.id": req.body.jobsId }, {
        "todolist.$.status": req.body.status
    }).then(() => {
        res.status(201).send("Cập nhật việc thành công!")
    }).catch(() => {
        res.status(500).send("Cập nhật việc thất bại!")
    })
})

// Add blog
app.post("/api/v1/AddBlog", apiLimiter, (req, res) => {
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

// Get Blogs For Homepage
app.get("/api/v1/GetBlogsForHomepage", apiLimiter, async (req, res) => {
    try {
        const getBlogsOut = await getBlogs.find({}).limit(4)
        res.status(201).send(getBlogsOut)
    } catch (e) {
        console.log(e);
    }
})

// Get blogs
app.get("/api/v1/GetBlogs", apiLimiter, async (req, res) => {
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
app.get("/api/v1/GetSpecificBlog", apiLimiter, async (req, res) => {
    await getBlogs.findOne({ _id: req.query.id }).then((resa) => {
        res.status(201).send(resa)
    })
})

// Delete Blog
app.post("/api/v1/DeleteBlog", apiLimiter, async (req, res) => {
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
app.post("/api/v1/UpdateBlog", apiLimiter, async (req, res) => {
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
app.post("/api/v1/AddSample", apiLimiter, async (req, res) => {
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
app.get("/api/v1/GetAllSample", apiLimiter, async (req, res) => {
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
app.get("/api/v1/GetFavourites", apiLimiter, async (req, res) => {
    const forSort = req.query.sorted === "Newtoold" ? { createdAt: -1 } : req.query.sorted === "Oldtonew" ? { createdAt: 1 } : req.query.sorted === "Bigsession" ? { "session.count": -1 } : req.query.sorted === "Smallsession" ? { "session.count": 1 } : req.query.sorted === "Highprice" ? { price: -1 } : req.query.sorted === "Lowprice" ? { price: 1 } : null
    const getOrder = await getSamples.find(req.query.cate !== "All" ? { "categories.data.cate": { $in: req.query.cate.split(",").slice(1) }, _id: { $in: JSON.parse(req.query.id) } } : { _id: { $in: JSON.parse(req.query.id) } }).sort(forSort)
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
app.post("/api/v1/DeleteSample", apiLimiter, async (req, res) => {
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
app.post("/api/v1/UpdateSample", apiLimiter, async (req, res) => {
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
        updateThis({ content: req.body.content, lastUpdate: Date.now() })
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

app.post("/api/v1/RateStar", apiLimiter, (req, res) => {
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
app.post("/api/v1/AddVideoGallery", apiLimiter, (req, res) => {
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
app.post("/api/v1/UpdateVideoGallery", apiLimiter, (req, res) => {
    getGallerys.updateOne({ _id: req.body.id }, {
        data: req.body.video
    }).then(() => {
        res.status(201).send("Cập nhật video thành công!")
    }).catch(() => {
        res.status(500).send("Cập nhật video thất bại!")
    })
})

// Get all gallerys
app.get("/api/v1/GetGallerys", apiLimiter, async (req, res) => {
    await getGallerys.find({}).then((resa) => {
        res.status(201).send(resa)
    })
})

// Add image gallery
app.post("/api/v1/AddImageGallery", apiLimiter, (req, res) => {
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
app.post("/api/v1/UpdateImageGallery", apiLimiter, async (req, res) => {
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
app.post("/api/v1/DeleteGallery", apiLimiter, async (req, res) => {
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

// Get Chat Room
app.get("/api/v1/GetChatRoom", apiLimiter, async (req, res) => {
    await getChats.findOne({ createdBy: req.query.userId }).then((resa) => {
        res.status(201).send(resa)
    })
})

// Get Chat Room For Admin
app.get("/api/v1/GetChatRoomAdmin", apiLimiter, async (req, res) => {
    await getChats.find({}).then(async (room) => {
        const dataPush = []
        room.reduce((acc, curr) => { dataPush.push(curr.createdBy) }, 0)
        await getAccounts.find({ _id: { $in: dataPush } }).then((user) => {
            res.status(201).send({ room, user })
        })
    })
})

// Update Notification Chat Tabs
app.post("/api/v1/UpdateNotificationChatTabs", apiLimiter, async (req, res) => {
    const findEach = await getChats.findOne({ createdBy: req.body.id })
    const dataPush = []
    for (var i = 0; i < findEach.data.length; i++) {
        if (findEach.data[i].id !== req.body.adminId) {
            findEach.data[i].status = 2
        }
        dataPush.push(findEach.data[i])
    }
    getChats.updateOne({ createdBy: req.body.id }, {
        data: dataPush
    }).then(() => {
        res.status(201).send({})
    })
})

// Get Specific Booking
app.get("/api/v1/GetSpecBooking", apiLimiter, async (req, res) => {
    const dataPush = []
    const resa = await getBookings.findOne({ phone: req.query.phone, status: { $in: [1, 2] } })
    if (resa) {
        resa.samples?.filter((item, index) => item.type === 1 && resa.samples.indexOf(item) === index).reduce((acc2, curr2) => {
            dataPush.push(curr2.id)
        }, 0)
        const samples = await getSamples.find({ _id: dataPush })
        res.status(201).send({ resa, samples })
    }
})

// Update Booking
app.post("/api/v1/UpdateBooking", apiLimiter, (req, res) => {
    function updateThis(updateWhat) {
        getBookings.updateOne({ _id: req.body.id }, updateWhat).exec()
    }
    if (req.body.name !== "") {
        updateThis({ name: req.body.name })
    }
    if (req.body.phone !== "") {
        updateThis({ phone: req.body.phone })
    }
    if (req.body.date !== "") {
        updateThis({ date: req.body.date })
    }
    if (req.body.time !== "") {
        updateThis({ time: req.body.time })
    }
    if (req.body.note !== "") {
        updateThis({ note: req.body.note })
    }
    if (req.body.samples.length > 0) {
        updateThis({ samples: req.body.samples })
    }
    res.status(201).send({})
})

// Get Booking Admin
app.get("/api/v1/GetBookingAdmin", apiLimiter, async (req, res) => {
    const filterStatus = parseInt(req.query.filter)
    const getOrder = await getBookings.find(req.query.search ? { phone: new RegExp(req.query.search, 'i'), status: filterStatus !== 0 ? filterStatus : { $in: [1, 2, 3, 4] } } : { status: filterStatus !== 0 ? filterStatus : { $in: [1, 2, 3, 4] } }).sort({ status: 1, createdAt: -1 })
    const dataPush = []
    if (getOrder) {
        getOrder.reduce((acc, curr) => {
            curr.samples.filter((item, index) => item.type === 1 && curr.samples.indexOf(item) === index).reduce((acc2, curr2) => {
                dataPush.push(curr2.id)
            }, 0)
        }, 0)
    }
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const start = (page - 1) * limit
    const end = page * limit

    const results = {}
    results.total = getOrder.length
    results.pageCount = Math.ceil(getOrder.length / limit)
    if (dataPush.length > 0) {
        results.samples = await getSamples.find({ _id: dataPush })
    }

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

// Add sample booking
app.post("/api/v1/AddSamplesToBooking", apiLimiter, (req, res) => {
    var id = new mongoose.Types.ObjectId()
    const mainChatId = req.body.id + "_" + id
    cloudinary.uploader.upload(req.body.image, {
        public_id: mainChatId, folder: "Booking"
    }).then((result) => {
        const dataSamples = { id: mainChatId, title: req.body.title, price: req.body.price, image: result.url, payingSession: req.body.session, type: 2 }
        getBookings.updateOne({ _id: req.body.id }, {
            $push: {
                samples: dataSamples
            }
        }).exec()
        res.status(201).send("Thêm hình mẫu thành công!")
    }).catch(() => {
        return res.status(500).send("Thêm hình mẫu thất bại!")
    })
})

// Update price booking session
app.post("/api/v1/UpdateBookingSessionPrice", apiLimiter, async (req, res) => {
    const dataPush = []
    const dataPush2 = []
    if (!req.body.realSession || req.body.realSession.length < 1) {
        getBookings.updateOne({ _id: req.body.bookingId, samples: { $elemMatch: { id: req.body.sessionId } } }, {
            $push: {
                "samples.$.payingSession": req.body.price
            }
        }).then(() => {
            return res.status(201).send({})
        })
    } else {
        req.body.realSession.reduce((acc, curr) => {
            if (curr.sessionTitle.localeCompare(req.body.price.sessionTitle) === 0) {
                curr = req.body.price
                dataPush.push(curr)
            } else {
                dataPush2.push(curr)
            }
        }, 0)
        if (dataPush.length > 0) {
            getBookings.updateOne({ _id: req.body.bookingId, samples: { $elemMatch: { id: req.body.sessionId } } }, {
                "samples.$.payingSession": dataPush.concat(dataPush2)
            }).then(() => {
                return res.status(201).send({})
            })
        } else {
            getBookings.updateOne({ _id: req.body.bookingId, samples: { $elemMatch: { id: req.body.sessionId } } }, {
                $push: {
                    "samples.$.payingSession": req.body.price
                }
            }).then(() => {
                return res.status(201).send({})
            })
        }
    }
})

// Update price booking session 2
app.post("/api/v1/UpdateBookingSessionPrice2", apiLimiter, (req, res) => {
    getBookings.updateOne({ _id: req.body.bookingId, samples: { $elemMatch: { id: req.body.sessionId } } }, {
        "samples.$.payingSession": req.body.realSession
    }).then(() => {
        return res.status(201).send({})
    })
})

// Update Main Dish Of Booking
app.post("/api/v1/UpdateBookingMainDish", apiLimiter, async (req, res) => {
    function updateWhat(e) {
        getBookings.updateOne({ _id: req.body.bookingId, samples: { $elemMatch: { id: req.body.sessionId } } }, e).exec()
    }
    if (req.body.title && req.body.title !== "") {
        updateWhat({ "samples.$.title": req.body.title })
    }
    if (req.body.price !== "") {
        updateWhat({ "samples.$.price": req.body.price })
    } else if (req.body.price === "") {
        updateWhat({ "samples.$.price": "" })
    }
    if (req.body.image) {
        await cloudinary.uploader.destroy(`Booking/${req.body.sessionId}`).then(() => {
            cloudinary.uploader.upload(req.body.image, {
                public_id: req.body.sessionId, folder: "Booking"
            }).then((result) => {
                updateWhat({ "samples.$.image": result.url })
            }).catch(() => {
                return res.status(500).send("Cập nhật booking thất bại!")
            })
        }).catch(() => {
            return res.status(500).send("Cập nhật booking thất bại!")
        })
    }
    return res.status(201).send("Cập nhật booking thành công!")
})

// Delete Main Dish Of Booking
app.post("/api/v1/DeleteBookingMainDish", apiLimiter, async (req, res) => {
    await cloudinary.uploader.destroy(`Booking/${req.body.sessionId}`).then(() => {
        getBookings.updateOne({ _id: req.body.bookingId }, {
            $pull: {
                samples: { id: req.body.sessionId }
            }
        }).then(() => {
            return res.status(201).send("Xóa booking thành công!")
        })
    }).catch(() => {
        return res.status(500).send("Xóa booking thất bại!")
    })
})

// Update real booking
app.post("/api/v1/UpdateRealBooking", apiLimiter, (req, res) => {
    function updateWhat(e) {
        getBookings.updateOne({ _id: req.body.id }, e).exec()
    }
    if (req.body.name && req.body.name !== "") {
        updateWhat({ name: req.body.name })
    }
    if (req.body.phone && req.body.phone !== "") {
        updateWhat({ phone: req.body.phone })
    }
    if (req.body.date && req.body.date !== "") {
        updateWhat({ date: req.body.date })
    }
    if (req.body.time && req.body.time !== "") {
        updateWhat({ time: req.body.time })
    }
    if (req.body.note && req.body.note !== "") {
        updateWhat({ note: req.body.note })
    }
    return res.status(201).send("Cập nhật booking thành công!")
})

// Add samples type 1
app.post("/api/v1/AddSamplesType1Booking", apiLimiter, (req, res) => {
    getBookings.updateOne({ _id: req.body.id }, {
        $push: {
            samples: req.body.samples.reduce((acc, curr) => { return curr }, 0)
        }
    }).exec()
    res.status(201).send("Thêm mẫu thành công!")
})

// Fetch Dashboard
app.get("/api/v1/FetchDashboard", apiLimiter, async (req, res) => {
    const dataAccounts = [], dataSamples = [], dataBlogs = [], dataBookingSuccess = [], dataBookingFail = [], dataSamplesPie = [], dataGallery = [], dataTotalPriceBooking = []
    const DateNow = Date.now()
    await getAccounts.find({}).then((resAccounts) => {
        resAccounts.reduce((acc, curr) => {
            if (new Date(curr.createdAt).getFullYear() === new Date(DateNow).getFullYear()) {
                dataAccounts.push({ month: new Date(curr.createdAt).getMonth() + 1 })
            }
        }, 0)
    })
    await getSamples.find({}).then((resSamples) => {
        resSamples.reduce((acc, curr) => {
            if (new Date(curr.createdAt).getFullYear() === new Date(DateNow).getFullYear()) {
                dataSamples.push({ month: new Date(curr.createdAt).getMonth() + 1 })
            }
            curr.categories.data.reduce((ac2, cur2) => {
                dataSamplesPie.push({ cate: cur2 })
            }, 0)
        }, 0)
    })
    await getBlogs.find({}).then((resBlogs) => {
        resBlogs.reduce((acc, curr) => {
            if (new Date(curr.createdAt).getFullYear() === new Date(DateNow).getFullYear()) {
                dataBlogs.push({ month: new Date(curr.createdAt).getMonth() + 1 })
            }
        }, 0)
    })
    await getBookings.find({}).then((resBooking) => {
        resBooking.reduce((acc, curr) => {
            if (new Date(curr.createdAt).getFullYear() === new Date(DateNow).getFullYear()) {
                if (curr.status === 3) {
                    dataBookingSuccess.push({ month: new Date(curr.createdAt).getMonth() + 1 })
                }
                if (curr.status === 4) {
                    dataBookingFail.push({ month: new Date(curr.createdAt).getMonth() + 1 })
                }
                dataTotalPriceBooking.push({ money: curr.totalPrice, month: new Date(curr.createdAt).getMonth() + 1 })
            }

        }, 0)
    })
    await getGallerys.find({}).then((resSamples) => {
        resSamples.reduce((acc, curr) => {
            dataGallery.push({ title: curr.title })
        }, 0)
    })
    res.send({ dataAccounts, dataBlogs, dataSamples, dataBookingSuccess, dataBookingFail, dataSamplesPie, dataGallery, dataTotalPriceBooking })
})






//                                              SOCKET IO

socketIo.on("connection", (socket) => {
    apiLimiter
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

    socket.on("ChatStart", function (data) {
        apiLimiter
        const chats = new Chats({
            createdBy: data.userId
        })
        chats.save().then(() => {
            const dated = { title: "Bạn đã tạo 1 phòng chat", place: "Chat", time: Date.now(), status: 1 }
            const dated2 = { title: "1 phòng chat đã được tạo", place: "Chat", time: Date.now(), status: 1 }
            getAccounts.updateOne({ _id: data.userId }, {
                $push: {
                    notification: dated
                }
            }).exec()
            getAccounts.updateMany({ role: 2 }, {
                $push: {
                    notification: dated2
                }
            }).exec()
            socketIo.emit("ChatStartSuccess", { id: data.userId });
        }).catch(() => {
            socketIo.emit("ChatStartFail", { id: data.userId });
        })
    })

    socket.on("ChatSend", function (data) {
        apiLimiter
        var id = new mongoose.Types.ObjectId()
        const mainChatId = data.roomId + "_" + id
        if (data.image) {
            cloudinary.uploader.upload(data.image, {
                public_id: mainChatId, folder: `Chat/${data.roomId}`
            }).then((result) => {
                getChats.updateOne({ _id: data.roomId }, {
                    $push: {
                        data: { chatId: mainChatId, id: data.userId, chat: data.chat, image: result.url, time: Date.now(), status: 1 }
                    }
                }).then(() => {
                    socketIo.emit("ChatSendSuccess", { id: data.userId });
                })
            }).catch((err) => {
                console.log(err);
            })
        } else {
            getChats.updateOne({ _id: data.roomId }, {
                $push: {
                    data: { chatId: mainChatId, id: data.userId, chat: data.chat, time: Date.now(), status: 1 }
                }
            }).then(() => {
                socketIo.emit("ChatSendSuccess", { id: data.userId });
            })
        }
    })

    socket.on("ChatSendAdmin", function (data) {
        apiLimiter
        var id = new mongoose.Types.ObjectId()
        const mainChatId = data.roomId + "_" + id
        if (data.image) {
            cloudinary.uploader.upload(data.image, {
                public_id: mainChatId, folder: `Chat/${data.roomId}`
            }).then((result) => {
                getChats.updateOne({ _id: data.roomId }, {
                    $push: {
                        data: { chatId: mainChatId, id: data.userId, chat: data.chat, image: result.url, time: Date.now(), status: 1 }
                    }
                }).then(() => {
                    socketIo.emit("ChatSendAdminSuccess", { userId: data.userId, adminId: data.adminId });
                })
            }).catch((err) => {
                console.log(err);
            })
        } else {
            getChats.updateOne({ _id: data.roomId }, {
                $push: {
                    data: dated
                }
            }).then(() => {
                socketIo.emit("ChatSendAdminSuccess", { userId: data.userId, adminId: data.adminId });
            })
        }
    })

    socket.on("DeleteChat", async function (data) {
        apiLimiter
        await cloudinary.api.delete_resources_by_prefix(`Chat/${data.roomId}`).then(async () => {
            await cloudinary.api.delete_folder(`Chat/${data.roomId}`).then(() => {
                getChats.deleteOne({ _id: data.roomId }).then(() => {
                    const dated2 = { title: "Phòng chat bị đóng!", place: "Chat", time: Date.now(), status: 1 }
                    getAccounts.updateMany({ _id: data.userId }, {
                        $push: {
                            notification: dated2
                        }
                    }).exec()
                    socketIo.emit("DeleteChatSuccess", { userId: data.userId, adminId: data.adminId });
                })
            })
        }).catch(() => {
            getChats.deleteOne({ _id: data.roomId }).then(() => {
                const dated2 = { title: "Phòng chat bị đóng!", place: "Chat", time: Date.now(), status: 1 }
                getAccounts.updateMany({ _id: data.userId }, {
                    $push: {
                        notification: dated2
                    }
                }).exec()
                socketIo.emit("DeleteChatSuccess", { userId: data.userId, adminId: data.adminId });
            })
        })
    })

    socket.on("AddBooking", async function (data) {
        apiLimiter
        var dataPhone = null
        if (data.tokenId) {
            const dataFind = await getAccounts.findOne({ _id: data.tokenId })
            dataPhone = dataFind.phonenumber
        }
        const booking = new Bookings({
            name: data.name,
            phone: data.tokenId ? dataPhone : data.phone,
            date: data.date,
            time: data.time,
            note: data.note,
            samples: data.samples,
            status: 1
        })
        const dated2 = { title: "1 đơn booking mới", place: "Booking", time: Date.now(), status: 1 }
        booking.save().then(() => {
            getAccounts.updateMany({ role: 2 }, {
                $push: {
                    notification: dated2
                }
            }).exec()
            socketIo.emit("AddBookingSuccess", { phone: data.tokenId ? dataPhone : data.phone });
        }).catch(() => {
            socketIo.emit("AddBookingFail", { phone: data.phone });
        })
    })

    socket.on("CancelBooking", function (data) {
        apiLimiter
        const dated2 = { title: "1 đơn booking bị hủy", place: "Booking", time: Date.now(), status: 1 }
        getBookings.updateOne({ _id: data.id }, {
            status: 4,
            cancelReason: data.reason
        }).then(() => {
            getAccounts.updateMany({ role: 2 }, {
                $push: {
                    notification: dated2
                }
            }).exec()
            socketIo.emit("CancelBookingSuccess", { phone: data.phone });
        })
    })

    socket.on("CancelBookingByAdmin", function (data) {
        apiLimiter
        getBookings.updateOne({ _id: data.bookingId }, {
            status: 4,
            cancelReason: data.reason
        }).then(() => {
            const dated2 = { title: "Booking bị hủy bởi admin!", place: "Booking", time: Date.now(), status: 1 }
            getAccounts.updateMany({ phonenumber: data.phone }, {
                $push: {
                    notification: dated2
                }
            }).exec()
            socketIo.emit("CancelBookingByAdminSuccess", { adminId: data.adminId, phone: data.phone });
        })
    })

    socket.on("ConfirmBooking", function (data) {
        apiLimiter
        getBookings.updateOne({ _id: data.bookingId }, {
            status: 2,
        }).then(() => {
            const dated2 = { title: "Booking đã được xác nhận!", place: "Booking", time: Date.now(), status: 1 }
            getAccounts.updateMany({ phonenumber: data.phone }, {
                $push: {
                    notification: dated2
                }
            }).exec()
            socketIo.emit("ConfirmBookingSuccess", { adminId: data.adminId, phone: data.phone });
        })
    })

    socket.on("DoneBooking", function (data) {
        apiLimiter
        getBookings.updateOne({ _id: data.bookingId }, {
            status: 3,
            totalPrice: parseInt(data.priceDone)
        }).then(() => {
            const dated2 = { title: "Booking đã thành công!", place: "Booking", time: Date.now(), status: 1 }
            getAccounts.updateMany({ phonenumber: data.phone }, {
                $push: {
                    notification: dated2
                }
            }).exec()
            socketIo.emit("DoneBookingSuccess", { adminId: data.adminId, phone: data.phone });
        })
    })
})