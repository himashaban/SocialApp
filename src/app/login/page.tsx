'use client'
import React from 'react'
import Container from '@mui/material/Container'
import { Paper, TextField, Button } from '@mui/material'
import { useFormik } from 'formik'
import { userLogin } from '@/lib/authSlice'
import { useDispatch } from 'react-redux'
import { Store } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'




export default function Login() {
  let router=useRouter()
  let dispatch=useDispatch<typeof Store.dispatch>();
  let formik= useFormik({
    initialValues:{
     email:'',
     password:''
    },
    onSubmit:(values)=>{
     console.log(values)
     dispatch(userLogin(values))
     .then((res)=>{
      console.log('res',res);
      if(res.payload.message == 'success'){
       console.log(res.payload.message);
       
       localStorage.setItem("userToken",res.payload.token);
       
       router.push('/')
setTimeout(() => {
  const userName = localStorage.getItem("userName");
  toast.success(`Welcome back 👋 ${userName}`);
}, 2000);       
      }else{
        console.log(res.payload)
        toast.error(res.payload)
      }
      
     })
     .catch((err)=>{
      console.log('err',err);
      
     })
    },
  })


  return<>

   <Container maxWidth="sm" sx={{marginBlock:'20px'}}>
    <Paper sx={{padding:'20px'}} elevation={15}>
<form onSubmit={formik.handleSubmit} style={{display:'flex', flexDirection:'column',gap:'20px'}}>

      <TextField onChange={formik.handleChange} id="email"label="email" variant='outlined'/>
      <TextField onChange={formik.handleChange} id="password"label="password" variant='outlined'/>
<Button 
type='submit'
  sx={{ 
    borderRadius: '10px', 
    background: 'linear-gradient(45deg, #C13584, #E1306C, #F56040)', 
    backgroundSize: '200% 200%', 
    transition: 'background-position 0.7s ease', 
    backgroundPosition: 'left',
    '&:hover': { 
      backgroundPosition: 'right'
    }, 
    color: 'white' 
  }} 
  variant="text"
>
  login
</Button>
</form>

    </Paper>

 



      
    </Container>








  </>
}
