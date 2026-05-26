import { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

export default function Splash({ onFinish }) {
  const [phase, setPhase] = useState('enter');
  // phase: 'enter' -> 'hold' -> 'exit'

  useEffect(() => {
    console.log('[SPLASH] starting transition sequence');
    const t1 = setTimeout(() => {
      console.log('[SPLASH] phase: hold');
      setPhase('hold');
    }, 400);
    const t2 = setTimeout(() => {
      console.log('[SPLASH] phase: exit');
      setPhase('exit');
    }, 1800);
    const t3 = setTimeout(() => {
      console.log('[SPLASH] transition complete -> dashboard');
      onFinish();
    }, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0a1a0a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      transform: phase === 'exit' ? 'translateY(-100%)' : 'translateY(0)',
      transition: phase === 'exit' ? 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
    }}>

      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(74,138,48,0.15) 0%, transparent 65%)',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 1s ease',
      }} />

      {/* Logo container */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        opacity: phase === 'enter' ? 0 : 1,
        transform: phase === 'enter' ? 'scale(0.8) translateY(20px)' : 'scale(1) translateY(0)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>

        {/* Ring animasi di belakang logo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            border: '1px solid rgba(122,184,64,0.2)',
            animation: 'ring-pulse 2s ease-in-out infinite',
          }} />
          <div style={{
            position: 'absolute',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            border: '1px solid rgba(122,184,64,0.15)',
            animation: 'ring-pulse 2s ease-in-out 0.3s infinite',
          }} />
          <img
            src={logo}
            alt="Webeans"
            style={{
              width: '72px',
              height: '72px',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </div>

        {/* Nama brand */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            color: '#c8e0a0',
            fontSize: '1.6rem',
            letterSpacing: '8px',
            fontWeight: '700',
            marginBottom: '8px',
          }}>
            WEBEANS
          </p>
          <p style={{
            color: 'rgba(160,210,100,0.4)',
            fontSize: '0.78rem',
            letterSpacing: '2px',
            fontWeight: '300',
          }}>
            Your coffee journey starts here.
          </p>
        </div>
      </div>

      {/* Loading bar bawah */}
      <div style={{
        position: 'absolute',
        bottom: '48px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120px',
        height: '1px',
        background: 'rgba(122,184,64,0.15)',
        borderRadius: '1px',
        overflow: 'hidden',
        opacity: phase === 'enter' ? 0 : 1,
        transition: 'opacity 0.4s ease 0.4s',
      }}>
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, transparent, #7ab840, transparent)',
          borderRadius: '1px',
          animation: 'loading-sweep 1.2s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400&display=swap');
        @keyframes ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes loading-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}