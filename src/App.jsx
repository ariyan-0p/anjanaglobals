import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Services from './pages/Services'
import B2B from './pages/B2B'
import Packages from './pages/Packages'
import Contact from './pages/Contact'
import Testimonials from './pages/Testimonials'

function App() {
  return (
    <BrowserRouter>
      <SitePreloader />
      <ScrollToTop />
      <SectionAnimator />
      <LeadPopup />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/b2b" element={<B2B />} />
        <Route path="/packages" element={<Packages />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
      <WhatsAppFloat />
    </BrowserRouter>
  )
}

export default App
