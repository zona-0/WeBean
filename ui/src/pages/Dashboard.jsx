import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Splash from './Splash';
import Profile from './Profile';
import AdminPanel from './AdminPanel';
import logo from '../assets/logo.png';
import '../styles/dashboard.css';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';

const CHART_TYPES = [
  { id: 'donut', label: 'Donut' },
  { id: 'radial', label: 'Radial' },
  { id: 'bar', label: 'Bar' },
  { id: 'area', label: 'Area' },
];

const tooltipStyle = {
  background: '#0a1510',
  border: '1px solid rgba(74,138,48,0.25)',
  borderRadius: 8,
  fontSize: '0.78rem',
  color: '#c8e0a0',
  padding: '8px 12px',
};

const axisTickStyle = {
  fontSize: 10,
  fill: 'rgba(122,184,64,0.35)',
  fontFamily: 'DM Sans, sans-serif',
};

function AxisYTag({ text, color = '#7ab840' }) {
  const rgb = color === '#7ab840' ? '74,138,48' : color === '#e05555' ? '220,85,85' : '74,138,48';
  return (
    <span style={{
      display: 'inline-block',
      background: `rgba(${rgb},0.08)`,
      border: `1px solid ${color}35`,
      borderRadius: 5,
      padding: '2px 8px',
      fontSize: '0.6rem',
      fontWeight: 600,
      color: `${color}bb`,
      fontFamily: 'DM Sans, sans-serif',
      letterSpacing: '0.5px',
      boxShadow: `0 0 6px ${color}18`,
    }}>
      {text}
    </span>
  );
}

function AxisXTag({ text }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
      <span style={{
        display: 'inline-block',
        background: 'rgba(74,138,48,0.06)',
        border: '1px solid rgba(122,184,64,0.2)',
        borderRadius: 5,
        padding: '2px 8px',
        fontSize: '0.6rem',
        fontWeight: 600,
        color: 'rgba(122,184,64,0.45)',
        fontFamily: 'DM Sans, sans-serif',
        letterSpacing: '0.5px',
        boxShadow: '0 0 5px rgba(122,184,64,0.1)',
      }}>
        {text}
      </span>
    </div>
  );
}

function QualityChart({ type, good }) {
  const bad = Math.max(0, 100 - good);

  const donutData = [
    { name: 'Kualitas Baik', value: good, color: '#7ab840' },
    { name: 'Kualitas Buruk', value: bad, color: '#e05555' },
  ];

  const radialData = [
    { name: 'Kualitas Buruk', value: bad, fill: '#e05555' },
    { name: 'Kualitas Baik', value: good, fill: '#7ab840' },
  ];

  const barData = [
    { name: 'Kualitas Baik', value: good, fill: '#7ab840' },
    { name: 'Kualitas Buruk', value: bad, fill: '#e05555' },
  ];

  const areaData = [
    { name: 'T-2', good: Math.max(0, good - 5), bad: Math.max(0, bad - 3) },
    { name: 'T-1', good: Math.max(0, good - 2), bad: Math.max(0, bad + 2) },
    { name: 'Saat ini', good, bad },
  ];

  if (type === 'donut') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, width: '100%' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <ResponsiveContainer width={150} height={150}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%" cy="50%"
                innerRadius={44} outerRadius={68}
                paddingAngle={3}
                dataKey="value"
                startAngle={90} endAngle={-270}
              >
                {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(val, name) => [`${val}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ color: '#7ab840', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>{good}%</span>
            <span style={{ color: 'rgba(122,184,64,0.4)', fontSize: '0.58rem', letterSpacing: 1, textTransform: 'uppercase' }}>baik</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {[
            { label: 'Kualitas Baik', val: good, color: '#7ab840', bg: 'rgba(74,138,48,0.08)', border: 'rgba(74,138,48,0.15)' },
            { label: 'Kualitas Buruk', val: bad, color: '#e05555', bg: 'rgba(220,60,60,0.08)', border: 'rgba(220,60,60,0.15)' },
          ].map(({ label, val, color, bg, border }) => (
            <div key={label} style={{ background: bg, borderRadius: 8, padding: '10px 14px', border: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(160,210,100,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
              <span style={{ color, fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>{val}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'radial') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
        <ResponsiveContainer width={150} height={150}>
          <RadialBarChart cx="50%" cy="50%" innerRadius={28} outerRadius={68} data={radialData} startAngle={180} endAngle={-180}>
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'rgba(74,138,48,0.04)' }} />
            <Tooltip contentStyle={tooltipStyle} formatter={(val, name) => [`${val}%`, name]} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {[
            { label: 'Kualitas Baik', val: good, color: '#7ab840' },
            { label: 'Kualitas Buruk', val: bad, color: '#e05555' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(74,138,48,0.06)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ color: 'rgba(160,210,100,0.5)', fontSize: '0.75rem', flex: 1 }}>{label}</span>
              <span style={{ color, fontSize: '1rem', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>{val}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
          <AxisYTag text="Y: Persentase (%)" />
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={barData} barSize={44} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,138,48,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={axisTickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <Tooltip
              cursor={{ fill: 'rgba(74,138,48,0.06)' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={tooltipStyle}>
                      <p style={{ margin: '0 0 3px', color: '#c8e0a0', fontWeight: 600, fontSize: '0.75rem' }}>{label}</p>
                      <p style={{ margin: 0, color: payload[0]?.payload?.fill, fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>{payload[0]?.value}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={true}>
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <AxisXTag text="X: Jenis Kualitas" />
      </div>
    );
  }

  if (type === 'area') {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
          <AxisYTag text="Y: Persentase (%)" />
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <AreaChart data={areaData} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
            <defs>
              <linearGradient id="goodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7ab840" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7ab840" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="badGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e05555" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#e05555" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,138,48,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={axisTickStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
            <Tooltip contentStyle={tooltipStyle} formatter={(val, name) => [`${val}%`, name]} cursor={{ stroke: 'rgba(122,184,64,0.2)' }} />
            <Area type="monotone" dataKey="good" stroke="#7ab840" strokeWidth={2} fill="url(#goodGrad)" name="Kualitas Baik" />
            <Area type="monotone" dataKey="bad" stroke="#e05555" strokeWidth={2} fill="url(#badGrad)" name="Kualitas Buruk" />
          </AreaChart>
        </ResponsiveContainer>
        <AxisXTag text="X: Waktu Relatif" />
      </div>
    );
  }

  return null;
}

function TrendChart({ color, gradientId, dataKey, data, xLabel, yLabel }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
        <AxisYTag text={`Y: ${yLabel}`} color={color} />
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,138,48,0.05)" vertical={false} />
          <XAxis dataKey="label" tick={axisTickStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisTickStyle} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
          <Tooltip contentStyle={tooltipStyle} formatter={(val) => [`${val}%`]} cursor={{ stroke: `${color}40` }} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={{ fill: color, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color, stroke: 'rgba(0,0,0,0.3)', strokeWidth: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <AxisXTag text={`X: ${xLabel}`} />
    </div>
  );
}

const IconDashboard = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const IconData = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const IconProfile = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const IconChevronLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const IconChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const IconRefresh = ({ spinning }) => (
  <svg
    width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ animation: spinning ? 'spin 0.7s linear infinite' : 'none', display: 'block' }}
  >
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const IconSeedling = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22V12"/>
    <path d="M12 12C12 8 15 5 19 5c0 4-3 7-7 7z"/>
    <path d="M12 12C12 9 9 6 5 7c0 3 3 6 7 5z"/>
  </svg>
);

const IconWarning = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconThermo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
  </svg>
);

const IconDroplet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

const IconBeanCoffee = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8 2 4 5.5 4 10s3 9 8 9 8-3.5 8-9-3-9-8-9z"/>
    <path d="M12 2c0 0 2 3 2 8s-2 9-2 9"/>
    <path d="M12 2c0 0-2 3-2 8s2 9 2 9"/>
    <path d="M4 10h16"/>
  </svg>
);

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  data: 'Data',
  profile: 'Profil',
  admin: 'Admin Panel',
};

const ROLE_LABEL = {
  user: 'User',
  admin: 'Admin',
  super_admin: 'Head Admin',
};

function NavItem({ id, label, icon, active, onClick, showLabel }) {
  return (
    <button
      onClick={onClick}
      title={!showLabel ? label : ''}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: showLabel ? '9px 12px 9px 14px' : '9px',
        justifyContent: showLabel ? 'flex-start' : 'center',
        border: 'none',
        borderRadius: 9,
        fontSize: '0.82rem',
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: active ? 500 : 400,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        position: 'relative',
        background: active
          ? 'linear-gradient(90deg, rgba(74,138,48,0.18) 0%, rgba(74,138,48,0.05) 100%)'
          : 'transparent',
        color: active ? '#a8d870' : 'rgba(122,184,64,0.35)',
        boxShadow: active ? '0 0 15px rgba(74,138,48,0.06)' : 'none',
        outline: 'none',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.background = 'rgba(74,138,48,0.06)';
          e.currentTarget.style.color = 'rgba(160,210,100,0.65)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'rgba(122,184,64,0.35)';
        }
      }}
    >
      {active && (
        <>
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: 3,
            background: 'linear-gradient(180deg, #a8d870 0%, #4a8a30 100%)',
            borderRadius: '0 3px 3px 0',
            boxShadow: '0 0 10px rgba(168,216,112,0.7), 0 0 20px rgba(122,184,64,0.4)',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 9,
            border: '1px solid rgba(122,184,64,0.2)',
            pointerEvents: 'none',
          }} />
        </>
      )}
      <span style={{
        display: 'flex', alignItems: 'center', flexShrink: 0,
        color: active ? '#a8d870' : 'inherit',
        filter: active ? 'drop-shadow(0 0 6px rgba(168,216,112,0.6))' : 'none',
        transition: 'all 0.25s ease',
        position: 'relative', zIndex: 1,
      }}>
        {icon}
      </span>
      {showLabel && (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative', zIndex: 1 }}>
          {label}
        </span>
      )}
    </button>
  );
}

function StatCard({ accentColor, glowColor, label, value, icon }) {
  return (
    <div
      style={{
        background: '#0a1510',
        borderRadius: 12,
        padding: '18px 20px',
        border: '1px solid rgba(74,138,48,0.1)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, border-color 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = `rgba(${glowColor},0.25)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(74,138,48,0.1)';
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: accentColor }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ color: 'rgba(160,210,100,0.4)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', margin: 0 }}>
          {label}
        </p>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `rgba(${glowColor},0.08)`,
          border: `1px solid rgba(${glowColor},0.18)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: `rgb(${glowColor})`,
          flexShrink: 0,
          filter: `drop-shadow(0 0 4px rgba(${glowColor},0.3))`,
        }}>
          {icon}
        </div>
      </div>
      {value}
    </div>
  );
}

export default function Dashboard({ tab = 'dashboard' }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem('webeans_splash_done'));
  const [activeNav, setActiveNav] = useState(tab);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chartType, setChartType] = useState('donut');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => { setActiveNav(tab); }, [tab]);

  const handleNav = (id) => {
    setActiveNav(id);
    navigate(`/${id}`);
  };

  const fetchHistory = useCallback(async () => {
    console.log('[DASHBOARD] fetching history');
    try {
      const res = await axios.get('http://localhost:5000/api/sensor/history?limit=10', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[DASHBOARD] history received:', res.data.length, 'records');
      const mapped = res.data.map((row) => ({
        label: `#${row.id}`,
        good: row.good ?? (row.kualitas_baik ?? 0),
        bad: row.bad ?? Math.max(0, 100 - (row.kualitas_baik ?? 0)),
      }));
      setHistoryData(mapped);
    } catch (err) {
      console.log('[DASHBOARD] history error:', err.message);
    }
  }, [token]);

  const fetchData = useCallback(async (isManual = false) => {
    console.log('[DASHBOARD] fetching sensor data');
    if (isManual) setSpinning(true);
    try {
      const res = await axios.get('http://localhost:5000/api/sensor/latest', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[DASHBOARD] data received');
      setData(res.data);
      setLastUpdate(new Date());
      setError(null);
      await fetchHistory();
    } catch (err) {
      console.log('[DASHBOARD] fetch error:', err.message);
      setError('Gagal mengambil data sensor');
    } finally {
      setLoading(false);
      if (isManual) {
        setTimeout(() => setSpinning(false), 700);
      }
    }
  }, [token, fetchHistory]);

  useEffect(() => {
    if (!showSplash) {
      fetchData();
      const interval = setInterval(() => {
        console.log('[DASHBOARD] auto-refresh');
        fetchData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [showSplash, fetchData]);

  const handleLogout = () => {
    console.log('[DASHBOARD] logout:', user?.username);
    sessionStorage.removeItem('webeans_splash_done');
    logout();
    navigate('/login');
  };

  if (showSplash) {
    return (
      <Splash onFinish={() => {
        sessionStorage.setItem('webeans_splash_done', 'true');
        setShowSplash(false);
      }} />
    );
  }

  const qualityGood = data?.kualitas_baik ?? 0;
  const qualityBad = Math.max(0, 100 - qualityGood);
  const temperature = data?.suhu ?? '--';
  const humidity = data?.kelembapan ?? '--';
  const totalHarvest = data?.total_panen ?? '--';

  const goodTrend = historyData.length > 1
    ? historyData[historyData.length - 1].good - historyData[historyData.length - 2].good
    : null;
  const badTrend = historyData.length > 1
    ? historyData[historyData.length - 1].bad - historyData[historyData.length - 2].bad
    : null;

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard />, roles: ['user', 'admin', 'super_admin'] },
    { id: 'data', label: 'Data', icon: <IconData />, roles: ['admin', 'super_admin'] },
    { id: 'profile', label: 'Profil', icon: <IconProfile />, roles: ['admin', 'super_admin'] },
  ].filter(item => item.roles.includes(user?.role));

  const adminNavItems = [
    { id: 'admin', label: 'Admin Panel', icon: <IconShield />, roles: ['super_admin'] },
  ].filter(item => item.roles.includes(user?.role));

  return (
    <div className="db-page">

      <aside className={`db-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="db-sidebar-top">
          {sidebarOpen && (
            <div className="db-sidebar-brand">
              <img src={logo} alt="Webeans" className="db-sidebar-logo" />
              <span className="db-sidebar-name">WEBEANS</span>
            </div>
          )}
          <button className="db-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <IconChevronLeft /> : <IconChevronRight />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {sidebarOpen && (
            <p style={{ color: 'rgba(122,184,64,0.22)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '10px 14px 5px', fontFamily: 'DM Sans, sans-serif', userSelect: 'none' }}>
              Overview
            </p>
          )}
          {mainNavItems.map(({ id, label, icon }) => (
            <NavItem key={id} id={id} label={label} icon={icon} active={activeNav === id} onClick={() => handleNav(id)} showLabel={sidebarOpen} />
          ))}
          {adminNavItems.length > 0 && (
            <>
              {sidebarOpen ? (
                <p style={{ color: 'rgba(122,184,64,0.22)', fontSize: '0.58rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', padding: '14px 14px 5px', fontFamily: 'DM Sans, sans-serif', userSelect: 'none' }}>
                  Administrasi
                </p>
              ) : (
                <div style={{ height: 10, borderTop: '1px solid rgba(74,138,48,0.08)', margin: '8px 4px' }} />
              )}
              {adminNavItems.map(({ id, label, icon }) => (
                <NavItem key={id} id={id} label={label} icon={icon} active={activeNav === id} onClick={() => handleNav(id)} showLabel={sidebarOpen} />
              ))}
            </>
          )}
        </nav>

        <div className="db-sidebar-footer">
          {sidebarOpen ? (
            <div style={{
              background: 'rgba(74,138,48,0.05)',
              border: '1px solid rgba(74,138,48,0.1)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(74,138,48,0.2), rgba(122,184,64,0.15))',
                border: '1.5px solid rgba(122,184,64,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Playfair Display, serif',
                color: '#7ab840', fontSize: '1rem', fontWeight: 700,
                flexShrink: 0,
                boxShadow: '0 0 10px rgba(122,184,64,0.15)',
              }}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ color: '#c8e0a0', fontSize: '0.82rem', fontWeight: 600, margin: '0 0 3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.username}
                </p>
                <span style={{
                  display: 'inline-block',
                  background: 'rgba(122,184,64,0.1)',
                  border: '1px solid rgba(122,184,64,0.2)',
                  borderRadius: 4,
                  padding: '1px 7px',
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  color: 'rgba(168,216,112,0.7)',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                }}>
                  {ROLE_LABEL[user?.role] || user?.role}
                </span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(74,138,48,0.12)',
                border: '1.5px solid rgba(122,184,64,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#7ab840', fontSize: '0.85rem', fontWeight: 700,
                fontFamily: 'Playfair Display, serif',
              }}>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Keluar' : ''}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: 8,
              padding: sidebarOpen ? '9px 12px' : '9px',
              background: 'transparent',
              border: '1px solid transparent',
              borderRadius: 8,
              color: 'rgba(220,100,100,0.45)',
              fontSize: '0.82rem',
              fontFamily: 'DM Sans, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(220,60,60,0.08)';
              e.currentTarget.style.color = 'rgba(220,100,100,0.85)';
              e.currentTarget.style.borderColor = 'rgba(220,60,60,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(220,100,100,0.45)';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <IconLogout />
            {sidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <main className="db-main">
        <header className="db-header">
          <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#c8e0a0', fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
            {PAGE_TITLES[activeNav]}
          </h1>
          <div className="db-header-right">
            {lastUpdate && (
              <span className="db-last-update">
                Diperbarui {lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            {activeNav === 'dashboard' && (
              <button className="db-refresh-btn" onClick={() => fetchData(true)} disabled={loading}>
                <IconRefresh spinning={spinning} />
                Refresh
              </button>
            )}
          </div>
        </header>

        {activeNav === 'dashboard' && (
          <div className="db-content">
            {error && <div className="db-alert-error">{error}</div>}

            <div className="db-row-4">
              <StatCard
                accentColor="linear-gradient(90deg, #4a8a30, #7ab840)"
                glowColor="122,184,64"
                label="Kualitas Baik"
                icon={<IconSeedling />}
                value={
                  <div>
                    <p style={{ color: '#7ab840', fontSize: '1.9rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', margin: '0 0 8px', lineHeight: 1 }}>
                      {loading ? '...' : `${qualityGood}%`}
                    </p>
                    <div style={{ height: 2, background: 'rgba(74,138,48,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: loading ? '0%' : `${qualityGood}%`, background: 'linear-gradient(90deg, #4a8a30, #7ab840)', transition: 'width 1s ease', boxShadow: '0 0 6px rgba(122,184,64,0.5)' }} />
                    </div>
                  </div>
                }
              />
              <StatCard
                accentColor="linear-gradient(90deg, #902020, #e05555)"
                glowColor="224,85,85"
                label="Kualitas Buruk"
                icon={<IconWarning />}
                value={
                  <div>
                    <p style={{ color: '#e05555', fontSize: '1.9rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', margin: '0 0 8px', lineHeight: 1 }}>
                      {loading ? '...' : `${qualityBad}%`}
                    </p>
                    <div style={{ height: 2, background: 'rgba(220,60,60,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: loading ? '0%' : `${qualityBad}%`, background: 'linear-gradient(90deg, #902020, #e05555)', transition: 'width 1s ease', boxShadow: '0 0 6px rgba(224,85,85,0.5)' }} />
                    </div>
                  </div>
                }
              />
              <StatCard
                accentColor="linear-gradient(90deg, #a06020, #e09040)"
                glowColor="224,144,64"
                label="Suhu"
                icon={<IconThermo />}
                value={
                  <p style={{ color: '#e09040', fontSize: '1.9rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', margin: 0, lineHeight: 1 }}>
                    {loading ? '...' : temperature !== '--' ? `${temperature}°C` : '--'}
                  </p>
                }
              />
              <StatCard
                accentColor="linear-gradient(90deg, #2060a0, #4090e0)"
                glowColor="64,144,224"
                label="Kelembapan"
                icon={<IconDroplet />}
                value={
                  <p style={{ color: '#4090e0', fontSize: '1.9rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', margin: 0, lineHeight: 1 }}>
                    {loading ? '...' : humidity !== '--' ? `${humidity}%` : '--'}
                  </p>
                }
              />
            </div>

            <div className="db-row-2" style={{ marginBottom: 14 }}>
              <div className="db-panel">
                <div className="db-panel-header">
                  <div>
                    <h3 className="db-panel-title">Kualitas Panen</h3>
                    <p className="db-panel-sub">Distribusi kualitas saat ini</p>
                  </div>
                  <div className="db-chart-switcher">
                    {CHART_TYPES.map(({ id, label }) => (
                      <button key={id} className={`db-chart-switch-btn ${chartType === id ? 'active' : ''}`} onClick={() => setChartType(id)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  {loading ? (
                    <div className="db-skeleton" style={{ width: '100%', height: 150, borderRadius: 10 }} />
                  ) : (
                    <QualityChart type={chartType} good={qualityGood} />
                  )}
                </div>
              </div>

              <div className="db-panel">
                <div className="db-panel-header">
                  <h3 className="db-panel-title">Ringkasan Panen</h3>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 16px',
                  background: 'rgba(74,138,48,0.06)',
                  borderRadius: 10,
                  border: '1px solid rgba(74,138,48,0.12)',
                  marginBottom: 16,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #4a8a30, #7ab840)' }} />
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(74,138,48,0.12)',
                    border: '1px solid rgba(74,138,48,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#7ab840', flexShrink: 0,
                    filter: 'drop-shadow(0 0 6px rgba(122,184,64,0.3))',
                  }}>
                    <IconBeanCoffee />
                  </div>
                  <div>
                    <p style={{ color: 'rgba(160,210,100,0.4)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 3px', fontFamily: 'DM Sans, sans-serif' }}>
                      Total Panen
                    </p>
                    <p style={{ color: '#c8e0a0', fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Playfair Display, serif', margin: 0, lineHeight: 1 }}>
                      {loading ? '...' : `${totalHarvest} kg`}
                    </p>
                  </div>
                </div>

                <div>
                  {[
                    { label: 'Kualitas Baik', val: qualityGood, color: '#7ab840', gradFrom: '#4a8a30', gradTo: '#7ab840' },
                    { label: 'Kualitas Buruk', val: qualityBad, color: '#e05555', gradFrom: '#902020', gradTo: '#e05555' },
                  ].map(({ label, val, color, gradFrom, gradTo }) => (
                    <div key={label} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 5px ${color}80`, flexShrink: 0 }} />
                          <span style={{ color: 'rgba(160,210,100,0.6)', fontSize: '0.78rem', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
                        </div>
                        <span style={{ color, fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Playfair Display, serif' }}>
                          {loading ? '-' : `${val}%`}
                        </span>
                      </div>
                      <div style={{ height: 5, background: 'rgba(74,138,48,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: loading ? '0%' : `${val}%`,
                          background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
                          borderRadius: 3,
                          transition: 'width 1.2s ease 0.3s',
                          boxShadow: `0 0 6px ${color}40`,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="db-row-2">
              <div className="db-panel">
                <div className="db-panel-header">
                  <div>
                    <h3 className="db-panel-title">Tren Kualitas Baik</h3>
                    <p className="db-panel-sub">
                      Per data sensor masuk
                      {goodTrend !== null && (
                        <span style={{ color: goodTrend >= 0 ? '#7ab840' : '#e05555', fontSize: '0.7rem', fontWeight: 600, marginLeft: 6 }}>
                          {goodTrend >= 0 ? `▲ +${goodTrend.toFixed(1)}%` : `▼ ${goodTrend.toFixed(1)}%`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {historyData.length < 2 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, color: 'rgba(122,184,64,0.25)', fontSize: '0.78rem' }}>
                    Menunggu data historis...
                  </div>
                ) : (
                  <TrendChart color="#7ab840" gradientId="goodTrendGrad" dataKey="good" data={historyData} xLabel="No. Data Sensor" yLabel="Kualitas Baik (%)" />
                )}
              </div>

              <div className="db-panel">
                <div className="db-panel-header">
                  <div>
                    <h3 className="db-panel-title">Tren Kualitas Buruk</h3>
                    <p className="db-panel-sub">
                      Per data sensor masuk
                      {badTrend !== null && (
                        <span style={{ color: badTrend <= 0 ? '#7ab840' : '#e05555', fontSize: '0.7rem', fontWeight: 600, marginLeft: 6 }}>
                          {badTrend <= 0 ? `▼ ${badTrend.toFixed(1)}%` : `▲ +${badTrend.toFixed(1)}%`}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {historyData.length < 2 ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, color: 'rgba(122,184,64,0.25)', fontSize: '0.78rem' }}>
                    Menunggu data historis...
                  </div>
                ) : (
                  <TrendChart color="#e05555" gradientId="badTrendGrad" dataKey="bad" data={historyData} xLabel="No. Data Sensor" yLabel="Kualitas Buruk (%)" />
                )}
              </div>
            </div>

          </div>
        )}

        {activeNav === 'data' && (
          <div className="db-content">
            <div className="db-panel db-coming-soon">
              <h3 className="db-panel-title">Soon</h3>
            </div>
          </div>
        )}

        {activeNav === 'profile' && (
          <div className="db-content"><Profile /></div>
        )}

        {activeNav === 'admin' && (
          <div className="db-content"><AdminPanel /></div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}