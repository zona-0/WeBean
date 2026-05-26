const log = {
  info: (label, msg) => console.log(`[INFO] [${label}] ${msg}`),
  success: (label, msg) => console.log(`[OK] [${label}] ${msg}`),
  warn: (label, msg) => console.log(`[WARN] [${label}] ${msg}`),
  error: (label, msg) => console.log(`[ERROR] [${label}] ${msg}`),
  db: (msg) => console.log(`[DB] ${msg}`),
  auth: (msg) => console.log(`[AUTH] ${msg}`),
};

module.exports = log;