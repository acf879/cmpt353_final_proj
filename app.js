var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs = require('fs');
var dbCreated = false;
var app = express();

var messagesNumber = 0;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(cors());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // react app
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // react app
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // react app
  res.setHeader('Access-Control-Allow-Credentials', true); // react app
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({extended: false} ));

var data,channels,replies,users, searchPost, searchChannel, searchReply = {} // getters and setter variables to allow for retrieval of data from database

function setData(result) {
  data = result;
}

function getData() {
  return data;
}

function setChannels(result) {
  channels = result;
}

function getChannels() {
  return channels;
}

function setReplies(result) {
  replies = result;
}

function getReplies() {
  return replies;
}

function setUsers(result) {
  users = result;
}

function getUsers() {
  return users;
}

function setSearchChannel(result) {
  searchChannel = result;
}

function getSearchChannel() {
  return searchChannel;
}

function setSearchPost(result) {
  searchPost = result;
}

function getSearchPost() {
  return searchPost;
}

function setSearchReply(result) {
  searchReply = result;
}

function getSearchReply() {
  return searchReply;
}


function inChannels(req, res) {
    connection.query("INSERT INTO channels (title, user) VALUES ('" + req.body.title + "', '" + req.params.user + "');", function (err, result) {
      if (err) console.log(err);
      createPostTable(req.body.title);
    });
}

function inMessages(req, res, channelName) {
  console.log(req.body);
  connection.query("INSERT INTO `channel_" + channelName + "_posts` (title, body, user, fileName, file) VALUES ('" + req.body.title + "', '" + req.body.body +  "', '" + req.params.user +  "', '" + req.body.file.fileName + "', '" +  req.body.file.file + "');", function (err, result) {
    if (err) console.log(err);
  });
  createReplyTable(channelName, req.body.title);
}

function outChannels() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM channels", function (err, result, fields) {
      if (err) console.log(err);
      setChannels(result);
      resolve(result);
    });
  });
}

function outMessages(channelName) {
      return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM `channel_" + channelName + "_posts`;", function (err, result, fields) { // messages
      if (err) console.log(err);
      console.log(result);
      setData(result);
      resolve(result);
    });
  });
}

app.delete("/deleteChannel/:channelName", (req, res) => {
  var postNames = [];
  try {
  connection.query("SELECT * FROM channels WHERE title='" + req.params.channelName + "';", function (err, result, fields) {
    for (var key in result) {
      postNames.push(result[key]['title']);
    }
  });
} catch (err) {
}
try {
  connection.query("DELETE FROM channels WHERE title='" + req.params.channelName + "';", function (err, result, fields) {
    if (err) console.log(err);
  });
} catch (err) {
}
try {
  connection.query("DROP TABLE `channel_" + req.params.channelName + "_posts`;", function (err, result, fields) {
    if (err) console.log(err);
  });
  } catch (err) {
  }
  try {
  for (var key in postNames) {
    connection.query("DROP TABLE `channel_" + req.params.channelName + "_post_" + postNames[key] + "_replies`;", function (err, result, fields) {
      if (err) console.log(err);
    });
  }
  } catch (err) {
  }
});
  
  app.delete("/deletePost/:channelName/:postName", (req, res) => {
    try {
    connection.query("DELETE FROM `channel_" + req.params.channelName + "_posts` WHERE title='" + req.params.postName + "';", function (err, result, fields) {
      if (err) console.log(err);
    });
  } catch (err) {
  }
  try {
    connection.query("DROP TABLE `channel_" + req.params.channelName + "_post_" + req.params.postName + "_replies`;", function (err, result, fields) {
      if (err) console.log(err);
    });
  } catch (err) {
  }
  res.json({channels: "success"});
});

app.update("/deleteReply/:channelName/:postName/:replyID", (req, res) => {
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }
  console.log(req.params.replyID);
  try {
    connection.query("UPDATE `channel_" + req.params.channelName + "_post_" + req.params.postName + "_replies` SET body= 'DELETED', file='null' WHERE replyID='" + req.params.replyID + "';", function (err, result, fields) {
      if (err) console.log(err);
    });
    } catch (err) {
    }
    try {
      connection.query("UPDATE `channel_general_posts_replies` SET body='DELETED' WHERE parentID='" + req.params.replyID + "';", function (err, result, fields) {
        if (err) console.log(err);
      });
      } catch (err) {
      }
  try {
    connection.query("SELECT * FROM `channel_" + req.params.channelName + "_post_" + req.params.postName + "_replies` WHERE replyID='" + req.params.replyID + "';", function (err, result, fields) {
      if (err) console.log(err);
      console.log(result);
    });
  } catch (err) {
  }
    res.json({channels: "success"});
});

app.get('/users/:user/search/:search_terms', (req, res) => { // search
  var searchList = {};
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }

  try {
    connection.query("SELECT * FROM channels WHERE title LIKE '%" + req.params.search_terms + "%' OR user LIKE '%" + req.params.search_terms + "%';", function (err, result, fields) {
      setSearchChannel(result);
  });
} catch (err) {
}
searchList['channels'] = getSearchChannel();
try {
  connection.query("SELECT * FROM channel_general_posts WHERE title LIKE '%" + req.params.search_terms + "%' OR body LIKE '%" + req.params.search_terms + "%' OR user LIKE '%" + req.params.search_terms + "%';", function (err, result, fields) {
    setSearchPost(result);
});
} catch (err) {
}
searchList['posts'] = getSearchPost();
  

try {
  connection.query("SELECT * FROM channel_general_posts_replies WHERE body LIKE '%" + req.params.search_terms + "%' OR user LIKE '%" + req.params.search_terms + "%';", function (err, result, fields) {
    setSearchReply(result);
  });
} catch (err) {
}
searchList['replies'] = getSearchReply();
  res.json({search: searchList});
});

// retrieve posts from db once connected to container
connection = mysql.createConnection({
  host: "database",
  user: "root",
  password: "admin"
}); 

app.get('/users/:user/channels', (req, res) => { // get channels
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }
  outChannels(req, res);
  res.json({channels: getChannels()});
});

app.post('/users/:user/channel', (req, res) => { // create channel
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }
  console.log(req.body.title);
  inChannels(req, res);
  res.json({channels: "success"});
});

app.get('/users/:user/channel/:channels/messages', (req, res) => { // get messages
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }
  outMessages(req.params.channels);
  res.json({messages: getData()});
});

app.post('/users/:user/channel/:channels/message/', (req, res) => { // create message
  try {
  connection.query("USE channels_db", function (err, result) {
    if (err) console.log(err);
    console.log("Using database");
  });
  connection.query("INSERT INTO `channel_general_posts` (channelName, title, body, user) VALUES ('" + req.params.channels + "','" + req.body.title + "', '" + req.body.body +  "', '" + req.params.user + "');", function (err, result) {
    if (err) console.log(err);
  });
} catch (err) {
}
  inMessages(req, res, req.params.channels);
  res.json({message: messagesNumber});
});

app.get('/users/:user/channel/:channels/message/:message/replies', (req, res) => { // get replies
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }
  connection.query("SELECT * FROM `channel_" + req.params.channels + "_post_" + req.params.message + "_replies`;", function (err, result, fields) { // replies
    if (err) console.log(err);
    setReplies(result);
  });
  res.json({replies: getReplies()});
});

app.post('/users/:user/channel/:channels/message/:message/reply/:parent_reply', (req, res) => { // create reply
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }
  try {
    if (req.params.parent_reply !== "undefined") {
      connection.query("INSERT INTO `channel_" + req.params.channels + "_post_" + req.params.message + "_replies` (body, parentID, user) VALUES ('" + req.body.reply + "','" + req.params.parent_reply + "','" + req.params.user +  "');", function (err, result) {
        if (err) console.log(err);
      });
      connection.query("INSERT INTO `channel_general_posts_replies` (channelName, postID, body, parentID, user) VALUES ('" + req.params.channels + "','" + req.params.message + "','" + req.body.reply + "','" + req.params.parent_reply + "','" + req.params.user + "');", function (err, result) {
        if (err) console.log(err);
      });
      } else {
      connection.query("INSERT INTO `channel_" + req.params.channels + "_post_" + req.params.message + "_replies` (body, user) VALUES ('" + req.body.reply + "','" + req.params.user +  "');", function (err, result) {
        if (err) console.log(err);
      });
      connection.query("INSERT INTO `channel_general_posts_replies` (channelName, postID, body, user) VALUES ('" + req.params.channels + "','" + req.params.message + "','" + req.body.reply + "','" + req.params.user + "');", function (err, result) {
        if (err) console.log(err);
      });
    }

  } catch (err) {
    console.log(err);
  }
  res.json({replies: "success"});
});




function createPostTable(channelName) {
  connection.query("CREATE TABLE IF NOT EXISTS `channel_" + channelName + "_posts` (postID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(100) NOT NULL UNIQUE, body VARCHAR(255) NOT NULL, user VARCHAR(32) NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, fileName VARCHAR(255), file TEXT DEFAULT NULL);", function (err, result) {
    if (err) console.log(err);
    console.log("Table created channel_" + channelName +"_posts");
  });
}

function createReplyTable(channelName, postID) {
  connection.query("CREATE TABLE IF NOT EXISTS `channel_" + channelName + "_post_" + postID + "_replies` (replyID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, body VARCHAR(255) NOT NULL, user VARCHAR(32) NOT NULL, parentID INT UNSIGNED DEFAULT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, fileName VARCHAR(255), file TEXT DEFAULT NULL);", function (err, result) {
    if (err) console.log(err);
    console.log("Table created channel_" + channelName + "_post_" + postID + "_replies");
  });
}

app.get('/users/', (req, res) => { // get users
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }
  try {
    connection.query("SELECT * FROM users;", function (err, result, fields) {
      if (err) console.log(err);
      console.log(result);
      setUsers(result);
    });
  } catch (err) {
    console.log(err);
  }
   res.json({users: getUsers()});
});

app.post('/user/', (req, res) => { // get users
  try {
    connection.query("USE channels_db", function (err, result) {
      if (err) console.log(err);
      console.log("Using database");
    });
  } catch (err) {
  }
  try {
      connection.query("INSERT INTO users (userName, password) VALUES ('" + req.body.userName + "', '" + req.body.password + "');", function (err, result) {
        if (err) console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
  res.json({users: "success"});
});

app.use('/', (req, res) => { // create database
  if (!dbCreated) {
  connection.connect((err) => {
    if (err) console.log(err);
    console.log("Connected to database");
  });
}
  try {
    if (!dbCreated) {
    connection.query("CREATE DATABASE IF NOT EXISTS channels_db", function (err, result) {
    if (err) console.log(err);
    console.log("Database created");
  });
  
    connection.query("USE channels_db", function (err, result) {
    if (err) console.log(err);
    console.log("Using database");
  });

    connection.query("CREATE TABLE IF NOT EXISTS users (userID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, userName VARCHAR(100) NOT NULL UNIQUE, password VARCHAR(100) NOT NULL);", function (err, result) {
    if (err) console.log(err);
    console.log("User Table created");
  });
  
    connection.query("CREATE TABLE IF NOT EXISTS channels (channelID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, title VARCHAR(100) NOT NULL UNIQUE, user VARCHAR(32) NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);", function (err, result) {
    if (err) console.log(err);
    console.log("Channels Table created");

    connection.query("INSERT INTO users (userName, password) VALUES ('admin', 'admin');", function (err, result) {
      
    });
    try {
      connection.query("CREATE TABLE IF NOT EXISTS `channel_general_posts` (postID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, channelName VARCHAR(100) NOT NULL, title VARCHAR(100) NOT NULL, body VARCHAR(255) NOT NULL, user VARCHAR(32) NOT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);", function (err, result) {
        if (err) console.log(err);
      });
    } catch (err) {
    }
    try {
      connection.query("CREATE TABLE IF NOT EXISTS `channel_general_posts_replies` (replyID INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY, postID VARCHAR(100) NOT NULL, channelName VARCHAR(100) NOT NULL, body VARCHAR(255) NOT NULL, user VARCHAR(32) NOT NULL, parentID INT UNSIGNED DEFAULT NULL, time TIMESTAMP DEFAULT CURRENT_TIMESTAMP);", function (err, result) {
        if (err) console.log(err);
      });
    } catch (err) {
    }
  });
  dbCreated = true;
}
} catch (err) {
  console.log(err);
}
res.json({});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
