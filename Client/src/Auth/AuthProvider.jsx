import React, { useEffect } from 'react'


import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';




export const AuthProvider = ({children}) => {
    const {user} = useSelector(state => state.user);
    const Navigate = useNavigate();
    useEffect(() => {
        if(!user){
            Navigate("/login");
        }
    }, [user])
  return (
    children
  )
}
