"use client"; // Ensure this is present for client-side rendering
import { store } from "@/lib/store";
import { Avatar, Box, Button, Card, CardContent, Divider, Fab, Grid2, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChangePic, UserInof, UserPosts } from "@/lib/postSlice";
import AddPost from "../_components/addPost/page";
import UserPage from "../_components/userPosts/page";
import Loading from "../loading";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useRouter } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Profile() {
  const dispatch = useDispatch();
  const { userpost: userposts, userinfo: userinfo } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.posts
  );

  const [showDetails, setDetails] = useState(false);
  const router = useRouter();

  function showSetPic() {
    setDetails(!showDetails);
  }

  useEffect(() => {
    dispatch(UserInof());
    dispatch(UserPosts());
  }, [dispatch]);

  function PostDetails(id) {
    router.push(`/posts/${id}`);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const fileInput = e.currentTarget.image.files[0];

    if (!fileInput) {
      alert("Please choose a file first");
      return;
    }

    const formData = new FormData();
    formData.append("photo", fileInput);

    dispatch(ChangePic(formData));
  };
  

  return (
    <>
      <Grid2
        item
        xs={12}
        md={4}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingX: "100px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
            marginTop: "20px",
          }}
        >
          {userinfo && (
            <div>
              <Avatar sx={{ width: 70, height: 70 }}>
                {userinfo.photo ? (
                  <img
                    src={userinfo.photo}
                    alt="User avatar"
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  "addpic"
                )}
              </Avatar>
              <p
                style={{
                  fontStyle: "bold",
                  cursor: "pointer",
                  paddingTop: "5px",
                }}
                onClick={showSetPic}
              >
                set profile pic
              </p>
              {showDetails && (
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "20px",
                  }}
                >
                  <input
                    id="fileInput"
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                  />
                  <button
                    className="btn"
                    type="submit"
                    style={{
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    Submit
                  </button>
                </form>
              )}
              <h2>{userinfo.name}</h2>
              <p style={{ fontSize: "13px" }}>your email: {userinfo.email}</p>
              <p style={{ fontSize: "13px" }}>
                joined at: {userinfo.createdAt.slice(0, 10)}
              </p>
              {userinfo.gender == "male" ? (
                <span>
                  <MaleIcon />
                </span>
              ) : (
                <span>
                  <FemaleIcon />
                </span>
              )}
            </div>
          )}
        </Box>
        <Grid2 item xs={12} md={12}>
          <AddPost />
        </Grid2>
      </Grid2>
      <Divider sx={{ my: 3 }} />

      {/* User Posts Section */}
      <Grid2 container spacing={1} sx={{ padding: "5px" }}>
        {userposts?.length > 0 ? (
          <Grid2
            container
            className="flex flex-wrap"
            sx={{ marginTop: "20px" }}
          >
            {userposts.map((post) => (
              <Grid2
                key={post._id}
                className="md:w-3/12 lg:w-3/12 flex flex-wrap m-auto mt-5"
                component={"div"}
                xs={12}
                sm={12}
                md={4}
                lg={4}
              >
                <UserPage postObj={post} allComments={false} />
                {/* Show "See more" if there are multiple comments */}
                {post.comments.length > 1 && (
                  <Button
                    variant="outlined"
                    startIcon={<ExpandMoreIcon />}
                    onClick={() => PostDetails(post._id)}
                    sx={{
                      marginTop: "10px",
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    See more comments
                  </Button>
                )}
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Grid2 item xs={12} sx={{ textAlign: "center" }}>
            <Loading />
          </Grid2>
        )}
      </Grid2>
    </>
  );
}
