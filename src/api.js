const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type':'application/json', ...(options.headers||{}) }, ...options
  });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) throw new Error(typeof data === 'string' ? data : (data.error || data.message || 'Request failed'));
  return data;
}
export const signup = (payload) => request('/auth/signup', { method:'POST', body: JSON.stringify(payload) });
export const login = (payload) => request('/auth/login', { method:'POST', body: JSON.stringify(payload) });
export const getProducts = () => request('/products');
export const getProductById = (id) => request(`/products/${id}`);
export const searchProducts = (q) => request(`/search?q=${encodeURIComponent(q || '')}`);
