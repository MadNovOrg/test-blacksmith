import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import { AccountPage } from './pages/Account/Account'
import { HomePage } from './pages/Home/Home'

import './style.css'

function App() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="account" element={<AccountPage />} />
      </Routes>
    </div>
  )
}

export default App
