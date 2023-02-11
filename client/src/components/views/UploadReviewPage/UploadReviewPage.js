// 상품을 등록하는 페이지. 상품 정보가 모두 입력되면 백엔드로 보내주는 역할.

import React, { useState, useEffect } from 'react'
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import ReviewImageUpload from '../../utils/ReviewImageUpload';
import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';

const { TextArea } = Input;
const ARRAY = [0, 1, 2, 3, 4];

const RestaurantTypes = [
    { key: 1, value: "한식" },
    { key: 2, value: "양식" },
    { key: 3, value: "중식" },
    { key: 4, value: "일식" },
    { key: 5, value: "퓨전" },
    { key: 6, value: "제과" },
    { key: 7, value: "디저트" }
]

// props를 사용하는 이유는 다른 페이지의 내용을 끌어다 쓰기 위함
function UploadReviewPage(props) {
    const navigate = useNavigate();
    const { productId } = useParams();
    const variable = { productId: productId }

    // 사용자가 값을 입력할 수 있도록 하는 State를 설정
    // Title은 return할 때 value에 사용되고, setTitle은 onChange함수를 구현하는데 사용
    const [Review, setReview] = useState("")
    // 이미지 설정
    const [Images, setImages] = useState([])
    // 평점 설정
    const [Grade, setGrade] = useState([false, false, false, false, false])
    
    const reviewChangeHandler = (event) => {
        setReview(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    // 평점 핸들러 구현
    const gradeChangeHandler = index => {
        let gradeStates = [...Grade];
        
        for (let i = 0; i < 5; i++) {
            gradeStates[i] = i <= index ? true : false;
        }

        setGrade(gradeStates);
    }
    
    useEffect(() => {
        setStar();
    }, [Grade]);

    const setStar = () => {
        let star = Grade.filter(Boolean).length;
    }
    
    const submitHandler = (event) => {
        event.preventDefault(); // 페이지가 자동적으로 refresh되지 않도록 설정
        // 사진을 제외한, 나머지 값이 채워지지 않은 경우 
        if (!Review && !Grade) {
            return alert("리뷰와 평점 값을 넣어주셔야 합니다.")
        }

        else if (!Review) {
            return alert("리뷰를 넣어주셔야 합니다.")
        }

        else if (!Grade) {
            return alert("평점 값을 넣어주셔야 합니다.")
        }

        //서버에 채운 값들을 request로 보낸다.

        // post request를 쓰기 위해서는 body를 채워줘야 함
       
        const body = {
            // 로그인 된 사람의 ID 
            // props를 이용해서 auth.js에서 user의 id를 가져온다.
            writer: props.user.userData._id,
            restaurantId: productId,
            review: Review,   // 여기서 Review, Grade 등은 useState를 통해 이미 세팅된 값을 의미함
            images: Images,
            grade : Grade.filter(Boolean).length,
        }

        // 저장할 내용을 백엔드로 보내기 위해 post request
        // 서버쪽의 review 라우트와 연결 (server/routes/review.js)
        Axios.post('/api/review', body)
            .then(response => {
                if (response.data.success) {
                    alert('식당 리뷰 업로드에 성공 했습니다.')
                    navigate('/') // 상품 업로드 성공시 자동적으로 LandingPage로 이동하도록 함
                } else {
                    alert('식당 리뷰 업로드에 실패 했습니다.')
                }
            })
            .catch((error) => {
                if (error.response) {
                  console.log(error.response);
                  console.log("server responded");
                } else if (error.request) {
                  console.log("network error");
                } else {
                  console.log(error);
                }
            });
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2> 식당 리뷰 업로드</h2>
            </div>
            <Form onSubmitCapture={submitHandler}>
                <RatingText>사진 업로드</RatingText>
                <br />
                {/* DropZone */}
                {/* ReviewImageUpload.js의 이미지를 함께 업로드하기 위해 필요한 props */}
                    <ReviewImageUpload refreshFunction={updateImages} />
                <br />
                <br />
                <Wrap>
                <RatingText>평가하기</RatingText>
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
                </Wrap>
                <br />
                <br />
                <RatingText>리뷰</RatingText>
                    <TextArea onChange={reviewChangeHandler} value={Review} />
                <br />
                <br />
                <Button htmlType="submit">
                    확인
                </Button>
                <br />
                <br />
            </Form>
        </div>
    )
}

export default UploadReviewPage


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