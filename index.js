
app.set('secret', 'i2u34y12oi3u4y8')

var express = require('express');
var app = express();

app.use(require('cors')())
app.use(express.json())
app.use('/', express.static(__dirname + '/web'))
app.use('/admin', express.static(__dirname + '/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./plugins/db')(app)
require('./routes/admin')(app)
require('./routes/web/article')(app)


const router = require('./router/web')
app.use('/index', router)


const jwt = require('jsonwebtoken')
const SECRET = 'aaaaa'

app.use(express.json()) 
// app.use(cookieParser())
// app.use(multer({ dest: '/tmp/'}).array('image'));


app.get('/', function (req, res) {
    // 向弄的技术服务器发cookie信息，输出了客户端发送的。
    console.log("Cookies: " + util.inspect(req.cookies));
    res.send('Hello World');
})

app.get('/api/users', async (req, res) => {
    const users = await User.find()
    res.send(users);
})

// 注册
app.post('/api/register', async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    // console.log(type(req.body))
    res.send(user)
})

// 登录 用户是否存在，密码是否正确
app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        username: req.body.username,
        // password: req.body.password
    })
    if(!user) { 
        return res.status(422).send({ // 客户发送数据有问题
            message: '用户名不存在'
        })
    }

    const isPasswordValid = require('bcrypt').compareSync(
        req.body.password,
        user.password
    )
    if( !isPasswordValid ) {
        return res.status(422).send({ // 客户发送数据有问题
            message: '密码错误'
        })
    }
    // 生成token
    
    const token = jwt.sign(
        { id: String(user._id) },
        //secret: 应该写在一个.env环境文件里
        SECRET
    )
    res.send({
        user,
        token: token
    })
})

// 中间件
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop() // 弹出栈
    const { id } = jwt.verify(raw, SECRET) // 解密
    req.user = await User.findById(id) // 不用const user, 用req.user之后可以在后面用Req.user
    next()
} 
app.get('/api/profile', auth, async (req, res) => {
   
    res.send(req.user)
})

app.get('/api/orders', auth, async (req, res) => {
    const orders = await User.find().where({
        user:req.user//mongo会自动匹配id
    })
    res.send(req.user)
})

app.listen(3000, function () {
    var port = server.address().port
    console.log("应用实例，访问地址为 http://127.0.0.1:" + port)

})



