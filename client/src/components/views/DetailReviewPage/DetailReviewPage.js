
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
// import { Popover } from 'antd'; // 즐겨찾기한 식당 위에 마우스를 갖다대면 사진이 보이도록 하는 기능
//import { IMAGE_BASE_URL } from '../../Config';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {Col, Card, Row, Carousel,Descriptions,Avatar,Space } from 'antd'; // Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능, utils/ImageSlider.js에서 구현
import Icon, { UserOutlined } from '@ant-design/icons';
import ImageSlider from '../../utils/ImageSlider';
import Meta from 'antd/lib/card/Meta';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import { Rate } from 'antd';
function DetailReviewPage() {

    const user = useSelector(state => state.user)
    const { reviewId } = useParams(); 
    //console.log(reviewId)
     const variable = { reviewId: reviewId }
    
    const [DetailReview, setDetailReview] = useState([])
    
  // 몽고DB에서 해당 id번호에 맞는 리뷰 내용 가져오기
  useEffect(() => {
    fetchDetailReview() // 리뷰 상세보기 페이지에 들어오자마자 일단 이 함수 한 번 실행, remove버튼을 누르면 이 함수 한 번 더 실행 (onClickDelete에서 구현)
                        //remove버튼 누르면 detailProduct 페이지로 이동시켜줘야함 
    
},[])

// Remove 버튼 클릭 시 페이지를 새로고침하여 Remove된 결과가 적용되도록 하는 함수
const fetchDetailReview = () => {
    // endpointer는 백엔드의 favorite.js와 관련
    // 누가 좋아요를 눌렀는지, 누구의 즐겨찾기 페이지를 보여줄 지를 결정해야 하므로 userFrom 설정
    // 백 서버에 post request를 날리고


    Axios.post('/api/review/review_by_reviewId',variable) 
       .then(response => {
          if (response.data.success) {
            console.log('response.data.review',response.data.review)
            setDetailReview(response.data.review)
            
          }  else {
            alert('Failed to get DetailReviewInfo')
        }
      })

    
}

const renderCards= DetailReview.map((Review,index) =>{
  const time=Review.updatedAt;
  const realTime=time.split('T');
   console.log(realTime[0]);
  return <Row>
            <Card className="custom-card" bordered={false}
                     // href를 통해 상품의 _id에 맞게 endpointer를 지정하고, 상품의 상세 페이지를 볼 수 있는 URL을 만들어 줌
                     cover={<a href={`/review/${Review._id}`} ><ImageSlider images={Review.images} /> </a>}>
                 
                 </Card>
         
         
         <Descriptions className="custom-description" layout='horizontal'>
             <Descriptions.Item ><Avatar size={48} icon={<UserOutlined/>}/> 
             &nbsp;&nbsp;&nbsp;{Review.writer.name} </Descriptions.Item>
             <Descriptions.Item label="등록 날짜" labelStyle={{ marginTop: '18px' }} contentStyle={{ marginTop: '18px' }}>{realTime[0]} </Descriptions.Item>
             <Descriptions.Item label="평점" labelStyle={{ marginTop: '18px' }}><Rate style={{ marginTop: '12px' }} disabled defaultValue={Review.grade} />{`\(${Review.grade}점\)`}                    
             </Descriptions.Item>
             <Descriptions.Item label="리뷰내용" >{Review.review}</Descriptions.Item>
         
         </Descriptions>
         <br></br>
 </Row>     
})
 

return (
  <div>
    {renderCards}
  </div>
  
)
  
         
}

export default DetailReviewPage