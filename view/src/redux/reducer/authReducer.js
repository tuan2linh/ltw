// authReducer.js
import { LOGIN_SUCCESS, LOGOUT } from "../action/authAction";

const initialState = {
  id: "",
  username: "",
  role: "",
  token: "",
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        id: action.payload.id, 
        username: action.payload.username,
        role: action.payload.role,
        token: action.payload.token,
        isAuthenticated: true,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default authReducer;
