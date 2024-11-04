
import post from "@/app/_components/post/post";
import { postType } from "@/app/_interfaces/home";
import icon from "@mui/icons-material/icon";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { headers } from "next/headers";
import { comment } from "postcss";
import { title } from "process";
import toast from "react-hot-toast";
import { text } from "stream/consumers";
import Swal from "sweetalert2";
 

let initialState: {
  allPosts: postType[] | null;
  singlePost: postType | null;
  userpost: postType | null;
  userinfo: postType | null;
} = {
  allPosts: null,
  singlePost: null,
  userpost: null,
  userinfo: null,
};
export let GetAllPosts = createAsyncThunk("postSlice/GetAllPosts",
  async (limit:number)=>{
    return await axios.get(`https://linked-posts.routemisr.com/posts?limit=${limit||50}`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    })
    .then(res=> res)
    .catch(err=>err)
});
export let GetPost = createAsyncThunk("postSlice/GetPost",async (id:string)=>{
    return await axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    })
    .then(res=> res)
    .catch(err=>err)
});

export let UserPosts=createAsyncThunk('postSlice/UserPosts',async ()=>{
  return await axios
    .get(
      `https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts?limit=10`,
      {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      }
    )
    .then((res) => res)
    .catch((err) => err);
})
export const UserInof = createAsyncThunk("postSlice/UserInof", async () => {
  return await axios
    .get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    })
    .then((res) => res)
    .catch((err) => err);
});


export const addPost = createAsyncThunk("postSlice/addPost",async (formData)=>{
    return await axios.post(`https://linked-posts.routemisr.com/posts`,formData, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
     
      
    })
    .then(res=> res)
    .catch(err=>err)
});
export const deletePost = createAsyncThunk(
  "postSlice/deletePost",
  async (id) => {
    return await axios
      .delete(`https://linked-posts.routemisr.com/posts/${id}`, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) =>res)
      .catch((err) => err);
  }
);
export const deleteComment = createAsyncThunk(
  "postSlice/deleteComment",
  async (id) => {
    return await axios
      .delete(`https://linked-posts.routemisr.com/comments/${id}`, {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => res)
      .catch((err) => err);
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
    title: title, // Dynamically set title
  });
};
export const ChangePic = createAsyncThunk("postSlice/changepic",async(formData)=>{
   return await axios.put(
     `https://linked-posts.routemisr.com/users/upload-photo`,formData,
     {
       headers: {
         token: localStorage.getItem("userToken"),
       },
     }
   );
});

export const AddComments = createAsyncThunk(
  'PostsSlice/addComments',
  async ({ comment, postid }) => {
    try {
      const response = await axios.post(
        `https://linked-posts.routemisr.com/comments/`,
        {
          content: comment,
          post: postid,
        },
        {
          headers: {
            token: localStorage.getItem('userToken'),
          },
        }
      );
      return response.data; // Return data from the API
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error; // Throw error to handle it in rejected case
    }
  }
);



let postSlice = createSlice({
    name:'postSlice',
    initialState,
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(GetAllPosts.fulfilled,(state,action)=>{
           
                        state.allPosts = action.payload.data.posts;
            })
            builder.addCase(GetPost.fulfilled,(state,action)=>{
              state.singlePost=action.payload.data.post
            })
            builder.addCase(addPost.fulfilled,(state,action)=>{
          
               const dynamicTitle = action.payload?.data.message;
      showNotification({ title: dynamicTitle });
            })
            builder.addCase(UserPosts.fulfilled,(state,action)=>{
               state.userpost = action.payload.data.posts;
            
              
            })
            builder.addCase(UserInof.fulfilled, (state, action) => {
              console.log("UserInof is here", action);
              state.userinfo=action.payload.data.user;
              localStorage.setItem("userName", action.payload.data.user.name);
              console.log(
                "LocalStorage userName set to:",
                localStorage.getItem("userName")
              );

            });
             builder.addCase(AddComments.fulfilled, (state, action) => {
               console.log("Comment added successfully", action);
               showNotification({title: "Comment added successfully"})
              
             });
             
             

             builder.addCase(AddComments.rejected, (state, action) => {
  console.error("Failed to add comment", action.error.message);
  Swal.fire({
    icon: 'error',
    title: 'Failed to add comment',
    text: action.error.message,
  });
});
           builder.addCase(ChangePic.fulfilled,(state,action)=>{
            console.log(action.payload);
             showNotification({ title: 'pic is picked successfully' });
           });
            builder.addCase(deletePost.fulfilled, (state, action) => {
              console.log(action.payload);
              showNotification({ title: "post deleted successfully" });
            });
            builder.addCase(deleteComment.fulfilled, (state, action) => {
              console.log(action.payload);
              showNotification({ title: "comment deleted successfully" });
            }); builder.addCase(deleteComment.rejected, (state, action) => {
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

        }
})
export let postReducer=postSlice.reducer