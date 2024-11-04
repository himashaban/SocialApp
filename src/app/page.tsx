'use client'

import Post from "./_components/post/post";
import { GetAllPosts, UserInof } from "@/lib/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { store } from "@/lib/store";
import { postType } from "./_interfaces/home";
import Loading from './loading'
import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";



export default function Home() {
  let dispatch=useDispatch<typeof store.dispatch>();
  let {allPosts}=useSelector((state:ReturnType<typeof store.getState>)=>state.posts)
  let router=useRouter()
     useEffect(() => {
       const token = localStorage.getItem("userToken");
       if (!token) {
         router.push("/login");
       }
     }, [router]);
  useEffect(()=>{
    dispatch(GetAllPosts());
dispatch(UserInof());
  },[dispatch])
 
  return (
    <>
      {allPosts?.length > 0 ? (
        <Grid2 size={{xs:12}} container spacing={2} sx={{ marginBlock: "30px" }}>
          <Grid2  size={{sm:3}}></Grid2>
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{ paddingBlock: "10px", paddingInline: "10px", margin: "auto" }}
          >
            {allPosts?.map((postObj: postType) => (
              <Post postObj={postObj} key={postObj._id} />
            ))}
          </Grid2>
          <Grid2  size={3}>
         
          </Grid2>
        </Grid2>
      ) : (
        <Loading />
      )}
    </>
  );
}
