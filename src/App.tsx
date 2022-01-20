import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { AccountPage } from './pages/Account/Account'
import { HomePage } from './pages/Home/Home'

import './style.css'
import './i18n/config'

function App() {
  const { t } = useTranslation()

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">{t('pages.home.title')}</Link>
          </li>
          <li>
            <Link to="/account">{t('pages.account.title')}</Link>
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
