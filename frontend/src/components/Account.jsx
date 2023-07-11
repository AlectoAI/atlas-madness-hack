import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { UserAuth } from '../context/AuthContext'
import axios from 'axios'
import logo from '../image/logo.png'

const Account = () => {
  const { user, logout } = UserAuth()
  const navigate = useNavigate()

  const [file, setFile] = useState()
  const [embedding, setEmbedding] = useState()

  function handleChange (event) {
    setFile(event.target.files[0])
  }

  function handleUpload (e) {
    console.log(this.state.file)
    this.uploadImage(this.state.file)
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message)
    }
  }

  function uploadImage (file) {
    try {
      console.log('Upload Image', file)
      const formData = new FormData()
      formData.append('image', file)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const url = 'https://alecto-api-7uztfekh2a-uc.a.run.app/process/'

      axios.post(url, formData, config).then(res => {
        console.log(res.data)
        setEmbedding(res.data.embedding)
      })
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <div className='max-w-[600px] mx-auto my-2 p-4'>
      <img style={{ width: '100px' }} src={logo} />
      <h2 className='text-2xl font-bold py-4'>Welcome</h2>
      <h2>User: {user && user.email}</h2>
      <button onClick={handleUpload} className='border px-6 py-2 my-4'>
        Logout
      </button>
    </div>
  )
}

export default Account
