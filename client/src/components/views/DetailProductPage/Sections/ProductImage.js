// 상품 상세 페이지에서 이미지를 관리하는 파일
// 만약 썸네일이 필요하다면, gm이라는 npm을 다운받아서 실행. (강의 상세 보기 페이지 만들기 두 번째 꺼 10분30초)

import React, { useState, useEffect } from 'react'
import ImageGallery from 'react-image-gallery'; // index.css에도 css스타일 적용을 위해 import해줘야 할 것이 있음

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        // 이미지가 존재하고, 이미지의 개수가 한 개 이상이면 images를 정의
        if (props.detail.images && props.detail.images.length > 0) {
            let images = []

            // 하나 하나 컨트롤하기 위해 map
            props.detail.images.map(item => {
                images.push({
                    original: `http://localhost:5000/${item}`, // 원래 사진
                    thumbnail: `http://localhost:5000/${item}` // 썸네일 사진, 우리는 동일한 사진을 썸네일로 쓸 것임
                })
            })
            setImages(images)
        }

    }, [props.detail]) // props.detail을 쓰지 않으면 useEffect가 image를 가져오지 못함.
    // props.detail을 써주면 props.detail 값이 바뀔 때 마다 life cycle이 한 번 더 실행되어 image를 가져올 수 있음

    return (
        <div>
            <ImageGallery items={Images} /> {/* ImageGallery 라이브러리를 사용하는데, 위에서 세팅된 Image를 item으로 넣는 것*/}
        </div>
    )
}

export default ProductImage