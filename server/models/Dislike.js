const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dislikeSchema = mongoose.Schema({
   userId: {
       type: Schema.Types.ObjectId,
       ref: 'User'
   },
   // 댓글에 대한 싫어요
   commentId: {
       type: Schema.Types.ObjectId,
       ref: 'Comment'
   },
   // 리뷰에 대한 싫어요
   reviewId: {
       type: Schema.Types.ObjectId,
       ref: 'Review'
   }

}, { timestamps: true })


const Dislike = mongoose.model('Dislike', dislikeSchema);

module.exports = { Dislike }