const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/Favorite'); // DB 모델을 가져오기

// client의 Favorite.js에서 설정한 endpointer와 맞추기
// express framework에서 제공하는 router 기능을 사용하고 있으므로,
// 여기에서는 /favoriteNumber 부분만 적어줘도 OK, 대신 index.js에서 그 앞부분에 해당하는 endpointer를 써줄 것!
router.post('/favoriteNumber', (req, res) => {  // 콜백 function을 통해 Favorite.js에서 variables에 담긴 정보들을 받을 수 있음
    // find 메소드를 통해 찾고싶은 상품 찾고, mongoDB에서 favorite 숫자를 가져오기 
    Favorite.find({ "productId": req.body.productId })
        // 쿼리 실행, info에는 몇 명이 좋아요를 눌렀는지에 대한 정보가 담김
        .exec((err, info) => {
            if (err) return res.status(400).send(err)
            // 그다음에 프론트에 다시 숫자 정보를 보내주기  
            res.status(200).json({ success: true, favoriteNumber: info.length })
        })
})



router.post('/favorited', (req, res) => {
    // 내가 이 상품을 Favorite 리스트에 넣었는지에 대한 정보를 DB에서 가져오기
    // "내가" 이 상품에 대해 좋아요를 눌렀는지 확인하기 위해 userFrom을 가져오는 것
    Favorite.find({ "productId": req.body.productId, "userFrom": req.body.userFrom })
        // info가 비어있다면 ( [] 상태 ) -> 내가 아직 Favorite 리스트에 상품을 넣지 않은 것임
        .exec((err, info) => {
            if (err) return res.status(400).send(err)
            // 그다음에 프론트에 다시 숫자 정보를 보내주기  

            let result = false; // 아직 Favorite List에 넣지 않은 상황

            // info에 내용이 들어있다면
            if (info.length !== 0) {
                result = true   // Favorite List에 넣은 상황으로 바꿔줌
            }

            res.status(200).json({ success: true, favorited: result })
        })
})


// 기존 John Ahn 코드에서는 이 endpointer에 해당하는 함수가 중복되어있음!
// client의 Favorite.js에서 보낸 request
// 이미 Favorited 버튼을 누른 상황인 경우, 버튼을 누르면 즐겨찾기를 취소해야함
router.post('/removeFromFavorite', (req, res) => {
    // Favorite DB에서 즐겨찾기를 해제 하려는 사람의 userFrom과 해당 식당을 가리키는 productId를 찾고 Favorite DB에 있는 정보를 지운다
    Favorite.findOneAndDelete({ productId: req.body.productId, userFrom: req.body.userFrom })
        // 이를 바탕으로 쿼리문 실행, result에는 쿼리가 실행된 결과가 담겨 프론트에 res로 보냄
        .exec((err, doc) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, doc })
        })
})


// client의 Favorite.js파일과 관련
// 아직 Favorited 버튼을 누르지 않은 경우, 버튼을 누르면 즐겨찾기를 추가해야함
// 프론트에서 받아온 정보들을 Favorite.js에 있는 DB에 넣어주면 됨
router.post('/addToFavorite', (req, res) => {
    // 프론트 쪽의 Favorite.js에서 보낸 req.body에는 variables가 들어있음
    const favorite = new Favorite(req.body) // favorite이라는 새로운 인스턴스 생성

    favorite.save((err, doc) => {   // save를 통해 req.body에 있는 모든 정보들(variables)이 favorite 인스턴스에 모두 들어감
        if (err) return res.status(400).send(err)
        return res.status(200).json({ success: true })
    })
})



// client의 FavoritePage.js파일과 관련
router.post('/getFavoredProduct', (req, res) => {
    // Favorite DB에서 즐겨찾기를 하려는 사람의 userFrom을 찾고
    Favorite.find({ 'userFrom': req.body.userFrom })
        // 이를 바탕으로 쿼리문 실행, 좋아요를 누른 식당들의 정보가 favorites에 array형식으로 담겨서 프론트에 res로 보냄
        .exec((err, favorites) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, favorites })
        })
})

module.exports = router;