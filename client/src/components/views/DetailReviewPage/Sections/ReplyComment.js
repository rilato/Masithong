// 답글에 대한 답글을 위한 파일, 얘의 부모 파일이 Comments.js

import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment';

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0) // 처음 답글의 수는 0이므로 initialState는 0으로 초기화
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    // 여기서는 답글의 수를 세기 위해 useEffect 사용
    useEffect(() => {
        // 아직 답글이 하나도 안달린 (답글이 0개인) 상태
        let commentNumber = 0;

        // 모든 CommentLists를 가져와서 map으로 하나씩 돌려봄
        props.CommentLists.map((comment) => {
            // 여기서 parentCommentId는 Comments.js의 comment._id를 의미
            // 자식 comment의 responseTo (답글이 어디에 달려있는지)와 부모 comment의 parentCommentId(답글이 달려있는 원본 댓글)가 같아야 답글의 수가 늘어나는 구조
            if (comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })

        setChildCommentNumber(commentNumber) // commentNumber의 수를 계산하여 다시 세팅
    }, [props.CommentLists, props.parentCommentId])
    // 숫자가 바뀔 때 마다 useEffect가 다시 실행되도록 하기 위해서 []가 아닌 [props.CommentLists, props.parentCommentId]를 사용하는 것
    // CommentLists는 부모로부터 오는데, 바뀔 때 마다 다시 한 번 실행하라는 의미.

    // 답글이 보여지는 부분(?)
    let renderReplyComment = (parentCommentId) =>
        props.CommentLists.map((comment, index) => (
            <React.Fragment>
                {/* Template이 Comment.js의 부분과 동일함
                자식 comment의 responseTo (답글이 어디에 달려있는지)와 부모 comment의 parentCommentId(답글이 달려있는 원본 댓글)가 같아야 <div style~~의 코드가 실행되는 것 */}
                {comment.responseTo === parentCommentId &&
                    // 이 아래의 style 적용을 통해, 답글이 댓글보다 약간 우측에 위치하도록 조정
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
                    </div>
                }
            </React.Fragment>
        ))

    // 사용자가 답글 칸에 타이핑할 수 있도록 하는 함수
    const handleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }


    return (
        <div>
            {/* 댓글 중 답글이 달려있는 개수가 1개 이상인 경우에 View more comment 버튼이 보이도록 함 */}
            {ChildCommentNumber > 0 &&
                <p style={{ fontSize: '14px', margin: 0, color: 'gray' }}
                    onClick={handleChange} >
                    View {ChildCommentNumber} more comment(s) {/* 답글의 수에 따라 보여지는 형식이 달라짐, 1개 : view 1 more comment */}
             </p>
            }

            {/* OpenReplyComments가 True인 경우에만 renerReplyComment를 실행 */}
            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }

        </div>
    )
}

export default ReplyComment