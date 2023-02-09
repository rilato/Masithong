// 댓글 관리를 위한 DB 스키마 생성 페이지

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User' // User.js를 참고하겠다는 의미
    }, 
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Product' // Product.js를 참고하겠다는 의미
    },
    // 리뷰
    review: {
        type: String
    },
    // 리뷰 사진
    images: {
        type: Array,
        default: []
    },
    // 평점
    grade: {
        type: Number,
        default: 1
    }
}, { timestamps: true })


const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review }