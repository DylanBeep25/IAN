import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import MainPage from './pages/MainPage'

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/*" element={<MainPage/>} />
      </Routes>
    </Router>
  )
}

export default App
