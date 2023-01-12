// 상품을 등록하는 페이지. 상품 정보가 모두 입력되면 백엔드로 보내주는 역할.

import React, { useState } from 'react'
import { Typography, Button, Form, Input, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';

const { TextArea } = Input;


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
function UploadProductPage(props) {
    const navigate = useNavigate();

    // 사용자가 값을 입력할 수 있도록 하는 State를 설정
    // Title은 return할 때 value에 사용되고, setTitle은 onChange함수를 구현하는데 사용
    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    // 괄호 안에 들어가는 숫자는 디폴트 값. 가격에 대해서는 0으로 적혀있음
    const [Price, setPrice] = useState(0)
    // 레스토랑 타입은 key값이 1인 한식이 디폴트 값
    const [RestaurantType, setRestaurantType] = useState(1)
    // FileUpload.js에 있는 이미지 정보를 가져와야 함
    // 그렇게 하기 위해 아래에 refreshFunction라는 props를 따로 만들어줘야 함
    const [Images, setImages] = useState([])

    // 위에서 설정한 state를 실제로 입력되도록 하는 event 설정
    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }

    const priceChangeHandler = (event) => {
        setPrice(event.currentTarget.value)
    }

    const typeChangeHandler = (event) => {
        setRestaurantType(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    // 가격, 메뉴 이름을 쓸 수 있도록 Handler 설정, DB 변경 필요

    const submitHandler = (event) => {
        event.preventDefault(); // 페이지가 자동적으로 refresh되지 않도록 설정
        // 모든 칸이 채워지지 않은 경우, 제출할 수 없도록 함
        if (!Title || !Description || !Price || !RestaurantType || Images.length === 0) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }

        //서버에 채운 값들을 request로 보낸다.

        // post request를 쓰기 위해서는 body를 채워줘야 함
        const body = {
            //로그인 된 사람의 ID 
            // props를 이용해서 auth.js에서 user의 id를 가져온다.
            writer: props.user.userData._id,
            title: Title,   // 여기서 Title, Description 등은 useState를 통해 이미 세팅된 값을 의미함
            description: Description,
            price: Price,
            images: Images,
            restaurantTypes: RestaurantType
        }

        // 저장할 내용을 백엔드로 보내기 위해 post request
        // 서버쪽의 product 라우트와 연결 (server/routes/product.js)
        Axios.post('/api/product', body)
            .then(response => {
                if (response.data.success) {
                    alert('식당 정보 업로드에 성공 했습니다.')
                    navigate('/') // 상품 업로드 성공시 자동적으로 LandingPage로 이동하도록 함
                } else {
                    alert('식당 정보 업로드에 실패 했습니다.')
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
                <h2> 식당 정보 업로드</h2>
            </div>
            <Form onSubmitCapture={submitHandler}>
                {/* DropZone */}
                {/* FileUpload.js의 이미지를 함께 업로드하기 위해 필요한 props */}
                <FileUpload refreshFunction={updateImages} />
                <br />
                <br />
                <label>이름</label>
                {/* Input 다음에 나오는 코드는 onChange가 발생하면 value가 변하도록 함 */}
                <Input onChange={titleChangeHandler} value={Title} />
                <br />
                <br />
                <label>분류</label>
                <br />
                <select onChange={typeChangeHandler} value={RestaurantType}>
                    {/* map 메소드를 이용하면 위에서 정의한 RestaurantTypes의 각 아이템들을 하나 하나 컨트롤할 수 있음 */}
                    {RestaurantTypes.map(item => (
                        <option key={item.key} value={item.key}> {item.value}</option>
                    ))}
                </select>
                <br />
                <br />
                <label>가격대(￦) / 1인</label>
                    <Input type="number" onChange={priceChangeHandler} value={Price} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description} />
                <br />
                <br />
                {/* antd에서 Col, Row를 추가 */}
                <Row gutter={[16, 16]}>
                    {/* 화면이 줄어들면 Collapse가 하나씩 따로 보이고, 화면이 커지면 Collapse가 두 개로 보이도록 함 */}
                    <Col lg={12} xs={24}>
                        <label>대표 메뉴</label>
                        <TextArea onChange={descriptionChangeHandler} value={Description} />
                        <br />
                        <br />
                    </Col>
                    <Col lg={12} xs={24}>
                        <label>가격</label>
                        <TextArea onChange={descriptionChangeHandler} value={Description} />
                        <br />
                        <br />
                    </Col>
                </Row>
                <Button htmlType="submit">
                    확인
                </Button>
            </Form>
        </div>
    )
}

export default UploadProductPage