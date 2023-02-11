// 별점 평균 계산 구현, 얘의 자식 페이지가 StarRate.js

import React, { useEffect, useState } from 'react'
import { Card, Row, Descriptions, Avatar } from 'antd'; // Carousel은 한 카테고리 안에 여러 이미지를 슬라이드하며 볼 수 있게 하는 기능, utils/ImageSlider.js에서 구현
import { UserOutlined } from '@ant-design/icons';
import ImageSlider from '../../../utils/ImageSlider';
import styled from 'styled-components';
import { Rate } from 'antd';
import StarRate from './StarRate';

function StarInfo(props) {
    const [Reviews, setReview] = useState([])
    
    useEffect(()=>{
        setReview(props.ReviewLists)
    }, [props.ReviewLists]) 
    
    let stars = 0;
    let cnt = 0;
    let AverageStar = 0;

    for (var i = 0; i < Reviews.length; i++) {
        stars += Reviews[i].grade;
        cnt += 1;
    }

    if(cnt == 0){
        AverageStar = 0;
    } else {
        AverageStar = stars/cnt;
    }
    

    // toFixed(1)로 소수점을 고정시키는게 먹히지 않아, 다른 방법을 사용
    const showStar = () => {
        return (
            <Descriptions layout='horizontal' title="식당 정보">
                <Descriptions.Item label="평점" labelStyle={{ marginTop: '15px' }} contentStyle={{ marginTop: '15px' }}>
                    {`${AverageStar.toLocaleString(undefined, {maximumFractionDigits:1})}점`}
                </Descriptions.Item>
                <Descriptions.Item>
                    <StarRate AverageStar={AverageStar}/>    
                </Descriptions.Item>  
            </Descriptions>
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