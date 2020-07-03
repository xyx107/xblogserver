
const { User, BlogDetail, BlogList } = require('../models/models')

var express = require('express');
var app = express();
const jwt = require('jsonwebtoken')
const SECRET = 'aaaaa'
const cors = require('cors')

app.use(express.json()) 
app.use(cors())
var corsOptions = {
    // origin: 'http://127.0.0.1:8080', //只有origin可以访问
    optionsSuccessStatus: 200 ,
    // exposeHeaders: ['Authorization'],
    alloweHeaders:['Conten-Type', 'Authorization']
  }

app.get('/', function (req, res) {
    // 向弄的技术服务器发cookie信息，输出了客户端发送的。
    console.log("Cookies: " + util.inspect(req.cookies));
    res.send('Hello World');
})

require('../routes/admin/index')(app)




// 博客列表
app.get('/bloglist', cors(corsOptions), async (req, res) => {
    const items = await BlogList.findById(req.paramss.id)
    res.send(items);
})
// 博客详情
app.get('/blog/:id', cors(corsOptions), async (req, res) => {
    const items = await BlogList.findById(req.paramss.id)
    res.send(items);
})

// // 导入博客数据
// router.get('/news/init', async (req, res) => {
//     const parent = await Category.findOne({
//         name: '新闻分类'
//     })
//     const cats = await Category.find().where({
//         parent: parent
//     }).lean()
//     const newsTitles = ["夏日新版本“稷下星之队”即将6月上线", "王者荣耀携手两大博物馆 走进稷下学宫"]
//     const newsList = newsTitles.map(title => {
//         const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
//         return {
//             categories: randomCats.slice(0, 2),
//             title: title
//         }
//     })
//     await Article.deleteMany({})
//     await Article.insertMany(newsList)
//     res.send(newsList)
// })

// // 新闻列表接口
// router.get('/blog/list', async (req, res) => {
//     // const parent = await Category.findOne({
//     //   name: '新闻分类'
//     // }).populate({
//     //   path: 'children',
//     //   populate: {
//     //     path: 'newsList'
//     //   }
//     // }).lean()
//     const parent = await Category.findOne({
//         name: '博客分类'
//     })
//     const cats = await Category.aggregate([
//         { $match: { parent: parent._id } },
//         {
//             $lookup: {
//                 from: 'articles',
//                 localField: '_id',
//                 foreignField: 'categories',
//                 as: 'blogList'
//             }
//         },
//         {
//             $addFields: {
//                 newsList: { $slice: ['$newsList', 5] }
//             }
//         }
//     ])
//     const subCats = cats.map(v => v._id)
//     cats.unshift({
//         name: '热门',
//         newsList: await Article.find().where({
//             categories: { $in: subCats }
//         }).populate('categories').limit(5).lean()
//     })

//     cats.map(cat => {
//         cat.newsList.map(news => {
//             news.categoryName = (cat.name === '热门')
//                 ? news.categories[0].name : cat.name
//             return news
//         })
//         return cat
//     })
//     res.send(cats)

// })

// // 导入英雄数据
// router.get('/heroes/init', async (req, res) => {
//     await Hero.deleteMany({})
//     const rawData = [{ "name": "热门", "heroes": [{ "name": "高渐离", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg" }, { "name": "扁鹊", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg" }, { "name": "芈月", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "周瑜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg" }, { "name": "甄姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "武则天", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg" }, { "name": "貂蝉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "太乙真人", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "大乔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg" }, { "name": "鬼谷子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg" }, { "name": "明世隐", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg" }, { "name": "盾山", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg" }, { "name": "瑶", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg" }] }]
//     for (let cat of rawData) {
//         if (cat.name === '热门') {
//             continue
//         }
//         // 找到当前分类在数据库中对应的数据
//         const category = await Category.findOne({
//             name: cat.name
//         })
//         cat.heroes = cat.heroes.map(hero => {
//             hero.categories = [category]
//             return hero
//         })
//         // 录入英雄
//         await Hero.insertMany(cat.heroes)
//     }

//     res.send(await Hero.find())
// })

// // 英雄列表接口
// router.get('/heroes/list', async (req, res) => {
//     const parent = await Category.findOne({
//         name: '英雄分类'
//     })
//     const cats = await Category.aggregate([
//         { $match: { parent: parent._id } },
//         {
//             $lookup: {
//                 from: 'heroes',
//                 localField: '_id',
//                 foreignField: 'categories',
//                 as: 'heroList'
//             }
//         }
//     ])
//     const subCats = cats.map(v => v._id)
//     cats.unshift({
//         name: '热门',
//         heroList: await Hero.find().where({
//             categories: { $in: subCats }
//         }).limit(10).lean()
//     })

//     res.send(cats)

// });

// // 文章详情
// router.get('/articles/:id', async (req, res) => {
//     const data = await Article.findById(req.params.id).lean()
//     data.related = await Article.find().where({
//         categories: { $in: data.categories }
//     }).limit(2)
//     res.send(data)
// })

// router.get('/heroes/:id', async (req, res) => {
//     const data = await Hero
//         .findById(req.params.id)
//         .populate('categories items1 items2 partners.hero')
//         .lean()
//     res.send(data)
// })

// app.use('/web/api', router)



// 用户列表
app.get('/users', cors(corsOptions), async (req, res) => {
    const users = await User.find()
    res.send(users);
})

// 注册
app.post('/register', async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    })
    // console.log(type(req.body))
    res.send(user)
})

// 登录 用户是否存在，密码是否正确
app.post('/login',  async (req, res) => {
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
        data: {token: String(token) , username: req.body.username},
    })
})

// 中间件
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop() // 弹出栈
    const { id } = jwt.verify(raw, SECRET) // 解密
    req.user = await User.findById(id) // 不用const user, 用req.user之后可以在后面用Req.user
    next()
} 
app.get('/profile', auth, async (req, res) => {
    res.send(req.user)
})

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://127.0.0.1:" + port)

})