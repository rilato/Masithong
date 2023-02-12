// 사이트 최하단에 있는 영역으로 보통 저작권 정보나 개인정보처리 방침, 이용약관처럼 정책 페이지 링크를 두기 위해 존재

import React from "react";
import { Layout, Typography, Row, Col } from "antd";
import { SmileOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text } = Typography;

function BottomFooter() {
    return (
        <div>
        <Footer style={{ textAlign: "center", padding: "20px 0" }}>
            <Row type="flex" justify="center">
            <Col xs={8}>
                <a href="/" style={{ display: "inline-block", fontSize: "20px", marginLeft: "82%" }}>맛있홍 <SmileOutlined/></a>
            </Col>
            <Col xs={16}>
                <Text style={{ fontWeight: "bold" }}>팀 이름 : &nbsp;&nbsp; 마트료시카</Text>
                <br />
                <Text type="secondary">제작 팀원 : &nbsp;&nbsp; 이윤식, 박시홍, 홍용현, 이동욱, 정연주</Text>
            </Col>
            </Row>
        </Footer>
        </div>
    )
}

export default BottomFooter