import { RootState } from "@/lib/store";
import { UserInfoResponse } from "./../app/_interfaces/home";
import { postType, UserType } from "@/app/_interfaces/home";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const initialState: {
  allPosts: postType[] | null;
  singlePost: postType | null;
  userpost: postType | null;
  userinfo: UserType | null;
} = {
  allPosts: null,
  singlePost: null,
  userpost: null,
  userinfo: null,
};

interface AddCommentParams {
  comment: string;
  postid: string;
}

export const GetAllPosts = createAsyncThunk<postType[], number | undefined>(
  "postSlice/GetAllPosts",
  async (limit: number | undefined = 50, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    const response = await axios.get(
      `https://linked-posts.routemisr.com/posts?limit=${limit}`,
      { headers: { token } }
    );
    return response.data.posts;
  }
);

export const GetPost = createAsyncThunk(
  "postSlice/GetPost",
  async (id: string, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    return await axios
      .get(`https://linked-posts.routemisr.com/posts/${id}`, {
        headers: { token },
      })
      .then((res) => res)
      .catch((err) => err);
  }
);

export const UserPosts = createAsyncThunk(
  "postSlice/UserPosts",
  async (_, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    return await axios
      .get(
        `https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts?limit=10`,
        {
          headers: { token },
        }
      )
      .then((res) => res)
      .catch((err) => err);
  }
);

export const UserInof = createAsyncThunk<UserInfoResponse>(
  "postSlice/UserInof",
  async (_, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    const response = await axios.get(
      `https://linked-posts.routemisr.com/users/profile-data`,
      { headers: { token } }
    );
    return response.data;
  }
);

export const addPost = createAsyncThunk(
  "postSlice/addPost",
  async (formData: FormData, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    return await axios
      .post(`https://linked-posts.routemisr.com/posts`, formData, {
        headers: { token },
      })
      .then((res) => res)
      .catch((err) => err);
  }
);

export const deletePost = createAsyncThunk(
  "postSlice/deletePost",
  async (id: string, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    return await axios
      .delete(`https://linked-posts.routemisr.com/posts/${id}`, {
        headers: { token },
      })
      .then((res) => res)
      .catch((err) => err);
  }
);

export const deleteComment = createAsyncThunk(
  "postSlice/deleteComment",
  async (id: string, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    return await axios
      .delete(`https://linked-posts.routemisr.com/comments/${id}`, {
        headers: { token },
      })
      .then((res) => res)
      .catch((err) => err);
  }
);

export const ChangePic = createAsyncThunk(
  "postSlice/changepic",
  async (formData: FormData, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    return await axios.put(
      `https://linked-posts.routemisr.com/users/upload-photo`,
      formData,
      { headers: { token } }
    );
  }
);

export const AddComments = createAsyncThunk(
  "PostsSlice/addComments",
  async ({ comment, postid }: AddCommentParams, { getState }) => {
    const token = (getState() as RootState).auth.userToken;
    try {
      const response = await axios.post(
        `https://linked-posts.routemisr.com/comments/`,
        { content: comment, post: postid },
        { headers: { token } }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  }
);


const showNotification = ({ title }: { title: string }) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  Toast.fire({
    icon: "success",
    title: title,
  });
};

const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(GetAllPosts.fulfilled, (state, action) => {
      state.allPosts = action.payload;
      // Corrected line
    });
    builder.addCase(GetAllPosts.rejected, (state, action) => {
      console.log("getallposts state", state);
      console.log("Error fetching posts:", action.error.message);
    });
    builder.addCase(GetPost.fulfilled, (state, action) => {
      state.singlePost = action.payload.data.post;
      console.log('singelpostis ',action.payload.data.post);
      
    });builder.addCase(GetPost.rejected, (state, action) => {
     
      console.log("singelpostis failed ", action);
      console.log("singelpostis failed ", state);
    });
    builder.addCase(addPost.fulfilled, (state, action) => {
      const dynamicTitle = action.payload?.data.message;
      showNotification({ title: dynamicTitle });
    });
    builder.addCase(UserPosts.fulfilled, (state, action) => {
      state.userpost = action.payload.data.posts;
      
    });
    builder.addCase(UserInof.fulfilled, (state, action) => {
      console.log("User  Info payload is here", action.payload);
      state.userinfo = action.payload.user; 
    });
    builder.addCase(AddComments.fulfilled, (state, action) => {
      console.log("Comment added successfully", action);
      showNotification({ title: "Comment added successfully" });
    });

    builder.addCase(AddComments.rejected, (state, action) => {
      console.error("Failed to add comment", action.error.message);
      Swal.fire({
        icon: "error",
        title: "Failed to add comment",
        text: action.error.message,
      });
    });
    builder.addCase(ChangePic.fulfilled, (state, action) => {
      console.log(action.payload);
      showNotification({ title: "pic is picked successfully" });
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      console.log(action.payload);
      showNotification({ title: "post deleted successfully" });
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      console.log(action.payload);
      showNotification({ title: "comment deleted successfully" });
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      console.log(action.payload);
      Swal.fire({
        icon: "error",
        title: "Failed to delete comment",
        text: action.error.message,
      });
    });

    builder.addCase(ChangePic.rejected, (state, action) => {
      console.log(action.payload);
      console.log(state);

      Swal.fire({
        icon: "error",
        title: "failed to upload a pic",
        text: action.error.message,
      });
    });
  },
});
export const postReducer = postSlice.reducer;
