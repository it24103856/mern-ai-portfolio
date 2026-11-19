import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import AIChatWidget from '../components/AIChatWidget';
import {
  Mail,
  Download,
  ExternalLink,
  Code2,
  MapPin,
  Send,
  Sparkles,
  Lock,
} from 'lucide-react';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Contact Form State
  const [contact, setContact] = useState({ senderName: '', senderEmail: '', subject: '', message: '' });
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const [profRes, projRes, skillRes] = await Promise.all([
          api.get('/profile'),
          api.get('/projects'),
          api.get('/skills'),
        ]);
        setProfile(profRes.data.data);
        setProjects(projRes.data.data || []);
        setSkills(skillRes.data.data || []);
      } catch (error) {
        console.error('Error loading portfolio:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPortfolio();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendingMsg(true);
    try {
      await api.post('/messages', contact);
      toast.success('Message sent! Thank you for reaching out.');
      setContact({ senderName: '', senderEmail: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSendingMsg(false);
    }
  };

  const categories = ['All', 'Full-Stack', 'AI/ML', 'Mobile', 'Frontend', 'Backend'];
  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    acc[skill.category] = acc[skill.category] || [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/70">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="#" className="font-bold text-lg tracking-tight flex items-center gap-2">
            <Code2 className="w-6 h-6 text-indigo-500" />
            <span>{profile?.fullName?.split(' ')[0] || 'Dev'}<span className="text-indigo-500">.dev</span></span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#about" className="hover:text-indigo-400 transition">About</a>
            <a href="#skills" className="hover:text-indigo-400 transition">Skills</a>
            <a href="#projects" className="hover:text-indigo-400 transition">Projects</a>
            <a href="#contact" className="hover:text-indigo-400 transition">Contact</a>
          </div>
          <Link
            to="/admin/login"
            title="Admin CMS"
            className="text-slate-500 hover:text-indigo-400 transition p-2"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="about" className="max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            {profile?.availability && (
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3.5 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Available for Opportunities & Projects
              </div>
            )}

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Hi, I'm{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                {profile?.fullName || 'Full-Stack Developer'}
              </span>
            </h1>

            <p className="text-xl text-slate-300 font-medium">
              {profile?.headline || 'Full-Stack Software Engineer & AI Enthusiast'}
            </p>

            <p className="text-slate-400 leading-relaxed max-w-2xl">
              {profile?.bio ||
                'Welcome to my portfolio! Update your bio, projects, and skills from the Admin CMS Dashboard.'}
            </p>

            {profile?.location && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4 text-indigo-400" /> {profile.location}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <a
                href="#projects"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition shadow-lg shadow-indigo-600/25"
              >
                View My Work
              </a>

              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium px-6 py-3 rounded-xl transition"
                >
                  <Download className="w-4 h-4" /> Download CV
                </a>
              )}

              <div className="flex items-center gap-3 ml-2">
                {profile?.socialLinks?.github && (
                  <a
                    href={profile.socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 text-slate-300 hover:text-white transition"
                  >
                    <Code2 className="w-5 h-5" />
                  </a>
                )}
                {profile?.socialLinks?.linkedin && (
                  <a
                    href={profile.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500 text-slate-300 hover:text-white transition"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Profile Image */}
          {profile?.avatarUrl && (
            <div className="relative">
              <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-indigo-500/30 shadow-2xl shadow-indigo-500/10">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SKILLS SECTION */}
      <section id="skills" className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-900">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Technical Stack</h2>
          <p className="text-slate-400 text-sm mt-1">Technologies, frameworks, and tools I work with</p>
        </div>

        {Object.keys(groupedSkills).length === 0 ? (
          <p className="text-slate-500 text-sm">No skills added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groupedSkills).map(([category, items]) => (
              <div key={category} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-indigo-400 font-semibold text-sm mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill._id}
                      className="bg-slate-950 border border-slate-800 text-slate-200 text-xs px-3 py-1.5 rounded-lg"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <p className="text-slate-400 text-sm mt-1">Real-world applications & engineering builds</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <p className="text-slate-500 text-sm">No projects found in this category.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl overflow-hidden flex flex-col justify-between transition group"
              >
                <div>
                  {project.images?.[0]?.url ? (
                    <div className="h-48 overflow-hidden bg-slate-950">
                      <img
                        src={project.images[0].url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-indigo-400/50" />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-medium bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full">
                        {project.category}
                      </span>
                      {project.featured && (
                        <span className="text-[11px] text-amber-400 font-medium">★ Featured</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      {project.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] bg-slate-950 border border-slate-800 text-slate-300 px-2 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-950/50 border-t border-slate-800/80 flex items-center gap-4 text-xs font-medium">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition"
                    >
                      <Code2 className="w-4 h-4" /> Source Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition ml-auto"
                    >
                      Live Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="max-w-3xl mx-auto px-4 py-20 border-t border-slate-900">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Get In Touch</h2>
          <p className="text-slate-400 text-sm mt-2">
            Have a project idea, internship/job opportunity, or just want to connect? Drop a message!
          </p>
        </div>

        <form
          onSubmit={handleContactSubmit}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={contact.senderName}
              onChange={(e) => setContact({ ...contact, senderName: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="email"
              required
              placeholder="Your Email"
              value={contact.senderEmail}
              onChange={(e) => setContact({ ...contact, senderEmail: e.target.value })}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            value={contact.subject}
            onChange={(e) => setContact({ ...contact, subject: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
          />
          <textarea
            rows={4}
            required
            placeholder="Your Message..."
            value={contact.message}
            onChange={(e) => setContact({ ...contact, message: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={sendingMsg}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl transition cursor-pointer"
          >
            <Send className="w-4 h-4" /> {sendingMsg ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {profile?.fullName || 'Developer Portfolio'}. Built with MERN Stack & Gemini AI.
      </footer>

      {/* FLOATING AI ASSISTANT */}
      <AIChatWidget developerName={profile?.fullName} />
    </div>
  );
};

export default Home;