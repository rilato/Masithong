const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

const { auth } = require("../middleware/auth");

//=================================
//             Subscribe
//=================================

// 프론트 쪽의 Comments.js에서 axios.post('/api/comment/saveComment', variables)에 맞추기 위해 /saveComment
router.post("/saveComment", (req, res) => {

    const comment = new Comment(req.body)

    comment.save((err, comment) => {
        if (err) return res.json({ success: false, err })
        // comment만 써도 되지만, writer의 모든 정보를 가져오기 위해서는 아래의 코드로 작성
        Comment.find({ '_id': comment._id }) // id를 먼저 찾고
            .populate('writer') // 그다음 populate를 통해 writer에 해당하는 모든 정보를 가져옴
            .exec((err, result) => { // 그거를 실행
                if (err) return res.json({ success: false, err })
                return res.status(200).json({ success: true, result })
            })
    })

})

// 프론트 쪽의 DetailProductPage.js에서 axios.post('/api/comment/getComments', variable)에 맞추기 위해 /getComments
router.post("/getComments", (req, res) => {

    Comment.find({ "postId": req.body.productId }) // models/Comment.js에서 productId를 받아오고, 그거에 맞는 애를 DB에서 찾기
        .populate('writer')
        .exec((err, comments) => {
            if (err) return res.status(400).send(err)
            res.status(200).json({ success: true, comments })
        })

});


module.exports = router;