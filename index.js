
// app.set('secret', 'i2u34y12oi3u4y8')
const { User, BlogDetail, BlogList } = require('../models/models')

var express = require('express');
var app = express();
app.use(require('cors')())
app.use(express.json())
// app.use(cookieParser())
// app.use(multer({ dest: '/tmp/'}).array('image'));

require('./utils/db')(app)
require('./routes/admin')(app)
require('./routes/web/article')(app)

app.use('/', express.static(__dirname + '/web'))
app.use('/admin', express.static(__dirname + '/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'))

const router = require('./router/web')
app.use('/index', router)

// app.get('/', function (req, res) {
//     // 向node技术服务器发cookie信息，输出了客户端发送的。
//     console.log("Cookies: " + util.inspect(req.cookies));
//     res.send('Hello World');
// })

app.listen(3000, function () {
    var port = server.address().port
    console.log("应用实例，访问地址为 http://127.0.0.1:" + port)

})



