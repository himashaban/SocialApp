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
import { Box, Button, Menu, MenuItem } from "@mui/material";
import myImg from "../../../assets/peep.png";
import { AddComments, deletePost, deleteComment } from "@/lib/postSlice";
import { useAppDispatch } from "@/lib/store";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [showAllComments, setShowAllComments] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handelOpenMenue = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE1(event.currentTarget);
  };

  const handelCloseMenue = () => {
    setAnchorE1(null);
    console.log(allComments);
    
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
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
    if (lastKeyWord === "undefined" || typeof imgsrc === "object") {
      return myImg;
    }
    return imgsrc;
  }

  function deletePostComment(id: string) {
    dispatch(deleteComment(id));
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
              <MenuItem
                onClick={() => {
                  deleteSelectedPost(postObj._id);
                  handelCloseMenue();
                }}
              >
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
          sx={{ backgroundColor: "#F1FAF1", padding: "8px",width:'100%' }}
          component="img"
         
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
      {comments.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
            padding: "16px",
          }}
        >
          {(showAllComments ? comments : comments.slice(0, 1)).map(
            (comment) => (
              <Box
                key={comment._id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "12px",
                  marginY: "8px",
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: red[500],
                    cursor: "pointer",
                    width: 48,
                    height: 48,
                    marginRight: "16px",
                  }}
                  aria-label={comment.commentCreator.name}
                >
                  <Image
                    src={handelProfileImage(comment.commentCreator.photo)}
                    alt={comment.commentCreator.name}
                    width={48}
                    height={48}
                  />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", cursor: "pointer" }}
                    >
                      {comment.commentCreator.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", marginLeft: "8px" }}
                    >
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                    <IconButton
                      onClick={() => deletePostComment(comment._id)}
                      sx={{ marginLeft: "auto" }}
                    >
                      <DeleteIcon sx={{ color: "red", fontSize: 20 }} />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      marginTop: "4px",
                    }}
                  >
                    {comment.content}
                  </Typography>
                </Box>
              </Box>
            )
          )}
          <Button
            onClick={() => setShowAllComments((prev) => !prev)}
            sx={{
              display: "block",
              margin: "12px auto 0",
              textTransform: "capitalize",
              color: "#1976d2",
            }}
          >
            {showAllComments ? "Show Less" : `Show More (${comments.length})`}
          </Button>
        </Box>
      )}
    </Card>
  );
}
