import { useState } from 'react'
import './App.css'
import BillTemplate from './components/BillTemplate'
import SplashScreen from './components/SplashScreen/SplashScreen'
import Header from './components/Header'
import Footer from './components/Footer'
import Settings from './components/Settings'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

function AppContent() {
  const [showSplash, setShowSplash] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const { isDarkMode, toggleDarkMode } = useTheme()

  const handleSplashFinish = () => {
    setShowSplash(false)
  }

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />
  }

  return (
    <>
      <Header onSettingsClick={() => setShowSettings(true)} />
      <main style={{ flex: 1 }}>
        <BillTemplate />
      </main>
      <Footer />
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onDarkModeToggle={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
