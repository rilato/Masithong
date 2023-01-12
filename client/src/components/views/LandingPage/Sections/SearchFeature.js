// 원하는 메뉴를 검색창에 검색하는 페이지

import React, { useState } from 'react'
import { Input } from 'antd';

const { Search } = Input;

// SearchFeature은 LandingPage.js에서 사용, 넘겨주기 위해 props사용
function SearchFeature(props) {
    // 검색 창에 글자를 한 개씩 입력할 때마다 SearchTerm이 달라짐
    const [SearchTerm, setSearchTerm] = useState("")

    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value)
        props.refreshFunction(event.currentTarget.value) // LandingPage.js에서 구현, SearchTerm을 부모컴포넌트인 LandingPage.js에 전달하기 위한 코드
    }

    return (
        // 이 부분은 antdesign에서 가져온, 검색창 UI를 예쁘게 만들기 위한 부분
        <div>
            <Search
                placeholder="맛집을 검색해보세요!"
                onChange={searchHandler} // 바로 위에서 함수로 구현
                style={{ width: 200 }}
                value={SearchTerm} // 검색창에 입력을 할 때마다 SearchTerm의 값이 달라짐, LandingPage.js에서 얘를 업데이트하기 위한 함수를 구현할 것
            />
        </div>
    )
}

export default SearchFeature