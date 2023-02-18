const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
   userId: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   // 댓글에 대한 좋아요
   commentId: {
       type: Schema.Types.ObjectId,
       ref: 'Comment'
   },
   // 리뷰에 대한 좋아요
   reviewId: {
       type: Schema.Types.ObjectId,
       ref: 'Review'
   }

}, { timestamps: true })


const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }