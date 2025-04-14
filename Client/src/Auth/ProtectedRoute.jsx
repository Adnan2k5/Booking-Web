import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthProvider'
import React, { useEffect } from 'react'

export const ProtectedRoute = ({children}) => {
    const navigate = useNavigate();
    const {user} = useAuth();
    useEffect(()=>{
        if(user.user === null){
            navigate('/login')
        }
        else if(user.user.role !== 'admin'){
            navigate("/")
        }
    })
  return (
    children
  )
}
