var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var multer  = require('multer');
var cookieParser = require('cookie-parser');
var util = require('util');
const mongoose=require('mongoose');
var urlencodedParser = bodyParser.urlencoded({ extended: false }); 

app.use(express.json()) 
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));

mongoose.connect("mongodb://localhost:27017/xblog", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection
    .on('error', console.error.bind(console, 'connection error:连接失败'))
    .once('open', function() {
    console.log("we're connected!");
})


const cors = require('cors')
// 使用cors解决跨域
app.use(cors())
var corsOptions = {
    // origin: 'http://127.0.0.1:8080', //只有origin可以访问
    optionsSuccessStatus: 200 ,
    // exposeHeaders: ['Authorization'],
    alloweHeaders:['Conten-Type', 'Authorization']
  }

app.use(express.json()) 
// app.use(cookieParser())

// // 解决跨域
// app.use('*',function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
// //res.header('Access-Control-Allow-Origin', 'http://www.baidu.com'); //这样写，只有www.baidu.com 可以访问。
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
//   if (req.method == 'OPTIONS') {
//     res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
//   }
//   else {
//     next();
//   }
// });

var Schema = mongoose.Schema;
const blogSchema = mongoose.model('blog', new Schema({
name:{
    required: true,
    type: String
},
title: {
    required: true,
    type: String
},
text: {
    required: true,
    type: String
},
date: {
    required: true,
    type: Date,
    default: new Date() 
}
}))

// 插入多条 
blogSchema.insertMany([
    {name: 'aaa', title: 'bbb', text: 'ccc', date: '2020-7-2'}
])

app.get('/blog', async function(req, res){
    const data = await blogSchema.find().where({
        title: 'bbb'
    })
    res.send(data)
})

// 详情接口
app.get('/blog/:id', async function(req, res){
    const data = await blogSchema.findById(req.params.id)
    res.send(data)
})

// 新增   
app.post('/blog', async function(req, res){
    const data  = req.body
    const blog = await blogSchema.create(data) 
    res.send(blog)
})

// 修改
app.put('/blog/:id', async function(req, res){
    const blog = await blogSchema.findById(req.params.id)
    blog.title = req.body.title
    await blogSchema.save()
    res.send(blog)
})

// 删除
app.delete('/blog/:id', async function(req, res){
    const blog = await blogSchema.findById(req.params.id)
    await blog.remove()
    res.send({
        success: true
    })
})


app.get('/', function (req, res) {
    // 向弄的技术服务器发cookie信息，输出了客户端发送的。
    console.log("Cookies: " + util.inspect(req.cookies));
    res.send('Hello World');
})


var server = app.listen(8082, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://127.0.0.1:" + port)

})