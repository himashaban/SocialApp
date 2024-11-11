import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


interface AuthState {
  userToken: string | null;
  userData: string | null; 
  isLoading: boolean;
  isError: boolean;
}

const initialState: AuthState = {
  userToken: null,
  userData: null,
  isLoading: false,
  isError: false,
};

// Async thunk for login
export const userLogin = createAsyncThunk(
  "auth/userLogin",
  (formData: { email: string; password: string }) => {
    return axios
      .post("https://linked-posts.routemisr.com/users/signin", formData) // Your URL here
      .then((response) => response.data) // Return the data if successful
      .catch((error) => {
        // Return an error object if request fails
        return { error: error.response?.data || "Login failed" };
      });
  }
);

// Async thunk for register
export const userRegister = createAsyncThunk(
  "auth/userRegister",
  (formData: {
    name: string;
    email: string;
    password: string;
    rePassword: string;
    dateOfBirth: string;
    gender: string;
  }) => {
    return axios
      .post("https://linked-posts.routemisr.com/users/signup", formData) // Your URL here
      .then((response) => response.data) // Return the data if successful
      .catch((error) => {
        // Return an error object if request fails
        return { error: error.response?.data || "Registration failed" };
      });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearData: (state) => {
      state.userToken = null;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    // Handle login state changes
    builder
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
          state.userToken = action.payload.token;
          state.userData = action.payload.userData;
          state.isError = false;
          console.log(state.userToken);
          console.log();
          
          console.log("state:", state);
          console.log("action:", action);
          // console.log("action:", action?.payload.token)
          console.log("action:", action?.payload?.message)
        
          
        
      })
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userLogin.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });

    // Handle register state changes
    builder
      .addCase(userRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.error) {
          state.isError = true;
        } else {
          state.userToken = action.payload.token;
          state.userData = action.payload.userData;
          state.isError = false;
        }
      })
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(userRegister.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { clearData } = authSlice.actions;
export const authReducer = authSlice.reducer;
