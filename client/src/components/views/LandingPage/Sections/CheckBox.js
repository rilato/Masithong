// 메인 화면의 좌측 상단 "식당 종류"에 해당하는 부분

import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd'; // Collapse는 누르면 펼쳐지고, 다시 누르면 닫혀지는 형식의 UI

const { Panel } = Collapse; // Collapse 사용

function CheckBox(props) {
    // 키 값인 _id 값이 Checked라는 []안에 들어가게 되는 형태
    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {
        const currentIndex = Checked.indexOf(value) // 체크박스에서 누른 것의 Index를 구하고 
        const newChecked = [...Checked] // 전체 Checked된 State를 가져오기 위해 [...Checked]

        //전체 Checked된 State에서 현재 누른 Checkbox가 없다면 ( indexOf(value)가 -1인 경우 )
        if (currentIndex === -1) {
            newChecked.push(value) // State 넣어준다. 
        //전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면 
        } else {
            newChecked.splice(currentIndex, 1) // splice를 통해 currentIndex에서 한 개를 지워준다
        }
        setChecked(newChecked)
        props.handleFilters(newChecked) // LandingPage.js에서 구현, 부모컴포넌트인 LandingPage.js에 전달하기 위한 코드
    }


    // props의 list가 존재한다면 props list를 하나하나 매칭시킨다.
    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index} >
            {/* onChange시 handleToggle실행, value._id는 Datas.js에서 각각의 아이템에 해당하는 _id값 */}
            <Checkbox onChange={() => handleToggle(value._id)}
                checked={Checked.indexOf(value._id) === -1 ? false : true} /> {/* indexOf(value._id)가 -1이면 false, 그렇지 않으면 true */}
            <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <div>
            {/* defaultActiveKey가 0이면 Collapse가 닫혀있고, 1이면 열려있음 */}
            <Collapse defaultActiveKey={['0']} >
                <Panel header="식당 종류" key="1">

                    {renderCheckboxLists()}

                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox