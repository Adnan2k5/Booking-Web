import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../AuthProvider'
import { Loader } from '../../components/Loader'

export default function DashboardLayout() {
  const { user, loading } = useAuth()

  // While auth status is loading, show loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  // If not logged in, redirect to login page
  if (!user || !user.user) {
    return <Navigate to="/login" replace />
  }

  // Authenticated: render nested dashboard routes
  return <Outlet />
}
