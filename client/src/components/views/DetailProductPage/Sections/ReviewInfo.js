import React, { useEffect, useState } from 'react'
import { Col, Card, Row, Descriptions, Avatar } from 'antd'; // Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능, utils/ImageSlider.js에서 구현
import { ConsoleSqlOutlined, UserOutlined } from '@ant-design/icons';
import ImageSlider from '../../../utils/ImageSlider';
import styled from 'styled-components';
import { Rate } from 'antd';
import LikeInfo from './LikeInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ReviewInfo.css';
import Axios from 'axios';
import {useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

const baseURL = `/api/users`;

function ReviewInfo(props) {
    
    const USER = useSelector(state => state.user);
    const userId = '63fb7a19becdca233393f934';
    const [Reviews, setReview] = useState([])
    const [Images, setImages] = useState([])
    
    /*useEffect(() => {
      Axios.post(`/api/users/register`).then((response) => {
        if(response.data.success)
        {
          setImages(response.data.images[0])
          console.log("UserId: ",userId);
          console.log("response.data[0] ",response.data[0]);
        }
        else{
          console.log(response.error);
          alert("이미지 가져오기 실패")
        }
      });
    },[]);*/


    const downloadFiles = Axios.create({
        baseURL,
        headers: {"Content-type":"fomr-data"},
        timeout: 5000,
    });

    const onImageListClick = async (imageId) => {
      await downloadFiles.post("/register", {imageId})
      .then(({data}) => {
         const newFile = new File([data], imageId);
         const reader = new FileReader();
         reader.onload = (event) => {
          const previewImage = String(event.target?.result);
          setImages(previewImage);
         };
         reader.readAsDataURL(newFile);
      });
    }

    useEffect(() => {
      onImageListClick();
    }, [])
    

    useEffect(()=>{
        setReview(props.ReviewLists)
    }, [props.ReviewLists])

 
    
    const renderCards = Reviews.map((Review,index) => {
        let time=Review.createdAt;
        let realTime=time.split('T');

        const variable = { reviewId : Review._id }

       
        
        return (

          
          <div style={{ margin: '1rem auto'}} key={index}>
         

          <div className="card mb-3" style={{ maxWidth: '700px',maxHeight:'300px' }}>
            <div className="row g-0">
              <div className="col-md-4" >
              <a href={`/review/${Review._id}`}><ImageSlider images={Review.images} /></a>  
              </div>
            <div className="col-md-8">
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between"}}>
                <div style={{ float: "left", justifyContent: "flex-start", fontWeight:"bold" }}>
                <h6 className="card-title"><img src = {Images} />{/*<Avatar size={30} icon={Images}/>*/}&nbsp;{Review.writer.name}</h6>
                </div>
                <div style={{ float: "right", justifyContent: "flex-end" }}>
                <LikeInfo Review={Review}/>
                </div>
              </div>
              <div style={{fontWeight:"bold"}}>평점: &nbsp; <Rate disabled value={Review.grade} />{` \(${Review.grade}점\)`}</div>
              
              <div className="myStyle" style={{ marginTop: "12px", fontSize: "20px", width:'100%', height:'100px', }}>
              <a href={`/review/${Review._id}`}>{Review.review}</a>
              </div>
              
              <p className="card-text"><small className="text-muted">{realTime[0]}</small></p>
            </div>
            </div>
          </div>
          </div>
          
         
            
        </div>     
        )     
        
    })
    return (
        <div>
            
           

            
            {/* 화면의 크기에 따라 이미지를 조정하기 위해 아래의 코드 입력*/}
            <Row gutter={[16, 16]}>
              {renderCards.map((card, index) => (
                <Col span={12} key={index}>
                  {card}
                </Col>
              ))}
            </Row>

            
            
        

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