var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require("fs");
var multer  = require('multer');
var cookieParser = require('cookie-parser');
var util = require('util');
const mongoose=require('mongoose');
var urlencodedParser = bodyParser.urlencoded({ extended: false }); // 创建 application/x-www-form-urlencoded 编码解析 post请求用这个
var Schema = mongoose.Schema;


app.use(express.json()) // 允许express 处理返回的数据
app.use('/public', express.static('public'));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));// 可以访问http://127.0.0.1:8081/public/imgs/3.jpg

mongoose.connect("mongodb://localhost:27017/xblog", { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection
    .then( res => { console.log('数据库连接成功')})
    .on('error', console.error.bind(console, 'connection error:连接失败'))
    .once('open', function() {
        console.log("we're connected!"); 
})

// const blogSchema = new Schema({ })
// module.exports = mongoose.model('blog', blogSchema)

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
// blogSchema.insertMany([
//     {name: 'aaa', title: 'bbb', text: 'ccc', date: '2020-7-2'}
// ])

// 列表接口 每一次查询都是从node服务中异步操作连接数据库的
// blogSchema.find().sort({_id: 1}) // _id: -1就是倒序，大的在前 blogSchema.find().skip(1).limit(2)
// skip(1).limit(2)结合起来做分页
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

// exports.addBlog = (req, res, next) => {
//     // new blog() z这个blog就是前面的module.exports = mongoose.model('blog', blogSchema)
//     let newBLog = new blog({
//         name: req.body.name,
//         title: req.body.title,
//         text: req.body.text,
//         date: req.body.date ? new Date() : new Date(parseInt(req.body.date))
//     })
//     newBLog.save(function(err, student) {
//         if(err) {
//             // 
//             return res,json({
//                 success: 'false',
//                 err: err.messeage
//             })
//         } else {
//             res.json({
//                 success: 'true',
//                  data: student
//             })
//         }
//     })
// }


// exports.getBlogDetail = (req, res, next) =>{
//     blog.findById(req.params.id, function(err, blog) {
//         if(err) {
//             // 
//             return res,json({
//                 success: 'false',
//                 err: err.messeage
//             })
//         } else {
//             // 否则返回单个文档，文档（document）是存在mongodb中的数据的一对一映射，每个文档都是其模型的一个实例
//             res.json({
//                 success: 'true',
//                  data: blog
//             })
//         }
//     })
// }

// Api
// 获取列表，新建
app.route('/blog')
    // .get(controllers.getBlogList)      
    // .post(controllers.addBlog)

// 获取详情/修改/移除
// app.route('/blog/:id')
//     .get(controllers.getBlogDetail)      
    // .post(controllers.updateBlog)
    // .delete(controllers.deleteBlog)

// var MongoClient = require('mongodb').MongoClient
// MongoClient.connect('mongodb://localhost:27017/animals', function (err, db) {
//   if (err) throw err

//   db.collection('mammals').find().toArray(function (err, result) {
//     if (err) throw err

//     console.log(result)
//   })
// })g


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


var server = app.listen(8082, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("应用实例，访问地址为 http://127.0.0.1:" + port)

})