import React, { useEffect, useState } from 'react'
import { Tooltip } from 'antd';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import Axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)
    const [DislikeAction, setDislikeAction] = useState(null)

    let variable = {};

    // DetailReview 왔다면 : 즉, DetailReviewPage.js에서 리뷰에 해당하는 곳에서 왔다면
    if (props.DetailReview) {
        variable = { reviewId: props.reviewId, userId: props.userId }
    } else {    // 댓글과 관련한 좋아요 싫어요라면
        variable = { commentId: props.commentId, userId: props.userId }
    }

    


    useEffect(() => {

        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                console.log('getLikes',response.data)

                if (response.data.success) {
                    //How many likes does this video or comment have 
                    setLikes(response.data.likes.length)

                    //if I already click this like button or not 
                    response.data.likes.map(like => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked')
                        }
                    })
                } else {
                    alert('Failed to get likes')
                }
            })

        Axios.post('/api/like/getDislikes', variable)
            .then(response => {
                console.log('getDislike',response.data)
                if (response.data.success) {
                    //How many likes does this video or comment have 
                    setDislikes(response.data.dislikes.length)

                    //if I already click this like button or not 
                    response.data.dislikes.map(dislike => {
                        if (dislike.userId === props.userId) {
                            setDislikeAction('disliked')
                        }
                    })
                } else {
                    alert('Failed to get dislikes')
                }
            })

    }, [])


    const onLike = () => {

        if (LikeAction === null) {

            Axios.post('/api/like/upLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes + 1)
                        setLikeAction('liked')

                        //If dislike button is already clicked

                        if (DislikeAction !== null) {
                            setDislikeAction(null)
                            setDislikes(Dislikes - 1)
                        }


                    } else {
                        alert('Failed to increase the like')
                    }
                })


        } else {

            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setLikes(Likes - 1)
                        setLikeAction(null)

                    } else {
                        alert('Failed to decrease the like')
                    }
                })

        }

    }


    const onDisLike = () => {

        if (DislikeAction !== null) {

            Axios.post('/api/like/unDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes - 1)
                        setDislikeAction(null)

                    } else {
                        alert('Failed to decrease dislike')
                    }
                })

        } else {

            Axios.post('/api/like/upDisLike', variable)
                .then(response => {
                    if (response.data.success) {

                        setDislikes(Dislikes + 1)
                        setDislikeAction('disliked')

                        //If dislike button is already clicked
                        if(LikeAction !== null ) {
                            setLikeAction(null)
                            setLikes(Likes - 1)
                        }

                    } else {
                        alert('Failed to increase dislike')
                    }
                })


        }


    }

    // 디테일 리뷰 페이지에서 리뷰에 대해 좋아요 누를 때는 아래의 css style 적용
    if (props.DetailReview){
        return (
            <React.Fragment>
                <span key="comment-basic-like">
                    <Tooltip title="Like">
                        <LikeOutlined
                            style={{ fontSize: '25px' }}
                            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                            onClick={onLike} />
                    </Tooltip>
                    <span style={{ paddingLeft: '8px', cursor: 'auto', fontSize: '16px' }}>{Likes}</span>
                </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span key="comment-basic-dislike">
                    <Tooltip title="Dislike">
                        <DislikeOutlined
                            style={{ fontSize: '25px' }}
                            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                            onClick={onDisLike}
                        />
                    </Tooltip>
                    <span style={{ paddingLeft: '8px', cursor: 'auto', fontSize: '16px' }}>{Dislikes}</span>
                </span>
            </React.Fragment>
        )
    }
    // 댓글에 대해 좋아요 누를 때는 아래의 css style 적용
    else{
        return (
            <React.Fragment>
                <span key="comment-basic-like">
                    <Tooltip title="Like">
                        <LikeOutlined
                            theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
                            onClick={onLike} />
                    </Tooltip>
                    <span style={{ paddingLeft: '6px', cursor: 'auto' }}>{Likes}</span>
                </span>&nbsp;
                <span key="comment-basic-dislike">
                    <Tooltip title="Dislike">
                        <DislikeOutlined
                            theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
                            onClick={onDisLike}
                        />
                    </Tooltip>
                    <span style={{ paddingLeft: '6px', cursor: 'auto' }}>{Dislikes}</span>
                </span>
            </React.Fragment>
        )
    }

}

export default LikeDislikes