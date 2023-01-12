// 이미지 파일을 업로드하는 페이지

import React, { useState } from 'react'
import Dropzone from 'react-dropzone' // 컴퓨터 내의 이미지를 서버로 올리기 위해 필요한 라이브러리
//import Icon from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

// 여기서 등록된 이미지를 UploadProductPage.js에서 사용할 수 있도록 하기 위해 props parameter 필요
function FileUpload(props) {
    // state에 백엔드 측의 product.js에 저장된 정보를 저장하기 위해 아래의 코드 사용
    // 업로드되는 이미지는 useState의 배열 안에 저장되게 됨
    const [Images, setImages] = useState([])

    // 아래의 return부분에서 onDrop이 될 때, dropHandler라는 함수가 실행되도록 하기위해 구현한 함수
    // files라는 파라미터를 백엔드로 전송하도록 함
    const dropHandler = (files) => {
        // 파일을 전송하기 위해 필요한 코드
        let formData = new FormData();

        const config = {
            header: { 'content-type': 'multipart/fomr-data' }
        }

        formData.append("file", files[0])

        // 반드시 formData와 config를 같이 넣어줘야 함. 그래야 에러가 발생하지 않음
        axios.post('/api/product/image', formData, config)
            // 백엔드를 통해 전달된 정보는 response 안에 들어있음
            .then(response => {
                if (response.data.success) {
                    // ...을 통해 올라온 이미지들을 모두 넣어줌. response.data.filePath는 또 다시 새롭게 등록되는 이미지를 위해 필요
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath]) // 여기서 등록된 이미지를 UploadProductPage.js에서 사용할 수 있도록 하기 위해 필요
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    // 이미지 클릭 시 이미지를 지우기 위한 함수
    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images]
        // splice : 1개의 아이템을 currentIndex에서 지운다
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        props.refreshFunction(newImages) // 여기서 등록된 이미지를 UploadProductPage.js에서 사용할 수 있도록 하기 위해 필요
    }


    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Dropzone을 이용해서 파일을 올리고, 노드 서버에 파일을 저장.
            백엔드에 파일을 저장하기 위해서 multer라는 라이브러리가 필요.
            onDrop이 될 때, dropHandler라는 함수가 실행되도록 함 */}
            <Dropzone onDrop={dropHandler}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <PlusOutlined style={{ fontSize: '3rem' }}/>
                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
                {/* 이 부분이 있어야 이미지 업로드 시, 우측에 업로드한 이미지가 표시됨,
                또한 우측에 업로드된 이미지를 클릭하여 지우기 위해 deleteHandler 함수 사용 */}
                {Images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}


            </div>


        </div>
    )
}

export default FileUpload