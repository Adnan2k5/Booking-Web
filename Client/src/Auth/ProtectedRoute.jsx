import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthProvider'
import { useEffect } from 'react'
import { getInstructorById } from '../Api/instructor.api';

export const AdminRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    if (user.user === null) {
      navigate('/login')
    }
    else if (user.user.role !== 'admin') {
      navigate("/")
    }
  })
  return (
    children
  )
}

export const InstructorRoute = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const getStatus = async () => {
    const res = await getInstructorById(user.user.instructor)
    if (res.data.message.instructor[0].instructor.documentVerified === "pending") {
      return false;
    }
  }

  useEffect(() => {
    if (user.user === null) {
      navigate('/login')
    }
    else if (user.user.role === 'instructor') {
      navigate("/")
    }
    else if (user.user.role === 'instructor' && user.user.instructor !== null) {
      getStatus().then((res) => {
        if (res === false) {
          navigate("/instructor/pending-review")
        }
      })
    }
  })
  return (
    children
  )
}
