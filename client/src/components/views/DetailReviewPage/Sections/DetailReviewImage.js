import React, { useState, useEffect } from 'react'
import {Card, Space,Image,Col,Row } from 'antd';

function DetailReviewImage(props) {

    const [Images, setImages] = useState([]);


    useEffect(() => {
        // 이미지가 존재하고, 이미지의 개수가 한 개 이상이면 images를 정의
        if (props.detail.images && props.detail.images.length > 0) {
            let images = []

            // 하나 하나 컨트롤하기 위해 map
            props.detail.images.map(item => {
                images.push(
                     `http://localhost:5000/${item}`, // 원래 사진
                     
                   
                )
            })
            setImages(images)
        }

    }, [props.detail]) // props.detail을 쓰지 않으면 useEffect가 image를 가져오지 못함.
    // props.detail을 써주면 props.detail 값이 바뀔 때 마다 life cycle이 한 번 더 실행되어 image를 가져올 수 있음

    console.log('img',Images)

    const renderCards= Images.map((image,index)=>{

        return(
        
           
          <Col key={index}  >
            <Image width={250} src={image} alt={`Image ${index + 1}`} />
            
            
          </Col>)
})
      
   
                    //<Image width={200} src={image}/>
                    
               
                
   

    return (
         


            <Row gutter={[16,16]} >
            {renderCards}
            </Row>
            
            
       
    )
    

    /*
    return (
        <div style={{ display: 'flex'}}>
          {Images.map((image, index) => (
            <Row gutter={[16, 16]} >
                <Col lg={6} md={8} xs={24} key={index}>
                 <Card >
                    <Image width={200} src={image}/>
                </Card>
            </Col>
            </Row>
            
               

           

              
              
            
          ))}
        </div>
      );

      */
    };
    

  


export default DetailReviewImage;