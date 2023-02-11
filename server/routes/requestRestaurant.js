const express = require('express');
const router = express.Router();    // 웹페이지의 request를 받기 위해 사용
const { RequestRestaurant } = require("../models/RequestRestaurant"); // models 폴더에서 스키마를 짜고, 그거를 여기서 라우팅하는 용도
// 사진 저장도 추가할거면 아래 코드 추가
// const multer = require('multer'); // 파일 업로드를 위한 npm, 가져온 사진을 저장하는데 필요

// 받아온 정보를 DB에 넣기 위한 작업, RequestRestaurantPage.js와 연관
// index.js에서 이미 /api/requestRestaurant를 타고 왔기 때문에, /만 있어도 OK
router.post('/', (req, res) => {
    // client의 RequestRestaurantPage.js의 Axios.post('/api/requestRestaurant', body)에서 받아온 정보들을 DB에 넣어 준다.
    const requestRestaurant = new RequestRestaurant(req.body) // RequestRestaurant는 RequestRestaurant.js에서 가져온 것. req.body를 통해 RequestRestaurant의 스키마를 채운다.

    requestRestaurant.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

// client의 ApproveRestaurantPage.js파일과 관련
router.post('/getRequestedRestaurant', (req, res) => {
    // RequestRestaurant DB에서 UserId를 알 필요 없이 모든 정보를 조회
    RequestRestaurant.find({})
        .exec((err, restaurants) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({ success: true, restaurants })
        })
})

// client의 ApproveRestaurantPage.js에서 보낸 request 또는 UploadRequestedProductPage.js에서 보낸 request
// 식당 등록을 완료한 경우, 버튼을 누르면 식당 요청을 없애야함
router.post('/removeRestaurant', (req, res) => {
    // RequestRestaurant DB에서 즐겨찾기를 해제 하려는 사람의 userFrom과 해당 식당을 가리키는 restaurantId를 찾고 RequestRestaurant DB에 있는 정보를 지운다
    RequestRestaurant.findOneAndDelete({ restaurantId: req.body.restaurantId, userFrom: req.body.userFrom })
        // 이를 바탕으로 쿼리문 실행, doc에는 쿼리가 실행된 결과가 담겨 프론트에 res로 보냄
        .exec((err, doc) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, doc })
        })
})

// client의 UploadProductPage.js파일과 관련
router.post('/restaurant_by_id', (req, res) => {
    //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.
    RequestRestaurant.find({ "_id" : req.body.approveRestaurantId })
    .populate('userFrom') // writer의 모든 정보를 가져와서 읽는다
    // 쿼리를 실행한다
    .exec((err, restaurant) => {
        if (err) return res.status(400).send(err)
        return res.status(200).json({success: true, restaurant})
    })
})

router.get('/restaurant_by_id', (req, res) => {
    // post request를 이용해서 필요한 값을 프론트엔드에서 가져올 때엔 req.body.~을 사용하지만, get request에서는 req.query.~를 사용!!
    let type = req.query.type
    let restaurantIds = req.query.id

    if (type === "array") {
        //id=123123123,324234234,324234234 이거를 
        //restaurantIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔준다
        let ids = req.query.id.split(',')
        restaurantIds = ids.map(item => {
            return item
        })
    }

    //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.
    RequestRestaurant.find({ _id: { $in: restaurantIds } })
        .populate('userFrom') // writer의 모든 정보를 가져와서 읽는다
        // 쿼리를 실행한다
        .exec((err, restaurant) => {
            if (err) return res.status(400).send(err)
            return res.status(200).send(restaurant)
        })
})

module.exports = router;