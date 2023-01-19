// 로그인 한 유저가 식당 요청을 하기 위한 스키마

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 로그인 한 유저가 식당과 관련해서 입력해야하는 정보들 추가
const requestRestaurantSchema = mongoose.Schema({
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'User' // 얘를 통해 User.js의 스키마에 있는 모든 정보를 가져올 수 있음
    },
    // 식당 고유 코드
    restaurantId: {
        type: String
    },
    // 식당 이름
    restaurantTitle: {
        type: String
    },
    // 식당 소개
    restaurantDescription: {
        type: String
    },
    // 추천 메뉴
    restaurantMenu: {
        type: String
    },
    // 식당 분류
    restaurantTypes: {
        type: Number
    },
    // 식당 주소
    restaurantAddress: {
        type: String
    },
}, { timestamps: true })

const RequestRestaurant = mongoose.model('RequestRestaurant', requestRestaurantSchema);

module.exports = { RequestRestaurant }