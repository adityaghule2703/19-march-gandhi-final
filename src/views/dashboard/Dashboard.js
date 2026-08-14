import React, { useState, useEffect } from 'react'
import {
  CSpinner,
} from '@coreui/react'
import axios from 'axios'

const Dashboard = () => {
  const [backgroundImage, setBackgroundImage] = useState('')
  const [imageLoading, setImageLoading] = useState(true)
  const baseURL = 'https://gmplmis.com/dealership-api/api/v1'

  useEffect(() => {
    fetchActiveWallpaper()
  }, [])

  const fetchActiveWallpaper = async () => {
    try {
      setImageLoading(true)
      const response = await axios.get(`${baseURL}/wallpapers/active`, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.data.success && response.data.data) {
        const dashboardWallpaper = response.data.data.find(
          wallpaper => wallpaper.screen_name === 'dashboard' && wallpaper.is_active === true
        )
        
        if (dashboardWallpaper && dashboardWallpaper.image_url) {
          setBackgroundImage(dashboardWallpaper.image_url)
        } else {
          console.log('No active wallpaper found for dashboard screen')
          setBackgroundImage('')
        }
      } else {
        setBackgroundImage('')
      }
    } catch (error) {
      console.error('Error fetching active wallpaper:', error)
      setBackgroundImage('')
    } finally {
      setImageLoading(false)
    }
  }

  if (imageLoading) {
    return (
      <div
        className="min-vh-100 d-flex flex-row align-items-center justify-content-center"
        style={{
          backgroundColor: '#f0f0f0',
        }}
      >
        <CSpinner color="primary" size="lg" />
      </div>
    )
  }

  return (
    <div
      className="min-vh-100 w-100"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'background-image 0.5s ease-in-out',
        backgroundColor: backgroundImage ? 'transparent' : '#f0f0f0',
      }}
    >
      {backgroundImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 0,
          marginLeft: '250px', // Adjust based on your sidebar width
        }} />
      )}
    </div>
  )
}

export default Dashboard