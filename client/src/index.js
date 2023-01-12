import React from 'react'; // 사용자 인터페이스를 만들기 위해 사용
import ReactDOM from 'react-dom'; // https://sysong85.tistory.com/203
import './index.css'; // css 입히기
import App from './components/App'; // components폴더의 App.js 가져오기
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import 'antd/dist/antd.min.css';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)

ReactDOM.render(
    <Provider
        store={createStoreWithMiddleware(Reducer,
            window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__()
        )}
    >
        <App />
    </Provider>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
