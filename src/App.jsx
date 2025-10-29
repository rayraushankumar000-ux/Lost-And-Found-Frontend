import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import ReportLost from './pages/ReportLost/ReportLost'
import ReportFound from './pages/ReportFound/ReportFound'
import SearchResults from './pages/SearchResults/SearchResults'
import UserProfile from './pages/UserProfile/UserProfile'
import AdminDashboard from './pages/AdminDashboard/AdminDashboard'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import AnalyticsDashboard from './pages/AnalyticsDashboard/AnalyticsDashboard'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import NotificationCenter from './components/NotificationCenter/NotificationCenter'
import VoiceAssistant from './components/VoiceAssistant/VoiceAssistant'
import BulkItemUpload from './components/BulkManagement/BulkItemUpload'
import QRCodeGenerator from './components/QRSystem/QRCodeGenerator'
import AuthorityReporting from './components/AuthorityIntegration/AuthorityReporting'
import ARItemScanner from './components/ARScanner/ARItemScanner'
import AIImageRecognition from './components/AIFeatures/AIImageRecognition'
import RewardsSystem from './components/RewardsSystem/RewardsSystem'
import EnhancedChatSystem from './components/ChatSystem/EnhancedChatSystem'
import LocationMap from './components/LocationMap/LocationMap'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <div className="App">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/search" element={<SearchResults />} />
                    
                    {/* Protected User Routes */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/report-lost" 
                      element={
                        <ProtectedRoute>
                          <ReportLost />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/report-found" 
                      element={
                        <ProtectedRoute>
                          <ReportFound />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/profile" 
                      element={
                        <ProtectedRoute>
                          <UserProfile />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Advanced Features Routes */}
                    <Route 
                      path="/bulk-upload" 
                      element={
                        <ProtectedRoute>
                          <BulkItemUpload />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/qr-generator" 
                      element={
                        <ProtectedRoute>
                          <QRCodeGenerator />
                        </ProtectedRoute>
                      } 
                    />
                    {/* authority */}
                    <Route 
                      path="/authority-reporting" 
                      element={
                        <ProtectedRoute>
                          <AuthorityReporting />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/ar-scanner" 
                      element={
                        <ProtectedRoute>
                          <ARItemScanner />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/ai-recognition" 
                      element={
                        <ProtectedRoute>
                          <AIImageRecognition />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/rewards" 
                      element={
                        <ProtectedRoute>
                          <RewardsSystem />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/location-map" 
                      element={
                        <ProtectedRoute>
                          <LocationMap />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Only Routes */}
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={
                        <ProtectedRoute requireAdmin={true}>
                          <AnalyticsDashboard />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* 404 Fallback */}
                    <Route path="*" element={
                      <div className="not-found">
                        <div className="not-found-content">
                          <h1>404</h1>
                          <h2>Page Not Found</h2>
                          <p>The page you're looking for doesn't exist.</p>
                          <a href="/" className="btn btn-primary">
                            Go Home
                          </a>
                        </div>
                      </div>
                    } />
                  </Routes>
                </main>
                
                {/* Global Components */}
                <VoiceAssistant />
                <NotificationCenter />
                <EnhancedChatSystem />
                <Footer />
              </div>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App