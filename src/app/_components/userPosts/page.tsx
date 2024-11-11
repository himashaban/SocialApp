"use client";
import React, { useState, KeyboardEvent } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { commentType, postType } from "@/app/_interfaces/home";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import { Box, Menu, MenuItem } from "@mui/material";
import myImg from "../../../assets/peep.png";
import { AddComments, deletePost } from "@/lib/postSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "@/lib/store";

export default function UserPage({
  postObj,
  allComments = false,
}: {
  postObj: postType;
  allComments: boolean;
}) {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<commentType[]>(postObj.comments);
  const [anchorE1, setAnchorE1] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handelOpenMenue = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE1(event.currentTarget);
  };

  const handelCloseMenue = () => {
    setAnchorE1(null);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed!");
      console.log("Comment:", comment);
      console.log("Post ID:", postObj._id);
      setComment(""); // Clear input after submission

      dispatch(AddComments({ comment, postid: postObj._id })).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          const commentData = res.payload.data.comment as commentType;
          setComments([...comments, commentData]);
        } else {
          console.error("Failed to add comment:", res);
        }
      });
    }
  };

  function handelProfileImage(imgsrc: string) {
    const myallKeywords = imgsrc.split("/");
    const lastKeyWord = myallKeywords[myallKeywords.length - 1];
    // Check if the imgsrc is a StaticImageData or a string URL
    if (lastKeyWord === "undefined" || typeof imgsrc === "object") {
      // Return a fallback image URL (string)
      return myImg; // myImg should be a string URL, not StaticImageData
    }
    return imgsrc;
  }

  function handelNavigate(id: string) {
    router.push(`/profile/${id}`);
  }

  function deleteSelectedPost(id: string) {
    dispatch(deletePost(id));
  }

  return (
    <Card
      className="border-none rounded rounded-b-full"
      sx={{
        maxWidth: "100%",
        marginTop: "20px 0px",
        height: "content-fit",
        border: "none",
        boxShadow: "none",
      }}
    >
      <CardHeader
        className="rounded-t-[40px]"
        sx={{ backgroundColor: "#F1FAF1" }}
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], cursor: "pointer" }}
            aria-label={postObj.user.name}
            onClick={() => handelNavigate(postObj.user._id)}
          >
            <Image
              src={handelProfileImage(postObj.user.photo)}
              alt={postObj.user.name}
              width={50}
              height={50}
            />
          </Avatar>
        }
        action={
          <>
            <IconButton aria-label="settings" onClick={handelOpenMenue}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorE1}
              open={Boolean(anchorE1)}
              onClose={handelCloseMenue}
              sx={{ padding: "0" }}
            >
              <MenuItem>
                <DeleteIcon sx={{ color: "red" }} /> delete post
              </MenuItem>
            </Menu>
          </>
        }
        title={
          <Typography
            sx={{ width: "50%", cursor: "pointer" }}
            onClick={() => handelNavigate(postObj.user._id)}
          >
            {postObj.user.name}
          </Typography>
        }
        subheader={new Date(postObj.createdAt).toLocaleDateString()}
        subheaderTypographyProps={{ sx: { gap: "12px" } }}
      />
      {postObj.image && (
        <CardMedia
          sx={{ backgroundColor: "#F1FAF1", padding: "8px" }}
          component="img"
          height="50"
          image={postObj.image}
          alt={postObj.body}
        />
      )}

      <CardContent sx={{ backgroundColor: "#F1FAF1" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {postObj.body}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          backgroundColor: "#F1FAF1",
          padding: "5px 10px",
          marginBottom: "10px",
        }}
      >
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyPress}
          sx={{
            paddingY: "10px",
            marginY: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
            },
          }}
          fullWidth
          label="comment"
        />
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>

      {/* Comments Section */}
      {postObj.comments.length > 0 && !allComments ? (
        <Box
          sx={{
            backgroundColor: "#F8C8C6",
            borderRadius: "50px",
            height: "auto",
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                sx={{ bgcolor: red[500], cursor: "pointer" }}
                aria-label={postObj.comments[0].commentCreator?.name}
              >
                <Image
                  src={handelProfileImage(
                    postObj.comments[0].commentCreator?.photo || ""
                  )} // Now returns a valid string URL
                  alt={
                    postObj.comments[0].commentCreator?.name || "User Avatar"
                  }
                  width={50}
                  height={50}
                />
              </Avatar>
            }
            title={postObj.comments[0].commentCreator.name}
            subheader={new Date(
              postObj.comments[0].createdAt
            ).toLocaleDateString()}
            subheaderTypographyProps={{ sx: { gap: "12px" } }}
            titleTypographyProps={{
              sx: { width: "fit-content", cursor: "pointer" },
            }}
            onClick={() =>
              handelNavigate(postObj.comments[0].commentCreator._id)
            }
          />
          <CardContent>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                padding: "0px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {postObj.comments[0].content}
            </Typography>
          </CardContent>
        </Box>
      ) : (
        postObj.comments?.map((comment) => (
          <Box
            className="rounded-full"
            key={comment._id}
            sx={{ backgroundColor: "gray" }}
          >
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: red[500], cursor: "pointer" }}
                  aria-label={comment.commentCreator.name}
                  onClick={() => handelNavigate(comment.commentCreator._id)}
                >
                  <Image
                    src={handelProfileImage(comment.commentCreator.photo)}
                    alt={comment.commentCreator.name}
                    width={50}
                    height={50}
                  />
                </Avatar>
              }
              title={comment.commentCreator.name}
              subheader={new Date(comment.createdAt).toLocaleDateString()}
              subheaderTypographyProps={{ sx: { gap: "12px" } }}
              titleTypographyProps={{
                sx: { width: "fit-content", cursor: "pointer" },
              }}
              onClick={() => {
                deleteSelectedPost(comment._id);
                handelCloseMenue();
              }}
            />
            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  justifyContent: "center",
                  justifyItems: "center",
                }}
              >
                {comment.content}
              </Typography>
            </CardContent>
          </Box>
        ))
      )}
    </Card>
  );
}