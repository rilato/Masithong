// 상품 상세 페이지에서 상품의 정보를 보여주는 파일

import React from 'react'
import { Button, Descriptions } from 'antd'; // 상품 상세 페이지에서 design을 위해 필요한 애들 import
//import { useDispatch } from 'react-redux';

function ProductInfo(props) {
    return (
        <div>
            <Descriptions layout='horizontal' title="식당 정보">
                <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
                {/* 여기에 Sold, View 대신, 식당에 대한 다른 정보들 추가할 수 있음 (예를 들면, 음식의 분류라든지.., 별점이라든지.. 그렇게 하려면 DB에 별점을 저장해야..)
                별점의 평균을 매길 수 있는 쿼리문도 필요할듯*/}
                <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
                
                <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
                
                <Descriptions.Item label="식당 상세정보 링크"><a href={`https://search.naver.com/search.naver?&where=nexearch&query=${props.detail.title}`}>이동하기</a></Descriptions.Item>
                
                <Descriptions.Item label="식당 위치정보 링크"><a href={`https://map.naver.com/v5/search/${props.detail.title}`}>이동하기</a></Descriptions.Item>
                
            </Descriptions>

            <br />
            <br />
            <br />
        </div>
    )
}

export default ProductInfo