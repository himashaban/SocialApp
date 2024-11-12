import React, { useState } from "react";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextField from "@mui/material/TextField";
import { Box, Divider, Button } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AddComments } from "@/lib/postSlice";
import { AppDispatch } from "@/lib/store";
import myImg from "../../../assets/peep.png";
import { commentType, postType } from "@/app/_interfaces/home";

export default function Post({
  postObj,
  allComments = false,
}: {
  postObj: postType;
  allComments: boolean;
}) {
  const router = useRouter();
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<commentType[]>(postObj.comments);
  const [showAllComments, setShowAllComments] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      setComment("");
      dispatch(AddComments({ comment, postid: postObj._id })).then((res) => {
        if (res?.payload?.data?.comment) {
          setComments([...comments, res.payload.data.comment]);
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

  // const PostDetails = async (id: string) => {
  //   try {
  //     await dispatch(GetPost(id));
  //     router.push(`/ssingelpost`);
  //   } catch (error) {
  //     console.error("Failed to load post details:", error);
  //   }
  // };

  function handelNavigate(id: string) {
    router.push(`/profile/${id}`);
  }

  const toggleComments = () => {
    setShowAllComments((prev) => !prev);
    console.log(allComments);
    
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <Card sx={{ maxWidth: "100%", marginTop: "20px" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], cursor: "pointer" }}
            aria-label={postObj.user?.name}
          >
            <Image
              src={handelProfileImage(postObj.user?.photo || "")}
              alt={postObj.user?.name || "User Avatar"}
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
        title={postObj.user?.name}
        subheader={postObj.createdAt}
        titleTypographyProps={{
          sx: { cursor: "pointer" },
        }}
        onClick={() => handelNavigate(postObj.user?._id || "")}
      />
      {postObj.image && (
        <CardMedia
          component="img"
          image={postObj.image}
          alt={postObj.body}
          sx={{ width: "100%" }} // Using sx for full width
        />
      )}
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {postObj.body}
        </Typography>
        <Typography
          variant="body2"
          sx={{ marginTop: "10px", fontWeight: "bold" }}
        >
          {comments.length} comments
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <TextField
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Add a comment..."
          fullWidth
          variant="outlined"
          size="small"
          sx={{ marginLeft: "10px" }}
        />
      </CardActions>
      <Divider />
      {displayedComments.map((c, index) => (
        <Box
          key={index}
          sx={{ display: "flex", alignItems: "center", padding: "10px" }}
        >
          <Avatar
            sx={{ bgcolor: red[500], cursor: "pointer" }}
            aria-label={c.commentCreator?.name}
          >
            <Image
              src={handelProfileImage(c.commentCreator?.photo || "")} // Now returns a valid string URL
              alt={c.commentCreator?.name || "User Avatar"}
              width={50}
              height={50}
            />
          </Avatar>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ paddingX: "10px", fontWeight: "bold" }}
            >
              {c.commentCreator?.name || "Anonymous"}
            </Typography>
            <Typography sx={{ paddingX: "10px" }} variant="body2">
              {c.content}
            </Typography>
          </Box>
        </Box>
      ))}
      {comments.length > 3 && (
        <Box sx={{ textAlign: "center", padding: "10px" }}>
          <Button onClick={toggleComments}>
            {showAllComments ? "Show Less" : "Show More"}
          </Button>
        </Box>
      )}
    </Card>
  );
}
