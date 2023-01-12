// 여러 액션과 상태값 사이에서 리듀서(Reducer)는 switch~case 문으로 액션에 대한 선택지를 줄여 상태(State)를 변화시키는 역할.
// 이전 state(상태)와 Action을 합쳐 새로운 state를 만드는 과정

import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER
} from '../_actions/types';

// reducer는 현재 state와 action object를 받은 후에  next state를 return하는 역할
export default function (state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload } // ...은 위에 parameter의 state를 똑같이 가져오는 역할
            break; //  loginSuccess에는 user_action.js에서의 payload를 넣어주는 역할, 크롬 확장도구인 Redux DevTools의 State에서 확인 가능
        case REGISTER_USER:
            return { ...state, register: action.payload } // 원본 state를 ...으로 가져오고, 서버에서 가져온 response를 action.payload로 넣어줌
            break;
        case AUTH_USER:
            return { ...state, userData: action.payload } // action.payload에는 server/index.js에서 유저와 관련된 모든 정보를 담고있음.
            break;
        case LOGOUT_USER:
            return { ...state }
            break;
        default:
            return state;
    }
}