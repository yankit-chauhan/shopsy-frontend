import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { signup, login, getProducts, getProductById, searchProducts } from './api';
import { getProductImage, homeBanner, secondaryBanner } from './productImages';

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required />
    </label>
  );
}

function Header({ auth }) {

  const isLoggedIn = !!auth.userEmail;

  return (
    <header className="header">
      <div className="header-inner">

        <Link to="/" className="brand">
          Shopsy
        </Link>

        <nav className="nav">

          <Link to="/">Home</Link>
          <Link to="/search">Search</Link>

          {!isLoggedIn && (
            <>
              <Link to="/signup">Sign up</Link>
              <Link to="/login">Login</Link>
            </>
          )}

          {isLoggedIn && (
            <button
              className="ghost-button"
              onClick={auth.onLogout}
            >
              Logout ({auth.userEmail})
            </button>
          )}

        </nav>

      </div>
    </header>
  );
}

function Home() {
  return (
    <section className="stack-large">
      <section className="hero">
        <div className="hero-copy">
          <span className="pill">Online Shopping</span>
          <h1>Find everyday essentials, premium gadgets, and style picks in one place.Yankit Chauhan</h1>
          <p>
            Explore a curated shopping experience with fast product search, detailed product pages,
            and a simple account flow to get started.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/search">Shop now</Link>
            <Link className="secondary-button" to="/signup">Create account</Link>
          </div>
        </div>
        <div className="hero-visual">
          <img src={homeBanner} alt="Online shopping banner" />
        </div>
      </section>

      <section className="features-grid">
        <div className="card feature-card"><h3>Login / Signup</h3><p>Connects with auth-service through the API gateway for a clean user flow.</p></div>
        <div className="card feature-card"><h3>Search Experience</h3><p>Shows product search results in a visual card layout with images and quick pricing.</p></div>
        <div className="card feature-card"><h3>Product Details</h3><p>Displays an image-led PDP with category, stock, description, and product ID.</p></div>
      </section>

      <section className="promo-banner card">
        <div>
          <span className="pill dark-pill">Featured Picks</span>
          <h2>Fresh arrivals across mobiles, laptops, audio, and fashion</h2>
          <p>
            Browse popular categories, compare products quickly, and open detailed product pages
            with pricing, stock, and descriptions.
          </p>
          <Link className="primary-button" to="/search">Browse products</Link>
        </div>
        <img src={secondaryBanner} alt="Featured shopping collection" />
      </section>
    </section>
  );
}

function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function handleSubmit(event) {
    event.preventDefault(); setError(''); setMessage('');
    try { const result = await signup(form); setMessage(result.message || 'Signup successful'); }
    catch (err) { setError(err.message); }
  }
  return (
    <section className="center-panel">
      <div className="card form-card">
        <h2>Create your account</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <Input label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Input label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
          <Input label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
          <button className="primary-button" type="submit">Create account</button>
        </form>
        {message ? <p className="success">{message}</p> : null}
        {error ? <p className="error">{error}</p> : null}
      </div>
    </section>
  );
}

function LoginPage({ auth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault(); setError('');
    try { const result = await login(form); auth.onLoginSuccess(result); navigate('/search'); }
    catch (err) { setError(err.message); }
  }
  return (
    <section className="center-panel">
      <div className="card form-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form-grid">
          <Input label="Email" type="email" value={form.email} onChange={(value) => setForm({ ...form, email: value })} />
          <Input label="Password" type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
          <button className="primary-button" type="submit">Login</button>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </div>
    </section>
  );
}

function SearchPage() {
  const [query, setQuery] = useState('iphone');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [error, setError] = useState('');
  async function handleSearch(event) {
    event?.preventDefault(); setError('');
    try { setResults(await searchProducts(query)); } catch (err) { setError(err.message); setResults([]); }
  }
  async function handleLoadAll() {
    setError('');
    try { setAllProducts(await getProducts()); } catch (err) { setError(err.message); setAllProducts([]); }
  }
  return (
    <section className="stack">
      <div className="card search-card">
        <div>
          <span className="pill">Search Catalog</span>
          <h2>Search products</h2>
          <p>Search by name or category and explore image-rich product cards.</p>
        </div>
        <form onSubmit={handleSearch} className="search-row">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try iphone, laptops, audio..." />
          <button className="primary-button" type="submit">Search</button>
          <button className="secondary-button" type="button" onClick={handleLoadAll}>Load all</button>
        </form>
        {error ? <p className="error">{error}</p> : null}
      </div>
      {results.length > 0 ? <ProductList title={`Search results (${results.length})`} products={results} /> : null}
      {allProducts.length > 0 ? <ProductList title={`All products (${allProducts.length})`} products={allProducts} /> : null}
    </section>
  );
}

function ProductList({ title, products }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div className="product-grid">
        {products.map((product) => (
          <Link className="product-card" key={product.id} to={`/products/${product.id}`}>
            <img className="product-image" src={getProductImage(product)} alt={product.name} />
            <div className="product-meta">
              <span className="category-tag">{product.category}</span>
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <div className="product-bottom">
                <strong>₹ {product.price}</strong>
                <span>Stock: {product.stock}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    getProductById(id).then((data) => active && setProduct(data)).catch((err) => active && setError(err.message));
    return () => { active = false; };
  }, [id]);
  if (error) return <section className="card"><p className="error">{error}</p></section>;
  if (!product) return <section className="card"><p>Loading product details...</p></section>;
  return (
    <section className="pdp-layout">
      <div className="card pdp-image-card">
        <img className="pdp-image" src={getProductImage(product)} alt={product.name} />
      </div>
      <div className="card pdp-info-card">
        <span className="category-tag">{product.category}</span>
        <h1>{product.name}</h1>
        <div className="pdp-price">₹ {product.price}</div>
        <p className="pdp-description">{product.description}</p>
        <div className="pdp-facts">
          <div><span>Stock</span><strong>{product.stock}</strong></div>
          <div><span>Product ID</span><strong>{product.id}</strong></div>
        </div>
        <div className="pdp-actions"><Link className="primary-button" to="/search">Back to search</Link></div>
      </div>
    </section>
  );
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('shopsy_token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('shopsy_email') || '');
  const auth = useMemo(() => ({
    token, userEmail,
    onLoginSuccess: (p) => {
      localStorage.setItem('shopsy_token', p.token || '');
      localStorage.setItem('shopsy_email', p.email || '');
      setToken(p.token || ''); setUserEmail(p.email || '');
    },
    onLogout: () => {
      localStorage.removeItem('shopsy_token'); localStorage.removeItem('shopsy_email');
      setToken(''); setUserEmail('');
    }
  }), [token, userEmail]);

  return (
    <div className="app-shell">
      <Header auth={auth} />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage auth={auth} />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
        </Routes>
      </main>
    </div>
  );
}
