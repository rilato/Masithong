// 등록한 상품의 상세정보를 볼 수 있는 페이지
/* props는 부모 컴포넌트로부터 자식 컴포넌트에게 전달 혹은 상속되는 속성값을 말한다.
이 값은 자식 컴포넌트에서 활용은 가능하지만 수정은 불가하다.
이 값의 변경이 필요하다면 반드시 부모에서 변경해야만 한다.*/

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Row, Col,Avatar,Space,Card } from 'antd';
import { useSelector } from "react-redux";
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import Comments from './Sections/Comments';
import Favorite from './Sections/Favorite';
import KakaoMap from './Sections/KakaoMap';
import ReviewInfo from './Sections/ReviewInfo';
import StarInfo from './Sections/StarInfo';
import ImageSlider from '../../utils/ImageSlider';
import './detailProductPage.css';
import Meta from 'antd/lib/card/Meta';
import styled from "styled-components";

function DetailProductPage(props) {
  // 로그인 정보를 가져오기 위한 코드
  const user = useSelector(state => state.user)

  //const productId = props.match.params.productId

  /* useParams는 리액트에서 제공하는 Hook으로 동적으로 라우팅을 생성하기 위해 사용
    URL에 포함되어있는 Key, Value 형식의 객체를 반환해주는 역할
    Route 부분에서 Key를 지정해주고, 해당하는 Key에 적합한 Value를 넣어 URL을 변경시키면, useParams를 통해 Key, Value 객체를 반환받아 확인할 수 있음
    반환받은 Value를 통해 게시글을 불러오거나, 검색목록을 변경시키는 등 다양한 기능으로 확장시켜 사용할 수 있음. */
  const { productId } = useParams(); 
  const variable = { productId: productId }

  const [Product, setProduct] = useState([]) // 상품 설정
  const [CommentLists, setCommentLists] = useState([]) // 댓글 설정
  const [ReviewLists, setReviewLists]=useState([]) //리뷰 설정

  // useEffect 라는 Hook 을 사용하면 컴포넌트가 마운트 됐을 때 (처음 나타났을 때), 언마운트 됐을 때 (사라질 때), 그리고 업데이트 될 때 (특정 props가 바뀔 때)
  // 특정 작업을 처리하는 역할
  useEffect(() => {
    // DB에서 상품을 가져오기 위한 request, 이 부분을 백엔드에 넘겨줌, 하나의 상품만 가져오기 때문에 type=single
    // axios.get이 실행된 결과는 return부분의 Product(props)에 들어가게 됨
    axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response => {
            setProduct(response.data[0])
        })
        .catch(err => alert(err))
    
    // DB에서 모든 Comment 정보들을 가져오기, 백엔드의 comment.js 파일과 연관
    axios.post('/api/comment/getComments', variable)
        .then(response => {
          if (response.data.success) {
              console.log('response.data.comments',response.data.comments)
              setCommentLists(response.data.comments)
          } else {
              alert('Failed to get comment Info')
          }
        })

  axios.post('/api/review/reviews_by_id',variable) 
        .then(response => {
          if (response.data.success) {
            console.log('response.data.reviews',response.data.reviews)
            setReviewLists(response.data.reviews)
          }  else {
            alert('Failed to get reviewInfo')
        }
      })
  }, [])

  
  // 새로운 댓글을 추가하면, 기존의 댓글에 더불어 함께 추가된 댓글이 보이도록 하기 위함 (concat)
  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment))
  }

  // 관리자라면 favorite창이 보이지 않도록 설정
  if (user.userData && user.userData.isAuth && user.userData.isAdmin){
    return (
      <div style={{ width: '100%', padding: '3rem 4rem' }}> {/* rem은 글씨 사이즈, 루트엘리먼트의 폰트 사이즈를 기준으로 동작 */}
        {/* px(픽셀), rem, em의 차이
        https://dwbutter.com/entry/CSS-%EC%86%8D%EC%84%B1-%EB%8B%A8%EC%9C%84-px-rem-em-%EC%82%AC%EC%9A%A9%EC%98%88%EC%8B%9C-%EA%B3%84%EC%82%B0-%EA%B8%B0%EC%A4%80 */}
  
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h1>{Product.title}</h1>
        </div>
        
        <br />
        
        {/* gutter에서 두 개로 화면을 분할하기 때문에 지도를 새로고침했을 때 문제가 발생하는 듯 */}
        <Row gutter={[16, 16]} >
            {/* 화면의 크기에 따라 이미지를 조정하기 위해 아래의 코드 입력*/}
            <Col lg={12} sm={24}>
                <StarInfo ReviewLists={ReviewLists} />
              {/* ProductImage.js에서 가져온 내용을 위치시키는 곳 */}
              {/*
                컴포넌트(함수를 만들어 <함수/>로 사용하는 걸 말하는 듯) 만드는 법
                
                1. function 만들기
                2. return()안에 html 담기
                3. <함수명> </함수명> 쓰기

                여기선
                1. ProductImage라는 function을 ProductImage.js에서 만들었고
                2. 그 ProductImage.js에서 return() 안에 html을 담았으며
                3. <ProductImage /> 로 사용했음


                어떤걸 컴포넌트로 만들면 좋은가?
                1. 반복적으로 등장하는 html을 축약할 때 하나의 컴포넌트(함수)로 관리
                2. 페이지 전환 같은 기능들을 사용하거나 큰 페이지 혹은 기능들을 만들 때
                3. 자주 변경되는 UI들

                컴포넌트의 단점 : state를 가져다 쓸 때 문제가 생김. 왜냐하면 현재 페이지에서 변수의 선언 영역이 다른 페이지에 영향을 줄 수 없기 때문
                따라서 자식이 부모의 state를 가져다 쓰고 싶을 때에 props를 사용!
              */}
                <ProductImage detail={Product} />
            </Col>
            <Col lg={12} sm={24}>
                {/* ProductInfo.js에서 가져온 내용을 위치시키는 곳 */}
                <ProductInfo detail={Product} />
                {/* KakaoMap.js에서 가져온 내용을 위치시키는 곳 */}
                <KakaoMap productInfo={Product} />
            </Col>
        </Row>
        <br />
        <p> 리뷰 </p>
        <hr />
        <div style={{margin: '1rem auto'}}>
        <ReviewInfo ReviewLists={ReviewLists}  />
        </div>
        <br />          
      </div>
    )
  }
  // 로그인 한 유저라면 favorite창이 보이도록 설정
  else if (user.userData && user.userData.isAuth && !user.userData.isAdmin){
    return (
      <div style={{ width: '100%', padding: '3rem 4rem' }}> {/* rem은 글씨 사이즈, 루트엘리먼트의 폰트 사이즈를 기준으로 동작 */}
        {/* px(픽셀), rem, em의 차이
        https://dwbutter.com/entry/CSS-%EC%86%8D%EC%84%B1-%EB%8B%A8%EC%9C%84-px-rem-em-%EC%82%AC%EC%9A%A9%EC%98%88%EC%8B%9C-%EA%B3%84%EC%82%B0-%EA%B8%B0%EC%A4%80 */}
  
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h1>{Product.title}</h1>
        </div>
        
        <br />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* 버튼 간의 간격 조절을 위해 margin 설정 */}
          <div style={{ marginRight: '5px' }}>
            {/*
            버튼을 구현하고 싶었지만, href에서 "" 안에 {productId} 부분을 인식하지 못함.. 
            <Button href="/product/uploadReview">리뷰 작성</Button>
            <Button onclick="location.href=`/product/${productId}/uploadReview` "> 리뷰 작성 </Button> */}
            
            <a href={`/product/uploadReview/${productId}`}><Button>리뷰 작성</Button></a>
            {/*<a href={`/product/uploadReview/${productId}`}> 리뷰 작성 </a>*/}
          </div>
          <div style={{ marginLeft: '5px' }}>
            {/* 맨 위의 useState에서 Product를 여기에 사용,
            아래에서 3 가지 props를 적용하여 Favorite.js에서 function Favorite(props)의 props에 적용됨
            productId와 userFrom는 Favorite.js에서 variables에서 사용됨, userId는 LoginPage.js와 관련 있음
            로그인된 유저의 정보가 localStorage에 저장되어있음 */}
            <Favorite productInfo={Product} productId={productId} userFrom={localStorage.getItem('userId')} />
          </div>
        </div>
        
        {/* gutter에서 두 개로 화면을 분할하기 때문에 지도를 새로고침했을 때 문제가 발생하는 듯 */}
        <Row gutter={[16, 16]} >
            {/* 화면의 크기에 따라 이미지를 조정하기 위해 아래의 코드 입력*/}
            <Col lg={12} sm={24}>
                <StarInfo ReviewLists={ReviewLists} />
                {/* ProductImage.js에서 가져온 내용을 위치시키는 곳 */}
                <ProductImage detail={Product} />  
            </Col>
            <Col lg={12} sm={24}>
                {/* ProductInfo.js에서 가져온 내용을 위치시키는 곳 */}
                <ProductInfo detail={Product} />
                {/* KakaoMap.js에서 가져온 내용을 위치시키는 곳 */}
                <KakaoMap productInfo={Product} />
            </Col>  
        </Row>
        <br />
        <p> 리뷰 </p>
        <hr />
        <div style={{margin: '1rem auto'}}>
        <ReviewInfo ReviewLists={ReviewLists}  />
        </div>
        <br />          
      </div>
    )
  }
  // 로그인하지 않은 유저는 favorite창과 댓글 창이 보이지 않도록 설정
  else{
    return (
      <div style={{ width: '100%', padding: '3rem 4rem' }}> {/* rem은 글씨 사이즈, 루트엘리먼트의 폰트 사이즈를 기준으로 동작 */}
        {/* px(픽셀), rem, em의 차이
        https://dwbutter.com/entry/CSS-%EC%86%8D%EC%84%B1-%EB%8B%A8%EC%9C%84-px-rem-em-%EC%82%AC%EC%9A%A9%EC%98%88%EC%8B%9C-%EA%B3%84%EC%82%B0-%EA%B8%B0%EC%A4%80 */}
  
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <h1>{Product.title}</h1>
        </div>
        
        <br />
        
        {/* gutter에서 두 개로 화면을 분할하기 때문에 지도를 새로고침했을 때 문제가 발생하는 듯 */}
        <Row gutter={[16, 16]} >
            {/* 화면의 크기에 따라 이미지를 조정하기 위해 아래의 코드 입력*/}
            <Col lg={12} sm={24}>
                {/* ProductImage.js에서 가져온 내용을 위치시키는 곳 */}
                <ProductImage detail={Product} />
            </Col>
            <Col lg={12} sm={24}>
                {/* ProductInfo.js에서 가져온 내용을 위치시키는 곳 */}
                <ProductInfo detail={Product} />
                {/* KakaoMap.js에서 가져온 내용을 위치시키는 곳 */}
                <KakaoMap productInfo={Product} />
            </Col>
        </Row>
      </div>
    )
  }
}

export default DetailProductPage

   const Wrapper = styled.div`
  display: grid;
  place-items: center;
  margin: 30px;
  background: linear-gradient(to bottom, transparent, gray);
`;