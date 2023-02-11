// 하나의 댓글에 대해 답글을 이어갈 수 있도록 하는 파일, 얘의 부모 파일이 Comments.js

import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

// Comments.js와 상호작용하기 위한 props
function SingleComment(props) {
    const user = useSelector(state => state.user); // redux를 통해 로그인된 유저의 정보를 가져오기 위해 사용
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false) // 처음에는 reply부분이 숨겨져 있어야 하므로 false

    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    // Reply to 버튼 클릭 시 openReply가 toggle되어 reply를 달 수 있도록 하는 부분
    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    // 여기서 e는 event
    const onSubmit = (e) => {
        e.preventDefault(); // 새로고침 방지

        // 어차피 댓글에 대한 답글도, 구조가 그냥 댓글을 다는 것과 똑같기 때문에 Comments.js에서의 코드와 유사
        const variables = {
            writer: user.userData._id,
            postId: props.postId, // Comments.js에서 맨 밑부분 SingleComment부분에서 props를 이용하여 postId를 가져오는 방식
            responseTo: props.comment._id,
            content: CommentValue // 현재 댓글로 채워진 State인 CommentValue를 가져옴
        }

        // Comments.js에서 작성했던 부분과 유사
        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentValue("") // 얘를 해줘야 답글 제출시, 답글을 입력하는 창이 비어있게 됨. 그렇지 않으면 내가 썼던 답글 그대로 입력 창에 남아있게 됨
                    setOpenReply(!OpenReply) // 답글을 작성한 후, 답글 다는 창이 없어져야 하기 때문에 이 코드 추가
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }

    // 댓글에 대한 답글을 위한 actions
    const actions = [
        //<LikeDislikes comment commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
        // Reply to 버튼 클릭 시 openReply 작동
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to"> Reply to </span>
    ]

    return (
        <div>
            <Comment
                // Comments.js에서 <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} /> 코드와 연관
                actions={actions} // 얘가 주석처리 되어있으면 Reply to 버튼이 보이지 않음
                author={props.comment.writer.name}
                avatar={
                    <Avatar
                        src={props.comment.writer.image}
                        alt="image"
                    />
                }
                content={
                    <p>
                        {props.comment.content}
                    </p>
                }
            ></Comment>

            {/* OpenReply가 true인 경우에만 아래의 내용이 보일 수 있도록 함 */}
            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                    <TextArea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={handleChange}
                        value={CommentValue}
                        placeholder="write some comments"
                    />
                    <br />
                    <Button style={{ width: '25%', height: '52px' }} onClick={onSubmit}>답글</Button>
                </form>
            }

        </div>
    )
}

export default SingleComment