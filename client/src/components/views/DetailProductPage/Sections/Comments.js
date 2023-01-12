// 상품 상세 페이지에서 댓글을 관리하는 파일, 얘의 자식 파일로는 ReplyComment.js와 SingleComment.js가 존재

import React, { useState } from 'react'
import { Button, Input } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux'; // redux를 통해 로그인된 유저의 정보를 가져오기 위해 사용
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

const { TextArea } = Input;

function Comments(props) {
    const user = useSelector(state => state.user) // redux를 통해 로그인된 유저의 정보를 가져오기 위해 사용
    const [Comment, setComment] = useState("")

    // 사용자가 댓글 칸에 타이핑할 수 있도록 하는 함수
    const handleChange = (e) => {
        setComment(e.currentTarget.value)
    }

    // submit버튼을 눌렀을 때 댓글이 제출되도록 하는 함수
    const onSubmit = (e) => {
        e.preventDefault(); // submit 누를때 새로고침 방지

        // properties를 넣어주기 위해 아래의 내용 작성
        const variables = {
            content: Comment,
            writer: user.userData._id, // redux에서 로그인된 유저의 정보를 가져오는 방식, react-redux에서 useSelector를 추가
            postId: props.postId // DetailProductPage.js에서 맨 밑부분 Comments부분에서 props를 이용하여 postId를 가져오는 방식
        }

        // 댓글이 실제로 저장되는 곳 설정
        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                // 댓글이 저장되는 경우
                if (response.data.success) {
                    setComment("") // 얘를 해줘야 댓글 제출시, 댓글을 입력하는 창이 비어있게 됨. 그렇지 않으면 내가 썼던 댓글 그대로 입력 창에 남아있게 됨
                    // refreshFunction은 DetailProductPage.js에서 updateComment함수임
                    props.refreshFunction(response.data.result)
                } else {
                    alert('Failed to save Comment')
                }
            })
    }

    return (
        <div>
            <br />
            <p> 댓글 </p>
            <hr />

            {/* Comment Lists  */}
            {/* 사용자들이 입력했던 댓글들이 리스트형태로 쭉 나열되어 실제로 보여지는 부분 */}
            {console.log(props.CommentLists)}
            {/* DetailProductPage.js에서 CommentLists가 있으면, map을 돌림, comment가 아래쪽 코드의 props에 들어감 */}
            {props.CommentLists && props.CommentLists.map((comment, index) => (
                // Comment.js의 스키마를 보면, responseTo가 없는 애들(답글이 안달린 애들)만 출력되도록 하기 위함. 즉, 답글 버튼을 누르지 않으면 답글이 보이지 않도록 함
                (!comment.responseTo &&
                    // react에서는 JSX를 HTML대신 사용하는데, div나 React.Fragment로 감싸줘야 에러가 나지 않음!
                    <React.Fragment>
                        {/* SingleComment.js와 연관이 있음 */}
                        <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                        {/* ReplyComment.js와 연관이 있음 */}
                        <ReplyComment CommentLists={props.CommentLists} postId={props.postId} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                    </React.Fragment>
                )
            ))}


            {/* Root Comment Form */}

            <form style={{ display: 'flex' }} onSubmit={onSubmit}>
                <TextArea
                    style={{ width: '100%', borderRadius: '5px' }}  // borderRadius는 테두리를 둥글게 하기 위한 코드
                    onChange={handleChange} // 댓글 창에 글을 쓸 수 있게 하기 위한 코드
                    value={Comment} // value에 state을 줘야 함 그렇게 하기 위해 useState사용, 이 Comment는 위의 const variables의 Comment로도 사용
                    placeholder="write some comments"
                />
                <br />
                <Button style={{ width: '25%', height: '52px' }} onClick={onSubmit}>댓글</Button>
            </form>

        </div>
    )
}

export default Comments