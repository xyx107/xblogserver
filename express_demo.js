var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var multer  = require('multer');
var cookieParser = require('cookie-parser');
var util = require('util');

const mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient
MongoClient.connect('mongodb://localhost:27017/animals', function (err, db) {
  if (err) throw err

  db.collection('mammals').find().toArray(function (err, result) {
    if (err) throw err

    console.log(result)
  })
})

// 创建 application/x-www-form-urlencoded 编码解析 post请求用这个
var urlencodedParser = bodyParser.urlencoded({ extended: false }) 
app.use(bodyParser.urlencoded({ extended: false }));
// 可以访问http://127.0.0.1:8081/public/imgs/3.jpg
app.use('/public', express.static('public'));
app.use(multer({ dest: '/tmp/'}).array('image'));
app.use(cookieParser())

app.get('/', function (req, res) {
    // 向弄的技术服务器发cookie信息，输出了客户端发送的。
    console.log("Cookies: " + util.inspect(req.cookies));
    res.send('Hello World');
})

app.get('/index.html', function (req, res) {
    res.sendFile(__dirname + "/" + "index.html");
})
// app.get('/process_get', function (req, res) {
//     // 输出 JSON 格式
//     var response = {
//         "first_name": req.query.first_name,
//         "last_name": req.query.last_name
//     };
//     console.log(response);
//     res.end(JSON.stringify(response));
// })
app.post('/process_post', urlencodedParser, function (req, res) {
 
    // 输出 JSON 格式
    var response = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name
    };
    console.log(response);
    res.end(JSON.stringify(response));
 })

 // 上传文件
app.post('/file_upload', function (req, res) {
 
    console.log(req.files[0]);  // 上传的文件信息
  
    var des_file = __dirname + "/" + req.files[0].originalname;
    fs.readFile( req.files[0].path, function (err, data) {
         fs.writeFile(des_file, data, function (err) {
          if( err ){
               console.log( err );
          }else{
                response = {
                    message:'File uploaded successfully', 
                    filename:req.files[0].originalname
               };
           }
           console.log( response );
           res.end( JSON.stringify( response ) );
        });
    });
 })
//  POST 请求
app.post('/', function (req, res) {
    console.log("主页 POST 请求");
    res.send('Hello POST');
})

//  /del_user 页面响应
app.get('/del_user', function (req, res) {
    console.log("/del_user 响应 DELETE 请求");
    res.send('删除页面');
})

//  /list_user 页面 GET 请求
app.get('/list_user', function (req, res) {
    console.log("/list_user GET 请求");
    res.send('用户列表页面');
})

// 对页面 abcd, abxcd, ab123cd, 等响应 GET 请求
app.get('/ab*cd', function (req, res) {
    console.log("/ab*cd GET 请求");
    res.send('正则匹配');
})


var server = app.listen(8081, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http:127.0.0.1:" + port)

})