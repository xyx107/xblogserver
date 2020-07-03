const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/xblog", { 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true 
});
mongoose.connection
    .on('error', console.error.bind(console, 'connection error:连接失败'))
    .once('open', function() { console.log("we're connected!") })


// 分类
const CategorySchema = new mongoose.Schema({
    name: {type: String, unique: true },
})

// 用户信息
const UserSchema = new mongoose.Schema({
    username: { required: true, type: String, unique: true },
    password: { 
        required: true, 
        type: String,
        set(val) {
            return require('bcrypt').hashSync(val, 5) // 将密码同步散列
        }
    }
})

// 博客列表
const BlogListSchema = new mongoose.Schema({
    // createAt: { required: true,  type: String, },
    title: { required: true,  type: String, unique: true },
    body: { required: true,  type: String, },
}, {
    timestamps: true // timestamps选项会在创建文档时自动生成 默认createAt和updateAt两个字段，详情用的是自定义字段名
})

// 博客详情
const BlogDetailSchema = new mongoose.Schema({
    id: { required: true, type: Number, },
    zanNum: {   type: Number, },
    rearNum: {  type: Number, },
    // categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
    title: { required: true,  type: String, unique: true },
    body: { required: true,  type: String, },
    // comment: { type: String, },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
})

const User = mongoose.model('User', UserSchema)
const BlogDetail = mongoose.model('BlogDetail', BlogDetailSchema)
const BlogList = mongoose.model('BlogList', BlogListSchema)
const Category = mongoose.model('Category', CategorySchema)

// User.db.dropCollection('users')

module.exports = { User, BlogDetail, BlogList, Category }