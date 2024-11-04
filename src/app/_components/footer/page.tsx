'use client'
import React from "react";
import {
  Box,
  Typography,
  Link,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: "auto",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        {/* Company Info */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>
            Company
          </Typography>
          <Typography variant="body2">
            © 2024 Your Company. All rights reserved.
          </Typography>
        </Grid>

        {/* Navigation Links */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>
            Links
          </Typography>
          <Link
            href="#"
            color="inherit"
            underline="none"
            variant="body2"
            display="block"
          >
            Home
          </Link>
          <Link
            href="#"
            color="inherit"
            underline="none"
            variant="body2"
            display="block"
          >
            About Us
          </Link>
          <Link
            href="#"
            color="inherit"
            underline="none"
            variant="body2"
            display="block"
          >
            Contact
          </Link>
          <Link
            href="#"
            color="inherit"
            underline="none"
            variant="body2"
            display="block"
          >
            Careers
          </Link>
        </Grid>

        {/* Social Links */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" gutterBottom>
            Connect
          </Typography>
          <Box display="flex" gap={1}>
            <IconButton
              color="inherit"
              href="https://facebook.com"
              target="_blank"
            >
              <Facebook />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://twitter.com"
              target="_blank"
            >
              <Twitter />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://instagram.com"
              target="_blank"
            >
              <Instagram />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://linkedin.com"
              target="_blank"
            >
              <LinkedIn />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        color="text.secondary"
      >
        Crafted with ❤️ by ibrahim shaaban
      </Typography>
    </Box>
  );
};

export default Footer;
