import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import {BrowserRouter, Routes, Route } from 'react-router-dom'


function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}></Route>
      <Route path="/signup" element={<SignUp/>}></Route>
    </Routes>
    </BrowserRouter>

    </>
  )
}

export default App