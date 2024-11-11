"use client";

import Post from "./_components/post/post";
import { GetAllPosts, UserInof } from "@/lib/postSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "@/lib/store";
import { postType } from "./_interfaces/home";
import Loading from "./loading";
import { Grid2 } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch = useAppDispatch();
  const { allPosts } = useSelector((state: RootState) => state.posts);
  const userinfo = useAppSelector((state: RootState) => state.posts.userinfo);
  const router = useRouter();

  // Loading state to handle async data fetching from redux-persist
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user info is available from persisted state
    if (!userinfo) {
      router.push("/login");
    }
  }, [userinfo, router]);

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      try {
        await dispatch(GetAllPosts()).unwrap(); // Fetch all posts
        await dispatch(UserInof()).unwrap(); // Fetch user info
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false); // Set loading to false when data fetching completes
      }
    };

    // Run the fetch data function
    fetchData();
  }, [dispatch]);

  // If data is still loading, show a loading indicator
  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {(allPosts?.length ?? 0) > 0 ? (
        <Grid2
          size={{ xs: 12 }}
          container
          spacing={2}
          sx={{ marginBlock: "30px" }}
        >
          <Grid2 size={{ sm: 3 }}></Grid2>
          <Grid2
            size={{ xs: 12, md: 6 }}
            sx={{ paddingBlock: "10px", paddingInline: "10px", margin: "auto" }}
          >
            {allPosts?.map((postObj: postType) => (
              <Post postObj={postObj} key={postObj._id} allComments={false} />
            ))}
          </Grid2>
          <Grid2 size={3}>{/* Additional content here */}</Grid2>
        </Grid2>
      ) : (
        <Loading /> // Show loading if no posts available
      )}
    </>
  );
}
