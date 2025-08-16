import Link from 'next/link';
import AuthWrapper from '@/components/AuthWrapper';

export default function NotFoundPage() {
  return (
    <AuthWrapper requireAuth={false}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center' as const,
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <span style={{
              fontSize: '4rem',
              display: 'block',
              marginBottom: '1rem'
            }}>🌊</span>
          </div>
          
          <h1 style={{
            marginBottom: '1rem',
            fontSize: '2.5rem',
            fontWeight: 'bold'
          }}>
            404 - Vibe Not Found
          </h1>
          
          <p style={{
            marginBottom: '2rem',
            fontSize: '1.125rem',
            lineHeight: '1.75',
            color: '#6b7280'
          }}>
            This vibe doesn&apos;t exist in the tribe. Let&apos;s get you back to the good vibes!
          </p>
          
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap' as const
          }}>
            <Link 
              href="/home" 
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                minWidth: '120px',
                background: '#3b82f6',
                color: 'white',
                border: '2px solid #3b82f6'
              }}
            >
              Back to Home
            </Link>
            <Link 
              href="/explore"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                minWidth: '120px',
                background: 'transparent',
                color: '#374151',
                border: '2px solid #e5e7eb'
              }}
            >
              Explore Vibes
            </Link>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}