"use client";
import React, { useState, KeyboardEvent } from "react";
import { styled } from "@mui/material/styles";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import { postType } from "@/app/_interfaces/home";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import { Box, Menu, MenuItem } from "@mui/material";
import myImg from "../../../assets/peep.png";
import { AddComments, deletePost } from "@/lib/postSlice";
import { useDispatch } from "react-redux";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
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
  transform: (props: ExpandMoreProps) =>
    !props.expand ? "rotate(0deg)" : "rotate(180deg)",
}));

export default function UserPage({
  postObj,
  allComments = false,
}: {
  postObj: postType;
  allComments: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [anchorE1,setAnchorE1]=useState(null)
  
  const handelOpenMenue=(event)=>{
setAnchorE1(event.currentTarget)
  }
  const handelCloseMenue=()=>{
setAnchorE1(null)
  }
  const dispatch=useDispatch();

  const router = useRouter();

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
    return lastKeyWord === "undefined" ? myImg : imgsrc;
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
  function deleteSelectedPost(id:string){
   dispatch(deletePost(id))
   
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
              src={postObj.user.photo}
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
          onChange={(e) => setComment(e.target.value)} // Update state on input change
          onKeyDown={handleKeyPress} // Handle "Enter" key press
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
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <CommentIcon />
        </ExpandMore>
      </CardActions>

      {/* Comments Section */}
      {postObj.comments.length > 0 && allComments == false ? (
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
                sx={{ padding: "0px", bgcolor: red[500], cursor: "pointer" }}
                aria-label={postObj.comments[0].commentCreator.name}
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
                {comment.content}/
              </Typography>
            </CardContent>
          </Box>
        ))
      )}
    </Card>
  );
}
