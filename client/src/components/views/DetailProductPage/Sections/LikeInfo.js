// ReviewInfo.js의 자식 페이지

import React, { useEffect, useState } from 'react'
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import Axios from 'axios';

function LikeInfo(props) {
    const [Likes, setLikes] = useState(0)
    const [Dislikes, setDislikes] = useState(0)

    const variable = { reviewId : props.Review._id }

    useEffect(() => {
      Axios.post('/api/like/getLikes', variable)
          .then(response => {
              console.log('getLikes',response.data)

              if (response.data.success) {
                  //How many likes does this video or comment have 
                  setLikes(response.data.likes.length)
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
              } else {
                  alert('Failed to get dislikes')
              }
          })
    })
    
    return (
        <div>
            <React.Fragment>
                <span key="comment-basic-like">
                    <Tooltip title="Like">
                        <LikeOutlined
                            style={{ fontSize: '20px' }}
                        />
                    </Tooltip>
                    <span style={{ paddingLeft: '8px', cursor: 'auto', fontSize: '16px' }}>{Likes}</span>
                </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span key="comment-basic-dislike">
                    <Tooltip title="Dislike">
                        <DislikeOutlined
                            style={{ fontSize: '20px' }}
                        />
                    </Tooltip>
                    <span style={{ paddingLeft: '8px', cursor: 'auto', fontSize: '16px' }}>{Dislikes}</span>
                </span>
            </React.Fragment>
        </div>
    )
}

export default LikeInfo