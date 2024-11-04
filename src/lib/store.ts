import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { postReducer } from "./postSlice";

export let store=configureStore({
    reducer:{
auth:authReducer,
posts:postReducer
    }
})