import { Suspense, lazy, ReactNode, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CustomToaster } from './components/ui/CustomToasts'
import DashboardShell from './components/layout/DashboardShell'
import RouteLoader from './components/layout/RouteLoader'
import { useSession } from './store/session'
import api from './lib/api'

// Non-lazy imports for core pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import OverviewPage from './pages/dashboard/OverviewPage'

// Lazy load others
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

const FeaturesPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.FeaturesPage })))
const PricingPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.PricingPage })))
const AboutPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.AboutPage })))
const BlogPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.BlogPage })))
const CareersPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.CareersPage })))
const ChangelogPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.ChangelogPage })))
const RoadmapPage = lazy(() => import('./pages/InfoPages').then(m => ({ default: m.RoadmapPage })))
const RunResultsPage = lazy(() => import('./pages/dashboard/RunResultsPage'))
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'))
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'))
const ProductLibraryPage = lazy(() => import('./pages/dashboard/ProductLibraryPage'))
const ShopifySyncPage = lazy(() => import('./pages/dashboard/ShopifySyncPage'))
const AgentStatusPage = lazy(() => import('./pages/dashboard/AgentStatusPage'))
const AgentConsolePage = lazy(() => import('./pages/dashboard/AgentConsolePage'))
const AgentWorkflowPage = lazy(() => import('./pages/dashboard/AgentWorkflowPage'))
const InsightsPage = lazy(() => import('./pages/dashboard/InsightsPage'))
const RunsHistoryPage = lazy(() => import('./pages/dashboard/RunsHistoryPage'))
const MetaAdsPage = lazy(() => import('./pages/dashboard/MetaAdsPage'))
const SourcingPage = lazy(() => import('./pages/dashboard/SourcingPage'))

function PublicOnly({ children }: { children: ReactNode }) {
  const { accessToken } = useSession()
  if (accessToken) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken } = useSession()
  if (!accessToken) return <Navigate to="/auth/login" replace />
  return <>{children}</>
}

export default function App() {
  const { accessToken, clear } = useSession()

  useEffect(() => {
    const verifySession = async () => {
      if (!accessToken) return
      try {
        await api.get('/v2/auth/me')
      } catch (err: any) {
        console.error('Session validation failed on mount, clearing token:', err)
        clear()
      }
    }
    verifySession()
  }, [accessToken, clear])
  return (
    <div className="bg-brand-950 min-h-screen selection:bg-accent-primary/20">
      <CustomToaster />
      <RouteLoader />
      <Suspense fallback={<div className="min-h-screen bg-brand-950" />}>
        <Routes>
          <Route index element={<LandingPage />} />
          
          <Route path="/auth">
            <Route path="login" element={<PublicOnly><LoginPage /></PublicOnly>} />
            <Route path="signup" element={<PublicOnly><SignupPage /></PublicOnly>} />
            <Route path="forgot-password" element={<PublicOnly><ForgotPasswordPage /></PublicOnly>} />
          </Route>

          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          
          <Route element={<DashboardShell />}>
            <Route path="/dashboard" element={<ProtectedRoute><OverviewPage /></ProtectedRoute>} />
            <Route path="/dashboard/run/new" element={<Navigate to="/dashboard/products" replace />} />
            <Route path="/dashboard/runs/:runId" element={<ProtectedRoute><RunResultsPage /></ProtectedRoute>} />
            <Route path="/dashboard/runs" element={<ProtectedRoute><RunsHistoryPage /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
            <Route path="/dashboard/products" element={<ProtectedRoute><ProductLibraryPage /></ProtectedRoute>} />
            <Route path="/dashboard/shopify" element={<ProtectedRoute><ShopifySyncPage /></ProtectedRoute>} />
            <Route path="/dashboard/agents" element={<ProtectedRoute><AgentStatusPage /></ProtectedRoute>} />
            <Route path="/dashboard/agents/:agentId" element={<ProtectedRoute><AgentConsolePage /></ProtectedRoute>} />
            <Route path="/dashboard/workflow" element={<ProtectedRoute><AgentWorkflowPage /></ProtectedRoute>} />
            <Route path="/dashboard/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
            <Route path="/dashboard/ads" element={<ProtectedRoute><MetaAdsPage /></ProtectedRoute>} />
            <Route path="/dashboard/sourcing" element={<ProtectedRoute><SourcingPage /></ProtectedRoute>} />
          </Route>

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/changelog" element={<ChangelogPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}
