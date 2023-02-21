// 상품 등록시 업로드된 파일을 디비에 넣기 위해 필요한 페이지

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 몽고디비에 넣을 데이터가 어떻게 생겼는지 여기서 결정
const productSchema = mongoose.Schema({
    // 각각은 필드를 구성
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    restaurantTypes: {
        type: Number,
        default: 1
    },
    address: {
        type: String,
        default: "홍대 주변 어딘가"
    },
    // 평점의 합
    starCount: {
        type: Number,
        default: 0
    },
    // 리뷰를 올린 모든 사람들의 수
    reviewCount: {
        type: Number,
        default: 0
    },
    // 식당의 평균 평점
    averageStar: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

// search할 때 title과 description을 중점적으로 보되, weights을 통해 title을 더 중요하게 생각해서 검색한다는 것
productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights: {
        title: 5,
        description: 1
    }
})

const Product = mongoose.model('Product', productSchema);

module.exports = { Product }