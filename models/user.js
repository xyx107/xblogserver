const mongoose = require('mongoose')

// mongoose.connect("mongodb://localhost:27017/xblog", { 
//     useNewUrlParser: true, 
//     useCreateIndex: true,
//     useUnifiedTopology: true 
// });

// mongoose.connection
//     .on('error', console.error.bind(console, 'connection error:连接失败'))
//     .once('open', function() { console.log("we're connected!") })

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


const User = mongoose.model('User', UserSchema)

// User.db.dropCollection('users')

module.exports = { User }