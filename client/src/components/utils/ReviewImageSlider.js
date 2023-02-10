import React from 'react';
import {
  MDBCarousel,
  MDBCarouselItem,
} from 'mdb-react-ui-kit';

// props를 통해 다른 페이지에서 이 함수에 대해 접근 가능
function ReviewImageSlider(props) {
    return (
        <div>
            <MDBCarousel showControls showIndicators>
            { /* map을 통해 이미지 하나 하나 컨트롤 */ }
                {props.images.map((image, index) => (
                    <div key={index}>
                        <MDBCarouselItem
                            className='w-100 d-block'
                            itemId={index}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}
            </MDBCarousel>
        </div>
      );
}

export default ReviewImageSlider