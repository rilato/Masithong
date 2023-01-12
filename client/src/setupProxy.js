/* 프록시 서버는 클라이언트가 자신을 통해서 다른 네트워크 서비스에 간접적으로 접속할 수 있게 해 주는 컴퓨터 시스템이나 응용 프로그램을 가리킨다.
서버와 클라이언트 사이에 중계기로서 대리로 통신을 수행하는 것을 가리켜 '프록시', 그 중계 기능을 하는 것을 프록시 서버라고 부른다. */

// 프로젝트 폴더내 src 폴더안에 ( /src/setupProxy.js ) setupProxy.js 라는 파일 생성 후 아래 코드 입력
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',  // 프록시를 사용할 경로 (path)
    createProxyMiddleware({
      target: 'http://localhost:5000', // target 은 내가 프록시로 이용할 서버의 주소
      changeOrigin: true, // changeOrigin은 대상 서버의 구성에 따라 호스트 헤더의 변경을 해주는 옵션
    })
  );
};