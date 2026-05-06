import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import {BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import Cart from './pages/Cart'
import Order from './pages/Order'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/signup" element={<SignUp/>}></Route>
          <Route path="/admin/home" element={<AdminDashboard/>}></Route>
          <Route path="/user/home" element={<UserDashboard/>}></Route>
          <Route path="/user/cart" element={<Cart/>}></Route>
          <Route path="/user/order" element={<Order/>}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App