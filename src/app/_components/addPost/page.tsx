import { addPost } from "@/lib/postSlice";
import { Box, Grid2, TextareaAutosize } from "@mui/material";
import React, { useState } from "react";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import DisabledByDefaultOutlinedIcon from "@mui/icons-material/DisabledByDefaultOutlined";
import { useAppDispatch } from "@/lib/store";

export default function AddPost() {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData();
    const body = e.currentTarget.body.value;
    const image = e.currentTarget.image.files[0];

    formData.append("body", body);
    formData.append("image", image);
    dispatch(addPost(formData));
  }

  const displayAddPost = () => {
    setShowForm(!showForm);
  };

  return (
    <Grid2 sx={{ margin: "auto" }}>
      <Box sx={{ textAlign: "center", margin: "auto" }}>
        {showForm ? (
          <Box sx={{textAlign:'center'}}>
            <DisabledByDefaultOutlinedIcon
              sx={{
                marginTop: "20px",
                fontSize: "70px",
                color: "#E73F5E",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              onClick={displayAddPost}
            />
            <p>close</p>
          </Box>
        ) : (
          <Box>
            <AddBoxOutlinedIcon
              sx={{
                marginTop: "20px",
                fontSize: "70px",
                color: "#E73F5E",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              onClick={displayAddPost}
            />

            <p>add post</p>
          </Box>
        )}
      </Box>

      <div
        className={`form-container ${showForm ? "form-enter" : "form-exit"}`}
      >
        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{ width: "80%", margin: "10px auto" }}
          >
            <TextareaAutosize
              name="body"
              maxRows={10}
              minRows={6}
              className="form-control"
            />
            <input name="image" type="file" className="btn" />
            <button type="submit" className="btn">
              add post
            </button>
          </form>
        )}
      </div>
    </Grid2>
  );
}
