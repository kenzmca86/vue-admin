/* eslint-disable no-console */
/*jshint esversion: 6 */
/*jshint node: true */

var express = require("express");
var bodyParser = require("body-parser");
var https = require("https");
var jwt = require("jsonwebtoken");
var http = require('http');
var fs = require("fs");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var mysql = require("mysql");
const path = require('path');

require("dotenv").config();

var database = require("./database.js");

var pkey = fs.readFileSync("config_keys/oms-cloud.com.key", "utf8");
var cert = fs.readFileSync("config_keys/oms-cloud.com.crt", "utf8");
var dad1 = fs.readFileSync("config_keys/gd_bundle.crt", "utf8");
var dad2 = fs.readFileSync("config_keys/gd_bundle.crt", "utf8");

var app = express();
app.set("superSecret", process.env.SUPER_SECRET);
app.set("sessionSecret", process.env.SESSION_SECRET);
app.set("trust proxy", 1);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//json error handling
app.use(function (error, request, response, next) {
  if (error) {
    console.error('json error', error);
    return response.json({
      Status: "Error",
      Message: "Error has occured! Please contact your administrator."
    });
  }
  return next();
});

var mysqlstore_options = {
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
  createDatabaseTable: true,
  connectionLimit: 20,
  endConnectionOnClose: true
};

//Session Pooling
var session_config = {
  host: 'localhost',
  port: "3306",
  database: 'session',
  user: 'root',
  password: 'ecom@1',
  connectionLimit: 20,
  timeout: 90000,
  connectTimeout: 30000,
  acquireTimeout: 30000
};

var sessionpool = mysql.createPool(session_config);
var sessionStore = new MySQLStore(mysqlstore_options, sessionpool);
var session_config = {
  secret: app.get("sessionSecret"),
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    name: 'eAPP_cookie',
    path: '/', 
    sameSite: true,
    httpOnly: true, 
    maxAge: 1 * 60 * 60 * 1000,
    secure: true
  }
};

app.use(session(session_config));

var db_config = {
  host: 'localhost',
  port: '3306',
  database: 'ecomm',
  user: 'root',
  password: 'ecom@1',
  connectionLimit: 20,
  timeout: 90000,
  connectTimeout: 30000,
  acquireTimeout: 30000
};

// ---------------------------------------- Common functions starts ------------------------------------
function errorHandler (err) {
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error(
        "/!\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
      reconnect();
    } else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
      console.error(
        "/!\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
      reconnect();
    } else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
      console.error(
        "/!\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
      reconnect();
    } else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
      console.error(
        "/!\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
    } else {
		console.log(err)
      console.error(
        "/!\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
      reconnect();
    }
  console.log(err);
}

function reconnect(err, functionname) {
  console.error(functionname);
  if(pool) {
      pool.removeListener('error', errorHandler);
      pool.end(function (err) {
          // all connections in the pool have ended
          console.error(err);
      });
  }
  //- Create a new one
  pool = mysql.createPool(db_config);
  //- Try to reconnect
  pool.getConnection(function (err) {
      if (err) {
          console.error(err);
      }
  });
console.log(db_config)
  database.createPool(pool, reconnect);
  console.error(new Date());
  console.error("Error occured in : " + functionname);
  console.error("Problem with db connection. Please retry after 1 mins.");
  console.error(err);
}

function extend(target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
}

function setResultStatus(
  response,
  functionname,
  status,
  statusmessage,
  result
) {
  if (status === "error") {
    console.error(new Date());
    console.error("Error occured in : " + functionname);
    console.error(result);
    response.status(403).send({ status: status, statusmessage: statusmessage });
  } else {
    response
      .status(200)
      .send({ status: status, statusmessage: statusmessage, result: result });
  }
  response.end();
}
// ---------------------------------------- Common functions ends ------------------------------------

var pool = mysql.createPool(db_config);
pool.on("error", errorHandler);
database.createPool(pool, reconnect);

// Create a server
var server = http.createServer({
    key: pkey,
    cert: cert,
    ca: [dad1, dad2]
  },
  app
);

//Lets start our server
server.timeout = 60 * 60 * 1000;

server.listen(process.env.VUE_APP_SERVER_PORT, process.env.VUE_APP_SERVER_IP, function () {
  //Callback triggered when server is successfully listening. Hurray!
  console.log("Server listening on: http://localhost:%s%s", process.env.VUE_APP_SERVER_PORT, process.env.VUE_APP_API_PROD_URL);
});


// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST");
//   res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,xsrf-token,Content-Type");
//   res.setHeader("Access-Control-Expose-Headers", "xsrf-token");
//   res.setHeader("Content-Type", "application/json");
//   // Set to true if you need the website to include cookies in the requests sents
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });

// CORS
// if (process.env.VUE_APP_DEPLOYMENT === "DEV") {
//   var cors = require("cors");
//   app.use(cors());
// }
var cors = require("cors");
app.use(cors());
// ---------------------------------------------------------------------------
// authentication without middleware
// ---------------------------------------------------------------------------
console.log(process.env.VUE_APP_API_PROD_URL + "/authenticate");

// app.post(process.env.VUE_APP_API_PROD_URL +"/login", function (req, res) {
//   var data = extend({}, req.decoded, req.body);
//   database.authenticate(data, function (resultdata) {
//     res.end(JSON.stringify(resultdata));
//   });
// });

app.post(process.env.VUE_APP_API_PROD_URL + "/login", function (req, res) {
  database.authenticate(req.body, function (data) {
    var jsondata = data.result;
    var token = "";
    var userid = 0;
    var userrole = 0;
    if (jsondata && jsondata.userid && jsondata.userid > 0) {
      userid = jsondata.userid;
      token = jwt.sign({ userid : jsondata.userid }, app.get("superSecret"), {
        expiresIn: 60 * 60 * 1000
      });
    } 
    console.log(jsondata)
    setResultStatus(res, "authenticate", data.status, data.statusmessage, {
      token: token,
      loginid: userid,
      loginrole: userrole,
    });

  });
});

// -------------------------------------- api routes starts --------------------------------------------
var apiRoutes = express.Router();
// Extend session
apiRoutes.post("/extend", function (req, res) {
  var token =
    req.body.token || req.headers["x-access-token"] || req.query.token;
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get("superSecret"), function (err, decoded) {
      if (!err) {
        // if user is found and password is right
        // create a token
        var logindata = {
          organizationid: decoded.organizationid,
          userid: decoded.userid,
          loginfacility: decoded.loginfacility,
          loginid: decoded.loginid
        };
        req.session.organizationid = decoded.organizationid;
        req.session.userid = decoded.userid;
        req.session.loginid = decoded.loginid;
        req.session.loginfacility = decoded.loginfacility;
        req.session.save();
        var token = jwt.sign(logindata, app.get("superSecret"), {
          expiresIn: 60 * 60 * 1000
        });
        setResultStatus(res, "extend", "success", "", {
          token: token,
          organizationid: decoded.organizationid,
          username: decoded.username,
          loginfacility: decoded.loginfacility,
          loginuser: decoded.loginuser,
          loginid: decoded.loginid,
          uid: decoded.uid,
          guid: decoded.guid
        });
      } else {
        setResultStatus(res, "extend", "error", "", {
          token: "",
          organizationid: 0,
          username: "",
          loginfacility: 0,
          loginuser: "",
          loginid: 0,
          uid: 0,
          guid: ""
        });
      }
    });
  }
});

// Middleware
apiRoutes.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token =
    req.body.token || req.headers["x-access-token"] || req.query.token;
    
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get("superSecret"), function (err, decoded) {
      if (!err) {
        if (process.env.VUE_APP_DEPLOYMENT === "DEV") {
          req.decoded = decoded;
          next();
        } else if (process.env.VUE_APP_DEPLOYMENT === "PROD") {
          // console.log(req.session.userid)
          // if (req.session.userid === decoded.userid) {
          //   req.decoded = decoded;
          //   next();
          // } else {
          //   setResultStatus(res, 'middleware', 'error', 'Failed to authenticate token.', null);
          // }
          req.decoded = decoded;
          next();
        }
      } else {
        setResultStatus(
          res,
          "middleware",
          "error",
          "Failed to authenticate token.",
          null
        );
      }
    });
  } else {
    // if there is no token
    // return an error
    setResultStatus(res, "middleware", "error", "No token provided.", null);
  }
});

// get_service_masters

apiRoutes.post("/getcustomeremails", function (req, res) {
  var data = extend({}, req.decoded, req.body);
  database.get_customer_emails(data, function (resultdata) {
    res.end(JSON.stringify(resultdata));
  });
});


apiRoutes.use(function (err, req, res, next) {
  if (err) {
    setResultStatus(res, 'Error from middleware', 'error', 'session has expired or tampered with', err);
  }
});

app.use(process.env.VUE_APP_API_PROD_URL + "/api", apiRoutes);

// -------------------------------------- api routes ends ---------------------------------------------

// Used to display html client view
app.use(process.env.VUE_APP_API_PROD_URL, express.static("dist"));
app.use(process.env.VUE_APP_API_PROD_URL, express.static(__dirname + '/category_images'))
app.use(process.env.VUE_APP_API_PROD_URL, express.static(__dirname + '/product_images'))
