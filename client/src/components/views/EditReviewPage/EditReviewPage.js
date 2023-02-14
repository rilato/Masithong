// 리뷰를 수정하는 페이지. 수정 내용을 백엔드부로 저장하고, 업데이트 해줌.

import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { Button, Form, Input,Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';

const ARRAY = [0, 1, 2, 3, 4];


// props를 사용하는 이유는 다른 페이지의 내용을 끌어다 쓰기 위함
function EditReviewPage() {

    const navigate = useNavigate();
    const user = useSelector(state => state.user)
    const { reviewId } = useParams(); 
    const variable = { reviewId: reviewId }


    const [DetailReview, setDetailReview] = useState([])
    const [Review, setReview] = useState("")
    const [Grade, setGrade] = useState([false, false, false, false, false])

    useEffect(() => {
        Axios.post('/api/review/review_by_reviewId',variable) 
           .then(response => {
              if (response.data.success) {
                console.log('response.data.review',response.data.review)
                setDetailReview(response.data.review[0])
               
                
                
              }  else {
                alert('Failed to get DetailReviewInfo')
            }
          })
          
        
    },[]);

    useEffect(() => {
        
        setReview(DetailReview.review);
        for(let i=0;i<DetailReview.grade;i++)
        {
            Grade[i]=true;
        }
       
          
        
    },[DetailReview]);  

    useEffect(() => {
        setStar();
    }, [Grade]);

    const setStar = () => {
        let star = Grade.filter(Boolean).length;
    }

   
    const reviewChangeHandler = (event) => {
        setReview(event.currentTarget.value)
    }

    const gradeChangeHandler = index => {
        let gradeStates = [...Grade];
        
        for (let i = 0; i < 5; i++) {
            gradeStates[i] = i <= index ? true : false;
        }

        setGrade(gradeStates);
    }
 
   // 가격, 메뉴 이름을 쓸 수 있도록 Handler 설정, DB 변경 필요
   const submitHandler = (event) => {
    event.preventDefault(); // 페이지가 자동적으로 refresh되지 않도록 설정
    // 모든 칸이 채워지지 않은 경우, 제출할 수 없도록 함
    if (!Review) {
        return alert(" 모든 값을 넣어주셔야 합니다.")
    }

    //서버에 채운 값들을 request로 보낸다.

    // post request를 쓰기 위해서는 body를 채워줘야 함
   
    const body = {
        
        _id: reviewId,
        review:Review,
        grade: Grade.filter(Boolean).length,
    }

    // 저장할 내용을 백엔드로 보내기 위해 post request
    // 서버쪽의 product 라우트와 연결 (server/routes/product.js)
    Axios.post('/api/review/updateReview', body)
        .then(res => {
            console.log(res.data);
            alert('리뷰 업데이트에 성공 했습니다.')
            navigate(`/review/${reviewId}`) // 상품 업로드 성공시 자동적으로 ApproveRestaurantPage로 이동하도록 함})
            
         })
         .catch(err => {
            console.error(err);
          });
        


  
}

    
    console.log('리뷰',Review)
    console.log('별',Grade)
    const {TextArea}=Input
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2>수정하기</h2>
            </div>
            
            <Form onSubmitCapture={submitHandler}>
                
                {/* antd에서 Col, Row를 추가 */}
                <Row >
                    <label>평점</label>
                    <Stars>
                        {ARRAY.map((el, idx) => {
                        return (
                            <FaStar
                            key={idx}
                            size="50"
                            onClick={() => gradeChangeHandler(el)}
                            className={Grade[el] && 'yellowStar'}
                            />
                        );
                        })}
                    </Stars>
                </Row>
                <Row>
                    <label>리뷰내용</label>
                    {/* Input 다음에 나오는 코드는 onChange가 발생하면 value가 변하도록 함 */}
                    <TextArea autoSize  onChange={reviewChangeHandler}  value={Review}  />
                        
                        <br />
                        <br />
                    
                    
                </Row>
                <Button htmlType="submit">
                    확인
                </Button>
                <br />
                <br />
            </Form>
        </div>
        
    )
}

export default EditReviewPage

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
    color: #fadb14;
  }
`;