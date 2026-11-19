import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, User, ArrowLeft, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const { admin, login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) navigate('/admin/dashboard');
  }, [admin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSetupMode) {
        await register(formData.name, formData.email, formData.password);
        toast.success('Admin account created! Welcome.');
      } else {
        await login(formData.email, formData.password);
        toast.success('Logged in successfully!');
      }
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Portfolio
      </Link>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-bold text-center">
          {isSetupMode ? 'Initial Admin Setup' : 'Portfolio CMS Login'}
        </h1>
        <p className="text-slate-400 text-sm text-center mt-1 mb-6">
          {isSetupMode
            ? 'Create the single master admin account (locks after creation)'
            : 'Sign in to manage your projects, skills, and profile'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSetupMode && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Minsara Abeykoon"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="admin@portfolio.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-xl transition cursor-pointer mt-2"
          >
            {submitting ? 'Processing...' : isSetupMode ? 'Create Admin Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => setIsSetupMode(!isSetupMode)}
            className="text-xs text-slate-400 hover:text-indigo-400 transition cursor-pointer"
          >
            {isSetupMode
              ? 'Already created an admin account? Sign in'
              : 'First time setting up? Create master admin account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;