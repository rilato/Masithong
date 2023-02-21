// 상품을 등록하는 페이지. 상품 정보가 모두 입력되면 백엔드로 보내주는 역할.

import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Col, Row } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
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
function UploadRequestedProductPage(props) {
    const navigate = useNavigate();
    const { approveRestaurantId } = useParams(); 
    const restaurantId=approveRestaurantId;
    const variable = { approveRestaurantId: approveRestaurantId }
    

    {/**
        useState의 () 안에 초기화 값을 넣어줘야 함.
        내가 원하는건 Restaurant.restaurantTitle의 값(예를 들어 교다이야)을 Initial Value로 넣고 싶은데, 그렇게 안됨.
        만약 넣는다고 해도 수정이 안되고, Antd의 defaultValue를 사용해보려고 했지만 it's not working.

        시도해본 방법들

        1.  const [Title, setTitle] = useState(Restaurant.restaurantTitle) // 값 자체를 넣어도보고

        2.  const Rtitle = Restaurant.restaurantTitle.toString(); // 받아오는 형식이 Object 타입인거 같아서 String으로 바꿔도 보고
            const [Title, setTitle] = useState(Rtitle)

        3.  const [DBTitle, setDBTitle] = useState("") // 애초에 request를 날릴 때 title을 따로 세팅한 뒤 그 값을 초기값으로도 넣어봄

                useEffect(() => {
                    // post request를 쓰면 상품은 가져오지만, {Restaurant.restaurantTitle}을 알아먹지 못한다!!
                    // 따라서 위와 같이 DB에서 아이템을 갖다 쓰고 싶으면 반드시 get request를 쓰도록 한다!!
                    Axios.get(`/api/requestRestaurant/restaurant_by_id?id=${approveRestaurantId}&type=single`)
                    .then(response => {
                        setRestaurant(response.data[0])

                        setDBTitle(response.data[0].restaurantTitle)
                    
                    })
                    .catch(err => alert(err))
                }, [])

            const [Title, setTitle] = useState(DBTitle)

        ... 등등 이거 외에도 시도한 방법이 더 많은데, 생각이 나지 않음... 얘좀 해결해주셈
    */}

    // 요청된 식당 정보 세팅
    const [Restaurant, setRestaurant] = useState([])
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
    //주소 State설정
    const [Address,SetAddress]=useState("")
    //추천인 State설정
    const[userFrom,SetUserId]=useState("");
   


    // 몽고DB에서 등록 요청된 식당들을 가져오기
    useEffect(() => {
        // post request를 쓰면 상품은 가져오지만, {Restaurant.restaurantTitle}을 알아먹지 못한다!!
        // 따라서 위와 같이 DB에서 아이템을 갖다 쓰고 싶으면 반드시 get request를 쓰도록 한다!!
        Axios.get(`/api/requestRestaurant/restaurant_by_id?id=${approveRestaurantId}&type=single`)
        .then(response => {
            setRestaurant(response.data[0])
        })
        .catch(err => alert(err))
    }, [])

    useEffect(()=> {
        setTitle(Restaurant.restaurantTitle)
        setRestaurantType(Restaurant.restaurantTypes)
        setDescription(Restaurant.restaurantDescription)
        SetAddress(Restaurant.restaurantAddress)
        SetUserId(Restaurant.userFrom)
        
    },[Restaurant])

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

    const addressChangeHandler = (event) => {
        SetAddress(event.currentTarget.value)
    }


    console.log('c',restaurantId);
    console.log('d',userFrom)


    // 가격, 메뉴 이름을 쓸 수 있도록 Handler 설정, DB 변경 필요
    const submitHandler = (event) => {
        event.preventDefault(); // 페이지가 자동적으로 refresh되지 않도록 설정
        // 모든 칸이 채워지지 않은 경우, 제출할 수 없도록 함
        if (!Title || !Description || !Price || !RestaurantType || Images.length === 0 || !Address) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }

        //서버에 채운 값들을 request로 보낸다.

        // post request를 쓰기 위해서는 body를 채워줘야 함
       
        const body = {
            // 로그인 된 사람의 ID 
            // props를 이용해서 auth.js에서 user의 id를 가져온다.
            writer: props.user.userData._id,
            title: Title,   // 여기서 Title, Description 등은 useState를 통해 이미 세팅된 값을 의미함
            description: Description,
            price: Price,
            images: Images,
            restaurantTypes: RestaurantType,
            address: Address,
        }

        const variables = {
            restaurantId,
            
            
        }
       
        // 저장할 내용을 백엔드로 보내기 위해 post request
        // 서버쪽의 product 라우트와 연결 (server/routes/product.js)
        Axios.post('/api/product', body)
            .then(response => {
                if (response.data.success) {
                    alert('식당 정보 업로드에 성공 했습니다.')
                    //navigate('/approveRestaurant')
                    }
                    
                   
                 else {
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

            Axios.post('/api/requestRestaurant/removeSpecificRestaurant', variables)
            .then(response => {
                if (response.data.success) {
                    alert('해당 식당을 리스트에서 지우는데 성공했습니다.')
                    navigate('/approveRestaurant')
                } else {
                    alert("해당 식당을 리스트에서 지우는데 실패했습니다.")
                }
            })
        


        {/**
            원하는 기능 : 식당 등록시 자동으로 RequestRestaurant DB에 있던 해당 식당 관련 내용이 삭제되도록 하고 싶음.
            ApproveRestaurantPage.js의 onClickDelete 부분과 백엔드의 requestRestaurant.js의 router.post의 removeRestaurant를 잘 연구하면 될 것 같은데 안되네.. 
        */}
    }

    console.log('이름',Title);
    console.log('분류',RestaurantType);
    console.log('가격',Price);
    console.log('주소',Address);
    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2> 식당 정보 업로드 </h2>
            </div>
            <Form onSubmitCapture={submitHandler}>
                {/* DropZone */}
                {/* FileUpload.js의 이미지를 함께 업로드하기 위해 필요한 props */}
                <FileUpload refreshFunction={updateImages} />
                <br />
                <br />
                {/* antd에서 Col, Row를 추가 */}
                
                    
                    <Col >
                        <label>이름</label>
                        {/* Input 다음에 나오는 코드는 onChange가 발생하면 value가 변하도록 함 */}
                        <Input onChange={titleChangeHandler}  value={Title} />
                        <br />
                        <br />
                    </Col>
                    
                    <Col >
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
                    </Col>
                    
                    <Col >
                        <label>설명</label>
                        <TextArea onChange={descriptionChangeHandler}  value={Description} />
                        <br />
                        <br />
                    </Col>
                    
                    <Col>
                        <label>도로명주소</label>
                        <TextArea onChange={addressChangeHandler}  value={Address} />
                        <br />
                        <br />
                    </Col>
                    {/* 화면이 줄어들면 Collapse가 하나씩 따로 보이고, 화면이 커지면 Collapse가 두 개로 보이도록 함 */}
                    
                    <Col >
                        <label>가격대(￦) / 1인</label>
                        <Input type="number" onChange={priceChangeHandler} value={Price} />
                        <br />
                        <br />
                    </Col>
                
                <Button htmlType="submit">
                    확인
                </Button>
                <br />
                <br />
            </Form>
        </div>
    )
}

export default UploadRequestedProductPage