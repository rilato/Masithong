// 식당 상세 페이지에서 지도를 나타내기 위한 파일

// 최종 수정본

import { useEffect } from "react";

// props를 통해 부모컴포넌트로부터 자식컴포넌트로 restaurant내용을 상속하였음
function KakaoMap(props) {
  const title = props.productInfo.title; // 제목을 DB에서 가져옴
  const address = props.productInfo.address; // 주소를 DB에서 가져옴

  const { kakao } = window;
  
  useEffect(() => {
    const geocoder = new kakao.maps.services.Geocoder();    // 주소-좌표 변환 객체를 생성

    geocoder.addressSearch(address, function (result, status) {   // 주소로 좌표를 검색
      
      if (status === kakao.maps.services.Status.OK) {      // 정상적으로 검색이 완료됐으면 
        const container = document.getElementById("map");   // 지도를 담을 영역의 DOM 레퍼런스
        
        const options = {
          center: new kakao.maps.LatLng(result[0].y, result[0].x),      // 지도 중심의 좌표, result로부터 latitude와 longitude를 가져옴
          level: 2,       // 지도의 크기 관련
        };
    
        const map = new kakao.maps.Map(container, options);  // 지도 생성 및 객체 리턴 

        let markerPosition = new kakao.maps.LatLng(result[0].y, result[0].x);   // 마커가 표시될 위치에 result로부터 latitude와 longitude를 가져옴

        // 결과값으로 받은 위치를 마커로 표시
        let marker = new kakao.maps.Marker({
          position: markerPosition,
          title: title
        });

        marker.setMap(map);
      }
    })
  }, [address]);  // 배열에 값을 넣어줘야 새로고침할 때 맵이 제대로 작동함 (props가 1회성으로 작동하는 것을 방지)

  // 좌우는 %로, 상하는 px로 고정시켜야 지도가 균일하게 나오고, 새로고침 시 공백이 발생하지 않음
  return <div id="map" style={{ width: "100%", height: "400px", color: "#000", fontWeight: "bold", textAlign:"center"}}></div>;
}

export default KakaoMap;