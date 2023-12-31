import React from 'react'
import UploadPhoto from './components/UploadPhoto'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Account from './components/Account'
import { Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import { Helmet } from 'react-helmet'

function App () {
  return (
    <div>
      <Helmet>
        <style>{'body { background-color: #fffae6; }'}</style>
      </Helmet>
      <h1 className='text-center text-3xl font-bold'>
        AlectAI Demo
      </h1>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route
            path='/account'
            element={
              <ProtectedRoute>
                <Account />
                <UploadPhoto/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </div>
  )
}

export default App
