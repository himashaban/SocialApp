"use client"; // Ensure this is present for client-side rendering
import { RootState, useAppDispatch } from "@/lib/store";
import { Avatar, Button, Divider, Grid2, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChangePic, UserInof, UserPosts } from "@/lib/postSlice";
import AddPost from "../_components/addPost/page";
import UserPage from "../_components/userPosts/page";
import Loading from "../loading";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { useRouter } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { UserType, postType } from "../_interfaces/home";

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
 const userinfo = useSelector(
   (state: RootState) => state.posts.userinfo
 ) as UserType | null;
  const userposts = useSelector(
    (state: RootState) => state.posts.userpost || []
  ) as postType[];

  const [showDetails, setDetails] = useState(false);
  const router = useRouter();

  function showSetPic() {
    setDetails(!showDetails);
  }

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(UserInof());
      await dispatch(UserPosts());
    };

    fetchData();
  }, [dispatch]);

  function PostDetails(id: string) {
    router.push(`/posts/${id}`);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        container
        spacing={2}
        sx={{
          justifyContent: "space-between",
          paddingX: "100px",
        }}
      >
        <Grid2
          spacing={1}
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
                {userinfo?.photo ? (
                  <img
                    src={userinfo?.photo}
                    alt="User  avatar"
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
                joined at:{" "}
                {userinfo?.createdAt ? userinfo.createdAt.slice(0, 10) : "N/A"}
              </p>
              {userinfo.gender === "male" ? (
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
        </Grid2>
        <Grid2 spacing={1}>
          <AddPost />
        </Grid2>
      </Grid2>
      <Divider sx={{ my: 3 }} />

      {/* User Posts Section */}
      <Grid2 container spacing={1} sx={{ padding: "5px" }}>
        {userposts.length > 0 ? (
          <Grid2 container spacing={2} sx={{ marginTop: "20px" }}>
            {userposts.map((post) => (
              <Grid2
                
                size={4} // Each item takes 4 columns out of 12, as desired
                key={post._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                {/* Render the post content */}
                <UserPage postObj={post} allComments={false} />

                {/* Display "See all comments" button directly below each post */}
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
                    <Typography sx={{ cursor: "pointer" }}>
                      See all {post.comments.length} comments
                    </Typography>
                  </Button>
                )}
              </Grid2>
            ))}
          </Grid2>
        ) : (
          <Grid2
            container
            sx={{
              textAlign: "center",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            <Loading />
          </Grid2>
        )}
      </Grid2>
    </>
  );
};

export default Profile;
