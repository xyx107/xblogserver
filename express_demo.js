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