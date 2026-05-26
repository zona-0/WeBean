import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconLockSmall = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const IconEdit = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconEyeOn = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconEyeOff = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function BlurredValue({ value, revealed, onToggle }) {
  if (!value) return <span style={{ color: '#c8dab8' }}>Belum diisi</span>;
  return (
    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{
        filter: revealed ? 'none' : 'blur(5px)',
        userSelect: revealed ? 'auto' : 'none',
        transition: 'filter 0.3s ease',
        color: '#0d1f0d',
        fontSize: '0.875rem',
      }}>
        {value}
      </span>
      <button
        onClick={onToggle}
        style={{
          background: '#f0f4eb', border: '1px solid #dde8cc', borderRadius: 6,
          padding: '3px 8px', cursor: 'pointer', color: '#7a9a6a',
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: '0.68rem', fontWeight: 500, fontFamily: 'DM Sans, sans-serif',
          flexShrink: 0, marginLeft: 12,
        }}
      >
        {revealed ? <IconEyeOff /> : <IconEyeOn />}
        {revealed ? 'Sembunyikan' : 'Tampilkan'}
      </button>
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f5f8f2' }}>
      <span style={{ color: '#9ab88a', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', minWidth: 140, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: '#0d1f0d', fontSize: '0.875rem', fontWeight: 400, flex: 1, display: 'flex', alignItems: 'center' }}>
        {value}
      </span>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', color: '#3a5a2a', fontSize: '0.67rem', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Section({ title, sub, IconComponent, iconColor, onEdit, editing, onCancel, onSave, saving, editLabel = 'Edit', children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: '22px 24px', border: '1px solid #dde8cc', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #eef5e8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconComponent />
          </div>
          <div>
            <p style={{ color: '#0d1f0d', fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{title}</p>
            <p style={{ color: '#9ab88a', fontSize: '0.72rem', margin: 0, fontWeight: 300 }}>{sub}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {editing ? (
            <>
              <button onClick={onCancel} style={{ padding: '7px 14px', background: 'transparent', border: '1px solid #dde8cc', borderRadius: 7, color: '#9ab88a', fontSize: '0.78rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Batal
              </button>
              <button onClick={onSave} disabled={saving} style={{ padding: '7px 14px', background: '#0d1f0d', border: 'none', borderRadius: 7, color: '#c8e0a0', fontSize: '0.78rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1, fontFamily: 'DM Sans, sans-serif' }}>
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </>
          ) : (
            <button onClick={onEdit} style={{ padding: '7px 14px', background: '#f0f4eb', border: '1px solid #dde8cc', borderRadius: 7, color: '#3a5a2a', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}>
              <IconEdit />
              {editLabel}
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showDob, setShowDob] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    console.log('[PROFILE] fetching...');
    try {
      const res = await axios.get('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[PROFILE] loaded:', res.data.username);
      setProfile(res.data);
    } catch (err) {
      console.log('[PROFILE] fetch failed ->', err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (section) => {
    setMsg({ type: '', text: '' });
    if (section === 'basic') setForm({ username: profile.username, email: profile.email });
    else if (section === 'personal') setForm({ dob: profile.dob?.split('T')[0] || '' });
    else if (section === 'security') setForm({ secretQuestion: profile.secret_question || '', secretAnswer: '' });
    else if (section === 'password') setForm({ currentPassword: '', newPassword: '', confirmNew: '' });
    setEditMode(section);
  };

  const cancelEdit = () => {
    setEditMode(null);
    setForm({});
    setMsg({ type: '', text: '' });
  };

  const saveEdit = async () => {
    setSaving(true);
    setMsg({ type: '', text: '' });
    console.log('[PROFILE] saving section:', editMode);
    try {
      let payload = {};
      if (editMode === 'basic') {
        if (!form.username || !form.email) { setMsg({ type: 'error', text: 'Username dan email wajib diisi' }); setSaving(false); return; }
        payload = { username: form.username, email: form.email };
      } else if (editMode === 'personal') {
        payload = { dob: form.dob };
      } else if (editMode === 'security') {
        if (!form.secretAnswer) { setMsg({ type: 'error', text: 'Jawaban keamanan wajib diisi' }); setSaving(false); return; }
        payload = { secretQuestion: form.secretQuestion, secretAnswer: form.secretAnswer };
      } else if (editMode === 'password') {
        if (form.newPassword.length < 6) { setMsg({ type: 'error', text: 'Password baru minimal 6 karakter' }); setSaving(false); return; }
        if (form.newPassword !== form.confirmNew) { setMsg({ type: 'error', text: 'Konfirmasi password tidak cocok' }); setSaving(false); return; }
        payload = { currentPassword: form.currentPassword, newPassword: form.newPassword };
      }
      await axios.patch('http://localhost:5000/api/users/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[PROFILE] save success');
      setMsg({ type: 'success', text: 'Perubahan berhasil disimpan' });
      await fetchProfile();
      setTimeout(() => { setEditMode(null); setMsg({ type: '', text: '' }); }, 1500);
    } catch (err) {
      const m = err.response?.data?.message || 'Gagal menyimpan perubahan';
      console.log('[PROFILE] save failed ->', m);
      setMsg({ type: 'error', text: m });
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = { user: 'User', admin: 'Admin', super_admin: 'Super Admin' };
  const roleColor = {
    user: { bg: '#eef8e6', color: '#2d6a10' },
    admin: { bg: '#e8f0ff', color: '#2050a0' },
    super_admin: { bg: '#f5ecff', color: '#6020a0' },
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <p style={{ color: '#9ab88a', fontSize: '0.875rem' }}>Memuat profil...</p>
      </div>
    );
  }

  const rc = roleColor[profile?.role] || roleColor.user;

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', fontFamily: 'DM Sans, sans-serif' }}>

      <div style={{
        background: 'linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 45%, #3d7a3d 80%, #2a5a2a 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 14,
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: 24,
      }}>
        <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(122,184,64,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 200, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(160,210,80,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{
          width: 68, height: 68, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(122,184,64,0.25), rgba(74,138,48,0.35))',
          border: '2px solid rgba(160,210,100,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Playfair Display, serif',
          color: '#d8f0a8', fontSize: '1.7rem', fontWeight: 700,
          flexShrink: 0, position: 'relative', zIndex: 1,
          boxShadow: '0 0 0 4px rgba(122,184,64,0.1)',
        }}>
          {profile?.username?.charAt(0).toUpperCase()}
        </div>

        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#e8f5d0', fontSize: '1.5rem', fontWeight: 700, margin: '0 0 6px' }}>
            {profile?.username}
          </h2>
          <p style={{ color: 'rgba(210,240,160,0.65)', fontSize: '0.85rem', fontWeight: 300, margin: 0 }}>
            {profile?.email}
          </p>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(160,210,100,0.2)', borderRadius: 12, padding: '14px 22px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(160,210,100,0.5)', fontSize: '0.6rem', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', margin: '0 0 5px' }}>Role</p>
            <span style={{ background: rc.bg, color: rc.color, fontSize: '0.65rem', fontWeight: 700, padding: '4px 12px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
              {roleLabel[profile?.role]}
            </span>
          </div>
        </div>
      </div>

      {msg.text && (
        <div style={{
          background: msg.type === 'error' ? '#fff5f5' : '#f2faf0',
          borderLeft: `3px solid ${msg.type === 'error' ? '#e05050' : '#4a8a30'}`,
          borderRadius: '0 8px 8px 0', padding: '10px 16px',
          color: msg.type === 'error' ? '#c0392b' : '#2d5a10',
          fontSize: '0.82rem', marginBottom: 12,
        }}>
          {msg.text}
        </div>
      )}

      <Section
        title="Informasi Akun"
        sub="Edit username dan email"
        IconComponent={IconUser}
        iconColor="#eef8e6"
        onEdit={() => startEdit('basic')}
        editing={editMode === 'basic'}
        onCancel={cancelEdit}
        onSave={saveEdit}
        saving={saving}
      >
        {editMode === 'basic' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Username">
              <input className="profile-input" value={form.username || ''} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Username baru" />
            </FormField>
            <FormField label="Email">
              <input className="profile-input" type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email baru" />
            </FormField>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <div style={{ flex: 1, padding: '6px 16px 6px 0' }}>
              <p style={{ color: '#9ab88a', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 5px' }}>Username</p>
              <p style={{ color: '#0d1f0d', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>{profile?.username}</p>
            </div>
            <div style={{ width: 1, height: 44, background: '#eef5e8', flexShrink: 0 }} />
            <div style={{ flex: 2, padding: '6px 16px' }}>
              <p style={{ color: '#9ab88a', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 5px' }}>Email</p>
              <p style={{ color: '#0d1f0d', fontSize: '0.95rem', fontWeight: 500, margin: 0 }}>{profile?.email}</p>
            </div>
            <div style={{ width: 1, height: 44, background: '#eef5e8', flexShrink: 0 }} />
            <div style={{ padding: '6px 0 6px 16px' }}>
              <p style={{ color: '#9ab88a', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase', margin: '0 0 5px' }}>Role</p>
              <span style={{ background: rc.bg, color: rc.color, fontSize: '0.62rem', fontWeight: 700, padding: '3px 9px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 1 }}>
                {roleLabel[profile?.role]}
              </span>
            </div>
          </div>
        )}
      </Section>

      <Section
        title="Data Personal"
        sub="Tanggal lahir dan informasi pribadi"
        IconComponent={IconCalendar}
        iconColor="#fff4ec"
        onEdit={() => startEdit('personal')}
        editing={editMode === 'personal'}
        onCancel={cancelEdit}
        onSave={saveEdit}
        saving={saving}
      >
        {editMode === 'personal' ? (
          <FormField label="Tanggal Lahir">
            <input className="profile-input" type="date" value={form.dob || ''} onChange={e => setForm({ ...form, dob: e.target.value })} style={{ colorScheme: 'light' }} />
          </FormField>
        ) : (
          <InfoRow
            label="Tanggal Lahir"
            value={
              profile?.dob
                ? <BlurredValue
                    value={new Date(profile.dob).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    revealed={showDob}
                    onToggle={() => setShowDob(!showDob)}
                  />
                : <span style={{ color: '#c8dab8' }}>Belum diisi</span>
            }
          />
        )}
      </Section>

      <Section
        title="Keamanan Akun"
        sub="Pertanyaan dan jawaban pemulihan akun"
        IconComponent={IconShield}
        iconColor="#f0ecff"
        onEdit={() => startEdit('security')}
        editing={editMode === 'security'}
        onCancel={cancelEdit}
        onSave={saveEdit}
        saving={saving}
      >
        {editMode === 'security' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Pertanyaan Keamanan">
              <select className="profile-input" value={form.secretQuestion || ''} onChange={e => setForm({ ...form, secretQuestion: e.target.value })}>
                {['q1?','q2?','q3?'].map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Jawaban Baru">
              <input className="profile-input" type="text" placeholder="Jawaban keamanan baru" value={form.secretAnswer || ''} onChange={e => setForm({ ...form, secretAnswer: e.target.value })} />
            </FormField>
          </div>
        ) : (
          <>
            <InfoRow
              label="Pertanyaan"
              value={profile?.secret_question || <span style={{ color: '#c8dab8' }}>Belum diisi</span>}
            />
            <InfoRow
              label="Jawaban"
              value={
                <BlurredValue
                  value={profile?.secret_answer}
                  revealed={showAnswer}
                  onToggle={() => setShowAnswer(!showAnswer)}
                />
              }
            />
          </>
        )}
      </Section>

      <Section
        title="Ganti Password"
        sub="Perbarui password akun kamu"
        IconComponent={IconLock}
        iconColor="#fff0f0"
        onEdit={() => startEdit('password')}
        editing={editMode === 'password'}
        onCancel={cancelEdit}
        onSave={saveEdit}
        saving={saving}
        editLabel="Ganti Password"
      >
        {editMode === 'password' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FormField label="Password Saat Ini">
              <input className="profile-input" type="password" placeholder="••••••••" value={form.currentPassword || ''} onChange={e => setForm({ ...form, currentPassword: e.target.value })} />
            </FormField>
            <FormField label="Password Baru">
              <input className="profile-input" type="password" placeholder="Min. 6 karakter" value={form.newPassword || ''} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
            </FormField>
            <FormField label="Konfirmasi Password Baru">
              <input
                className="profile-input"
                type="password"
                placeholder="Ulangi password baru"
                value={form.confirmNew || ''}
                onChange={e => setForm({ ...form, confirmNew: e.target.value })}
                style={{ borderColor: form.confirmNew ? (form.newPassword === form.confirmNew ? '#4a8a30' : '#e05050') : '#c8dab8' }}
              />
              {form.confirmNew && form.newPassword !== form.confirmNew && (
                <p style={{ color: '#c0392b', fontSize: '0.7rem', marginTop: 4 }}>Password tidak cocok</p>
              )}
            </FormField>
          </div>
        ) : (
          <InfoRow
            label="Password"
            value={
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ letterSpacing: 3, color: '#c8dab8', fontSize: '1rem' }}>••••••••••</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f0f4eb', border: '1px solid #dde8cc', borderRadius: 6, padding: '4px 10px', color: '#9ab88a' }}>
                  <IconLockSmall />
                  <span style={{ fontSize: '0.65rem', fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}>Terenkripsi</span>
                </span>
              </span>
            }
          />
        )}
      </Section>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .profile-input {
          width: 100%;
          background: #f8faf4;
          border: 1.5px solid #c8dab8;
          border-radius: 8px;
          padding: 11px 14px;
          color: #0d1f0d;
          font-size: 0.875rem;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .profile-input:focus {
          border-color: #4a8a30;
          box-shadow: 0 0 0 3px rgba(74,138,48,0.08);
        }
      `}</style>
    </div>
  );
}