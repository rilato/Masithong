const express = require('express');
const router = express.Router();
const multer = require('multer'); // 파일 업로드를 위한 npm, 가져온 사진을 저장하는데 필요
const { Review } = require("../models/Review");

//=================================
//             Review
//=================================

// multer 모듈을 통해서 post로 전송된 파일의 저장경로와 파일명 등을 처리하기 위해서는 diskStorage 엔진이 필요
var storage = multer.diskStorage({
    // destination은 파일이 어디에 저장될 지 결정. 우리는 uploadsReview라는 폴더에 넣을 것
    destination: function (req, file, cb) {
        cb(null, 'uploadsReview/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    // 파일 저장시 어떠한 이름으로 저장할지 설정
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`) // cb 콜백함수를 통해 전송된 파일 이름 설정, 현재날짜_원본파일명의 조합으로 파일 이름 생성
    }
})

var upload = multer({ storage: storage }).single("file")

// index.js에서 /api/review를 이미 타고왔기 때문에, /image만 적어주면 OK
router.post('/image', (req, res) => {
    //가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        // 업로드 시 에러가 없으면 파일 경로와 파일 이름을 전달 (백엔드에서 프론트엔드로 파일이 저장되었음을 알릴 때 필요)
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
})

// 받아온 정보를 DB에 넣기 위한 작업, UploadReviewPage.js와 연관
// index.js에서 이미 /api/review를 타고 왔기 때문에, /만 있어도 OK
router.post('/', (req, res) => {
    // client의 UploadReviewPage.js의 Axios.post('/api/review', body)에서 받아온 정보들을 DB에 넣어 준다.
    const review = new Review(req.body) // Review는 Review.js에서 가져온 것. req.body를 통해 Review의 스키마를 채운다.

    review.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})

// 정렬 순서 : https://www.inflearn.com/questions/143367/%EB%9E%9C%EB%94%A9-%ED%8E%98%EC%9D%B4%EC%A7%80%EC%97%90-%EC%83%81%ED%92%88%EB%93%A4%EC%9D%84-%EC%A0%95%EB%A0%AC%ED%95%98%EB%8A%94-%EB%B0%A9%EB%B2%95
// DetailProductPage.js에서 설정한 endpointer와 맞춰주기 위해 /reviews로 설정
router.post('/reviews', (req, res) => {
    // post request를 이용해서 필요한 값을 프론트엔드에서 가져올 때엔 req.body.~을 사용하지만, get request에서는 req.query.~를 사용!!
    let order = req.body.order ? req.body.order : "desc";   // .order = 정렬 방법 : 내림차순
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"; // .sortBy = 기준 칼럼 : _id
    // DetailProductPage.js에서 보내온 skip과 limit 정보를 받아옴
    let limit = req.body.limit ? parseInt(req.body.limit) : 20; // limit이 존재하면 parseInt(req.body.limit)을 통해 limit을 숫자로 변경, 존재하지 않으면 20으로 설정
    let skip = req.body.skip ? parseInt(req.body.skip) : 0; // skip이 존재하면 skip을 숫자로 변경, 존재하지 않으면 0으로 설정

    let findArgs={};

    if(req.body.selectedStarRate) //열람하려고 하는 별점이 선택됐다면 findArgs설정
    {
        findArgs["grade"]=req.body.selectedStarRate;
        console.log('findArgs',findArgs);
    } 

    if(req.body.selectedStarRate) //열람하려고 하는 별점이 선택됐다면
    {
        Review.find({"restaurantId" : req.body.productId})
        .find(findArgs)
        // 해당 상품이 없으므로, 여기서 .find를 한 번 더 써주지 않음
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, reviewInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, reviewInfo,
                postSize: reviewInfo.length // postSize는 reviewInfo.length로 정의
            })
        })
    }
    else{ //열람하려고 하는 별점이 선택안됐다면
        Review.find({"restaurantId" : req.body.productId})
        
        // 해당 상품이 없으므로, 여기서 .find를 한 번 더 써주지 않음
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, reviewInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, reviewInfo,
                postSize: reviewInfo.length // postSize는 reviewInfo.length로 정의
            })
        })
    }
})


router.post('/reviews_by_grade', (req, res) => {
    // post request를 이용해서 필요한 값을 프론트엔드에서 가져올 때엔 req.body.~을 사용하지만, get request에서는 req.query.~를 사용!!
    let order = req.body.order ? req.body.order : "desc";   // .order = 정렬 방법 : 내림차순
    let sortBy = req.body.sortBy ? req.body.sortBy : "grade"; // .sortBy = 기준 칼럼 : _id
    // DetailProductPage.js에서 보내온 skip과 limit 정보를 받아옴
    let limit = req.body.limit ? parseInt(req.body.limit) : 20; // limit이 존재하면 parseInt(req.body.limit)을 통해 limit을 숫자로 변경, 존재하지 않으면 20으로 설정
    let skip = req.body.skip ? parseInt(req.body.skip) : 0; // skip이 존재하면 skip을 숫자로 변경, 존재하지 않으면 0으로 설정

    let findArgs={};

    if(req.body.selectedStarRate) //열람하려고 하는 별점이 선택됐다면 findArgs설정
    {
        findArgs["grade"]=req.body.selectedStarRate;
        console.log('findArgs',findArgs);
    } 

    if(req.body.selectedStarRate) //열람하려고 하는 별점이 선택됐다면
    {
        Review.find({"restaurantId" : req.body.productId})
        .find(findArgs)
        // 해당 상품이 없으므로, 여기서 .find를 한 번 더 써주지 않음
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, reviewInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, reviewInfo,
                postSize: reviewInfo.length // postSize는 reviewInfo.length로 정의
            })
        })
    }
    else{ //열람하려고 하는 별점이 선택안됐다면
        Review.find({"restaurantId" : req.body.productId})
        
        // 해당 상품이 없으므로, 여기서 .find를 한 번 더 써주지 않음
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, reviewInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, reviewInfo,
                postSize: reviewInfo.length // postSize는 reviewInfo.length로 정의
            })
        })
    }
})


router.post('/reviews_by_grade_up', (req, res) => {
    // post request를 이용해서 필요한 값을 프론트엔드에서 가져올 때엔 req.body.~을 사용하지만, get request에서는 req.query.~를 사용!!
    let order = req.body.order ? req.body.order : "asc";   // .order = 정렬 방법 : 내림차순
    let sortBy = req.body.sortBy ? req.body.sortBy : "grade"; // .sortBy = 기준 칼럼 : _id
    // DetailProductPage.js에서 보내온 skip과 limit 정보를 받아옴
    let limit = req.body.limit ? parseInt(req.body.limit) : 20; // limit이 존재하면 parseInt(req.body.limit)을 통해 limit을 숫자로 변경, 존재하지 않으면 20으로 설정
    let skip = req.body.skip ? parseInt(req.body.skip) : 0; // skip이 존재하면 skip을 숫자로 변경, 존재하지 않으면 0으로 설정

    let findArgs={};

    if(req.body.selectedStarRate) //열람하려고 하는 별점이 선택됐다면 findArgs설정
    {
        findArgs["grade"]=req.body.selectedStarRate;
        console.log('findArgs',findArgs);
    } 

    if(req.body.selectedStarRate) //열람하려고 하는 별점이 선택됐다면
    {
        Review.find({"restaurantId" : req.body.productId})
        .find(findArgs)
        // 해당 상품이 없으므로, 여기서 .find를 한 번 더 써주지 않음
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, reviewInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, reviewInfo,
                postSize: reviewInfo.length // postSize는 reviewInfo.length로 정의
            })
        })
    }
    else{ //열람하려고 하는 별점이 선택안됐다면
        Review.find({"restaurantId" : req.body.productId})
        
        // 해당 상품이 없으므로, 여기서 .find를 한 번 더 써주지 않음
        .populate("writer")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, reviewInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, reviewInfo,
                postSize: reviewInfo.length // postSize는 reviewInfo.length로 정의
            })
        })
    }
})

// EditReviewPage.js에서 get request를 요청하면, 여기서 식당 ID에 관련된 모든 리뷰를 찾아 다시 보내줌. 
router.post('/reviews_by_id', (req, res) => {
    //_id를 이용해서 DB에서 _id와 같은 상품의 정보를 가져온다.
    Review.find({ "_id" : req.body.reviewId })
        .populate('writer') // writer의 모든 정보를 가져와서 읽는다
        // 쿼리를 실행한다
        .exec((err, review) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({success: true, review})
        })
})


// EditReviewPage.js에서 post request를 요청하면, 여기서 특정 리뷰 id에 맞는 리뷰를 찾아 다시 보내줌. 
router.post('/review_by_reviewId', (req, res) => {
    //_id를 이용해서 DB에서 _id와 같은 상품의 정보를 가져온다.
    Review.find({ "_id" : req.body.reviewId })
        .populate('writer') // writer의 모든 정보를 가져와서 읽는다
        .populate('restaurantId')
        // 쿼리를 실행한다
        .exec((err, review) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({success: true, review})
        })
})


router.post('/updateReview', (req, res) => {
    
    Review.findOneAndUpdate(
        {_id: req.body._id},
        {review: req.body.review, grade: req.body.grade, images:req.body.images},
        
        )
        .then(Review=>res.json(Review))
        .catch(err=>res.status(400).json(err));
        
    

})



// routes폴더 안의 파일로, 라우터 기능을 하므로, exports router
module.exports = router;