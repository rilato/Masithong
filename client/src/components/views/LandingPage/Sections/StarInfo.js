// 별점 평균 계산 구현, 얘의 자식 페이지가 StarRate.js

import React, { useEffect, useState } from 'react'
import { Card, Row, Descriptions, Avatar } from 'antd'; // Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능, utils/ImageSlider.js에서 구현
import { UserOutlined } from '@ant-design/icons';
import ImageSlider from '../../../utils/ImageSlider';
import styled from 'styled-components';
import { Rate } from 'antd';
import StarRate from './StarRate';

function StarInfo(props) {
    const [AverageStar, setAverageStar] = useState([])
    
    useEffect(()=>{
        setAverageStar(props.detail)
        console.log("type of AverageStar : ", typeof(AverageStar))
    }, [props.detail]) 

    // AverageStar는 객체 타입이므로, 숫자로 변환 후 반올림
    const RoundAverageStar = Number(AverageStar).toFixed(1);

    const showStar = () => {
        return (
            <StarRate AverageStar={AverageStar}>{RoundAverageStar}점</StarRate>
        )
    }
    
    return (
        <div>
            {showStar()}
            <br/>
            <br/>
        </div>
    )
}

export default StarInfo