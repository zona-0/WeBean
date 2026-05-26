import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const roleLabel = { user: 'User', admin: 'Admin', super_admin: 'Head Admin' };

const roleColor = {
  user: { bg: 'rgba(74,138,48,0.15)', color: '#7ab840', border: 'rgba(74,138,48,0.3)' },
  admin: { bg: 'rgba(56,138,221,0.15)', color: '#5aabf0', border: 'rgba(56,138,221,0.3)' },
  super_admin: { bg: 'rgba(160,80,255,0.15)', color: '#c080ff', border: 'rgba(160,80,255,0.3)' },
};

const statusColor = {
  active: { bg: 'rgba(74,138,48,0.12)', color: '#7ab840', border: 'rgba(74,138,48,0.25)' },
  pending: { bg: 'rgba(255,180,40,0.12)', color: '#ffb828', border: 'rgba(255,180,40,0.25)' },
  inactive: { bg: 'rgba(220,60,60,0.12)', color: '#e05555', border: 'rgba(220,60,60,0.25)' },
};

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const IconRefresh = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const IconUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

function ConfirmModal({ msg, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#0f1e14',
        border: '1px solid rgba(74,138,48,0.25)',
        borderRadius: 14,
        padding: '28px 32px',
        maxWidth: 360, width: '90%',
        textAlign: 'center',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,180,40,0.12)',
          border: '1px solid rgba(255,180,40,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#ffb828', fontSize: '1.2rem',
        }}>!</div>
        <p style={{ color: '#c8e0a0', fontSize: '0.9rem', fontWeight: 600, marginBottom: 8, fontFamily: 'DM Sans, sans-serif' }}>
          Confirm Action
        </p>
        <p style={{ color: 'rgba(160,210,100,0.5)', fontSize: '0.82rem', marginBottom: 24, fontFamily: 'DM Sans, sans-serif' }}>
          {msg}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '9px 20px',
              background: 'transparent',
              border: '1px solid rgba(160,210,100,0.2)',
              borderRadius: 8,
              color: 'rgba(160,210,100,0.5)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '9px 20px',
              background: 'rgba(74,138,48,0.2)',
              border: '1px solid rgba(74,138,48,0.4)',
              borderRadius: 8,
              color: '#7ab840',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(74,138,48,0.15)',
      borderRadius: 12,
      padding: '18px 20px',
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: color || 'linear-gradient(90deg, #4a8a30, #7ab840)',
      }} />
      <p style={{ color: 'rgba(160,210,100,0.45)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', margin: '0 0 8px', fontFamily: 'DM Sans, sans-serif' }}>
        {label}
      </p>
      <p style={{ color: '#c8e0a0', fontSize: '1.8rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', margin: '0 0 4px', lineHeight: 1 }}>
        {value}
      </p>
      {sub && (
        <p style={{ color: 'rgba(160,210,100,0.35)', fontSize: '0.7rem', margin: 0, fontFamily: 'DM Sans, sans-serif' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function Badge({ label, style: sc }) {
  return (
    <span style={{
      background: sc.bg,
      color: sc.color,
      border: `1px solid ${sc.border}`,
      fontSize: '0.62rem',
      fontWeight: 600,
      padding: '3px 9px',
      borderRadius: 4,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      fontFamily: 'DM Sans, sans-serif',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

export default function AdminPanel() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [confirm, setConfirm] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    console.log('[ADMIN] fetching users');

    try {
      const [allRes, pendRes] = await Promise.all([
        axios.get(`${API}/users`, { headers }),
        axios.get(`${API}/users/pending`, { headers }),
      ]);
      setUsers(allRes.data);
      setPending(pendRes.data);
      console.log('[ADMIN] users:', allRes.data.length, 'pending:', pendRes.data.length);
    } catch (err) {
      console.log('[ADMIN] fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const approveUser = async (id) => {
    console.log('[ADMIN] approve user:', id);
    try {
      await axios.patch(`${API}/users/${id}/status`, { status: 'active' }, { headers });
      showMsg('success', 'Account approved successfully');
      fetchAll(true);
    } catch (err) {
      showMsg('error', 'Failed to approve account');
    }
  };

  const rejectUser = async (id) => {
    console.log('[ADMIN] reject user:', id);
    try {
      await axios.patch(`${API}/users/${id}/status`, { status: 'inactive' }, { headers });
      showMsg('success', 'Account rejected');
      fetchAll(true);
    } catch (err) {
      showMsg('error', 'Failed to reject account');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log('[ADMIN] toggle status:', id, currentStatus, newStatus);
    try {
      await axios.patch(`${API}/users/${id}/status`, { status: newStatus }, { headers });
      showMsg('success', `Account ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      fetchAll(true);
    } catch (err) {
      showMsg('error', 'Failed to update status');
    }
  };

  const changeRole = async (id, role) => {
    console.log('[ADMIN] change role:', id, role);
    try {
      await axios.patch(`${API}/users/${id}/role`, { role }, { headers });
      showMsg('success', 'Role updated successfully');
      fetchAll(true);
    } catch (err) {
      showMsg('error', 'Failed to update role');
    }
  };

  const deleteUser = async (id) => {
    console.log('[ADMIN] delete user:', id);
    try {
      await axios.delete(`${API}/users/${id}`, { headers });
      showMsg('success', 'User deleted successfully');
      fetchAll(true);
    } catch (err) {
      showMsg('error', 'Failed to delete user');
    }
  };

  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;

  const tabs = [
    { id: 'pending', label: 'Pending Approval', count: pending.length },
    { id: 'users', label: 'All Users', count: users.length },
  ];

  const thStyle = {
    padding: '12px 16px',
    textAlign: 'left',
    color: 'rgba(160,210,100,0.4)',
    fontSize: '0.62rem',
    fontWeight: 600,
    letterSpacing: '1.2px',
    textTransform: 'uppercase',
    fontFamily: 'DM Sans, sans-serif',
    borderBottom: '1px solid rgba(74,138,48,0.1)',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '13px 16px',
    fontSize: '0.82rem',
    fontFamily: 'DM Sans, sans-serif',
    borderBottom: '1px solid rgba(74,138,48,0.06)',
  };

  const selectStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(74,138,48,0.2)',
    borderRadius: 6,
    padding: '5px 8px',
    fontSize: '0.72rem',
    color: '#c8e0a0',
    fontFamily: 'DM Sans, sans-serif',
    cursor: 'pointer',
    outline: 'none',
  };

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', color: '#c8e0a0' }}>

      {confirm && (
        <ConfirmModal
          msg={confirm.msg}
          onConfirm={() => { confirm.action(); setConfirm(null); }}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#c8e0a0', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 4px' }}>
              User Management
            </h2>
            <p style={{ color: 'rgba(160,210,100,0.4)', fontSize: '0.78rem', margin: 0 }}>
              Manage accounts and access permissions
            </p>
          </div>
          <button
            onClick={() => fetchAll(true)}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px',
              background: 'rgba(74,138,48,0.1)',
              border: '1px solid rgba(74,138,48,0.25)',
              borderRadius: 8,
              color: '#7ab840',
              fontSize: '0.78rem',
              fontWeight: 500,
              cursor: refreshing ? 'not-allowed' : 'pointer',
              opacity: refreshing ? 0.6 : 1,
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ display: 'inline-flex', animation: refreshing ? 'spin 1s linear infinite' : 'none' }}>
              <IconRefresh />
            </span>
            Refresh
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <StatCard
          label="Total Users"
          value={users.length}
          sub="Registered accounts"
          color="linear-gradient(90deg, #4a8a30, #7ab840)"
        />
        <StatCard
          label="Active"
          value={activeUsers}
          sub="Active accounts"
          color="linear-gradient(90deg, #2a8a60, #40c090)"
        />
        <StatCard
          label="Pending"
          value={pending.length}
          sub="Awaiting approval"
          color="linear-gradient(90deg, #a07020, #ffb828)"
        />
        <StatCard
          label="Inactive"
          value={inactiveUsers}
          sub="Deactivated accounts"
          color="linear-gradient(90deg, #902020, #e05555)"
        />
      </div>

      {msg.text && (
        <div style={{
          background: msg.type === 'error' ? 'rgba(220,60,60,0.1)' : 'rgba(74,138,48,0.1)',
          border: `1px solid ${msg.type === 'error' ? 'rgba(220,60,60,0.3)' : 'rgba(74,138,48,0.3)'}`,
          borderRadius: 8,
          padding: '10px 16px',
          color: msg.type === 'error' ? '#e05555' : '#7ab840',
          fontSize: '0.82rem',
          marginBottom: 14,
        }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {tabs.map(({ id, label, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              padding: '8px 18px',
              border: activeTab === id ? '1px solid rgba(74,138,48,0.4)' : '1px solid rgba(74,138,48,0.1)',
              borderRadius: 8,
              background: activeTab === id ? 'rgba(74,138,48,0.15)' : 'transparent',
              color: activeTab === id ? '#7ab840' : 'rgba(160,210,100,0.4)',
              fontSize: '0.78rem',
              fontWeight: activeTab === id ? 600 : 400,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
            }}
          >
            {id === 'pending' ? <IconClock /> : <IconUsers />}
            {label}
            {count > 0 && (
              <span style={{
                background: id === 'pending' && count > 0 ? 'rgba(255,180,40,0.2)' : 'rgba(74,138,48,0.2)',
                color: id === 'pending' && count > 0 ? '#ffb828' : '#7ab840',
                border: `1px solid ${id === 'pending' && count > 0 ? 'rgba(255,180,40,0.3)' : 'rgba(74,138,48,0.3)'}`,
                borderRadius: 10,
                padding: '1px 7px',
                fontSize: '0.62rem',
                fontWeight: 700,
              }}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(74,138,48,0.15)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'rgba(160,210,100,0.4)', fontSize: '0.875rem' }}>
            Loading...
          </div>
        ) : (
          <>
            {activeTab === 'pending' && (
              <>
                {pending.length === 0 ? (
                  <div style={{ padding: '48px', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(160,210,100,0.3)', fontSize: '0.875rem', margin: 0 }}>
                      No pending accounts
                    </p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={thStyle}>User</th>
                          <th style={thStyle}>Email</th>
                          <th style={thStyle}>Registered</th>
                          <th style={thStyle}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pending.map((u) => (
                          <tr key={u.id} style={{ transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,138,48,0.04)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                  width: 32, height: 32, borderRadius: '50%',
                                  background: 'rgba(74,138,48,0.15)',
                                  border: '1px solid rgba(74,138,48,0.25)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  color: '#7ab840', fontSize: '0.82rem', fontWeight: 700,
                                  flexShrink: 0,
                                }}>
                                  {u.username?.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ color: '#c8e0a0', fontWeight: 500 }}>{u.username}</span>
                              </div>
                            </td>
                            <td style={{ ...tdStyle, color: 'rgba(160,210,100,0.55)' }}>{u.email}</td>
                            <td style={{ ...tdStyle, color: 'rgba(160,210,100,0.35)', fontSize: '0.75rem' }}>
                              {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={tdStyle}>
                              <div style={{ display: 'flex', gap: 8 }}>
                                <button
                                  onClick={() => setConfirm({ msg: `Approve ${u.username}'s account?`, action: () => approveUser(u.id) })}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    padding: '6px 12px',
                                    background: 'rgba(74,138,48,0.15)',
                                    border: '1px solid rgba(74,138,48,0.3)',
                                    borderRadius: 6,
                                    color: '#7ab840',
                                    fontSize: '0.72rem', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                                  }}
                                >
                                  <IconCheck /> Approve
                                </button>
                                <button
                                  onClick={() => setConfirm({ msg: `Reject ${u.username}'s account?`, action: () => rejectUser(u.id) })}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    padding: '6px 12px',
                                    background: 'rgba(220,60,60,0.1)',
                                    border: '1px solid rgba(220,60,60,0.25)',
                                    borderRadius: 6,
                                    color: '#e05555',
                                    fontSize: '0.72rem', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                                  }}
                                >
                                  <IconX /> Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {activeTab === 'users' && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>User</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Status</th>
                      <th style={thStyle}>Joined</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => {
                      const rc = roleColor[u.role] || roleColor.user;
                      const sc = statusColor[u.status] || statusColor.active;
                      const statusLabel = u.status === 'active' ? 'Active' : u.status === 'pending' ? 'Pending' : 'Inactive';

                      return (
                        <tr
                          key={u.id}
                          style={{ transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,138,48,0.04)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: rc.bg,
                                border: `1px solid ${rc.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: rc.color, fontSize: '0.82rem', fontWeight: 700,
                                flexShrink: 0,
                              }}>
                                {u.username?.charAt(0).toUpperCase()}
                              </div>
                              <span style={{ color: '#c8e0a0', fontWeight: 500 }}>{u.username}</span>
                            </div>
                          </td>
                          <td style={{ ...tdStyle, color: 'rgba(160,210,100,0.55)' }}>{u.email}</td>
                          <td style={tdStyle}>
                            <select
                              value={u.role}
                              onChange={e => {
                                const newRole = e.target.value;
                                setConfirm({
                                  msg: `Change ${u.username}'s role to ${roleLabel[newRole]}?`,
                                  action: () => changeRole(u.id, newRole),
                                });
                              }}
                              style={{ ...selectStyle, color: rc.color, borderColor: rc.border, background: rc.bg }}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                              <option value="super_admin">Head Admin</option>
                            </select>
                          </td>
                          <td style={tdStyle}>
                            <Badge label={statusLabel} style={sc} />
                          </td>
                          <td style={{ ...tdStyle, color: 'rgba(160,210,100,0.35)', fontSize: '0.75rem' }}>
                            {new Date(u.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={tdStyle}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                onClick={() => setConfirm({
                                  msg: `${u.status === 'active' ? 'Deactivate' : 'Activate'} ${u.username}'s account?`,
                                  action: () => toggleStatus(u.id, u.status),
                                })}
                                style={{
                                  padding: '5px 10px',
                                  background: u.status === 'active' ? 'rgba(255,180,40,0.1)' : 'rgba(74,138,48,0.1)',
                                  border: `1px solid ${u.status === 'active' ? 'rgba(255,180,40,0.25)' : 'rgba(74,138,48,0.25)'}`,
                                  borderRadius: 6,
                                  color: u.status === 'active' ? '#ffb828' : '#7ab840',
                                  fontSize: '0.7rem', fontWeight: 600,
                                  cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {u.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => setConfirm({
                                  msg: `Permanently delete ${u.username}?`,
                                  action: () => deleteUser(u.id),
                                })}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  width: 30, height: 30,
                                  background: 'rgba(220,60,60,0.08)',
                                  border: '1px solid rgba(220,60,60,0.2)',
                                  borderRadius: 6,
                                  color: '#e05555',
                                  cursor: 'pointer',
                                }}
                              >
                                <IconTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}