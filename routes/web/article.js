// blog主页  列表 文章详情 新增 编辑 删除 批量删除 点赞 搜索
 
module.exports = app => {
    const router = require('express').Router()
    const mongoose = require('mongoose')
    // const Article = require('../../models/Article')
    // const Category = mongoose.model('Category')
    // const Article = mongoose.model('Article')
    // const Hero = mongoose.model('Hero')

    // // 博客列表
    // router.get('/bloglist', async (req, res) => {
    //     const items = await BlogList.findById(req.paramss.id)
    //     res.send(items);
    // })
    // // 博客详情
    // router.get('/blog/:id',  async (req, res) => {
    //     const items = await BlogList.findById(req.paramss.id)
    //     res.send(items);
    // })
    
    // 导入博客数据
    router.get('/news/init', async (req, res) => {
        const parent = await Category.findOne({
            name: '新闻分类'
        })
        const cats = await Category.find().where({
            parent: parent
        }).lean()
        const newsTitles = ["夏日新版本“稷下星之队”即将6月上线", "王者荣耀携手两大博物馆 走进稷下学宫"]
        const newsList = newsTitles.map(title => {
            const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5)
            return {
                categories: randomCats.slice(0, 2),
                title: title
            }
        })
        await Article.deleteMany({})
        await Article.insertMany(newsList)
        res.send(newsList)
    })

    // 新闻列表接口
    router.get('/blog/list', async (req, res) => {
        // const parent = await Category.findOne({
        //   name: '新闻分类'
        // }).populate({
        //   path: 'children',
        //   populate: {
        //     path: 'newsList'
        //   }
        // }).lean()
        const parent = await Category.findOne({
            name: '博客分类'
        })
        const cats = await Category.aggregate([
            { $match: { parent: parent._id } },
            {
                $lookup: {
                    from: 'articles',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'blogList'
                }
            },
            {
                $addFields: {
                    newsList: { $slice: ['$newsList', 5] }
                }
            }
        ])
        const subCats = cats.map(v => v._id)
        cats.unshift({
            name: '热门',
            newsList: await Article.find().where({
                categories: { $in: subCats }
            }).populate('categories').limit(5).lean()
        })

        cats.map(cat => {
            cat.newsList.map(news => {
                news.categoryName = (cat.name === '热门')
                    ? news.categories[0].name : cat.name
                return news
            })
            return cat
        })
        res.send(cats)

    })

    // 导入英雄数据
    router.get('/heroes/init', async (req, res) => {
        await Hero.deleteMany({})
        const rawData = [{ "name": "热门", "heroes": [{ "name": "高渐离", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg" }, { "name": "扁鹊", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg" }, { "name": "芈月", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg" }, { "name": "周瑜", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg" }, { "name": "甄姬", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg" }, { "name": "武则天", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg" }, { "name": "貂蝉", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg" }, { "name": "太乙真人", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg" }, { "name": "大乔", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg" }, { "name": "鬼谷子", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg" }, { "name": "明世隐", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg" }, { "name": "盾山", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg" }, { "name": "瑶", "avatar": "https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg" }] }]
        for (let cat of rawData) {
            if (cat.name === '热门') {
                continue
            }
            // 找到当前分类在数据库中对应的数据
            const category = await Category.findOne({
                name: cat.name
            })
            cat.heroes = cat.heroes.map(hero => {
                hero.categories = [category]
                return hero
            })
            // 录入英雄
            await Hero.insertMany(cat.heroes)
        }

        res.send(await Hero.find())
    })

    // 英雄列表接口
    router.get('/heroes/list', async (req, res) => {
        const parent = await Category.findOne({
            name: '英雄分类'
        })
        const cats = await Category.aggregate([
            { $match: { parent: parent._id } },
            {
                $lookup: {
                    from: 'heroes',
                    localField: '_id',
                    foreignField: 'categories',
                    as: 'heroList'
                }
            }
        ])
        const subCats = cats.map(v => v._id)
        cats.unshift({
            name: '热门',
            heroList: await Hero.find().where({
                categories: { $in: subCats }
            }).limit(10).lean()
        })

        res.send(cats)

    });

    // 文章详情
    router.get('/articles/:id', async (req, res) => {
        const data = await Article.findById(req.params.id).lean()
        data.related = await Article.find().where({
            categories: { $in: data.categories }
        }).limit(2)
        res.send(data)
    })

    router.get('/heroes/:id', async (req, res) => {
        const data = await Hero
            .findById(req.params.id)
            .populate('categories items1 items2 partners.hero')
            .lean()
        res.send(data)
    })

    app.use('/web/api', router)
}





// module.exports = app => {
//     const express = require('express')
//     const jwt = require('jsonwebtoken')
//     const router = express.Router({
//       mergeParams: true
//     })
  
//     // 创建资源
//     router.post('/', async (req, res) => {
//       const model = await req.Model.create(req.body)
//       res.send(model)
//     })
//     // 更新资源
//     router.put('/:id', async (req, res) => {
//       const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
//       res.send(model)
//     })
//     // 删除资源
//     router.delete('/:id', async (req, res) => {
//       await req.Model.findByIdAndDelete(req.params.id)
//       res.send({
//         success: true
//       })
//     })
//     // 资源列表
//     router.get('/', async (req, res) => {
//       const queryOptions = {}
//       if (req.Model.modelName === 'Category') {
//         queryOptions.populate = 'parent'
//       }
//       const items = await req.Model.find().setOptions(queryOptions).limit(100)
//       res.send(items)
//     })
//     // 资源详情
//     router.get('/:id', async (req, res) => {
//       const model = await req.Model.findById(req.params.id)
//       res.send(model)
//     })
//     // 登录校验中间件
//     const authMiddleware = require('../../middleware/auth')
//     const resourceMiddleware = require('../../middleware/resource')
//     app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)
  
//     const multer = require('multer')
//     const MAO = require('multer-aliyun-oss');
//     const upload = multer({
//       // dest: __dirname + '/../../uploads',
//       storage: MAO({
//         config: {
//           region: 'oss-cn-zhangjiakou',
//           accessKeyId: '替换为你的真实id',
//           accessKeySecret: '替换为你的真实secret',
//           bucket: 'node-vue-moba'
//         }
//       })
//     })
//     app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
//       const file = req.file
//       // file.url = `http://test.topfullstack.com/uploads/${file.filename}`
//       res.send(file)
//     })
  
//     app.post('/admin/api/login', async (req, res) => {
//       const { username, password } = req.body
//       // 1.根据用户名找用户
  
//       const user = await AdminUser.findOne({ username }).select('+password')
//       assert(user, 422, '用户不存在')
//       // 2.校验密码
//       const isValid = require('bcrypt').compareSync(password, user.password)
//       assert(isValid, 422, '密码错误')
//       // 3.返回token
//       const token = jwt.sign({ id: user._id }, app.get('secret'))
//       res.send({ token })
//     })
  
//     // 错误处理函数
//     app.use(async (err, req, res, next) => {
//       // console.log(err)
//       res.status(err.statusCode || 500).send({
//         message: err.message
//       })
//     })
//   }