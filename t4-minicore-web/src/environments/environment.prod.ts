export const environment = {
  production: true,
  // Cambia esta URL por la URL pública que Render le asigne a tu Web Service (backend)
  apiUrl: (window as any).__env?.apiUrl || 'https://t4-minicore-api.onrender.com/api'
};
