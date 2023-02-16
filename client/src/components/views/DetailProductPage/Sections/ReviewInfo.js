import React, { useEffect, useState } from 'react'
import { Card, Row, Descriptions, Avatar } from 'antd'; // Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능, utils/ImageSlider.js에서 구현
import { UserOutlined, LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import ImageSlider from '../../../utils/ImageSlider';
import styled from 'styled-components';
import { Rate, Tooltip } from 'antd';
import LikeInfo from './LikeInfo';

function ReviewInfo(props) {
    const [Reviews, setReview] = useState([])

    useEffect(()=>{
        setReview(props.ReviewLists)
    }, [props.ReviewLists])
    
    
    const renderCards = Reviews.map((Review,index) => {
        let time=Review.updatedAt;
        let realTime=time.split('T');

        const variable = { reviewId : Review._id }
        
        return (
          <div style={{ margin: '1rem auto'}}>
          <hr style = {{ margin: '0.3rem auto'}}/>
            <Row key={index}>
                 <Card className="custom-card" bordered={false}
                    // href를 통해 상품의 _id에 맞게 endpointer를 지정하고, 상품의 상세 페이지를 볼 수 있는 URL을 만들어 줌
                    cover={<a href={`/review/${Review._id}`} ><ImageSlider images={Review.images} /></a>} // card에는 image 정보를 담는다, ImageSlider는 utils/ImageSlider.js에서 구현
                >
                </Card>
                <Descriptions className="custom-description" layout='horizontal'>
                    <Descriptions.Item ><Avatar size={48} icon={<UserOutlined/>}/> 
                    &nbsp;&nbsp;&nbsp;{Review.writer.name} </Descriptions.Item>
                    <Descriptions.Item label="등록 날짜" labelStyle={{ marginTop: '18px' }} contentStyle={{ marginTop: '18px' }}>{realTime[0]} </Descriptions.Item>
                    <Descriptions.Item label="평점" labelStyle={{ marginTop: '18px' }}><Rate style={{ marginTop: '12px' }} disabled defaultValue={Review.grade} />{` \(${Review.grade}점\)`}                    
                    </Descriptions.Item>
                    <Descriptions.Item contentStyle={{ marginTop: '18px' }}><LikeInfo Review={Review} /></Descriptions.Item>
                    <Descriptions.Item label="리뷰내용" labelStyle={{marginTop: '8px'}} contentStyle={{marginTop:'8px', overflow:'hidden',width:'100px',height:'45px'}} ><a href={`/review/${Review._id}`}>{Review.review}</a></Descriptions.Item>
                </Descriptions>
                <br></br>
        </Row>
        <hr style = {{ margin: '1rem auto'}}/>      
        </div>     
        )     
        
    })
    return (
        <div>
            
            {renderCards}

        </div>
    )
}

export default ReviewInfo

// styled-components의 css를 하단에 작성
const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 15px;
`;

const RatingText = styled.div`
  color: #787878;
  font-size: 12px;
  font-weight: 400;
`;

const Stars = styled.div`
  display: flex;
  padding-top: 5px;

  & svg {
    color: gray;
    cursor: pointer;
  }

  :hover svg {
    color: #fcc419;
  }

  & svg:hover ~ svg {
    color: gray;
  }

  .yellowStar {
    color: #fcc419;
  }
`;