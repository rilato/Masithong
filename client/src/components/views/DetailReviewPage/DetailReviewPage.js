
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
// import { Popover } from 'antd'; // 즐겨찾기한 식당 위에 마우스를 갖다대면 사진이 보이도록 하는 기능
//import { IMAGE_BASE_URL } from '../../Config';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {Col, Card, Row, Carousel,Descriptions,Avatar,Space,Button } from 'antd'; // Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능, utils/ImageSlider.js에서 구현
import Icon, { UserOutlined } from '@ant-design/icons';
import ImageSlider from '../../utils/ImageSlider';
import Meta from 'antd/lib/card/Meta';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import { Rate } from 'antd';
import Comments from './Sections/Comments';
import DetailReviewImage from './Sections/DetailReviewImage';
function DetailReviewPage() {

    const user = useSelector(state => state.user)
    const { reviewId } = useParams(); 
    //console.log(reviewId)
     const variable = { reviewId: reviewId }
    
   
    const [DetailReview, setDetailReview] = useState([])
    const [CommentLists, setCommentLists] = useState([]) // 댓글 설정
  // 몽고DB에서 해당 id번호에 맞는 리뷰 내용 가져오기
  useEffect(() => {
    fetchDetailReview() // 리뷰 상세보기 페이지에 들어오자마자 일단 이 함수 한 번 실행, remove버튼을 누르면 이 함수 한 번 더 실행 (onClickDelete에서 구현)
                        //remove버튼 누르면 detailProduct 페이지로 이동시켜줘야함 

    // DB에서 모든 Comment 정보들을 가져오기, 백엔드의 comment.js 파일과 연관
    Axios.post('/api/comment/getComments', variable)
        .then(response => {
          if (response.data.success) {
              console.log('response.data.comments',response.data.comments)
              setCommentLists(response.data.comments)
          } else {
              alert('Failed to get comment Info')
          }
        })
    
},[])


const fetchDetailReview = () => {
    


    Axios.post('/api/review/review_by_reviewId',variable) 
       .then(response => {
          if (response.data.success) {
            console.log('response.data.review',response.data.review[0])
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
  return (
        
    
        <Row justify="center" >
             
         
          
            <Col align="middle" margin="20%" style={{ marginBottom: '30px' }}  >
         <Descriptions layout='horizontal' size="small" >
             <Descriptions.Item ><Avatar size={48} icon={<UserOutlined/>}/> 
             &nbsp;&nbsp;&nbsp;{Review.writer.name} </Descriptions.Item>
             <Descriptions.Item label="식당 이름" labelStyle={{ marginTop: '18px' }} contentStyle={{ marginTop: '18px' }}>{Review.restaurantId.title}</Descriptions.Item>
             <Descriptions.Item label="등록 날짜" labelStyle={{ marginTop: '18px' }} contentStyle={{ marginTop: '18px' }}>{realTime[0]} </Descriptions.Item>
             <Descriptions.Item label="평점" labelStyle={{ marginTop: '18px' }}> <Rate style={{ marginTop: '12px' }}  disabled defaultValue={Review.grade} />{`\(${Review.grade}점\)`}                    
             </Descriptions.Item>
             <Descriptions.Item label="리뷰내용" labelStyle={{marginTop: '8px'}} >{Review.review}           
             </Descriptions.Item>
         </Descriptions>
         
         </Col>
         

        
         
         
         
         <Col align="middle">
         <DetailReviewImage detail={Review}/>
         </Col>
         
        
         
         

         
 </Row>    
 

 
)})





return (

    <div style={{ width: '100%', padding: '4rem 12rem', justifyContent: 'center'}}>
     
     
     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* 버튼 간의 간격 조절을 위해 margin 설정 */}
        <div style={{ marginRight: '5px', marginBottom: '10px' }}>
          
          
          <a href={`/editReview/${reviewId}`}><Button>리뷰 수정</Button></a>
          
        </div>
        
     </div>
     
         {/* 화면의 크기에 따라 이미지를 조정하기 위해 아래의 코드 입력*/}
        {/*<div style={{margin:'10px 20%'}}>*/} 
         {renderCards}
       
         
       
        
        <br />
        
            
       
  </div>
 
  

  
)
  
         
}

export default DetailReviewPage