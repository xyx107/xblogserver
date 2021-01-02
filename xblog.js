// const { User, BlogDetail, BlogList } = require('../models/models')
const express = require('express')
const app = express()
app.use(require('cors')())
app.use(express.json())
const sendEmail = require('./utils/SendMail')
const jwt = require('jsonwebtoken')
const SECRET = 'aaaaa' //secret: 应该写在一个.env环境文件里

const mongoose = require('mongoose')
mongoose.connect('mongodb://xyx107:1962@localhost:27017/xblog?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const Code = mongoose.model('Code', new mongoose.Schema({
    email: { type: String },
    code: String
}))
// Code.insertMany([
//     {
//         email: '985830672@qq.com',
//         Code: '1233456' 
//     }
// ])
// // 博客列表
// const BlogListSchema = new mongoose.Schema(
//     {
//         // createAt: { required: true,  type: String, },
//         title: { required: true,  type: String, unique: true },
//         body: { required: true,  type: String, },
//     },
//     // {
//     //     timestamps: true // timestamps选项会在创建文档时自动生成 默认createAt和updateAt两个字段，详情用的是自定义字段名
//     // }
// )
// // 博客详情
// const BlogDetailSchema = new mongoose.Schema({
//     id: { required: true, type: Number, },
//     zanNum: {   type: Number, },
//     rearNum: {  type: Number, },
//     // categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
//     title: { required: true,  type: String, unique: true },
//     body: { required: true,  type: String, },
//     // comment: { type: String, },
//     createTime: {
//         type: Date,
//         default: Date.now
//     },
//     updateTime: {
//         type: Date,
//         default: Date.now
//     }
// }, {
//     versionKey: false,
//     timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
// })

// const BlogDetail = mongoose.model('BlogDetail', BlogDetailSchema)
// const BlogList = mongoose.model('BlogList', BlogListSchema)

const Article = mongoose.model('Article', new mongoose.Schema({
    id: Number,
    author: String,
    title: { type: String },
    content: String,
    tags: Array,
    comments: Object,
    readNum: Number
  }, {
    timestamps: true,
  }
))
Article.insertMany([
    {
        id: 1,
        title: '解决前端跨域问题',
        author: 'xyx107',
        content: "一、通过jsonp跨域。因为html页面通过相应的标签可以加载其他域的静态资源，苏亦可以动态的创建script,请求带参网址，实现跨域。带参数的请求只适应于get请求，如var script = document.createElement('script');script.type = 'text/javascript';script.src = 'http://www.a.com/login?username=admin&callback=handlecallback'//传递一个回调函数给后端，方便后端执行这个回调函数document.head.appendChild(script);function handlecallback(res){alert(JSON.stringify(res));} 二、通过CORS跨域",
        tags: 'JavaScript',
        comments: {},
        readNum: 5
    },
    {
        id: 2,
        title: 'JWT认证流程',
        author: 'xyx107',
        content: "1.JWT是什么 JWT(JSON Web Token)是基于token的鉴权机制类似于http协议也是无状态的，它不需要在服务端去保留用户的认证信息或者会话信息。这就意味着基于token认证机制的应用不需要去考虑用户在哪一台服务器登录了，这就为应用的扩展提供了便利。2.JWT认证流程 在前后端分离的项目中：前端将用户的登录信息发送给服务器；服务器接受请求后为用户生成独一无二的认证信息--token，传给客户端浏览器；客户端将token保存在cookie或者storage中；在之后访问客户端都携带这个token请求服务器；服务器验证token的值，如果验证成功则给客户端返回数据。服务器并不保存token。3.JWT的构成 JWS是JWT的一种实现，除了JWS外，JWE(JSON Web Encryption)也是JWT的一种实现。JWE的生成过程较为复杂，虽保证了安全性，但是降低了访问效率，JWS实现方式分为三部分：头部(header)，载荷(payload)，签证(signature)。",
        tags: 'JavaScript',
        comments: {},
        readNum: 5 
    },
    {
        id: 3,
        title: '(阿里云）SSL证书从申请到安装',
        author: 'xyx107',
        content: "1.JWT是什么 JWT(JSON Web Token)是基于token的鉴权机制类似于http协议也是无状态的，它不需要在服务端去保留用户的认证信息或者会话信息。这就意味着基于token认证机制的应用不需要去考虑用户在哪一台服务器登录了，这就为应用的扩展提供了便利。2.JWT认证流程 在前后端分离的项目中：前端将用户的登录信息发送给服务器；服务器接受请求后为用户生成独一无二的认证信息--token，传给客户端浏览器；客户端将token保存在cookie或者storage中；在之后访问客户端都携带这个token请求服务器；服务器验证token的值，如果验证成功则给客户端返回数据。服务器并不保存token。3.JWT的构成 JWS是JWT的一种实现，除了JWS外，JWE(JSON Web Encryption)也是JWT的一种实现。JWE的生成过程较为复杂，虽保证了安全性，但是降低了访问效率，JWS实现方式分为三部分：头部(header)，载荷(payload)，签证(signature)。",
        tags: 'JavaScript',
        comments: {},
        readNum: 5 
    },
    {
        id: 4,
        title: 'Mock.js测试接口使用方法',
        author: 'xyx107',
        content: "https://blog.csdn.net/xyx107/article/details/108002574",
        tags: 'JavaScript',
        comments: {},
        readNum: 5 
    },
    {
        id: 5,
        title: 'leetcode 349 两个数组的交集 (JS数组方法)',
        author: 'xyx107',
        content: "https://blog.csdn.net/xyx107/article/details/108002574",
        tags: 'JavaScript',
        comments: {},
        readNum: 5 
    }
])

const User = mongoose.model('User', new mongoose.Schema({
    userName: String,
    password: {
        type: String, 
        set(val) {
            // 再存数据库时把密码散列了,hashSync第二个参数表示散列强度，在这里只能用同步方法
            return require('bcrypt').hashSync(val)
        }
    },
    email: String
}))
User.insertMany([
    { 
        userName: 'archerx',
        email: '98583067@qq.com',
        password: '123456'
    }
])

// 验证码
app.post('/getCode', async (req, res) => {
    const db = await User.findOne({
        email: req.body.email
    })
    if(!db) {
        let code = Math.random().toString().slice(-6)

        // 生成验证码
//       const startTime = new Date(db.createdAt).getTime();
//       const intervalTime = 1000 * 60 * 60; // 过期时间
//       if (new Date().getTime() - startTime > intervalTime ){
//         await EmailModel.updateCode(email, code);
//       }else{
//         code = db.email_code;
//       }
        const data = {
            email: req.body.email,
            code: code
        }
        await Code.create(data, (err, doc)=> {
            if(err) console.log(err)
            console.log('保存成功', doc)
        })
        const result = sendEmail(req.body.email, code)

        // if(result === 5) {
        //     console.log('邮件发送失败')
        // }
        // else if(result === 1) {
        //     console.log('邮件发送成功')
        return res.status(200).send({
            code: code,
            message: '成功发送'
        })
    } else {
        console.log('该邮箱已注册！')
        res.send('err：该邮箱已注册！')
    }
})

// 注册
app.post('/register', async (req, res) => {
    // 验证code
    console.log(req.body)
    const codeValid = await Code.findOne({
        code: req.body.code,
        email: req.body.email
    })
    if(codeValid) {
        const user = await User.create({
            userName: req.body.username,
            password: req.body.password,
            email: req.body.email
        })
        await Code.deleteOne({email: req.body.email})
        console.log('ok')
        res.send(user)
    } else {
        return res.status(422).send({
            message:'验证码错误'
        })
    }
})

// 登录
app.post('/login', async (req, res) => {
    // 用户存在
    const userValid = await User.findOne({
        userName: req.body.username
    })
    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        userValid.password
    )
    if(!userValid) {
        console.log("用户不存在")
        return res.status(422).send({
            message:'用户不存在'
        })
    } else if(!isPasswordValid) {
        return res.status(422).send({
            message: '密码错误'
        })
    } else {
        const token = jwt.sign(
            { id: String(userValid._id) },
            SECRET
        )
        const data = {
            token: token,
            code: 0
        }
        console.log('登录成功')
        res.send(data)
    }
})

// 中间件
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop() // 弹出栈
    const { id } = jwt.verify(raw, SECRET) // 解密
    req.user = await User.findById(id) // 不用const user, 用req.user之后可以在后面用Req.user
    next()
} 
app.get('/article/:id', async (req, res) => {
    const detial = await Article.find({
        id: req.params.id
    })
    const data = {
        data: detial,
        code: 0
    }
    res.send(data)
})

app.post('/article/list', async (req, res) => {
    const blogs = await Article.find()
    const data = {
        blogs: blogs,
        code: 0
    }
    res.send(data)
})

// 新增   
app.post('/article', async function(req, res){
    const blog = await Article.insert({
        id: 1,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content,
        tags: req.body.tags,
        readNum: 0
    }) 
    const data = {
        blog: blog,
        code: 0
    }
    res.send(data)
})

// 修改
app.put('/article/:id', async function(req, res){
    const blog = await Article.find({
        id: req.params.id
    })
    console.log(req.body)
    blog.title = req.body.title
    blog.content = req.body.content
    blog.tags = req.body.tags
    await Article.update()
    const data = {
        message: '修改成功',
        code: 0
    }
    res.send(data)
})

// 删除
app.delete('/article/:id', async function(req, res){
    const blog = await Article.find({
        id: req.params.id
    })
    await Article.deleteOne({
        id: req.params.id
    })
    res.send({
        code: 0,
        success: true
    })
})
// 批量删除
app.delete('/article', async (req, res) => {
    // const len = req.ids.length
    console.log(req.body)

    // for(let i=0; i<1; i++) {
    //     const blog = await Article.find({
    //         id: req.ids[i]
    //     })
    //     await Article.remove()
    // }
    res.send({
        code: 0,
        success: true
    })
})

app.listen(3000, () => {
    console.log('127.0.0.1:3000')
})