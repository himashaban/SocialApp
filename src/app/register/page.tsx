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
import { Store } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch<typeof Store.dispatch>();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
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
        .required("Password is required"),
      rePassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
      dateOfBirth: Yup.date().required("Date of birth is required"),
      gender: Yup.string().required("Gender is required"),
    }),
    onSubmit: (values) => {
      dispatch(userRegister(values)) // Update to match the actual register action
        .then((res) => {
          if (res.payload.message === "success") {
            toast.success("Registration successful! 🎉");
            router.push("/login"); // Redirect to login after successful registration
          } else {
            toast.error(res.payload);
          }
        })
        .catch((err) => {
          console.log("Registration error:", err);
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
            id="rePassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.rePassword}
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
            InputLabelProps={{ shrink: true }}
            error={
              formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
            }
            helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
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
              label="Gender"
              value={formik.values.gender}
              onChange={(event) =>
                formik.setFieldValue("gender", event.target.value)
              }
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
            {formik.touched.gender && formik.errors.gender && (
              <FormHelperText>{formik.errors.gender}</FormHelperText>
            )}
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
            variant="text"
          >
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
