const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    createAt: { required: true,  type: String, },
    zanNum: { required: true,  type: String, },
    rearNum: null,
    // categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
    title: { required: true,  type: String, },
    body: { required: true,  type: String, },
    comment: { type: String, },
}, {
    timestamps: true
})

module.exports = mongoose.model('Article', schema)