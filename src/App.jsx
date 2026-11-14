import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import LeadPopup from './components/LeadPopup'
import SitePreloader from './components/SitePreloader'
import RouteErrorBoundary from './components/RouteErrorBoundary'
import MotionRoot from './motion/MotionRoot'
import { AuthProvider } from './context/AuthContext'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Destinations = lazy(() => import('./pages/Destinations'))
const DestinationPage = lazy(() => import('./pages/destination/DestinationPage'))
const Services = lazy(() => import('./pages/Services'))
const UAEVisaPage = lazy(() => import('./pages/UAEVisaPage'))
const B2B = lazy(() => import('./pages/B2B'))
const Packages = lazy(() => import('./pages/Packages'))
const Contact = lazy(() => import('./pages/Contact'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPostPage = lazy(() => import('./pages/BlogPost'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminGalleries = lazy(() => import('./pages/admin/AdminGalleries'))
const AdminAgentVoices = lazy(() => import('./pages/admin/AdminAgentVoices'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'))
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'))
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'))
const AdminBlogEdit = lazy(() => import('./pages/admin/AdminBlogEdit'))

function PublicChrome({ children }) {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      {!isAdmin && (
        <>
          <SitePreloader />
          <LeadPopup />
          <Navbar />
        </>
      )}
      <RouteErrorBoundary key={pathname}>
        <Suspense fallback={<div className="route-fallback" />}>{children}</Suspense>
      </RouteErrorBoundary>
      {!isAdmin && (
        <>
          <Footer />
          <WhatsAppFloat />
        </>
      )}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MotionRoot />
        <PublicChrome>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:slug" element={<DestinationPage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/uae-visa" element={<UAEVisaPage />} />
            <Route path="/b2b" element={<B2B />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="galleries" element={<AdminGalleries />} />
              <Route path="agent-voices" element={<AdminAgentVoices />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="blogs/new" element={<AdminBlogEdit />} />
              <Route path="blogs/:id/edit" element={<AdminBlogEdit />} />
            </Route>
          </Routes>
        </PublicChrome>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
