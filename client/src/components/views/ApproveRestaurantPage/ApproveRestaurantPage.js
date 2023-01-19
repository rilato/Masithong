// 로그인한 유저가 식당 업로드를 요청하면 그것을 확인하는 페이지

import React, { useEffect, useState } from 'react'
import './approveRestaurant.css';
import Axios from 'axios';

function ApproveRestaurantPage() {
    /** ApproveRestaurant에는 사용자가 등록을 요청한 모든 식당들의 정보가 들어있음 */
    const [ApproveRestaurant, setApproveRestaurant] = useState([])

    // 몽고DB에서 등록 요청된 식당들을 가져오기
    useEffect(() => {
        /** /requestRestaurant 페이지에 들어오자마자 일단 이 함수 한 번 실행, remove버튼을 누르면 이 함수 한 번 더 실행(onClickDelete에서 구현) */
        fetchRequestedRestaurant()
    }, [])

    /** Remove 버튼 클릭 시 페이지를 새로고침하여 Remove된 결과가 적용되도록 하는 함수 */
    const fetchRequestedRestaurant = () => {
        // endpointer는 백엔드의 requestRestaurant.js와 관련
        // 여기서 userFrom이 가리키는 사용자는 관리자
        // 백 서버에 post request를 날리고
        Axios.post('/api/requestRestaurant/getRequestedRestaurant')
            // 그에 대한 response (response에는 등록 요청된 식당들의 정보가 restaurants에 array형식으로 담겨있음)가 왔을 때
            .then(response => {
                // 성공하면 setApproveRestaurant 실행
                if (response.data.success) {
                    setApproveRestaurant(response.data.restaurants)
                } else {
                    alert('식당 정보를 가져오는데 실패 했습니다.')
                }
            })
    }


    // 즐겨찾기 페이지에서 remove 버튼을 누를 때, 해당 식당을 없애기 위한 함수
    const onClickDelete = (restaurantId, userFrom) => {

        const variables = {
            restaurantId,
            userFrom
        }

        // 백엔드에 해당하는 endpointer 전달
        Axios.post('/api/requestRestaurant/removeRestaurant', variables)
            .then(response => {
                if (response.data.success) {
                    fetchRequestedRestaurant()
                } else {
                    alert("해당 식당을 리스트에서 지우는데 실패했습니다.")
                }
            })
    }

    // 즐겨찾기에 추가한 식당들을 하나 하나 보여주기 위해 map 사용
    const renderCards = ApproveRestaurant.map((restaurant, index) => {

        // RestaurantType 부분
        let RestaurantType;
        
        // DB에서 restaurantTypes를 Number로 바꿨으므로, type 변경 없이 switch case문 바로 사용
        switch (restaurant.restaurantTypes){
            case 1:
                RestaurantType = "한식";
                break;
            case 2:
                RestaurantType = "양식";
                break;
            case 3:
                RestaurantType = "중식";
                break;
            case 4:
                RestaurantType = "일식";
                break;
            case 5:
                RestaurantType = "퓨전";
                break;
            case 6:
                RestaurantType = "제과";
                break;
            case 7:
                RestaurantType = "디저트";
                break;
            }

        return <tr key={index}>
            {/* 실제로 사용자가 식당 업로드를 요청했을 때 저장된 데이터가 관리자에게 보여지는 부분 */}
            <td>{restaurant.restaurantTitle}</td>

            {/* 식당의 types을 알려줌, switch case를 통해 숫자가 아닌 음식의 종류가 나오게 설정 */}
            <td>{RestaurantType}</td>
            
            {/* 식당에 대표메뉴 */}
            <td>{restaurant.restaurantMenu}</td>

            {/* 식당에 대한 소개 */}
            <td>{restaurant.restaurantDescription}</td>

            {/* 식당의 주소 */}
            <td>{restaurant.restaurantAddress}</td>

            {/* Remove 버튼을 누르면 즐겨찾기 삭제 */}
            {/* 평소대로라면 onClick={onClickDelete}를 사용하여 function을 구현했지만, 이번에는 다르게 구현해야 함
                onClick={() => onClickDelete(favorite.productId, favorite.userFrom)} 형식 사용

                왜냐하면 얘를 감싸고있는 return <tr key={index}>의 내부에 있는 정보들을 가져가서 onClickDelete함수에서 사용해야하기 때문
                식당의 ID를 나타내는 productId와 어느 유저인지에 해당하는 userFrom을 DB에서 찾아서 지워주기 위해, 이 둘을 인자로 전달함 */}
            <td><button onClick={() => onClickDelete(restaurant.restaurantId, restaurant.userFrom)}>Remove</button></td>

        </tr>
    })



    return (
        // 페이지에 적용될 UI 설정
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h2> 등록 요청된 식당 목록 </h2>
            <hr />

            {/* table, td, th에 대한 css 적용은 favorite.css파일에서 만들음 */}
            <table>
                <thead>
                    <tr>
                        <th>이름</th>
                        <th>분류</th>
                        <th>대표 메뉴</th>
                        <th>소개</th>
                        <th>주소</th>
                        <th>등록 요청 제거</th>
                    </tr>
                </thead>
                <tbody>
                    {/* 위에서 renderCards 구현 */}
                    {renderCards}
                </tbody>
            </table>
        </div>
    )
}

export default ApproveRestaurantPage