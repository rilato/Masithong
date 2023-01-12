// 내가 누른 즐겨찾기를 모아놓은 페이지
// IMAGE_BASE_URL이 아닌, 이미지를 띄우고 싶다면 DetailProductPage.js의 이미지 업로드 방식을 파악하고,
// ProductImage.js에서 썸네일만 가져오는 방식을 익혀서, 여기에 ProductImage.js를 임포트해서 코드 짜면 될 것 같기도..

import React, { useEffect, useState } from 'react'
import './favorite.css';
import Axios from 'axios';
// import { Popover } from 'antd'; // 즐겨찾기한 식당 위에 마우스를 갖다대면 사진이 보이도록 하는 기능
//import { IMAGE_BASE_URL } from '../../Config';

function FavoritePage() {
    // Favorites에는 즐겨찾기를 누른 모든 식당들의 정보가 들어있음
    const [Favorites, setFavorites] = useState([])

    // 몽고DB에서 Favorited된 식당들을 가져오기
    useEffect(() => {
        fetchFavoredProduct() // /favorite 페이지에 들어오자마자 일단 이 함수 한 번 실행, remove버튼을 누르면 이 함수 한 번 더 실행(onClickDelete에서 구현)
    }, [])

    // Remove 버튼 클릭 시 페이지를 새로고침하여 Remove된 결과가 적용되도록 하는 함수
    const fetchFavoredProduct = () => {
        // endpointer는 백엔드의 favorite.js와 관련
        // 누가 좋아요를 눌렀는지, 누구의 즐겨찾기 페이지를 보여줄 지를 결정해야 하므로 userFrom 설정
        // 백 서버에 post request를 날리고
        Axios.post('/api/favorite/getFavoredProduct', { userFrom: localStorage.getItem('userId') })
            // 그에 대한 response (response에는 좋아요를 누른 식당들의 정보가 favorites에 array형식으로 담겨있음)가 왔을 때
            .then(response => {
                // 성공하면 setFavorites 실행
                if (response.data.success) {
                    setFavorites(response.data.favorites)
                } else {
                    alert('식당 정보를 가져오는데 실패 했습니다.')
                }
            })
    }


    // 즐겨찾기 페이지에서 remove 버튼을 누를 때, 해당 식당을 없애기 위한 함수
    const onClickDelete = (productId, userFrom) => {

        const variables = {
            productId,
            userFrom
        }

        // 백엔드에 해당하는 endpointer 전달
        Axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if (response.data.success) {
                    fetchFavoredProduct()
                } else {
                    alert("해당 식당을 리스트에서 지우는데 실패했습니다.")
                }
            })


    }

    // 즐겨찾기에 추가한 식당들을 하나 하나 보여주기 위해 map 사용
    const renderCards = Favorites.map((favorite, index) => {

        /* const content = (
            <div>
                {/* IMAGE_BASE_URL은 config.js에 있는 애인데, 저장된 이미지와 관련
                    w500은 사진의 크기 지정
                    우리는 Favorite DB에 사진을 저장하지 않고, Product DB에 사진을 저장하므로 사진을 불러올 수 없는 듯 !!
                {favorite.productTypes ?
                    <img src={`${IMAGE_BASE_URL}w500${favorite.productTypes}`} /> : "no image"}
                {/* 기존 코드에 } 있었는데, 이거 지워줘야 함!
            </div>
        ) */
        
        
        // RestaurantType 부분, switch case 부분은 productTypes부분이 숫자로 나오는 것을 막기 위해 임시로 설정한 방법
        let RestaurantType;
        
        // DB에서 productTypes를 Number로 바꿨으므로, type 변경 없이 switch case문 바로 사용
        switch (favorite.productTypes){
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
            {/* 실제로 좋아요 눌렀을 때 저장된 데이터가 사용자에게 보여지는 부분, 어떤 내용을 보여줄 지 여기서 결정 */}
            {/* Popover를 통해 즐겨찾기한 식당 위에 마우스를 갖다대면 사진이 보이도록 함 */}
            {/* <Popover content={content} title={`${favorite.productTitle}`} > */}
                {/* 식당의 이름을 알려줌, 식당의 이름을 클릭했을 때 식당의 상세 페이지로 이동 */}
            <td><a href={`/product/${favorite.productId}`}>{favorite.productTitle}</a></td>
            {/* </Popover> */}

            {/* 식당의 types을 알려줌, switch case를 통해 숫자가 아닌 음식의 종류가 나오게 설정 */}
            <td>{RestaurantType}</td>

            {/* Remove 버튼을 누르면 즐겨찾기 삭제 */}
            {/* 평소대로라면 onClick={onClickDelete}를 사용하여 function을 구현했지만, 이번에는 다르게 구현해야 함
                onClick={() => onClickDelete(favorite.productId, favorite.userFrom)} 형식 사용

                왜냐하면 얘를 감싸고있는 return <tr key={index}>의 내부에 있는 정보들을 가져가서 onClickDelete함수에서 사용해야하기 때문
                식당의 ID를 나타내는 productId와 어느 유저인지에 해당하는 userFrom을 DB에서 찾아서 지워주기 위해, 이 둘을 인자로 전달함 */}
            <td><button onClick={() => onClickDelete(favorite.productId, favorite.userFrom)}>Remove</button></td>

        </tr>
    })



    return (
        // 페이지에 적용될 UI 설정
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h2> Favorite Restaurants </h2>
            <hr />

            {/* table, td, th에 대한 css 적용은 favorite.css파일에서 만들음 */}
            <table>
                <thead>
                    <tr>
                        <th>Restaurant Title</th>
                        <th>Restaurant Types</th>
                        <td>Remove from favorites</td>
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

export default FavoritePage