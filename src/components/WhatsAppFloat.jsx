import { useState } from 'react'
import { X, MessageCircle } from 'lucide-react'

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false)
  const [tooltip, setTooltip] = useState(true)

  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 900, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
      {/* Tooltip bubble */}
      {tooltip && !show && (
        <div style={{
          background: 'white',
          borderRadius: '12px 12px 0 12px',
          padding: '10px 14px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          fontSize: '13px',
          color: '#1A1A2E',
          fontWeight: '500',
          maxWidth: '200px',
          lineHeight: '1.5',
          position: 'relative',
          animation: 'float 3s ease-in-out infinite',
        }}>
          <button
            onClick={() => setTooltip(false)}
            style={{
              position: 'absolute', top: '4px', right: '6px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9CA3AF', padding: '0', lineHeight: 1,
            }}
          >
            <X size={12} />
          </button>
          <span>💬 Chat with us on WhatsApp!</span>
        </div>
      )}

      {/* Quick chat panel */}
      {show && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          width: '300px',
          overflow: 'hidden',
          animation: 'slideDown 0.2s ease',
        }}>
          {/* Header */}
          <div style={{ background: '#25D366', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'white', fontWeight: '700', fontSize: '15px', margin: 0 }}>Anjna Global</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0 }}>Typically replies in minutes</p>
            </div>
            <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <X size={18} />
            </button>
          </div>
          {/* Body */}
          <div style={{ padding: '20px', background: '#ECE5DD' }}>
            <div style={{ background: 'white', borderRadius: '0 12px 12px 12px', padding: '12px 14px', fontSize: '14px', lineHeight: '1.5', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
              Hello! 👋 Welcome to <strong>Anjna Global</strong>.<br />How can we help you plan your perfect trip?
            </div>
          </div>
          <div style={{ padding: '16px 20px', borderTop: '1px solid #f0f0f0' }}>
            <a
              href="https://wa.me/919876543210?text=Hi%20Anjna%20Global%2C%20I%20would%20like%20to%20enquire%20about%20a%20travel%20package."
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: '#25D366', color: 'white', padding: '12px',
                borderRadius: '8px', fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px',
                textDecoration: 'none', transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#1da851'}
              onMouseLeave={e => e.currentTarget.style.background = '#25D366'}
            >
              <MessageCircle size={18} />
              Start Chat
            </a>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => { setShow(o => !o); setTooltip(false) }}
        style={{
          width: '58px', height: '58px',
          background: '#25D366',
          border: 'none', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(37,211,102,0.5)',
          transition: 'all 0.3s ease',
          animation: show ? 'none' : 'float 3s ease-in-out infinite',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,211,102,0.6)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.5)' }}
        aria-label="WhatsApp Chat"
      >
        {show ? <X size={24} color="white" /> : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>
    </div>
  )
}
