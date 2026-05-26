import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import '../styles/auth.css';

const SECRET_QUESTIONS = [
  'Nama hewan peliharaan pertama kamu?',
  'Nama ibu kandung kamu?',
  'Kota kelahiran kamu?',
  'Nama sekolah dasar kamu?',
  'Makanan favorit kamu?',
];

export default function Login() {
  const [activeTab, setActiveTab] = useState('login');
  const [direction, setDirection] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [regForm, setRegForm] = useState({ username: '', email: '', password: '', confirmPassword: '', dob: '', secretQuestion: '', secretAnswer: '' });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [pwMatch, setPwMatch] = useState(null);

  const [forgotStep, setForgotStep] = useState(1);
  const [forgotForm, setForgotForm] = useState({ email: '', secretAnswer: '', newPassword: '', confirmNew: '' });
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [userSecretQuestion, setUserSecretQuestion] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    const tabs = ['login', 'register'];
    const from = tabs.indexOf(activeTab);
    const to = tabs.indexOf(tab);
    setDirection(to > from ? 'slide-left' : 'slide-right');
    setShowForgot(false);
    setTimeout(() => {
      setActiveTab(tab);
      setDirection('');
    }, 20);
  };

  const openForgot = () => {
    setShowForgot(true);
    setForgotStep(1);
    setForgotForm({ email: '', secretAnswer: '', newPassword: '', confirmNew: '' });
    setForgotError('');
    setForgotSuccess('');
    setUserSecretQuestion('');
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotStep(1);
    setForgotError('');
    setForgotSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    console.log('[LOGIN] submit -> email:', loginForm.email);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', loginForm);
      console.log('[LOGIN] success -> user:', res.data.user.username);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan';
      console.log('[LOGIN] failed ->', msg);
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...regForm, [name]: value };
    setRegForm(updated);
    if (name === 'password' || name === 'confirmPassword') {
      const p1 = name === 'password' ? value : updated.password;
      const p2 = name === 'confirmPassword' ? value : updated.confirmPassword;
      setPwMatch(p2.length > 0 ? p1 === p2 : null);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    if (regForm.password !== regForm.confirmPassword) return setRegError('Password tidak cocok');
    if (regForm.password.length < 6) return setRegError('Password minimal 6 karakter');
    if (!regForm.secretQuestion || !regForm.secretAnswer) return setRegError('Pertanyaan keamanan wajib diisi');
    setRegLoading(true);
    console.log('[REGISTER] submit -> username:', regForm.username);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username: regForm.username,
        email: regForm.email,
        password: regForm.password,
        dob: regForm.dob,
        secretQuestion: regForm.secretQuestion,
        secretAnswer: regForm.secretAnswer,
      });
      console.log('[REGISTER] success');
      setRegSuccess(res.data.message);
      setTimeout(() => switchTab('login'), 1800);
    } catch (err) {
      const msg = err.response?.data?.message || 'Terjadi kesalahan';
      console.log('[REGISTER] failed ->', msg);
      setRegError(msg);
    } finally {
      setRegLoading(false);
    }
  };

  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    console.log('[FORGOT] checking email:', forgotForm.email);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-check', { email: forgotForm.email });
      console.log('[FORGOT] secret question retrieved');
      setUserSecretQuestion(res.data.secretQuestion);
      setForgotStep(2);
    } catch (err) {
      const msg = err.response?.data?.message || 'Email tidak ditemukan';
      console.log('[FORGOT] step1 failed ->', msg);
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setForgotError('');
    if (forgotForm.newPassword !== forgotForm.confirmNew) return setForgotError('Password tidak cocok');
    if (forgotForm.newPassword.length < 6) return setForgotError('Password minimal 6 karakter');
    setForgotLoading(true);
    console.log('[FORGOT] resetting password...');
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-reset', {
        email: forgotForm.email,
        secretAnswer: forgotForm.secretAnswer,
        newPassword: forgotForm.newPassword,
      });
      console.log('[FORGOT] password reset success');
      setForgotSuccess('Password berhasil diperbarui. Silakan login.');
      setTimeout(() => {
        closeForgot();
        setActiveTab('login');
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Jawaban keamanan salah';
      console.log('[FORGOT] step2 failed ->', msg);
      setForgotError(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const leftContent = {
    login: {
      eyebrow: 'Platform Kopi Digital',
      title: <><>Kelola kebun</>  <em>lebih cerdas.</em></>,
      desc: 'Pantau panen, suhu, kelembapan, dan profil pekebun dalam satu platform terintegrasi berbasis IoT dan Machine Learning.',
      features: ['Monitoring kualitas panen real-time', 'Sensor suhu dan kelembapan otomatis', 'Analisis ML kualitas hasil panen', 'Laporan dan analitik terpadu'],
    },
    register: {
      eyebrow: 'Bergabung Sekarang',
      title: <><>Mulai perjalanan</> <em>kopi kamu.</em></>,
      desc: 'Daftar gratis dan dapatkan akses penuh ke semua fitur monitoring perkebunan kopi berbasis IoT.',
      features: ['Gratis tanpa biaya pendaftaran', 'Data aman dan terenkripsi', 'Akses dari mana saja', 'Dukungan pengguna penuh'],
    },
  };

  const lc = leftContent[activeTab];

  return (
    <div className="auth-page">
      
      <div className="auth-left">
        <div className="auth-left-bg" />
        <img src={logo} alt="" className="auth-left-bg-logo" aria-hidden="true" />
        <div className="auth-left-content">
          <div className="auth-brand">
            <img src={logo} alt="Webeans" className="auth-brand-logo" />
            <span className="auth-brand-name">WEBEANS</span>
          </div>
          <div className="auth-left-eyebrow">
            <div className="auth-left-eyebrow-line" />
            <span className="auth-left-eyebrow-text">{lc.eyebrow}</span>
          </div>
          <h2 className="auth-left-title">{lc.title}</h2>
          <p className="auth-left-desc">{lc.desc}</p>
          <div className="auth-left-features">
            {lc.features.map(f => (
              <div key={f} className="auth-left-feature-item">
                <div className="auth-left-feature-dot" />
                <span className="auth-left-feature-text">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-top-bar" />

        <div className="auth-right-inner">

          {!showForgot ? (
            <>
              <div className="auth-tab-nav">
                <button className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => switchTab('login')}>
                  Masuk
                </button>
                <button className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>
                  Daftar
                </button>
              </div>

              <div className={`auth-panel-wrap ${direction}`}>

                {/* LOGIN */}
                {activeTab === 'login' && (
                  <div className="auth-panel">
                    <h1 className="auth-form-title">Selamat datang kembali</h1>
                    <p className="auth-form-sub">Masuk untuk melanjutkan perjalanan kopi kamu</p>

                    {loginError && <div className="auth-alert-error">{loginError}</div>}

                    <form onSubmit={handleLogin}>
                      <div className="auth-field">
                        <label className="auth-label">Email</label>
                        <input
                          type="email"
                          placeholder="webeanscps@email.com"
                          value={loginForm.email}
                          onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                          className="auth-input"
                        />
                      </div>
                      <div className="auth-field">
                        <label className="auth-label">Password</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                          className="auth-input"
                        />
                      </div>

                      <button type="submit" disabled={loginLoading} className="auth-btn">
                        {loginLoading ? 'Memproses...' : 'Masuk'}
                      </button>
                    </form>

                    <div className="auth-login-footer">
                      <button className="auth-forgot-link" onClick={openForgot}>
                        Lupa password?
                      </button>
                      <button className="auth-text-btn" onClick={() => switchTab('register')}>
                        Belum punya akun? <strong>Daftar</strong>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'register' && (
                  <div className="auth-panel">
                    <h1 className="auth-form-title">Daftar sekarang</h1>
                    <p className="auth-form-sub">Isi data diri kamu untuk memulai perjalanan</p>

                    {regError && <div className="auth-alert-error">{regError}</div>}
                    {regSuccess && <div className="auth-alert-success">{regSuccess}</div>}

                    <form onSubmit={handleRegister}>
                      <div className="auth-grid-2">
                        <div className="auth-field">
                          <label className="auth-label">Username</label>
                          <input name="username" type="text" placeholder="webean_user" value={regForm.username} onChange={handleRegChange} required className="auth-input" />
                        </div>
                        <div className="auth-field">
                          <label className="auth-label">Tanggal Lahir</label>
                          <input name="dob" type="date" value={regForm.dob} onChange={handleRegChange} required className="auth-input" style={{ colorScheme: 'light' }} />
                        </div>
                      </div>

                      <div className="auth-field">
                        <label className="auth-label">Email</label>
                        <input name="email" type="email" placeholder="webeanscps@email.com" value={regForm.email} onChange={handleRegChange} required className="auth-input" />
                      </div>

                      <div className="auth-grid-2">
                        <div className="auth-field">
                          <label className="auth-label">Password</label>
                          <input name="password" type="password" placeholder="Min. 6 karakter" value={regForm.password} onChange={handleRegChange} required className="auth-input" />
                        </div>
                        <div className="auth-field">
                          <label className="auth-label">Konfirmasi Password</label>
                          <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Ulangi password"
                            value={regForm.confirmPassword}
                            onChange={handleRegChange}
                            required
                            className={`auth-input ${pwMatch === false ? 'input-error' : pwMatch === true ? 'input-success' : ''}`}
                          />
                          {pwMatch !== null && (
                            <div className="pw-match-bar">
                              {[0,1,2,3].map(i => (
                                <div key={i} className={`pw-match-segment ${pwMatch ? 'active-success' : i < 2 ? 'active-error' : ''}`} />
                              ))}
                            </div>
                          )}
                          {pwMatch === false && <p className="pw-match-text hint-error"><span className="pw-match-leaf">🍂</span>Tidak cocok</p>}
                          {pwMatch === true && <p className="pw-match-text hint-success"><span className="pw-match-leaf">🌱</span>Cocok</p>}
                        </div>
                      </div>

                      <div className="auth-security-box">
                        <p className="auth-security-title">Keamanan Akun</p>
                        <div className="auth-field">
                          <label className="auth-label">Pertanyaan Keamanan</label>
                          <select name="secretQuestion" value={regForm.secretQuestion} onChange={handleRegChange} required className="auth-input">
                            <option value="">Pilih pertanyaan...</option>
                            {SECRET_QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                          </select>
                        </div>
                        <div className="auth-field" style={{ marginBottom: 0 }}>
                          <label className="auth-label">Jawaban Keamanan</label>
                          <input name="secretAnswer" type="text" placeholder="Jawaban kamu..." value={regForm.secretAnswer} onChange={handleRegChange} required className="auth-input" />
                        </div>
                      </div>

                      <button type="submit" disabled={regLoading || pwMatch === false} className="auth-btn">
                        {regLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                      </button>
                    </form>

                    <div className="auth-login-footer" style={{ justifyContent: 'flex-end' }}>
                      <button className="auth-text-btn" onClick={() => switchTab('login')}>
                        Sudah punya akun? <strong>Masuk</strong>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="auth-panel" style={{ animation: 'slideInFromRight 0.3s cubic-bezier(0.4,0,0.2,1) forwards' }}>

              <button
                onClick={closeForgot}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#7a9a6a', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'DM Sans, sans-serif', marginBottom: 24, padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Kembali ke login
              </button>

              <h1 className="auth-form-title">Lupa password</h1>
              <p className="auth-form-sub">
                {forgotStep === 1 ? 'Masukkan email akun kamu untuk melanjutkan' : 'Jawab pertanyaan keamanan dan buat password baru'}
              </p>

              <div className="auth-step-indicator">
                <div className={`auth-step ${forgotStep >= 1 ? 'active' : ''}`}>
                  <div className="auth-step-dot">1</div>
                  <span className="auth-step-label">Verifikasi Email</span>
                </div>
                <div className="auth-step-line" />
                <div className={`auth-step ${forgotStep >= 2 ? 'active' : ''}`}>
                  <div className="auth-step-dot">2</div>
                  <span className="auth-step-label">Reset Password</span>
                </div>
              </div>

              {forgotError && <div className="auth-alert-error">{forgotError}</div>}
              {forgotSuccess && <div className="auth-alert-success">{forgotSuccess}</div>}

              {forgotStep === 1 && (
                <form onSubmit={handleForgotStep1}>
                  <div className="auth-field">
                    <label className="auth-label">Email</label>
                    <input
                      type="email"
                      placeholder="webeanscps@email.com"
                      value={forgotForm.email}
                      onChange={e => setForgotForm({ ...forgotForm, email: e.target.value })}
                      required
                      className="auth-input"
                    />
                  </div>
                  <button type="submit" disabled={forgotLoading} className="auth-btn">
                    {forgotLoading ? 'Memeriksa...' : 'Lanjutkan'}
                  </button>
                </form>
              )}

              {forgotStep === 2 && (
                <form onSubmit={handleForgotStep2}>
                  <div className="auth-field">
                    <label className="auth-label">Pertanyaan Keamanan</label>
                    <div className="auth-question-box">{userSecretQuestion}</div>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">Jawaban Keamanan</label>
                    <input
                      type="text"
                      placeholder="Jawaban kamu..."
                      value={forgotForm.secretAnswer}
                      onChange={e => setForgotForm({ ...forgotForm, secretAnswer: e.target.value })}
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="auth-grid-2">
                    <div className="auth-field">
                      <label className="auth-label">Password Baru</label>
                      <input
                        type="password"
                        placeholder="Min. 6 karakter"
                        value={forgotForm.newPassword}
                        onChange={e => setForgotForm({ ...forgotForm, newPassword: e.target.value })}
                        required
                        className="auth-input"
                      />
                    </div>
                    <div className="auth-field">
                      <label className="auth-label">Konfirmasi</label>
                      <input
                        type="password"
                        placeholder="Ulangi password"
                        value={forgotForm.confirmNew}
                        onChange={e => setForgotForm({ ...forgotForm, confirmNew: e.target.value })}
                        required
                        className={`auth-input ${forgotForm.confirmNew ? (forgotForm.newPassword === forgotForm.confirmNew ? 'input-success' : 'input-error') : ''}`}
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={forgotLoading} className="auth-btn">
                    {forgotLoading ? 'Menyimpan...' : 'Reset Password'}
                  </button>
                  <button type="button" className="auth-btn-secondary" onClick={() => { setForgotStep(1); setForgotError(''); }}>
                    Kembali ke Step 1
                  </button>
                </form>
              )}

            </div>
          )}

        </div>
      </div>

    </div>
  );
}