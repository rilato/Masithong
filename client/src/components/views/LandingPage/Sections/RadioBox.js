// 메인 화면의 우측 상단 "price"에 해당하는 부분

import React, { useState } from 'react'
import { Collapse, Radio } from 'antd'; // Collapse는 누르면 펼쳐지고, 다시 누르면 닫혀지는 형식의 UI

const { Panel } = Collapse;

// 전체적인 기조는 CheckBox.js와 동일, props를 통해 데이터를 넘겨줌
function RadioBox(props) {
    // Datas.js에서 _id는 0으로 시작하므로, 0으로 초기화
    const [Value, setValue] = useState(0)


    const renderRadioBox = () => (
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id}> {value.name} </Radio>
        ))
    )
    

    const handleChange = (event) => {
        setValue(event.target.value) // useState를 통해 Value가 바뀌고, 결과적으로 아래의 return에 있는 value가 바뀌어 같아지므로 하나밖에 클릭할 수 없는 구조 형성
        props.handleFilters(event.target.value) // LandingPage.js에서 구현, 부모컴포넌트인 LandingPage.js에 전달하기 위한 코드
    }

    return (
        <div>
            {/* defaultActiveKey가 0이면 Collapse가 닫혀있고, 1이면 열려있음 */}
            <Collapse defaultActiveKey={['0']} >
                <Panel header="Price" key="1">
                    {/* Radio.Group을 넣는 이유는, value={Value}를 통해 체크박스 하나를 선택하면 나머지 체크박스를 선택할 수 없게 하기 위함 */}
                    <Radio.Group onChange={handleChange} value={Value}>
                        {renderRadioBox()}
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox