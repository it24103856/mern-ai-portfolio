import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  User,
  FolderGit2,
  Cpu,
  Mail,
  LogOut,
  ExternalLink,
  Upload,
  Trash2,
  Plus,
  CheckCircle2,
} from 'lucide-react';

const AdminDashboard = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [uploading, setUploading] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    fullName: '',
    headline: '',
    bio: '',
    location: 'Sri Lanka',
    email: '',
    avatarUrl: '',
    resumeUrl: '',
    availability: true,
    socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
  });

  // Projects State
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: 'Full-Stack',
    techStack: '',
    liveUrl: '',
    githubUrl: '',
    featured: false,
    images: [],
  });

  // Skills State
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', proficiency: 85 });

  // Messages State
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [profRes, projRes, skillRes, msgRes] = await Promise.all([
        api.get('/profile'),
        api.get('/projects'),
        api.get('/skills'),
        api.get('/messages'),
      ]);
      if (profRes.data.data) setProfile(profRes.data.data);
      setProjects(projRes.data.data || []);
      setSkills(skillRes.data.data || []);
      setMessages(msgRes.data.data || []);
    } catch {
      toast.error('Failed to load CMS data');
    }
  };

  // Cloudinary File Upload Helper
  const handleFileUpload = async (file, onSuccess) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess(data);
      toast.success('File uploaded to Cloudinary!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Profile Submit
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', profile);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  // Add Project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        techStack: newProject.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const { data } = await api.post('/projects', payload);
      setProjects([data.data, ...projects]);
      setNewProject({
        title: '',
        shortDescription: '',
        description: '',
        category: 'Full-Stack',
        techStack: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        images: [],
      });
      toast.success('Project added!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success('Project deleted');
    } catch {
      toast.error('Failed to delete project');
    }
  };

  // Add Skill
  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/skills', newSkill);
      setSkills([...skills, data.data]);
      setNewSkill({ name: '', category: 'Frontend', proficiency: 85 });
      toast.success('Skill added!');
    } catch {
      toast.error('Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter((s) => s._id !== id));
      toast.success('Skill removed');
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  // Message Actions
  const handleToggleRead = async (id) => {
    const { data } = await api.patch(`/messages/${id}`);
    setMessages(messages.map((m) => (m._id === id ? data.data : m)));
  };

  const handleDeleteMessage = async (id) => {
    await api.delete(`/messages/${id}`);
    setMessages(messages.filter((m) => m._id !== id));
    toast.success('Message deleted');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Bar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg text-indigo-400">Portfolio CMS</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
              {admin?.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-indigo-400 transition"
            >
              View Live Site <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-rose-400 hover:text-rose-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-800 pb-4">
          {[
            { id: 'profile', label: 'Profile & CV', icon: User },
            { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
            { id: 'skills', label: `Skills (${skills.length})`, icon: Cpu },
            { id: 'messages', label: `Inbox (${unreadCount} new)`, icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PROFILE */}
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-semibold">Developer Profile & Resume</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Headline</label>
                <input
                  type="text"
                  required
                  placeholder="Full-Stack Developer & AI Engineer"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Contact Email</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Bio (Used in About section & AI Assistant)</label>
              <textarea
                rows={4}
                required
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            {/* Avatar & Resume Uploads */}
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <label className="block text-xs text-slate-400 mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {profile.avatarUrl && (
                    <img src={profile.avatarUrl} alt="Avatar" className="w-14 h-14 rounded-full object-cover" />
                  )}
                  <label className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-xs cursor-pointer">
                    <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        handleFileUpload(e.target.files[0], (data) =>
                          setProfile({ ...profile, avatarUrl: data.url })
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <label className="block text-xs text-slate-400 mb-2">Resume / CV (PDF)</label>
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-xs cursor-pointer">
                    <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload PDF'}
                    <input
                      type="file"
                      accept=".pdf"
                      hidden
                      onChange={(e) =>
                        handleFileUpload(e.target.files[0], (data) =>
                          setProfile({ ...profile, resumeUrl: data.url })
                        )
                      }
                    />
                  </label>
                  {profile.resumeUrl && (
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-400 underline"
                    >
                      View Current CV
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="url"
                placeholder="GitHub URL"
                value={profile.socialLinks?.github || ''}
                onChange={(e) =>
                  setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })
                }
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={profile.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })
                }
                className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.checked })}
                className="rounded accent-indigo-600"
              />
              Available for new opportunities / freelance projects
            </label>

            <div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <form onSubmit={handleAddProject} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-semibold">Add New Project</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Project Title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                >
                  {['Full-Stack', 'AI/ML', 'Mobile', 'Frontend', 'Backend'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                required
                placeholder="Short Summary (1-2 sentences)"
                value={newProject.shortDescription}
                onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
              />
              <textarea
                rows={3}
                required
                placeholder="Detailed Description & Architecture..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
              />
              <div className="grid md:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Tech Stack (comma separated: React, Node.js, MongoDB)"
                  value={newProject.techStack}
                  onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
                <input
                  type="url"
                  placeholder="Live Demo URL"
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
                <input
                  type="url"
                  placeholder="GitHub Repo URL"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg text-xs cursor-pointer">
                    <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Screenshot'}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) =>
                        handleFileUpload(e.target.files[0], (data) =>
                          setNewProject({
                            ...newProject,
                            images: [{ url: data.url, publicId: data.publicId }],
                          })
                        )
                      }
                    />
                  </label>
                  {newProject.images[0] && (
                    <span className="text-xs text-emerald-400">✓ Screenshot attached</span>
                  )}
                  <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProject.featured}
                      onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                    />
                    Featured Project
                  </label>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
            </form>

            {/* Existing Projects List */}
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div key={proj._id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{proj.title}</h3>
                      <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded">
                        {proj.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{proj.shortDescription}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.techStack.map((t) => (
                        <span key={t} className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(proj._id)}
                    className="text-rose-400 hover:text-rose-300 self-start p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <form onSubmit={handleAddSkill} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-slate-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  placeholder="React.js / Python / PostgreSQL"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm"
                >
                  {['Frontend', 'Backend', 'Database', 'AI & Data', 'DevOps & Tools'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl text-sm font-medium cursor-pointer"
              >
                Add Skill
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  key={skill._id}
                  className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-3"
                >
                  <div>
                    <span className="text-sm font-medium">{skill.name}</span>
                    <span className="text-xs text-slate-500 ml-2">({skill.category})</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(skill._id)}
                    className="text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <p className="text-slate-400 text-sm">No messages received yet.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`bg-slate-900 border rounded-xl p-5 flex justify-between gap-4 ${
                    msg.isRead ? 'border-slate-800 opacity-75' : 'border-indigo-500/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{msg.senderName}</span>
                      <span className="text-xs text-slate-400">({msg.senderEmail})</span>
                      {!msg.isRead && (
                        <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded-full">NEW</span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-400 mt-0.5">{msg.subject}</p>
                    <p className="text-sm text-slate-300 mt-2">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-2 self-start">
                    <button
                      onClick={() => handleToggleRead(msg._id)}
                      title="Toggle Read"
                      className="p-1.5 text-slate-400 hover:text-emerald-400 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      title="Delete"
                      className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;