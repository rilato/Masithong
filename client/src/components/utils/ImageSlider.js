// Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능. 그러한 기능을 관리하는 페이지

import React from 'react'
import { Carousel } from 'antd';

// props를 통해 다른 페이지에서 이 함수에 대해 접근 가능
function ImageSlider(props) {
    return (
        <div>
            { /* autoplay를 통해 손으로 누르지 않아도 자동적으로 image가 slide되도록 함 */ }
            <Carousel autoplay >
                { /* map을 통해 이미지 하나 하나 컨트롤 */ }
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img style={{ width: '100%', maxHeight: '150px' }}
                            src={`http://localhost:5000/${image}`} />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider