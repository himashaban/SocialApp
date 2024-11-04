'use client'
import Post from '@/app/_components/post/post';
import Loading from '@/app/loading';
import { GetPost } from '@/lib/postSlice';
import { store } from '@/lib/store';
import { Box } from '@mui/material';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

export default function page(props:string) {
  // console.log('props',props.params.id);
  const dispatch = useDispatch<typeof store.dispatch>();
  let { singlePost } = useSelector(
    (state: ReturnType<typeof store.getState>) => state.posts);

  useEffect(() => {
    dispatch(GetPost(props.params.id));
  }, [dispatch, props.params.id]);

  return singlePost ? <Box sx={{width:'50%', mx:'auto'}}><Post postObj={singlePost} allComments={true} /></Box> : <Loading />;

  
}
