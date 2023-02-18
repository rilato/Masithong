// 리뷰를 수정하는 페이지. 수정 내용을 백엔드부로 저장하고, 업데이트 해줌.

import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { Button, Form, Input,Row, Col, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import ReviewImageUpload from '../../utils/ReviewImageUpload';

const ARRAY = [0, 1, 2, 3, 4];


// props를 사용하는 이유는 다른 페이지의 내용을 끌어다 쓰기 위함
function EditReviewPage() {

    const navigate = useNavigate();
    const user = useSelector(state => state.user)
    const { reviewId } = useParams(); 
    const variable = { reviewId: reviewId }

    const [Product, setProduct] = useState([])
    const [DetailReview, setDetailReview] = useState([])
    const [productId, setProductId] = useState("")
    const [Toggle, setToggle] = useState(0)
    const [Review, setReview] = useState("")
    const [Grade, setGrade] = useState([false, false, false, false, false])
    const [Images, setImages] = useState([])


/*
    Axios.get('/api/product/getProduct', productId)
    .then(response => {
        setProduct(response.data)
        console.log("response.data : ", response.data)
    })
    .catch(err => alert(err))

    console.log("Product : ", Product)
    console.log("gap : ", - DetailReview.grade + Grade.filter(Boolean).length)
    console.log("AfterreviewCount : ", Product.reviewCount)
    console.log("AfteraverageStar : ", (Product.starCount - DetailReview.grade + Grade.filter(Boolean).length)/(Product.reviewCount))
*/

    useEffect(() => {
        Axios.post('/api/review/review_by_reviewId', variable) 
           .then(response => {
              if (response.data.success) {
                console.log('response.data.review[0]', response.data.review[0])
                console.log('response.data.review[0].restaurantId._id : ', response.data.review[0].restaurantId._id)
                setDetailReview(response.data.review[0])
                setProductId(response.data.review[0].restaurantId._id)
                setToggle(1);
              } else {
                alert('Failed to get DetailReviewInfo')
            }
        })

        if (Toggle) {
            // productId를 변수로 다시 productId로 설정해줘야 백서버에서 읽는 듯
            const variable2 = { productId : productId }

            Axios.post('/api/product/product_by_productId', variable2)
                .then(response => {
                if (response.data.success) {
                    console.log('response.data.product[0]', response.data.product[0])
                    setProduct(response.data.product[0])
                } else {
                    alert('Failed to get DetailReviewInfo')
                }
            })
        }
        /*
        Axios.post('/api/product/getProductById', productId)
            .then(response => {
                setProduct(response.data)
                console.log("productId in useEffect : ", productId)
                console.log("response.data : ", response.data)
            })
            .catch(err => alert(err))*/

        /*Axios.get('/api/product/findProduct', productId)
            .then(response => {
                setProduct(response.data[0]);
                console.log("response.data (Product) : ", response.data[0])
            });
            */
        
        /*Axios.get(`/api/product/product_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
                console.log("productId : ", productId)
                console.log("response.data[0] : ", response.data[0])
            })
            .catch(err => alert(err))
            */

    },[Toggle]);

    console.log("productId : ", productId);



    useEffect(() => { 
        setReview(DetailReview.review);
        setImages(DetailReview.images);
    
        for(let i = 0; i < DetailReview.grade; i++) {
            Grade[i]=true;
        }
    },[DetailReview]);  

    useEffect(() => { 
        setStar();
    }, [Grade]);


    useEffect(() => { 
        setImages(Images);
    }, [Images]);



   

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

    const updateImages = (newImages) => {

        //let prevArr=Images;
        //let afterArr=Images.push(newImages);
        setImages(newImages);
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
            review: Review,
            grade: Grade.filter(Boolean).length,
            images: Images,
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
        

        /*
        EditReviewPage.js에서
            1. get request로 해당 Product 가져오고, StarCount를 가져온다.
            2. 가져온 StarCount 값을 useState로 세팅한다.
            3. post request로 리뷰를 올린 사람이 매겼던 기존 별점을 가져온다.
            4. 가져온 별점 값을 useState로 세팅한다.
            5. 리뷰 업데이트 시 : StarCount =  StarCount - 가져온 별점(해당 유저가 기존에 설정했던) + 새로 설정한 별점 / AverageStar = StarCount/ReviewCount

        */
        const body2 = {
            _id: Product._id,
            starCount: Product.starCount - DetailReview.grade + Grade.filter(Boolean).length,
            reviewCount: Product.reviewCount,
            averageStar: (Product.starCount - DetailReview.grade + Grade.filter(Boolean).length)/(Product.reviewCount)
        }

        console.log("Product : ", Product)
        console.log("AfterstarCount : ", Product.starCount - DetailReview.grade + Grade.filter(Boolean).length)
        console.log("AfterreviewCount : ", Product.reviewCount)
        console.log("AfteraverageStar : ", (Product.starCount - DetailReview.grade + Grade.filter(Boolean).length)/(Product.reviewCount))

        // 저장할 내용을 백엔드로 보내기 위해 post request
        // 서버쪽의 product 라우트와 연결 (server/routes/product.js)
        Axios.post('/api/product/updateStar', body2)
            .then(res => {
                console.log(res.data);
                alert('리뷰 업데이트에 성공 했습니다.')
                })
                .catch(err => {
                console.error(err);
            });
    }

    console.log('리뷰',Review)
    console.log('별',Grade)
    console.log('이미지',Images)
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
                <Row>
                <br />
                {/* DropZone */}
                {/* ReviewImageUpload.js의 이미지를 함께 업로드하기 위해 필요한 props */}
                    <ReviewImageUpload detail={Images} refreshFunction={updateImages} />
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