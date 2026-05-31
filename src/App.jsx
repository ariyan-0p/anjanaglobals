import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import ScrollToTop from './components/ScrollToTop'
import SectionAnimator from './components/SectionAnimator'
import LeadPopup from './components/LeadPopup'
import SitePreloader from './components/SitePreloader'
import Home from './pages/Home'
import About from './pages/About'
import Destinations from './pages/Destinations'
import DestinationDetail from './pages/DestinationDetail'
import DubaiPage from './pages/DubaiPage'
import BaliPage from './pages/BaliPage'
import Services from './pages/Services'
import UAEVisaPage from './pages/UAEVisaPage'
import B2B from './pages/B2B'
import Packages from './pages/Packages'
import Contact from './pages/Contact'
import Testimonials from './pages/Testimonials'
import Blog from './pages/Blog'
import BlogPostPage from './pages/BlogPost'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminGalleries from './pages/admin/AdminGalleries'
import AdminAgentVoices from './pages/admin/AdminAgentVoices'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminBlogEdit from './pages/admin/AdminBlogEdit'
import { AuthProvider } from './context/AuthContext'

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
      {children}
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
        <ScrollToTop />
        <SectionAnimator />
        <PublicChrome>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/dubai" element={<DubaiPage />} />
            <Route path="/destinations/bali" element={<BaliPage />} />
            <Route path="/destinations/:slug" element={<DestinationDetail />} />
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
