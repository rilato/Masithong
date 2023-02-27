
import React, { useEffect, useState } from 'react'
import Axios from 'axios';
// import { Popover } from 'antd'; // 즐겨찾기한 식당 위에 마우스를 갖다대면 사진이 보이도록 하는 기능
//import { IMAGE_BASE_URL } from '../../Config';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import {Col, Row, List, Descriptions, Avatar, Button } from 'antd'; // Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능, utils/ImageSlider.js에서 구현
import Icon, { UserOutlined } from '@ant-design/icons';
import ImageSlider from '../../utils/ImageSlider';
import Meta from 'antd/lib/card/Meta';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import { Rate } from 'antd';
import Comments from './Sections/Comments';
import DetailReviewImage from './Sections/DetailReviewImage';
import LikeDislikes from './Sections/LikeDislikes';
import { Card, Badge } from 'react-bootstrap';

function DetailReviewPage() {
  const user = useSelector(state => state.user)
    //const user = useSelector(state => state.user)
    //console.log('user',user);
    const { reviewId } = useParams(); 
    //console.log(reviewId)
     const variable = { reviewId: reviewId }
    
   
    const [DetailReview, setDetailReview] = useState([])
    const [CommentLists, setCommentLists] = useState([]) // 댓글 설정
    const [productId, setProductId] = useState("")
    
    const [userId,setUserId]=useState("");
  // 몽고DB에서 해당 id번호에 맞는 리뷰 내용 가져오기
  useEffect(() => {
    
    Axios.post('/api/review/review_by_reviewId',variable) 
       .then(response => {
          if (response.data.success) {
            console.log('response.data.review',response.data.review[0])
            setDetailReview(response.data.review)
            setProductId(response.data.review[0].restaurantId._id)
            setUserId(response.data.review[0].writer._id);
           
            
          } else {
            alert('Failed to get DetailReviewInfo')
        }
      })

      

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





console.log('user',userId);





// 새로운 댓글을 추가하면, 기존의 댓글에 더불어 함께 추가된 댓글이 보이도록 하기 위함 (concat)
const updateComment = (newComment) => {
  setCommentLists(CommentLists.concat(newComment))
}



const renderCards= DetailReview.map((Review,index) =>{
 
  const time=Review.updatedAt;
  const realTime=time.split('T');
   console.log(realTime[0]);
  return (
        
      <div>
          <Card className="mb-4">
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <Avatar size={48} icon={<UserOutlined />} />
          <h5 className="ms-3 mb-0">{Review.writer.name}</h5>
        </div>
        <Card.Title>{Review.restaurantId.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{realTime[0]}</Card.Subtitle>
        <Rate style={{ marginTop: '12px' }}  disabled defaultValue={Review.grade} />{`\(${Review.grade}점\)`} 
        <Card.Text className="mt-3">{Review.review}</Card.Text>
      </Card.Body>
      <Col align="middle">
          <DetailReviewImage detail={Review}/>
         </Col>
    </Card>
    {/*}
    <Row justify="center" key={index} >
             
         
             
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
         
  */}
        
         
         
         
         

       {/*</Row>*/}    
      </div>
      
)})




if((user.userData && user.userData.isAuth && !user.userData.isAdmin)&&(user.userData._id===userId))
{
  return (

    <div style={{ width: '100%', padding: '4rem 12rem', justifyContent: 'center'}}>
     
     
     <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        {/* 버튼 간의 간격 조절을 위해 margin 설정 */}
        <div style={{ marginLeft: '83%' }}>
        <a href={`/product/${productId}`}><Button>식당 정보</Button></a>
        </div>
        <div style={{ marginLeft: '10px' }}>
          <a href={`/editReview/${reviewId}`}><Button>리뷰 수정</Button></a>
        </div>
     </div>
     
         {/* 화면의 크기에 따라 이미지를 조정하기 위해 아래의 코드 입력*/}
        {/*<div style={{margin:'10px 20%'}}>*/} 
         {renderCards}
       

        {/* 리뷰 좋아요 싫어요 기능 */} 
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <List.Item actions={[<LikeDislikes DetailReview reviewId={reviewId} userId={localStorage.getItem('userId')}/>]}></List.Item>
        </div>
        
        <br />

        <Comments CommentLists={CommentLists} postId={reviewId} refreshFunction={updateComment} />
            
       
  </div>
 
  

  
  ) }

  else
  {
    return (

      <div style={{ width: '100%', padding: '4rem 12rem', justifyContent: 'center'}}>
       
       
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          {/* 버튼 간의 간격 조절을 위해 margin 설정 */}
          <div style={{ marginLeft: '83%' }}>
          <a href={`/product/${productId}`}><Button>식당 정보</Button></a>
          </div>
          
       </div>
       
           {/* 화면의 크기에 따라 이미지를 조정하기 위해 아래의 코드 입력*/}
          {/*<div style={{margin:'10px 20%'}}>*/} 
           {renderCards}
         
  
          {/* 리뷰 좋아요 싫어요 기능 */} 
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <List.Item actions={[<LikeDislikes DetailReview reviewId={reviewId} userId={localStorage.getItem('userId')}/>]}></List.Item>
          </div>
          
          <br />
  
          <Comments CommentLists={CommentLists} postId={reviewId} refreshFunction={updateComment} />
              
         
    </div>
   
    
  
    
    ) 
  }
  
}

  
         


export default DetailReviewPage