// 댓글 관리를 위한 DB 스키마 생성 페이지

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User' // User.js를 참고하겠다는 의미
    }, 
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Product' // Product.js를 참고하겠다는 의미
    },
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }

}, { timestamps: true })


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }