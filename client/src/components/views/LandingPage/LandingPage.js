// LandingPage는 URL을 입력했을 때 가장 먼저 나오는 메인 페이지 역할

import React, { useEffect, useState } from 'react'
//import { FaCode } from "react-icons/fa";
import axios from 'axios';  // request를 보내기 위해 사용
import { useNavigate } from 'react-router-dom';
import {Col, Card, Row, Carousel } from 'antd'; // Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능, utils/ImageSlider.js에서 구현
import Icon from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
// 랜딩페이지에는 Sections 폴더 내부의 내용이 모두 포함되어야 함
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';
import { restaurantTypes, price } from './Sections/Datas';  // Datas.js에서는 function이 아닌, 정의된 변수 두 개를 가져와서 그것들을 사용할 것이므로 하나 하나 가져오는 듯

// 어떠한 값을 다른 컴포넌트(다른 파일)에게 전달해줘야 할 때, props 를 사용
function LandingPage(props) {
  const navigate = useNavigate();

  const [Products, setProducts] = useState([])
  // skip과 limit은 더보기 버튼 구현을 위해 필요
  const [Skip, setSkip] = useState(0) // Skip : 어디서부터 데이터를 가져오는지에 대한 위치(전에거는 스킵하고, 그 다음부터 데이터를 가져오겠다),
  // 처음에는 0부터 시작, Limit이 8이라면, 다음 번에는 2rd Skip = 0 + 8
  const [Limit, setLimit] = useState(8) // Limit : 처음 데이터를 가져올 때와 더보기 버튼을 눌러서 가져올 때 얼마나 많은 데이터를 한 번에 가져오는지 결정하는 메소드
  // 현재는 Limit을 통해, 더보기를 누르기 전에는 8개의 상품만 보이도록 설정
  const [PostSize, setPostSize] = useState(0)
  // handleFilters에서 사용할 필터 두 개를 만들어줘야 함
  const [Filters, setFilters] = useState({
      restaurantTypes: [],
      price: []
  })
  const [SearchTerm, setSearchTerm] = useState("")


  useEffect(() => {
    // 여기서 작성한 body는 getProducts함수의 argument로 전달되고, 백엔드의 product.js에서 받아서 사용
    let body = {
        skip: Skip, // skip은 0으로 초기화되었으므로 맨 처음 0으로 세팅
        limit: Limit // limit은 8로 초기화되었으므로 맨 처음 8로 세팅
    }

    getProducts(body)
}, [])

// 상품을 백엔드에서 가져오는 역할을 하는 함수
const getProducts = (body) => {
    axios.post('/api/product/products', body) // endpointer 설정, 백엔드의 product.js와 연관
        .then(response => {
            // 백엔드(product.js)에서 데이터 가져오는데 성공한 경우
            if (response.data.success) {
                // loadMoreHandler의 body에서 loadMore가 true인 상황인 경우, 더보기 버튼을 눌렀을 때 기존의 상품들과 더불어 추가된 상품이 함께 보이도록 함
                // 이 부분이 없으면, 더보기 버튼을 누르면 이전 상품들이 사라지고, 새롭게 로드된 상품들만 보임 (페이지 추가해서 다음 페이지로 이동시 이걸 써서 구현하면 될 듯)
                if (body.loadMore) {
                    setProducts([...Products, ...response.data.productInfo])
                } else {
                    setProducts(response.data.productInfo)
                }
                setPostSize(response.data.postSize) // 더보기 버튼을 보이게 할지 안보이게 할지를 설정
            // 실패한 경우
            } else {
                alert(" 상품들을 가져오는데 실패 했습니다.")
            }
        })
}

// 더보기 버튼 구현을 위한 함수
const loadMoreHandler = () => {
    // 더보기를 눌렀을 때, 그 다음 물품을 가져와야 하므로, skip을 재조정
    let skip = Skip + Limit
    let body = {
        skip: skip,
        limit: Limit,
        loadMore: true,
        filters: Filters
    }

    getProducts(body)
    setSkip(skip)
}

// Products에는 현재 여러 개의 product가 들어가있는 상태 (setProducts([...Products, ...response.data.productInfo]) 때문인듯).
// 얘네를 하나하나 컨트롤하기 위해 map 사용
const renderCards = Products.map((product, index) => {
    // 한 row는 24사이즈이므로, 화면이 가장 클 때에는 4개의 이미지가 들어가도록 6, 화면이 약간 작을 때에는 3개의 이미지가 들어가도록 8,
    // 가장 작을 떄에는 1개의 이미지가 들어가도록 24
    return <Col lg={6} md={8} xs={24} key={index}>
        <Card
            // href를 통해 상품의 _id에 맞게 endpointer를 지정하고, 상품의 상세 페이지를 볼 수 있는 URL을 만들어 줌
            cover={<a href={`/product/${product._id}`} ><ImageSlider images={product.images} /></a>} // card에는 image 정보를 담는다, ImageSlider는 utils/ImageSlider.js에서 구현
        >
            <Meta
                title={product.title}
                description={`￦${product.price}`}   // ￦는 사용자에게 표시되어야하는 문자이므로, 여기에 추가하여 기입
            />
        </Card>
    </Col>
})

// 체크박스를 통해 "음식의 종류로 필터링"된 결과물을 보여주기 위한 함수
const showFilteredResults = (filters) => {
  let body = {
    skip: 0,    // 체크박스를 해제하면 다시 처음부터 보여줘야 하므로 0
    limit: Limit,
    filters: filters
  }

  getProducts(body) // 백엔드에서 상품 가져오기
  setSkip(0) // skip을 다시 0으로 세팅
}

// 체크박스를 통해 "가격으로 필터링"된 결과물을 보여주기 위한 함수
const handlePrice = (value) => {
    const data = price; // Datas.js에서 가져온 price
    let array = [];

    // data[key]는 0번째 데이터, 1번째 데이터, 2번째 데이터... (Datas.js의 {} 안의 모든 항목들)
    for (let key in data) {
        if (data[key]._id === parseInt(value, 10)) { // 데이터에 있는 _id와 선택한 애가 같다면 데이터의 array 값이 리턴되도록 함
            array = data[key].array;
        }
    }

    return array;
}

// 두 개의 Collapse를 모두 컨트롤하기 위한 함수, filter는 체크박스에서 체크된 애들의 _id가 담겨져있음
const handleFilters = (filters, category) => {
    const newFilters = { ...Filters } // 새로운 오브젝트 생성

    newFilters[category] = filters // category 안에는 체크박스에서 체크된 restauranttype이나 price 배열이 있을 것

    console.log('filters', filters)

    if (category === "price") {
        let priceValues = handlePrice(filters)  // 바로 위에서 구현한 함수 적용
        newFilters[category] = priceValues
    }
    showFilteredResults(newFilters) // 바로 위에서 구현한 함수 적용
    setFilters(newFilters) // setFilters를 하지 않으면 필터링 적용이 안됨
}

// newSearchTerm은 event.currentTarget.value가 인자로 들어감
const updateSearchTerm = (newSearchTerm) => {

    let body = {
        skip: 0,    // 검색시 DB에 있는 맛집들 중 처음부터 긁어와야 하므로 0
        limit: Limit,   // limit은 8로 동일하게 설정
        filters: Filters,   // 코드 상단의 useState에 있는 Filters로 사용, 한식 분식 등 골랐을 때 그 필터도 함께 적용되도록 함
        searchTerm: newSearchTerm
    }

    setSkip(0) // skip을 0으로 세팅
    setSearchTerm(newSearchTerm) // SearchFeature.js에서 event.currentTarget.value를 newSearchTerm으로 받아서 useState 적용
    getProducts(body) // body 값에 맞게 백엔드에서 가져오기
}


// css 적용 등..
return (
    <div style={{ width: '75%', margin: '3rem auto' }}>

        <div style={{ textAlign: 'center' }}>
            <h2> 등록된 식당들 <Icon type="rocket" /> </h2>
        </div>

        {/* Filter */}
        {/* gutter는 Collapse 사이의 여백 기능 */ }
        <Row gutter={[16, 16]}>
            {/* 화면이 줄어들면 Collapse가 하나씩 따로 보이고, 화면이 커지면 Collapse가 두 개로 보이도록 함 */}
            <Col lg={12} xs={24}>
                {/* CheckBox, Sections/CheckBox.js와 연관 */}
                <Checkbox list={restaurantTypes} handleFilters={filters => handleFilters(filters, "restaurantTypes")} />
            </Col>
            <Col lg={12} xs={24}>
                {/* RadioBox, Sections/RadioBox.js와 연관, 사실상 또다른 체크박스 */}
                <Radiobox list={price} handleFilters={filters => handleFilters(filters, "price")} />
            </Col>
        </Row>


        {/* Search */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}> {/* 검색창을 우측 정렬하는 부분 */}
            {/* SearchFeature은 SearchFeature.js에서 구현, SearchFeature에서 SearchTerm을 업데이트하기 위한 코드 */}
            <SearchFeature
                refreshFunction={updateSearchTerm}
            />
        </div>


        {/* Cards */}
        {/* gutter는 이미지 사이의 여백 기능 */ }
        <Row gutter={[16, 16]} >
            {renderCards}
        </Row>

        <br />
        
        {/* PostSize는 product.js에서 productInfo.length를 의미, Limit 이상이라는 것은 더이상 DB에서 불러올 데이터가 없음을 의미 -> 더보기버튼이 더이상 보이지 않음 */}
        {PostSize >= Limit &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                { /* 더보기 버튼 구현, 클릭 시 loadMoreHandler 작동*/ }
                <button onClick={loadMoreHandler}>더보기</button>
            </div>
        }

    </div>
)
}

export default LandingPage