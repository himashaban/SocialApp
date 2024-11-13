"use client"; // Ensure this is present for client-side rendering
import { RootState, useAppDispatch } from "@/lib/store";
import { Avatar, Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ChangePic, UserInof, UserPosts } from "@/lib/postSlice";
import AddPost from "../_components/addPost/page";
import UserPage from "../_components/userPosts/page";
import Loading from "../loading";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
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

  function toggleSetPic() {
    setDetails((prev) => !prev);
  }

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(UserInof());
      await dispatch(UserPosts());
    };

    fetchData();
  }, [dispatch]);

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
      <Grid
        container
        spacing={2}
        sx={{ justifyContent: "space-between", px: 4 }}
      >
        <Grid
          item
          xs={12}
          md={4}
          sx={{ display: "flex", flexDirection: "column", mt: 2, rowGap: 2 }}
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
                  "Add Pic"
                )}
              </Avatar>
              <p
                onClick={toggleSetPic}
                style={{ fontWeight: "bold", cursor: "pointer", paddingTop: 1 }}
              >
                Set profile pic
              </p>
              {showDetails && (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column"}}
                >
                  <input
                    id="fileInput"
                    name="image"
                    type="file"
                    accept="image/*"
                    required
                  />
                  <button
                    type="submit"
                    className="btn"
                    style={{ fontSize: 12, fontStyle: "italic" }}
                  >
                    Submit
                  </button>
                </form>
              )}
              <h2>{userinfo.name}</h2>
              <p style={{ fontSize: 13 }}>Your email: {userinfo.email}</p>
              <p style={{ fontSize: 13 }}>
                Joined at:{" "}
                {userinfo.createdAt ? userinfo.createdAt.slice(0, 10) : "N/A"}
              </p>
              {userinfo.gender === "male" ? <MaleIcon /> : <FemaleIcon />}
            </div>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          <AddPost />
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* User Posts Section */}
      <Grid container spacing={2} sx={{ p: 1 }}>
        {userposts.length > 0 ? (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {userposts.map((post) => (
              <Grid
                item
                xs={12}
                md={4}
                key={post._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <UserPage postObj={post} allComments={false} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid
            container
            sx={{ textAlign: "center", justifyContent: "center" }}
          >
            <Loading />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Profile;
