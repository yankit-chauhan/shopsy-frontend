import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { signup, login, getProducts, getProductById, searchProducts } from './api';

function Input({ label, value, onChange, type='text' }) {
  return <label className="field"><span>{label}</span><input type={type} value={value} onChange={(e)=>onChange(e.target.value)} required /></label>;
}

function Header({ auth }) {
  return <header className="header"><div className="header-inner"><Link className="brand" to="/">Shopsy</Link><nav className="nav"><Link to="/search">Search</Link><Link to="/signup">Sign up</Link><Link to="/login">Login</Link>{auth.userEmail ? <button className="link-button" onClick={auth.onLogout}>Logout ({auth.userEmail})</button> : null}</nav></div></header>;
}

function Home() {
  return <section className="card"><h1>Shopsy Frontend Demo</h1><p>This frontend demonstrates signup/login, search, and product details against your deployed backend.</p></section>;
}

function SignupPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'USER' });
  const [message, setMessage] = useState(''); const [error, setError] = useState('');
  async function submit(e){ e.preventDefault(); setError(''); setMessage(''); try { const r = await signup(form); setMessage(r.message || 'Signup successful'); } catch(err){ setError(err.message); } }
  return <section className="card form-card"><h2>Sign up</h2><form onSubmit={submit} className="form-grid"><Input label="Name" value={form.name} onChange={(v)=>setForm({...form,name:v})} /><Input label="Email" type="email" value={form.email} onChange={(v)=>setForm({...form,email:v})} /><Input label="Password" type="password" value={form.password} onChange={(v)=>setForm({...form,password:v})} /><button className="primary-button" type="submit">Create account</button></form>{message ? <p className="success">{message}</p> : null}{error ? <p className="error">{error}</p> : null}</section>;
}

function LoginPage({ auth }) {
  const [form, setForm] = useState({ email:'', password:'' }); const [error, setError] = useState(''); const navigate = useNavigate();
  async function submit(e){ e.preventDefault(); setError(''); try { const r = await login(form); auth.onLoginSuccess(r); navigate('/search'); } catch(err){ setError(err.message); } }
  return <section className="card form-card"><h2>Login</h2><form onSubmit={submit} className="form-grid"><Input label="Email" type="email" value={form.email} onChange={(v)=>setForm({...form,email:v})} /><Input label="Password" type="password" value={form.password} onChange={(v)=>setForm({...form,password:v})} /><button className="primary-button" type="submit">Login</button></form>{error ? <p className="error">{error}</p> : null}</section>;
}

function ProductList({ title, products }) {
  return <section className="card"><h3>{title}</h3><div className="grid">{products.map((p)=><Link key={p.id} className="product-card" to={`/products/${p.id}`}><h4>{p.name}</h4><p>{p.category}</p><strong>₹ {p.price}</strong><span>Stock: {p.stock}</span></Link>)}</div></section>;
}

function SearchPage() {
  const [query, setQuery] = useState('iphone'); const [results, setResults] = useState([]); const [allProducts, setAllProducts] = useState([]); const [error, setError] = useState('');
  async function doSearch(e){ e?.preventDefault(); setError(''); try { setResults(await searchProducts(query)); } catch(err){ setError(err.message); } }
  async function loadAll(){ setError(''); try { setAllProducts(await getProducts()); } catch(err){ setError(err.message); } }
  return <section className="stack"><div className="card"><h2>Search products</h2><form onSubmit={doSearch} className="search-row"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by name or category" /><button className="primary-button" type="submit">Search</button><button className="secondary-button" type="button" onClick={loadAll}>Load all</button></form>{error ? <p className="error">{error}</p> : null}</div>{results.length ? <ProductList title={`Search results (${results.length})`} products={results} /> : null}{allProducts.length ? <ProductList title={`All products (${allProducts.length})`} products={allProducts} /> : null}</section>;
}

function ProductDetailsPage() {
  const { id } = useParams(); const [product, setProduct] = useState(null); const [error, setError] = useState('');
  useEffect(()=>{ let active=true; getProductById(id).then(d=>active && setProduct(d)).catch(e=>active && setError(e.message)); return ()=>{active=false}; }, [id]);
  if (error) return <section className="card"><p className="error">{error}</p></section>;
  if (!product) return <section className="card"><p>Loading product details...</p></section>;
  return <section className="card product-detail"><h2>{product.name}</h2><p><strong>Category:</strong> {product.category}</p><p><strong>Price:</strong> ₹ {product.price}</p><p><strong>Stock:</strong> {product.stock}</p><p><strong>Description:</strong> {product.description}</p><p><strong>Product ID:</strong> {product.id}</p></section>;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('shopsy_token') || ''); const [userEmail, setUserEmail] = useState(localStorage.getItem('shopsy_email') || '');
  const auth = useMemo(()=>({ token, userEmail, onLoginSuccess:(p)=>{ localStorage.setItem('shopsy_token', p.token || ''); localStorage.setItem('shopsy_email', p.email || ''); setToken(p.token || ''); setUserEmail(p.email || ''); }, onLogout:()=>{ localStorage.removeItem('shopsy_token'); localStorage.removeItem('shopsy_email'); setToken(''); setUserEmail(''); } }), [token, userEmail]);
  return <div><Header auth={auth} /><main className="container"><Routes><Route path="/" element={<Home/>} /><Route path="/signup" element={<SignupPage/>} /><Route path="/login" element={<LoginPage auth={auth} />} /><Route path="/search" element={<SearchPage/>} /><Route path="/products/:id" element={<ProductDetailsPage/>} /></Routes></main></div>;
}
