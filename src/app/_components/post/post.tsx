"use client";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import { postType } from "@/app/_interfaces/home";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import { Box, Divider, Menu, MenuItem } from "@mui/material";
import myImg from "../../../assets/peep.png";
import { useDispatch } from "react-redux";
import { AddComments, deleteComment } from "@/lib/postSlice";
import DeleteIcon from "@mui/icons-material/Delete";
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

export default function Post({
  postObj,
  allComments = false,
}: {
  postObj: postType;
  allComments: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const router = useRouter();
   const [comment, setComment] = useState<string>("");
   const dispatch = useDispatch();
const [anchorE1, setAnchorE1] = useState(null);
const handelOpenMenue = (event) => {
  setAnchorE1(event.currentTarget);
};
const handelCloseMenue = () => {
  setAnchorE1(null);
};
function deleteSelectedComment(id:string){
  dispatch(deleteComment(id));
}

   const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
     if (event.key === "Enter") {
       console.log("Enter key pressed!");
       console.log("Comment:", comment);
       console.log("Post ID:", postObj._id);
       setComment(""); // Clear input after submission

       dispatch(AddComments({ comment, postid: postObj._id })).then(
         (res: any) => {
           if (res?.payload?.data?.comment) {
             // Update comments state immediately
             setComments([...comments, res.payload.data.comment]);
           }
         }
       );
     }
   };

  function handelProfileImage(imgsrc: string) {
    let myallKeywords = imgsrc.split("/");
    let lastKeyWord = myallKeywords[myallKeywords.length - 1];
    if (lastKeyWord == "undefined") {
      return myImg;
    } else {
      return imgsrc;
    }
  }
  function PostDetails(id: string) {
    router.push(`/posts/${id}`);
  }

  function handelNavigate(id: string) {
    router.push(`/profile/${id}`);
  }
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: "100% ", marginTop: "20px" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], cursor: "pointer" }}
            aria-label={postObj.user.name}
            
          >
            <Image
              src={postObj.user.photo}
              alt={postObj.user.name}
              width={50}
              height={50}
            />
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={postObj.user.name}
        subheader={postObj.createdAt}
        subheaderTypographyProps={{
          sx: {
            gap: "12px",
          },
        }}
        titleTypographyProps={{
          sx: {
            width: "fit-content",
            cursor: "pointer",
          },
        }}
        
      />
      {postObj.image ? (
        <CardMedia
          component="img"
          height="150"
          image={postObj.image}
          alt={postObj.body}
        />
      ) : (
        ""
      )}

      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {postObj.body}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)} // Update state on input change
          onKeyDown={handleKeyPress}
          sx={{
            paddingY: "10px",
            marginY: "10px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
            },
            "& .MuiInputLabel-root": {
              top: "10px",
              left: "10px",
            },
            "& .MuiInputLabel-shrink": {
              top: "9px",
              left: "0px",
            },
          }}
          fullWidth
          id=""
          label="comment"
        />

        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>

        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </ExpandMore>
      </CardActions>
      {postObj.comments.length > 0 && allComments == false ? (
        <Box sx={{ backgroundColor: "gray" }}>
          <CardHeader
            avatar={
              <Avatar
                sx={{ bgcolor: red[500], cursor: "pointer" }}
                aria-label={postObj.user.name}
                onClick={() =>
                  handelNavigate(postObj.comments[0].commentCreator._id)
                }
              >
                <Image
                  src={handelProfileImage(
                    postObj.comments[0].commentCreator.photo
                  )}
                  alt={postObj.comments[0].commentCreator.name}
                  width={50}
                  height={50}
                />
              </Avatar>
            }
            title={postObj.comments[0].commentCreator.name}
            subheader={postObj.comments[0].createdAt}
            subheaderTypographyProps={{
              sx: {
                gap: "12px",
              },
            }}
            titleTypographyProps={{
              sx: {
                width: "fit-content",
                cursor: "pointer",
              },
            }}
            onClick={() =>
              handelNavigate(postObj.comments[0].commentCreator._id)
            }
          />
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {postObj.comments[0].content}
            </Typography>
          </CardContent>
        </Box>
      ) : (
        postObj.comments?.map((comment) => (
          <Box key={comment._id} sx={{ backgroundColor: "gray" }}>
            <CardHeader
              avatar={
                <Avatar
                  sx={{ bgcolor: red[500], cursor: "pointer" }}
                  aria-label={postObj.user.name}
                  
                >
                  <Image
                    src={handelProfileImage(
                      postObj.comments[0].commentCreator.photo
                    )}
                    alt={postObj.comments[0].commentCreator.name}
                    width={50}
                    height={50}
                  />
                </Avatar>
              }
              title={comment.commentCreator.name}
              subheader={comment.createdAt}
              subheaderTypographyProps={{
                sx: {
                  gap: "12px",
                },
              }}
              titleTypographyProps={{
                sx: {
                  width: "fit-content",
                  cursor: "pointer",
                },
              }}
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
                        deleteSelectedComment(comment._id);
                        handelCloseMenue();
                      }}
                    >
                      <DeleteIcon sx={{ color: "red" }} /> delete comment
                    </MenuItem>
                  </Menu>
                </>
              }
            />

            <CardContent>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {comment.content}
              </Typography>
            </CardContent>
            <Divider sx={{ my: 3 }} />
          </Box>
        ))
      )}
      {postObj.comments.length > 1 && allComments == false ? (
        <Typography
          sx={{ cursor: "pointer" }}
          component="p"
          
          onClick={() => PostDetails(postObj._id)}
        >
          {" "}
          see more comments
        </Typography>
      ) : (
        ""
      )}
    </Card>
  );
}
