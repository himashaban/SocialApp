"use client";
import React from "react";
import Container from "@mui/material/Container";
import {
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { userRegister } from "@/lib/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store"; // Make sure this path is correct
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); // Use AppDispatch instead of Store.dispatch

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "", // Keep this as rePassword
      dateOfBirth: "",
      gender: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter") // At least one capital letter
        .matches(/\d/, "Password must contain at least one number") // At least one number
        .matches(
          /[@$!%*?&]/,
          "Password must contain at least one special character"
        ) // At least one symbol
        .required("Password is required"),
      rePassword: Yup.string() // Keep this as rePassword
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
      dateOfBirth: Yup.date().required("Date of birth is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    // onSubmit: async (values) => {
    //   try {
    //     const res = await dispatch(userRegister(values)); // Ensure userRegister returns a message
    //     if (res.payload?.message === "success") {
    //       toast.success("Registration successful! 🎉");
    //       router.push("/login"); // Redirect to login after successful registration
    //     } else {
    //       toast.error(res.payload?.error || "Something went wrong!");
    //     }
    //   } catch (err) {
    //     console.error("Registration error:", err);
    //     toast.error("Registration failed. Please try again.");
    //   }
    // },
    onSubmit: (values) => {
      dispatch(userRegister(values))
        .then((res) => {
          if (res.payload.message === "success") {
            toast.success("Registration successful! 🎉");
                 router.push("/login");

            // Wait until userinfo is populated before showing the toast
            // Check every 100ms
          } else {
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
            id="name"
            label="Name"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            id="rePassword" // Keep this as rePassword
            label="Confirm Password"
            type="password"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.rePassword} // Keep this as rePassword
            error={
              formik.touched.rePassword && Boolean(formik.errors.rePassword)
            }
            helperText={formik.touched.rePassword && formik.errors.rePassword}
          />
          <TextField
            id="dateOfBirth"
            label="Date of Birth"
            type="date"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.dateOfBirth}
            error={
              formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
            }
            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl
            variant="outlined"
            error={formik.touched.gender && Boolean(formik.errors.gender)}
          >
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
            <FormHelperText>
              {formik.touched.gender && formik.errors.gender}
            </FormHelperText>
          </FormControl>

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
            variant="contained"
            color="primary"
          >
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
