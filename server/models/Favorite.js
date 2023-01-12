// 즐겨찾기 페이지를 위한 스키마

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 즐겨찾기 페이지로 이동하는 버튼을 눌렀을 때, 상품과 관련해서 더 많은 정보를 해당 페이지에서 띄우고 싶으면 여기서 컬럼 추가
const favoriteSchema = mongoose.Schema({
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User' // 얘를 통해 User.js의 스키마에 있는 모든 정보를 가져올 수 있음
    },
    // 나중에 productId, productTitle 등을 모두 restaurantId, restaurantTitle 등으로 바꿔야 할 듯
    productId: {
        type: String
    },
    productTitle: {
        type: String
    },
    // 기존의 String type이 아닌 Number Type으로 변경하였음
    productTypes: {
        type: Number
    },
    // 기존의 String type이 아닌 Number Type으로 변경하였음
    productPrice: {
        type: Number
    }
}, { timestamps: true })

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = { Favorite }