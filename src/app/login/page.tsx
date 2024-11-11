'use client'
import React from "react";
import { Container, Paper, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import { userLogin } from "@/lib/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { UserInof } from "@/lib/postSlice";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const userinfo = useAppSelector((state) => state.posts.userinfo);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      dispatch(userLogin(values))
        .then((res) => {
          if (res.payload.message === "success") {
            dispatch(UserInof());

            // Wait until userinfo is populated before showing the toast
            const checkUserInfo = setInterval(() => {
              if (userinfo?.name) {
                toast.success(`Welcome back 👋 ${userinfo.name}`);
                clearInterval(checkUserInfo); // Stop the interval once userinfo is available
                router.push("/");
              }
            }, 100); // Check every 100ms
          } else  {
            toast.error("Login failed. Please try again.");
          }
        })
        .catch(() => {
          toast.error("An unexpected error occurred.");
        });
    },
  });

  return (
    <Container maxWidth="sm" sx={{ marginBlock: "20px" }}>
      <Paper sx={{ padding: "20px" }} elevation={15}>
        <form
          onSubmit={formik.handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <TextField
            onChange={formik.handleChange}
            value={formik.values.email}
            id="email"
            label="Email"
            variant="outlined"
          />
          <TextField
            onChange={formik.handleChange}
            value={formik.values.password}
            id="password"
            label="Password"
            variant="outlined"
            type="password"
          />
          <Button
            type="submit"
            sx={{
              borderRadius: "10px",
              background: "linear-gradient(45deg, #C13584, #E1306C, #F56040)",
              backgroundSize: "200% 200%",
              transition: "background-position 0.7s ease",
              backgroundPosition: "left",
              "&:hover": {
                backgroundPosition: "right",
              },
              color: "white",
            }}
            variant="text"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
