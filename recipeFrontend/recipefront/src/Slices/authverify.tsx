import { createSlice } from "@reduxjs/toolkit"

interface initialvalues {
  token: string,
  isAuthenticated: boolean,
  userData: object
}

const initialState: initialvalues = {
  token: '',
  isAuthenticated: false,
  userData: {}
}

export const authverifySlice = createSlice({
  name: 'authverify',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true; 
      state.userData = action.payload.userData;
      localStorage.setItem('token', state.token); 
    },
    logout: (state) => {
      state.token = '';
      state.isAuthenticated = false;
      state.userData = {};
      localStorage.removeItem('token'); 
    },
    verifyToken: (state, action) => {
      if (state.token === action.payload.token) {
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
    initializeAuthState: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    }
  }
})

export const { loginSuccess, logout, verifyToken, initializeAuthState } = authverifySlice.actions;
export default authverifySlice.reducer;