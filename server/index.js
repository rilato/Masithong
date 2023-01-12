const express = require('express')  // node.js의 웹 프레임워크
const app = express()
const path = require("path"); // 여러개의 파일을 폴더로 만들고, 각 폴더의 파일에 접근하기 위해 path모듈 사용
const cors = require('cors'); // // https://surprisecomputer.tistory.com/32 참고
const bodyParser = require('body-parser');  // body-parser의 기능 : 클라이언트 POST request data의 body로부터 파라미터를 편리하게 추출함.
// 예를 들어 유저가 ID와 PW를 입력하면 그거를 쉽게 읽어들이도록 하는 역할
const cookieParser = require('cookie-parser');  // cookie-parser의 기능 : 요청된 쿠키를 쉽게 추출할 수 있도록 도와주는 미들웨어.

// 개인정보를 담아놓은 곳에서 가져오기
const config = require('./config/key');        // key.js는 dev.js와 연관되어 있으며, 로그인 데이터와 관련
const { auth } = require('./middleware/auth'); // auth.js는 인증을 처리
const { User } = require("./models/User");     // require를 통해 User.js의 스키마 실행

// bodyParser가 client에서 오는 정보를 서버에서 분석해서 가져올 수 있도록 하기 위해 아래의 코드 사용
// url을 encoded한다.
// https://studyingych.tistory.com/34 에서 1-3 req.body 참고
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 가져오는데 사용
// bodyParser는 express 뒤에 붙여서 사용함. 여기서 app은 express
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors())

// router사용을 위해 routes폴더를 만들고, 그 안에 파일을 만든다.
// router는 웹페이지의 get, post 등의 request와 연관이 있다.
// index.js의 코드가 길어짐을 방지하고, 유지 보수를 위해 파일을 따로 관리한다.
app.use('/api/users', require('./routes/users')); // endpointer에 해당되는 request를 관리 (login, logout 등...) ./routes/users를 /api/users로 칭하는 듯
app.use('/api/product', require('./routes/product')); // 상품 관련 스키마 관리 (상품 등록도 여기서)
app.use('/api/comment', require('./routes/comment')); // 댓글을 관리
app.use('/api/favorite', require('./routes/favorite')); // 식당 즐겨찾기를 관리

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads')); // 상품 등록시 uploads에 저장하기 위한 코드


const mongoose = require('mongoose') // mongoose를 통해 mongoDB와 js를 연결

mongoose.connect(config.mongoURI).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// Serve static assets if in production, config/key.js에서 production인 경우, 이 if문에 걸림
if (process.env.NODE_ENV === "production") {
  // 정적인 폴더 하나를 설정
  // js와 css파일은 이 폴더로부터 내용을 읽을 것이고, 이 폴더에 저장할 것
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

// 포트 설정
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});