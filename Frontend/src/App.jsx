import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { MainPage } from './pages/MainPage.jsx'


function App() {
  return(
    // 2. Envuelves tu aplicación con el AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/*" element={<MainPage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App