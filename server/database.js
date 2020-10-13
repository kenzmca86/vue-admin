/* eslint-disable no-console */
/*jshint esversion: 6 */
/*jshint node: true */

const crypto = require('crypto');
const rand = require("random-key");
require("dotenv").config();
const inetp = "localhost:8000";
const key = Buffer.from(process.env.ED_EK.substring(inetp.length), 'base64').toString('utf8');
const ivlogin = Buffer.from(process.env.ED_EKL.substring(inetp.length), 'base64').toString('utf8');
var pool, reconnect;
const path = require('path');
var axios = require('axios')
var multer = require('multer');
var fs = require("fs");
const { errorMonitor } = require('events');

function createPool(db_pool, db_reconnect) {
    pool = db_pool;
    reconnect = db_reconnect;
}

function setResultStatus(functionname, status, statusmessage, result) {
    if (status === "error") {
        console.error(new Date());
        console.error("Error occured in : " + functionname);
        console.error(result);
        return ({
            status: status,
            statusmessage: statusmessage
        });
    } else {
        return ({
            status: status,
            statusmessage: statusmessage,
            result: result
        });
    }
}

function calculateAge(dob) {
    var date = new Date();
    var diff = date - dob;
    var diffdays = diff / 1000 / (60 * 60 * 24);
    var age = Math.floor(diffdays / 365.25);
    return age;
}

function encrypt(text) {
    var cipher = crypto.createCipheriv('aes-256-cbc', key, ivlogin);
    var enc = cipher.update(text, 'utf8', 'base64');
    enc += cipher.final('base64');
    return enc;
}

function decrypt(text) {
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, ivlogin);
    var dec = decipher.update(text, 'base64', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function authenticate(body, callback) {
    var username = body.username;
    var password = body.password;
    pool.getConnection(function (err, connection) {
        if (err) {
            reconnect('login');
        } else {            
            connection.query("Select userid, fullname from user where username=? and password=?", [username, password], function (error, rows, res) {
                connection.release(); // <-- must be here, AFTER you finished your query and before err handling
                if (error) {
                    callback(setResultStatus('authenticate', 'error', 'Oops! There was an error occured.', error));
                } else {
                    if (rows && rows.length > 0) {
                        callback(setResultStatus('authenticate', 'success', '', {
                            userid: rows[0].userid
                        }));
                    }
                    else{
                        callback(setResultStatus('authenticate', 'error', 'Invalid username or password!', ''));
                    }                    
                }
            });
        }
    });
}

//Get Service Master
function get_service_masters(body, callback) {
    // var organizationid = body.organizationid;
    // var uid = body.uid;
    pool.getConnection(function (err, connection) {
        if (err) {
            reconnect('get_service_masters');
        } else {
            connection.query("CALL `get_service_masters`()", [], function (error, rows, res) {
                connection.release(); // <-- must be here, AFTER you finished your query and before err handling
                var arr_service_masters = {};
                if (error) {
                    callback(setResultStatus('get_service_masters', 'error', 'Oops! There was an error occured.', error));
                } else {
                    if (rows) {
                        var arrNames = ['category', 'subcategory', 'transaction', 'transactioncategory', 'transactionsubcategory'];
                        //Rename key values in JS Array
                        for (var i = 0; i < rows.length; i++) {
                            arr_service_masters[arrNames[i]] = rows[i];
                        }
                    }
                    callback(setResultStatus('get_service_masters', 'success', '', arr_service_masters));
                }
            });
        }
    });
}

// Perform CRUD for transaction type one
function manupulate_transactypeone(body, callback) {
    var formData = body.transactionForm;
    pool.getConnection(function (err, connection) {
        if (err) {
            reconnect('manupulate_transactypeone');
        } else {
            connection.query("CALL `stp_transaction_IUD`(?, ?, ?, ?, ?)", [
                formData.params,
                formData.transactionid,
                formData.subcategoryid,                
                formData.name_en,
                formData.name_ar
            ], function (error, rows, res) {
                connection.release(); // <-- must be here, AFTER you finished your query and before err handling
                if (error) {
                    callback(setResultStatus('manupulate_transactypeone', 'error', 'Oops! There was an error occured.', error));
                } else {
                    callback(setResultStatus('manupulate_transactypeone', 'success', '', rows[0]));
                }
            });
        }
    });
}


function manupulate_users(body, callback) {
    var formData = body.users;
    var category = formData.selectedcategory;
    // construct users catetory
    let Query = "INSERT INTO `usercompany` (userid, companyid) values ";
    let query_ = "";    
    if(category !== undefined && category.length > 0){        
        let queryList = "";
        category.map((obj,idx) => {
            if(idx+1 !== category.length)
                queryList += `("$",${obj}),`;
            else
                queryList += `("$",${obj})`;
        });
        query_ = Query + queryList + ";";
    }
    pool.getConnection(function (err, connection) {
        if (err) {
            reconnect('manupulate_users');
        } else {
            connection.query("CALL `stp_users_IUD`(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                formData.params,
                formData.userid,
                formData.userroleid,
                formData.username,
                formData.password,
                formData.name_en,
                formData.name_ar,
                formData.email,
                formData.mobile,
                query_
            ], function (error, rows, res) {
                connection.release(); // <-- must be here, AFTER you finished your query and before err handling
                if (error) {
                    callback(setResultStatus('manupulate_users', 'error', 'Oops! There was an error occured.', error));
                } else {
                    callback(setResultStatus('manupulate_users', 'success', '', rows[0]));
                }
            });
        }
    });
}

//Get users category
function get_usercategory(body, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            reconnect('get_usercategory');
        } else {
            connection.query("CALL `get_usercategory`(?)", [body.userid], function (error, rows, res) {
                connection.release(); // <-- must be here, AFTER you finished your query and before err handling
                if (error) {
                    callback(setResultStatus('get_usercategory', 'error', 'Oops! There was an error occured.', error));
                } else {
                    callback(setResultStatus('get_usercategory', 'success', '', rows[0]));
                }
            });
        }
    });
}


//Get orders
function get_orders(body, callback) {
    var categoryid = body.categoryid;
    var statusid = body.statusid;
    var userid = body.assignedby;
    pool.getConnection(function (err, connection) {
        if (err) {
            reconnect('get_orders');
        } else {
            connection.query("CALL `get_orders`(?,?,?)", [categoryid, statusid, userid], function (error, rows, res) {
                connection.release(); // <-- must be here, AFTER you finished your query and before err handling
                if (error) {
                    callback(setResultStatus('get_orders', 'error', 'Oops! There was an error occured.', error));
                } else {
                    callback(setResultStatus('get_orders', 'success', '', rows[0]));
                }
            });
        }
    });
}


function getQueryString(data = {}) {
    return Object.entries(data)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
}

// app.post('/upload-profile-pic', (req, res) => {
//     // 'profile_pic' is the name of our file input field in the HTML form
//     let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('profile_pic');

//     upload(req, res, function(err) {
//         // req.file contains information of uploaded file
//         // req.body contains information of text fields, if there were any

//         if (req.fileValidationError) {
//             return res.send(req.fileValidationError);
//         }
//         else if (!req.file) {
//             return res.send('Please select an image to upload');
//         }
//         else if (err instanceof multer.MulterError) {
//             return res.send(err);
//         }
//         else if (err) {
//             return res.send(err);
//         }

//         // Display uploaded image for user validation
//         res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
//     });
// });

// app.post('/categoryupload', (req, res) => {
//     // 'profile_pic' is the name of our file input field in the HTML form
//     let upload = multer({ storage: category_storage}).single('category');

//     upload(req, res, function(err) {
//         // req.file contains information of uploaded file
//         // req.body contains information of text fields, if there were any

//         if (req.fileValidationError) {
//             return res.send(req.fileValidationError);
//         }
//         else if (!req.file) {
//             return res.send('Please select an image to upload');
//         }
//         else if (err instanceof multer.MulterError) {
//             return res.send(err);
//         }
//         else if (err) {
//             return res.send(err);
//         }

//         // Display uploaded image for user validation
//         res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
//     });
// });

const category_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname +'category_images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
       crypto.pseudoRandomBytes
    //    crypto.pseudoRandomBytes(16, function(err, raw) {
    //     if (err) return callback(err);
      
    //     callback(null, raw.toString('hex') + path.extname(file.originalname));
    //   });
    }
});

// app.post('/productupload', (req, res) => {
//     // 10 is the limit I've defined for number of uploaded files at once
//     // 'multiple_images' is the name of our file input field
//     let upload = multer({ storage: product_storage}).array('multiple_images', 5);

//     upload(req, res, function(err) {

//         if (req.fileValidationError) {
//             return res.send(req.fileValidationError);
//         }
//         else if (!req.file) {
//             return res.send('Please select an image to upload');
//         }
//         else if (err instanceof multer.MulterError) {
//             return res.send(err);
//         }
//         else if (err) {
//             return res.send(err);
//         }

//         let result = "You have uploaded these images: <hr />";
//         const files = req.files;
//         let index, len;

//         // Loop through all the uploaded images and display them on frontend
//         for (index = 0, len = files.length; index < len; ++index) {
//             result += `<img src="${files[index].path}" width="300" style="margin-right: 20px;">`;
//         }
//         result += '<hr/><a href="./">Upload more images</a>';
//         res.send(result);
//     });
// });

const product_storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, __dirname +'product_images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

module.exports = {
    createPool: createPool,
    authenticate: authenticate,
    get_service_masters: get_service_masters,
    manupulate_transactypeone: manupulate_transactypeone,
    manupulate_users: manupulate_users,
    get_usercategory: get_usercategory,
    get_orders: get_orders,
};