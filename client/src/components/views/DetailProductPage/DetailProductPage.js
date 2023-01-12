// 등록한 상품의 상세정보를 볼 수 있는 페이지

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Row, Col } from 'antd';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import Comments from './Sections/Comments';
import Favorite from './Sections/Favorite';

function DetailProductPage(props) {
  //const productId = props.match.params.productId

  /* useParams는 리액트에서 제공하는 Hook으로 동적으로 라우팅을 생성하기 위해 사용
    URL에 포함되어있는 Key, Value 형식의 객체를 반환해주는 역할
    Route 부분에서 Key를 지정해주고, 해당하는 Key에 적합한 Value를 넣어 URL을 변경시키면, useParams를 통해 Key, Value 객체를 반환받아 확인할 수 있음
    반환받은 Value를 통해 게시글을 불러오거나, 검색목록을 변경시키는 등 다양한 기능으로 확장시켜 사용할 수 있음. */
  const { productId } = useParams(); 
  const variable = { productId: productId }

  const [Product, setProduct] = useState([]) // 상품 설정
  const [CommentLists, setCommentLists] = useState([]) // 댓글 설정

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
  }, [])
  
  // 새로운 댓글을 추가하면, 기존의 댓글에 더불어 함께 추가된 댓글이 보이도록 하기 위함 (concat)
  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment))
  }

  return (    
    <div style={{ width: '100%', padding: '3rem 4rem' }}> {/* rem은 글씨 사이즈, 루트엘리먼트의 폰트 사이즈를 기준으로 동작 */}
      {/* px(픽셀), rem, em의 차이
      https://dwbutter.com/entry/CSS-%EC%86%8D%EC%84%B1-%EB%8B%A8%EC%9C%84-px-rem-em-%EC%82%AC%EC%9A%A9%EC%98%88%EC%8B%9C-%EA%B3%84%EC%82%B0-%EA%B8%B0%EC%A4%80 */}

      <div style={{ display: 'flex', justifyContent: 'center' }}>
          <h1>{Product.title}</h1>
      </div>
      
      <br />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* 맨 위의 useState에서 Product를 여기에 사용,
        아래에서 3 가지 props를 적용하여 Favorite.js에서 function Favorite(props)의 props에 적용됨
        productId와 userFrom는 Favorite.js에서 variables에서 사용됨, userId는 LoginPage.js와 관련 있음
        로그인된 유저의 정보가 localStorage에 저장되어있음 */}
        <Favorite productInfo={Product} productId={productId} userFrom={localStorage.getItem('userId')} />
      </div>

      <Row gutter={[16, 16]} >
          {/* 화면의 크기에 따라 이미지를 조정하기 위해 아래의 코드 입력*/}
          <Col lg={12} sm={24}>
              {/* ProductImage.js에서 가져온 내용을 위치시키는 곳 */}
              <ProductImage detail={Product} />
          </Col>
          <Col lg={12} sm={24}>
              {/* ProductInfo.js에서 가져온 내용을 위치시키는 곳 */}
              <ProductInfo detail={Product} />
              {/* Comments.js에서 props로 postId를 넘겨주기 위해, CommentLists=~~~의 코드를 작성 */}
              {/* refreshFunction은 결국 updateComment 함수를 실행하는 것 */}
              {/* 기존 코드와 달리, ProductInfo 하단에 위치시켜, 댓글 UI를 더 깔끔하게 정리 */}
              <Comments CommentLists={CommentLists} postId={productId} refreshFunction={updateComment} />
          </Col>
      </Row>
    </div>
  )
}

export default DetailProductPage