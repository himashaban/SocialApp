import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default is localStorage
import { authReducer } from "./authSlice";
import { postReducer } from "./postSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { PersistPartial } from "redux-persist/es/persistReducer";
import { combineReducers } from "@reduxjs/toolkit"; // Add combineReducers
import { postType, UserType } from "@/app/_interfaces/home";

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["posts", "auth"], // Specify which reducers should be persisted
};

// Combine reducers to create the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  posts: postReducer,
});

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
});

// Create persistor for syncing persisted state
export const persistor = persistStore(store);

// Define the structure of the auth slice state
interface AuthState {
  userToken: string | null;
  userData: string | null;
  isLoading: boolean;
  isError: boolean;
}
// Define the structure of the posts slice state
interface PostState {
  allPosts: postType[] | null;
  singlePost: postType | null;
  userpost: postType | null;
  userinfo: UserType | null;
  isLoading: boolean;
  isError: boolean;
}

// Update RootState to use the correct structure
export type RootState = {
  auth: AuthState;
  posts: PersistPartial & PostState; // PersistPartial is to handle persisted state
};

export type AppDispatch = typeof store.dispatch;

// Custom hooks for dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
