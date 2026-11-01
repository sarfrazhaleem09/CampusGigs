import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogIn,
  Menu,
  MessageCircle,
  Palette,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import "./styles.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AuthContext = createContext(null);
function useAuth() {
  return useContext(AuthContext);
}
async function request(path, options = {}) {
  const token = localStorage.getItem("cg_token");
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response
    .json()
    .catch(() => ({ message: "Unexpected server response." }));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
}
const demoJobs = [
  {
    _id: "demo1",
    title: "Design a clean logo for a student startup",
    category: "Design",
    description:
      "Looking for a creative designer to create a simple, memorable logo and a mini brand kit for a new student-led startup. Share a few examples of your work.",
    tags: ["Figma", "Branding", "Illustrator"],
    budget: 4500,
    status: "open",
    owner: { name: "Ayesha K." },
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo2",
    title: "Build a responsive landing page",
    category: "Development",
    description:
      "Need a frontend developer to turn a Figma layout into a responsive landing page. React experience is a plus. Clean code and mobile layout matter most.",
    tags: ["React", "CSS", "Frontend"],
    budget: 8000,
    status: "open",
    owner: { name: "Hamza R." },
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    _id: "demo3",
    title: "Edit short reels for a campus event",
    category: "Video & Media",
    description:
      "Edit five 20–30 second vertical videos from event footage. Add captions, smooth cuts and royalty-free background music.",
    tags: ["CapCut", "Reels", "Editing"],
    budget: 3000,
    status: "open",
    owner: { name: "Zara M." },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    _id: "demo4",
    title: "Prepare organized calculus revision notes",
    category: "Writing",
    description:
      "Turn lecture slides into clear, well-structured revision notes with worked examples and a short formula sheet.",
    tags: ["Math", "Notes", "LaTeX"],
    budget: 1800,
    status: "open",
    owner: { name: "Bilal A." },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: "demo5",
    title: "Create social media posts for a society",
    category: "Design",
    description:
      "Create six consistent social media templates for a university society, suitable for Instagram and LinkedIn.",
    tags: ["Canva", "Social Media", "Design"],
    budget: 2500,
    status: "open",
    owner: { name: "Maryam S." },
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: "demo6",
    title: "Test a student-built mobile app",
    category: "Other",
    description:
      "Try a beta app, document reproducible bugs, and provide screenshots with clear steps. Android device preferred.",
    tags: ["QA", "Testing", "Documentation"],
    budget: 2200,
    status: "open",
    owner: { name: "Usman T." },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];
const categories = [
  "All categories",
  "Development",
  "Design",
  "Writing",
  "Video & Media",
  "Marketing",
  "Tutoring",
  "Other",
];
const icons = {
  Development: Code2,
  Design: Palette,
  "Video & Media": Video,
  Writing: MessageCircle,
  Marketing: TrendingUp,
  Tutoring: GraduationCap,
  Other: BriefcaseBusiness,
};
function money(n) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);
}
function timeAgo(date) {
  const h = Math.max(
    0,
    Math.floor((Date.now() - new Date(date).getTime()) / 3600000),
  );
  return h < 1
    ? "Just now"
    : h < 24
      ? `${h}h ago`
      : `${Math.floor(h / 24)}d ago`;
}
function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cg_user"));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("cg_token"));
  const [page, setPage] = useState("home");
  const [authOpen, setAuthOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = useMemo(
    () => ({
      user,
      token,
      signIn(data) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("cg_user", JSON.stringify(data.user));
        localStorage.setItem("cg_token", data.token);
        setAuthOpen(false);
        setToast(`Welcome, ${data.user.name.split(" ")[0]}!`);
      },
      updateUser(updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("cg_user", JSON.stringify(updatedUser));
      },
      signOut() {
        setUser(null);
        setToken(null);
        localStorage.removeItem("cg_user");
        localStorage.removeItem("cg_token");
        setPage("home");
        setToast("You have signed out.");
      },
    }),
    [user, token],
  );
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3200);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    const open = () => setPostOpen(true);
    window.addEventListener("cg:post", open);
    return () => window.removeEventListener("cg:post", open);
  }, []);
  return (
    <AuthContext.Provider value={auth}>
      <div className="app-shell">
        <Header
          page={page}
          setPage={setPage}
          openAuth={() => setAuthOpen(true)}
          openPost={() => (user ? setPostOpen(true) : setAuthOpen(true))}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        {page === "home" && (
          <Home
            setPage={setPage}
            openAuth={() => setAuthOpen(true)}
            openPost={() => (user ? setPostOpen(true) : setAuthOpen(true))}
            setSelectedJob={setSelectedJob}
            setToast={setToast}
          />
        )}
        {page === "explore" && (
          <Explore
            setSelectedJob={setSelectedJob}
            setToast={setToast}
            openAuth={() => setAuthOpen(true)}
          />
        )}
        {page === "dashboard" && (
          <Dashboard
            setSelectedJob={setSelectedJob}
            setToast={setToast}
            openAuth={() => setAuthOpen(true)}
          />
        )}
        {page === "profile" && <ProfilePage />}
        {page === "how" && (
          <HowItWorks
            openAuth={() => setAuthOpen(true)}
            openPost={() => (user ? setPostOpen(true) : setAuthOpen(true))}
          />
        )}
        <Footer setPage={setPage} />
        {authOpen && (
          <AuthModal
            onClose={() => setAuthOpen(false)}
            onSuccess={auth.signIn}
          />
        )}
        {postOpen && (
          <PostModal
            onClose={() => setPostOpen(false)}
            onCreated={() => {
              setPostOpen(false);
              setPage("explore");
              setToast("Your gig is live!");
            }}
            setToast={setToast}
          />
        )}
        {selectedJob && (
          <JobModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            openAuth={() => setAuthOpen(true)}
            setToast={setToast}
          />
        )}
        {toast && (
          <div className="toast">
            <Check size={17} />
            {toast}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!user) {
    return (
      <main className="page-main">
        <h1>Please sign in to view your profile.</h1>
      </main>
    );
  }

  async function saveProfile(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const data = await request("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ name, email }),
      });

      updateUser(data.user);
      setName(data.user.name);
      setEmail(data.user.email);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }

    setBusy(true);

    try {
      const data = await request("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-main">
      <section className="page-intro">
        <div className="eyebrow eyebrow-muted">YOUR ACCOUNT</div>
        <h1>
          My <span>Profile</span>
        </h1>
        <p>Manage your CampusGigs account details.</p>
      </section>

      <section className="profile-card">
        <h2>Personal information</h2>

        {!editing ? (
          <>
            <p>
              <strong>Full name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>

            <button
              className="button button-primary"
              onClick={() => {
                setName(user.name);
                setEmail(user.email);
                setEditing(true);
                setMessage("");
                setError("");
              }}
            >
              Edit profile
            </button>
          </>
        ) : (
          <form className="form-stack" onSubmit={saveProfile}>
            <label className="form-field">
              <span>Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                required
              />
            </label>

            <label className="form-field">
              <span>Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <div className="profile-actions">
              <button className="button button-primary" disabled={busy}>
                {busy ? "Saving..." : "Save changes"}
              </button>

              <button
                type="button"
                className="button button-outline"
                onClick={() => {
                  setEditing(false);
                  setName(user.name);
                  setEmail(user.email);
                  setError("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="profile-card">
        <h2>Change password</h2>
        <p>Choose a new password to secure your account.</p>

        <form className="form-stack" onSubmit={changePassword}>
          <label className="form-field">
            <span>Current password</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          <label className="form-field">
            <span>New password</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              required
            />
          </label>

          <label className="form-field">
            <span>Confirm new password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              required
            />
          </label>

          <button className="button button-primary" disabled={busy}>
            {busy ? "Please wait..." : "Change password"}
          </button>
        </form>
      </section>

      {message && <div className="profile-success">{message}</div>}
      {error && <div className="form-error">{error}</div>}
    </main>
  );
}

function Header({ page, setPage, openAuth, openPost, menuOpen, setMenuOpen }) {
  const { user, signOut } = useAuth();
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <button className="brand" onClick={() => setPage("home")}>
          <span className="brand-mark">
            <Zap size={20} fill="currentColor" />
          </span>
          <span>
            campus<span className="brand-accent">gigs</span>
            <small>STUDENT WORK, REAL IMPACT</small>
          </span>
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <button
            className={page === "explore" ? "nav-link active" : "nav-link"}
            onClick={() => {
              setPage("explore");
              setMenuOpen(false);
            }}
          >
            Explore gigs
          </button>
          <button
            className={page === "how" ? "nav-link active" : "nav-link"}
            onClick={() => {
              setPage("how");
              setMenuOpen(false);
            }}
          >
            How it works
          </button>
          {user && (
            <button
              className={page === "dashboard" ? "nav-link active" : "nav-link"}
              onClick={() => {
                setPage("dashboard");
                setMenuOpen(false);
              }}
            >
              My dashboard
            </button>
          )}
        </nav>
        <div className="nav-actions">
          <button
            className="button button-quiet hide-mobile"
            onClick={openPost}
          >
            <Plus size={16} /> Post a gig
          </button>
          {user ? (
            <div className="user-menu">
              <span className="avatar">{user.name?.[0]?.toUpperCase()}</span>
              <button
                className="user-name"
                onClick={() => {
                  setPage("profile");
                  setMenuOpen(false);
                }}
              >
                {user.name?.split(" ")[0]}
              </button>
              <button
                className="icon-button"
                title="Sign out"
                onClick={signOut}
              >
                <LogIn size={17} />
              </button>
            </div>
          ) : (
            <button className="button button-dark" onClick={openAuth}>
              Sign in <ArrowUpRight size={16} />
            </button>
          )}
          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Home({ setPage, openAuth, openPost, setSelectedJob, setToast }) {
  const [jobs, setJobs] = useState(demoJobs);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let active = true;
    request("/jobs?limit=6")
      .then((d) => {
        if (active && d.jobs?.length) setJobs(d.jobs);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const featured = jobs
    .filter((j) =>
      `${j.title} ${j.category} ${(j.tags || []).join(" ")}`
        .toLowerCase()
        .includes(q.toLowerCase()),
    )
    .slice(0, 3);
  return (
    <main>
      <section className="hero">
        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot" /> THE CAMPUS ECONOMY, REIMAGINED
            </div>
            <h1>
              Your skills.
              <br />
              Your schedule.
              <br />
              <span>Your next big thing.</span>
            </h1>
            <p className="hero-sub">
              A place for students to find meaningful freelance work, build real
              experience, and earn while they learn.
            </p>
            <div className="hero-actions">
              <button
                className="button button-primary button-large"
                onClick={() => setPage("explore")}
              >
                Find your next gig <ArrowRight size={18} />
              </button>
              <button
                className="button button-outline button-large"
                onClick={openPost}
              >
                I’m hiring <Plus size={18} />
              </button>
            </div>
            <div className="hero-proof">
              <div className="avatar-stack">
                <span>A</span>
                <span>H</span>
                <span>Z</span>
                <span>+</span>
              </div>
              <div>
                <strong>Made for student talent</strong>
                <small>Small gigs. Big opportunities.</small>
              </div>
              <div className="proof-divider" />
              <div>
                <strong>Free to get started</strong>
                <small>No complicated setup</small>
              </div>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-orbit orbit-a" />
            <div className="art-orbit orbit-b" />
            <div className="art-card art-card-main">
              <div className="art-top">
                <span className="live-dot" /> NEW OPPORTUNITY{" "}
                <span className="art-dots">•••</span>
              </div>
              <div className="art-icon-row">
                <div className="art-icon purple">
                  <Palette size={25} />
                </div>
                <div>
                  <strong>Brand identity designer</strong>
                  <small>Creative Studio · Remote</small>
                </div>
              </div>
              <p className="art-description">
                Help a student startup bring their vision to life.
              </p>
              <div className="art-tags">
                <span>Branding</span>
                <span>Figma</span>
                <span>Creative</span>
              </div>
              <div className="art-bottom">
                <div>
                  <small>PROJECT BUDGET</small>
                  <strong>PKR 4,500</strong>
                </div>
                <span className="mini-apply">
                  Apply now <ArrowUpRight size={14} />
                </span>
              </div>
            </div>
            <div className="floating-note note-top">
              <span className="note-icon">
                <Sparkles size={16} />
              </span>
              <div>
                <strong>Skill up. Earn more.</strong>
                <small>Your next chapter starts here</small>
              </div>
            </div>
            <div className="floating-note note-bottom">
              <div className="note-check">
                <Check size={15} />
              </div>
              <div>
                <strong>Application sent!</strong>
                <small>You're on your way</small>
              </div>
            </div>
            <div className="art-spark spark-a">✳</div>
            <div className="art-spark spark-b">✦</div>
          </div>
        </div>
        <div className="hero-bottom">
          <span>BUILT FOR THE NEXT GENERATION OF DOERS</span>
          <div>
            <span>
              <Code2 size={15} /> Development
            </span>
            <span>
              <Palette size={15} /> Design
            </span>
            <span>
              <Video size={15} /> Video
            </span>
            <span>
              <MessageCircle size={15} /> Writing
            </span>
          </div>
        </div>
      </section>
      <section className="stats-strip">
        <div>
          <strong>One campus</strong>
          <span>A world of talent</span>
        </div>
        <div>
          <strong>Real projects</strong>
          <span>Practical experience</span>
        </div>
        <div>
          <strong>Your own terms</strong>
          <span>Flexible student life</span>
        </div>
        <div>
          <strong>Zero fees</strong>
          <span>Start without a barrier</span>
        </div>
      </section>
      <section className="section featured-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow eyebrow-muted">GOOD WORK IS OUT THERE</div>
            <h2>
              Find a gig that <span>fits you.</span>
            </h2>
            <p>Real projects from people who need your skills.</p>
          </div>
          <button className="text-link" onClick={() => setPage("explore")}>
            Explore all gigs <ArrowRight size={17} />
          </button>
        </div>
        <div className="search-bar">
          <Search size={20} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try ‘React’, ‘logo design’, or ‘video editing’"
          />
          <button
            className="button button-dark"
            onClick={() => {
              setPage("explore");
              if (q) sessionStorage.setItem("cg_search", q);
            }}
          >
            Search gigs
          </button>
        </div>
        <div className="job-grid">
          {featured.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onClick={() => setSelectedJob(job)}
            />
          ))}
          {featured.length === 0 && (
            <div className="empty-state">
              No matching featured gigs. Try another search.
            </div>
          )}
        </div>
        <div className="center-action">
          <button
            className="button button-outline"
            onClick={() => setPage("explore")}
          >
            See all opportunities <ArrowRight size={16} />
          </button>
        </div>
      </section>
      <section className="how-preview">
        <div className="how-copy">
          <div className="eyebrow eyebrow-muted">
            LESS SCROLLING, MORE DOING
          </div>
          <h2>
            Good work should
            <br />
            open <span>doors.</span>
          </h2>
          <p>
            Whether you're looking to earn your first paycheck or find someone
            to bring an idea to life, CampusGigs helps students turn skills into
            opportunities.
          </p>
          <button className="button button-dark" onClick={() => setPage("how")}>
            See how it works <ArrowRight size={16} />
          </button>
        </div>
        <div className="steps-mini">
          <div className="mini-step">
            <span>01</span>
            <div className="mini-step-icon">
              <Users />
            </div>
            <div>
              <strong>Create your profile</strong>
              <p>Show your skills and what you love doing.</p>
            </div>
            <ArrowUpRight className="step-arrow" />
          </div>
          <div className="mini-step">
            <span>02</span>
            <div className="mini-step-icon">
              <Search />
            </div>
            <div>
              <strong>Find your fit</strong>
              <p>Discover gigs that match your interests.</p>
            </div>
            <ArrowUpRight className="step-arrow" />
          </div>
          <div className="mini-step">
            <span>03</span>
            <div className="mini-step-icon">
              <TrendingUp />
            </div>
            <div>
              <strong>Do great work</strong>
              <p>Build experience, reputation, and confidence.</p>
            </div>
            <ArrowUpRight className="step-arrow" />
          </div>
        </div>
      </section>
      <section className="cta-band">
        <div className="cta-decoration">✳</div>
        <div>
          <div className="eyebrow">YOUR NEXT OPPORTUNITY IS WAITING</div>
          <h2>Ready to make your skills count?</h2>
          <p>Join a campus community that gets things done.</p>
        </div>
        <button className="button button-white button-large" onClick={openAuth}>
          Get started for free <ArrowRight size={18} />
        </button>
      </section>
    </main>
  );
}
function JobCard({ job, onClick }) {
  const Icon = icons[job.category] || BriefcaseBusiness;
  return (
    <button className="job-card" onClick={onClick}>
      <div className="job-card-top">
        <span
          className={`category-icon ${job.category === "Development" ? "blue" : job.category === "Design" ? "purple" : job.category === "Video & Media" ? "orange" : "green"}`}
        >
          <Icon size={21} />
        </span>
        <span className="job-age">
          <Clock3 size={13} />
          {timeAgo(job.createdAt || Date.now())}
        </span>
      </div>
      <div className="job-category">{job.category}</div>
      <h3>{job.title}</h3>
      <p className="job-description">{job.description}</p>
      <div className="tag-row">
        {(job.tags || []).slice(0, 3).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="job-card-footer">
        <div>
          <small>BUDGET</small>
          <strong>{money(job.budget)}</strong>
        </div>
        <span className="round-arrow">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="job-owner">
        <span className="owner-avatar">{job.owner?.name?.[0] || "S"}</span>
        <span>
          Posted by <strong>{job.owner?.name || "Campus member"}</strong>
        </span>
        <span className="open-label">
          <span />
          Open
        </span>
      </div>
    </button>
  );
}
function Explore({ setSelectedJob, setToast, openAuth }) {
  const [jobs, setJobs] = useState(demoJobs);
  const [q, setQ] = useState(() => sessionStorage.getItem("cg_search") || "");
  const [category, setCategory] = useState("All categories");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);
  useEffect(() => {
    sessionStorage.removeItem("cg_search");
    let active = true;
    request("/jobs?status=all&limit=24")
      .then((d) => {
        if (active) {
          setJobs(d.jobs || []);
          setApiAvailable(true);
        }
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  const filtered = jobs
    .filter(
      (j) =>
        (category === "All categories" || j.category === category) &&
        `${j.title} ${j.description} ${j.category} ${(j.tags || []).join(" ")}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "budget"
        ? (b.budget || 0) - (a.budget || 0)
        : new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
  return (
    <main className="page-main">
      <section className="page-intro">
        <div className="eyebrow eyebrow-muted">THE OPPORTUNITY BOARD</div>
        <h1>
          Find work that <span>fits your life.</span>
        </h1>
        <p>
          Flexible projects, real experience, and a chance to put your skills to
          work.
        </p>
        <div className="explore-search">
          <Search size={20} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by skill, title, or keyword"
          />
          <button className="button button-dark" onClick={() => {}}>
            Search
          </button>
        </div>
      </section>
      <div className="explore-layout">
        <aside className="filter-panel">
          <div className="filter-head">
            <strong>Filters</strong>
            <button
              onClick={() => {
                setCategory("All categories");
                setQ("");
                setSort("newest");
              }}
            >
              Reset
            </button>
          </div>
          <label className="filter-label">CATEGORY</label>
          <div className="category-options">
            {categories.map((c) => (
              <button
                key={c}
                className={
                  category === c
                    ? "category-option selected"
                    : "category-option"
                }
                onClick={() => setCategory(c)}
              >
                <span>
                  {c === "All categories" ? (
                    <BriefcaseBusiness size={16} />
                  ) : (
                    React.createElement(icons[c] || BriefcaseBusiness, {
                      size: 16,
                    })
                  )}
                  {c}
                </span>
                <span>
                  {c === "All categories"
                    ? jobs.length
                    : jobs.filter((j) => j.category === c).length}
                </span>
              </button>
            ))}
          </div>
          <div className="filter-note">
            <ShieldCheck size={18} />
            <p>
              <strong>Student-first, always.</strong>
              <br />
              Keep conversations professional and agree on scope before starting
              work.
            </p>
          </div>
        </aside>
        <section className="results-panel">
          <div className="results-heading">
            <div>
              <h2>
                Available gigs <span>{filtered.length}</span>
              </h2>
              <p>
                {apiAvailable
                  ? "Live listings from the CampusGigs API"
                  : "Preview listings · connect MongoDB to load live gigs"}
              </p>
            </div>
            <label className="sort-control">
              Sort by{" "}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Most recent</option>
                <option value="budget">Highest budget</option>
              </select>
              <ChevronDown size={14} />
            </label>
          </div>
          {loading && (
            <div className="loading-line">Checking for new opportunities…</div>
          )}
          <div className="job-grid explore-grid">
            {filtered.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))}
            {!filtered.length && (
              <div className="empty-state">
                <Search size={24} />
                <strong>No gigs found</strong>
                <p>Try another keyword or clear your filters.</p>
                <button
                  className="button button-outline"
                  onClick={() => {
                    setCategory("All categories");
                    setQ("");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
          <div className="safe-note">
            <ShieldCheck size={17} /> Never pay an upfront fee to apply for a
            gig.
          </div>
        </section>
      </div>
    </main>
  );
}
function Dashboard({ setSelectedJob, setToast, openAuth }) {
  const { user } = useAuth();
  const [posted, setPosted] = useState([]);
  const [mine, setMine] = useState([]);
  const [received, setReceived] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [tab, setTab] = useState("posted");
  const [loading, setLoading] = useState(false);
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      request("/jobs/mine/posted"),
      request("/applications/mine"),
      request("/applications/received"),
      request("/messages/conversations"),
    ])
      .then(([p, m, r, c]) => {
        setPosted(p.jobs || []);
        setMine(m.applications || []);
        setReceived(r.applications || []);
        setConversations(c.conversations || []);
      })
      .catch(() => setDemo(true))
      .finally(() => setLoading(false));
  }, [user]);
  if (!user)
    return (
      <main className="page-main dashboard-gate">
        <div className="gate-icon">
          <LayoutDashboard size={28} />
        </div>
        <h1>
          Your work, <span>all in one place.</span>
        </h1>
        <p>
          Sign in to track your gigs, applications, and the opportunities you're
          working on.
        </p>
        <button className="button button-primary" onClick={openAuth}>
          Sign in to continue <ArrowRight size={17} />
        </button>
      </main>
    );
  const tabs = [
    ["posted", "My gigs", posted.length],
    ["applications", "My applications", mine.length],
    ["received", "Applicants", received.length],
    ["messages", "Messages", conversations.length],
  ];
  async function startConversation(jobId, recipientId) {
    try {
      const d = await request("/messages/conversations", {
        method: "POST",
        body: JSON.stringify({ jobId, recipientId }),
      });
      setConversations((old) => [
        d.conversation,
        ...old.filter((c) => c._id !== d.conversation._id),
      ]);
      setActiveConversation(d.conversation);
      setTab("messages");
      const md = await request(
        `/messages/conversations/${d.conversation._id}/messages`,
      );
      setMessages(md.messages || []);
    } catch (e) {
      setToast(e.message);
    }
  }
  async function openConversation(c) {
    setActiveConversation(c);
    setTab("messages");
    try {
      const d = await request(`/messages/conversations/${c._id}/messages`);
      setMessages(d.messages || []);
    } catch (e) {
      setToast(e.message);
    }
  }
  async function sendMessage(e) {
    e.preventDefault();
    if (!activeConversation || !messageText.trim()) return;
    try {
      const d = await request(
        `/messages/conversations/${activeConversation._id}/messages`,
        { method: "POST", body: JSON.stringify({ body: messageText }) },
      );
      setMessages((old) => [...old, d.message]);
      setMessageText("");
      setConversations((old) =>
        old
          .map((c) =>
            c._id === activeConversation._id
              ? {
                  ...c,
                  lastMessage: d.message.body,
                  lastMessageAt: d.message.createdAt,
                }
              : c,
          )
          .sort(
            (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
          ),
      );
    } catch (e) {
      setToast(e.message);
    }
  }
  async function review(id, status) {
    try {
      await request(`/applications/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setReceived((a) => a.map((x) => (x._id === id ? { ...x, status } : x)));
      setToast(`Application ${status}.`);
    } catch (e) {
      setToast(e.message);
    }
  }
  return (
    <main className="page-main dashboard-page">
      <div className="dashboard-welcome">
        <div>
          <div className="eyebrow eyebrow-muted">YOUR WORKSPACE</div>
          <h1>
            Hey, {user.name?.split(" ")[0]}. <span>Let's get to work.</span>
          </h1>
          <p>Keep an eye on your opportunities and what comes next.</p>
        </div>
        <button
          className="button button-dark"
          onClick={() => window.dispatchEvent(new Event("cg:post"))}
        >
          <Plus size={17} /> Post a gig
        </button>
      </div>
      <div className="dashboard-stats">
        <div>
          <span className="stat-icon purple">
            <BriefcaseBusiness />
          </span>
          <div>
            <small>GIGS POSTED</small>
            <strong>{posted.length}</strong>
          </div>
        </div>
        <div>
          <span className="stat-icon blue">
            <SendIcon />
          </span>
          <div>
            <small>APPLICATIONS SENT</small>
            <strong>{mine.length}</strong>
          </div>
        </div>
        <div>
          <span className="stat-icon green">
            <Users />
          </span>
          <div>
            <small>APPLICANTS</small>
            <strong>{received.length}</strong>
          </div>
        </div>
      </div>
      <div className="dashboard-tabs">
        {tabs.map(([id, label, count]) => (
          <button
            key={id}
            className={tab === id ? "dash-tab active" : "dash-tab"}
            onClick={() => setTab(id)}
          >
            {label}
            <span>{count}</span>
          </button>
        ))}
      </div>
      {loading && <div className="loading-line">Loading your workspace…</div>}
      {demo && (
        <div className="inline-alert">
          We couldn't load your dashboard data. Check that the API and database
          are running.
        </div>
      )}
      {tab === "posted" && (
        <div className="dashboard-list">
          {posted.map((j) => (
            <div className="dashboard-item" key={j._id}>
              <div className="item-main">
                <span className="category-icon purple">
                  <BriefcaseBusiness />
                </span>
                <div>
                  <strong>{j.title}</strong>
                  <small>
                    {j.category} · {timeAgo(j.createdAt)}
                  </small>
                </div>
              </div>
              <strong>{money(j.budget)}</strong>
              <span className={`status-pill ${j.status}`}>
                {j.status?.replace("_", " ")}
              </span>
            </div>
          ))}
          {!posted.length && !loading && (
            <EmptyDashboard
              title="No gigs posted yet"
              body="Have a project in mind? Post a gig and find student talent."
              action="Post your first gig"
              onClick={() => window.dispatchEvent(new Event("cg:post"))}
            />
          )}
        </div>
      )}
      {tab === "applications" && (
        <div className="dashboard-list">
          {mine.map((a) => (
            <div className="dashboard-item" key={a._id}>
              <div className="item-main">
                <span className="category-icon blue">
                  <BriefcaseBusiness />
                </span>
                <div>
                  <strong>{a.job?.title || "Gig unavailable"}</strong>
                  <small>Applied {timeAgo(a.createdAt)}</small>
                </div>
              </div>
              <strong>{money(a.job?.budget)}</strong>
              <span className={`status-pill ${a.status}`}>{a.status}</span>
              {a.job?.owner?._id && (
                <button
                  className="mini-action"
                  onClick={() => startConversation(a.job._id, a.job.owner._id)}
                >
                  Message
                </button>
              )}
            </div>
          ))}
          {!mine.length && !loading && (
            <EmptyDashboard
              title="No applications yet"
              body="Explore the board and apply to a gig that matches your skills."
              action="Explore gigs"
              onClick={() => window.location.assign("/#explore")}
            />
          )}
        </div>
      )}
      {tab === "received" && (
        <div className="applicant-list">
          {received.map((a) => (
            <div className="applicant-card" key={a._id}>
              <div className="applicant-head">
                <span className="owner-avatar big">
                  {a.applicant?.name?.[0] || "S"}
                </span>
                <div>
                  <strong>{a.applicant?.name}</strong>
                  <small>Applied to {a.job?.title}</small>
                </div>
                <span className={`status-pill ${a.status}`}>{a.status}</span>
              </div>
              <p>{a.coverLetter}</p>
              <div className="tag-row">
                {(a.applicant?.skills || []).map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
              <div className="applicant-actions">
                <button
                  className="button button-outline"
                  onClick={() =>
                    startConversation(a.job?._id, a.applicant?._id)
                  }
                >
                  Message
                </button>
                {a.status === "pending" && (
                  <>
                    <button
                      className="button button-outline"
                      onClick={() => review(a._id, "rejected")}
                    >
                      Decline
                    </button>
                    <button
                      className="button button-primary"
                      onClick={() => review(a._id, "accepted")}
                    >
                      <Check size={16} /> Accept applicant
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          {!received.length && !loading && (
            <EmptyDashboard
              title="No applicants yet"
              body="When students apply to your gigs, their applications will appear here."
            />
          )}
        </div>
      )}
      {tab === "messages" && (
        <div className="messages-layout">
          <div className="conversation-list">
            <div className="conversation-list-title">Your conversations</div>
            {conversations.map((c) => {
              const other = (c.participants || []).find(
                (p) => p._id !== user.id,
              );
              return (
                <button
                  key={c._id}
                  className={
                    activeConversation?._id === c._id
                      ? "conversation-row selected"
                      : "conversation-row"
                  }
                  onClick={() => openConversation(c)}
                >
                  <span className="owner-avatar">
                    {other?.name?.[0] || "S"}
                  </span>
                  <span className="conversation-copy">
                    <strong>{other?.name || "Campus member"}</strong>
                    <small>{c.job?.title || "Gig conversation"}</small>
                    <small className="conversation-preview">
                      {c.lastMessage || "No messages yet"}
                    </small>
                  </span>
                </button>
              );
            })}
            {!conversations.length && (
              <p className="conversation-empty">
                Message a gig owner after applying, or message an applicant from
                the Applicants tab.
              </p>
            )}
          </div>
          <div className="message-thread">
            {activeConversation ? (
              <>
                <div className="thread-head">
                  <strong>
                    {(activeConversation.participants || []).find(
                      (p) => p._id !== user.id,
                    )?.name || "Conversation"}
                  </strong>
                  <small>
                    {activeConversation.job?.title || "Gig conversation"}
                  </small>
                </div>
                <div className="thread-messages">
                  {messages.map((m) => (
                    <div
                      key={m._id}
                      className={
                        m.sender?._id === user.id
                          ? "message-bubble mine"
                          : "message-bubble"
                      }
                    >
                      <span>{m.sender?.name || "You"}</span>
                      <p>{m.body}</p>
                      <small>{new Date(m.createdAt).toLocaleString()}</small>
                    </div>
                  ))}
                  {!messages.length && (
                    <div className="thread-empty">
                      Start the conversation with a friendly introduction.
                    </div>
                  )}
                </div>
                <form className="send-message-form" onSubmit={sendMessage}>
                  <input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write a message…"
                    maxLength={2000}
                  />
                  <button
                    className="button button-primary"
                    disabled={!messageText.trim()}
                  >
                    <ArrowRight size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div className="thread-placeholder">
                <MessageCircle size={28} />
                <strong>Select a conversation</strong>
                <p>Choose a conversation to read and reply to messages.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
function SendIcon() {
  return <ArrowUpRight size={20} />;
}
function EmptyDashboard({ title, body, action, onClick }) {
  return (
    <div className="empty-state dashboard-empty">
      <div className="gate-icon">
        <BriefcaseBusiness />
      </div>
      <strong>{title}</strong>
      <p>{body}</p>
      {action && (
        <button className="button button-outline" onClick={onClick}>
          {action} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}
function HowItWorks({ openAuth, openPost }) {
  return (
    <main className="page-main how-page">
      <div className="page-intro">
        <div className="eyebrow eyebrow-muted">SIMPLE BY DESIGN</div>
        <h1>
          From “I can do that”
          <br />
          to <span>“It's done.”</span>
        </h1>
        <p>
          Everything you need to find the right people, do good work, and grow
          along the way.
        </p>
      </div>
      <div className="how-cards">
        <div className="how-card">
          <span className="how-number">01</span>
          <div className="how-card-icon purple">
            <Users />
          </div>
          <h3>Make your profile</h3>
          <p>
            Sign up with your email and tell the community what you're good at.
            Your skills and interests help people find the right fit.
          </p>
        </div>
        <div className="how-card">
          <span className="how-number">02</span>
          <div className="how-card-icon blue">
            <Search />
          </div>
          <h3>Find or post a gig</h3>
          <p>
            Browse short projects by category, or post a clear brief with your
            budget and deadline to find the help you need.
          </p>
        </div>
        <div className="how-card">
          <span className="how-number">03</span>
          <div className="how-card-icon green">
            <MessageCircle />
          </div>
          <h3>Apply and agree</h3>
          <p>
            Send a thoughtful application. Agree on scope, timing, and
            deliverables with the project owner before starting.
          </p>
        </div>
        <div className="how-card">
          <span className="how-number">04</span>
          <div className="how-card-icon orange">
            <TrendingUp />
          </div>
          <h3>Build your future</h3>
          <p>
            Finish meaningful work, build confidence, and collect experience you
            can talk about in your next interview.
          </p>
        </div>
      </div>
      <div className="how-bottom-cta">
        <div>
          <h2>Your next skill deserves a real project.</h2>
          <p>Start small. Learn by doing. Make it count.</p>
        </div>
        <div>
          <button className="button button-primary" onClick={openAuth}>
            Join CampusGigs <ArrowRight size={16} />
          </button>
          <button className="button button-outline" onClick={openPost}>
            Post a gig <Plus size={16} />
          </button>
        </div>
      </div>
    </main>
  );
}
function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await request(
        `/auth/${mode === "login" ? "login" : "register"}`,
        { method: "POST", body: JSON.stringify(form) },
      );
      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal onClose={onClose}>
      <div className="modal-brand">
        <span className="brand-mark">
          <Zap size={18} fill="currentColor" />
        </span>
        <span>
          campus<span className="brand-accent">gigs</span>
        </span>
      </div>
      <div className="modal-heading">
        <h2>{mode === "login" ? "Welcome back." : "Find your next thing."}</h2>
        <p>
          {mode === "login"
            ? "Sign in to pick up where you left off."
            : "Create your free student account to get started."}
        </p>
      </div>
      <div className="auth-switch">
        <button
          className={mode === "login" ? "selected" : ""}
          onClick={() => {
            setMode("login");
            setError("");
          }}
        >
          Sign in
        </button>
        <button
          className={mode === "register" ? "selected" : ""}
          onClick={() => {
            setMode("register");
            setError("");
          }}
        >
          Create account
        </button>
      </div>
      <form className="form-stack" onSubmit={submit}>
        {mode === "register" && (
          <Field
            label="Full name"
            placeholder="e.g. Ayesha Khan"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            required
          />
        )}
        <Field
          label="University email or personal email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          required
        />
        <Field
          label="Password"
          type="password"
          placeholder={
            mode === "register"
              ? "At least 8 characters"
              : "Enter your password"
          }
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
          required
          minLength={mode === "register" ? 8 : 1}
        />
        {error && <div className="form-error">{error}</div>}
        <button className="button button-primary button-full" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "login"
              ? "Sign in to CampusGigs"
              : "Create my account"}{" "}
          <ArrowRight size={17} />
        </button>
      </form>
      <p className="modal-terms">
        <ShieldCheck size={14} /> Your account information stays private.
      </p>
    </Modal>
  );
}
function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  minLength,
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </label>
  );
}
function PostModal({ onClose, onCreated, setToast }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Development",
    tags: "",
    budget: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await request("/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          budget: Number(form.budget),
          tags: form.tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      onCreated();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal onClose={onClose} wide>
      <div className="modal-heading">
        <div className="eyebrow eyebrow-muted">BRING YOUR IDEA TO LIFE</div>
        <h2>Post a new gig</h2>
        <p>Be clear about the work and students will know how to help.</p>
      </div>
      <form className="form-stack" onSubmit={submit}>
        <Field
          label="Gig title"
          placeholder="e.g. Design a logo for our society"
          value={form.title}
          onChange={(v) => setForm({ ...form, title: v })}
          required
        />
        <label className="form-field">
          <span>Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories
              .filter((c) => c !== "All categories")
              .map((c) => (
                <option key={c}>{c}</option>
              ))}
          </select>
        </label>
        <label className="form-field">
          <span>What needs to be done?</span>
          <textarea
            rows="4"
            maxLength="4000"
            placeholder="Describe the project, deliverables, and any helpful context…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </label>
        <div className="form-two">
          <Field
            label="Budget (PKR)"
            type="number"
            placeholder="5000"
            value={form.budget}
            onChange={(v) => setForm({ ...form, budget: v })}
            required
          />
          <Field
            label="Deadline (optional)"
            type="date"
            value={form.deadline}
            onChange={(v) => setForm({ ...form, deadline: v })}
          />
        </div>
        <Field
          label="Skills / tags (comma separated)"
          placeholder="React, Figma, writing"
          value={form.tags}
          onChange={(v) => setForm({ ...form, tags: v })}
        />
        {error && <div className="form-error">{error}</div>}
        <button className="button button-primary button-full" disabled={busy}>
          {busy ? "Publishing…" : "Publish gig"} <ArrowUpRight size={17} />
        </button>
      </form>
    </Modal>
  );
}
function JobModal({ job, onClose, openAuth, setToast }) {
  const { user } = useAuth();
  const [letter, setLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const isDemo = String(job._id).startsWith("demo");
  async function apply(e) {
    e.preventDefault();
    if (!user) {
      onClose();
      openAuth();
      return;
    }
    setApplying(true);
    setError("");
    try {
      if (isDemo)
        throw new Error(
          "This is a preview gig. Connect the API and database to apply to live listings.",
        );
      await request("/applications", {
        method: "POST",
        body: JSON.stringify({ jobId: job._id, coverLetter: letter }),
      });
      setToast("Application submitted successfully!");
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setApplying(false);
    }
  }
  const Icon = icons[job.category] || BriefcaseBusiness;
  return (
    <Modal onClose={onClose} wide>
      <div className="job-modal-top">
        <span className="category-icon purple">
          <Icon size={23} />
        </span>
        <span className="status-pill open">Open for applications</span>
      </div>
      <div className="job-modal-title">
        <div className="job-category">{job.category}</div>
        <h2>{job.title}</h2>
        <p>
          Posted by <strong>{job.owner?.name || "Campus member"}</strong> ·{" "}
          {timeAgo(job.createdAt || Date.now())}
        </p>
      </div>
      <div className="job-modal-budget">
        <div>
          <small>PROJECT BUDGET</small>
          <strong>{money(job.budget)}</strong>
        </div>
        {job.deadline && (
          <div>
            <small>DEADLINE</small>
            <strong>{new Date(job.deadline).toLocaleDateString()}</strong>
          </div>
        )}
      </div>
      <h3 className="detail-heading">About this project</h3>
      <p className="job-full-description">{job.description}</p>
      <div className="tag-row detail-tags">
        {(job.tags || []).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <div className="apply-divider" />
      <form className="form-stack" onSubmit={apply}>
        <label className="form-field">
          <span>Your application</span>
          <textarea
            rows="4"
            placeholder="Introduce yourself, share relevant skills, and explain how you'd approach this project…"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            required
            maxLength="1500"
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button
          className="button button-primary button-full"
          disabled={applying}
        >
          {applying
            ? "Submitting…"
            : user
              ? "Apply for this gig"
              : "Sign in to apply"}{" "}
          <ArrowRight size={17} />
        </button>
        <p className="apply-hint">
          <ShieldCheck size={14} /> Never share passwords or pay an upfront
          application fee.
        </p>
      </form>
    </Modal>
  );
}
function Modal({ children, onClose, wide = false }) {
  useEffect(() => {
    function esc(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={wide ? "modal modal-wide" : "modal"}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
}
function Footer({ setPage }) {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <button className="brand footer-brand" onClick={() => setPage("home")}>
          <span className="brand-mark">
            <Zap size={20} fill="currentColor" />
          </span>
          <span>
            campus<span className="brand-accent">gigs</span>
            <small>STUDENT WORK, REAL IMPACT</small>
          </span>
        </button>
        <p>
          Small gigs. Big opportunities.
          <br />
          Built for students making things happen.
        </p>
        <div className="footer-links">
          <button onClick={() => setPage("explore")}>Explore gigs</button>
          <button onClick={() => setPage("how")}>How it works</button>
          <button onClick={() => setPage("dashboard")}>My dashboard</button>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} CampusGigs. Made for student ambition.
        </span>
        <span>
          <ShieldCheck size={14} /> Learn. Earn. Grow.
        </span>
      </div>
    </footer>
  );
}

function Root() {
  const [postOpen, setPostOpen] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    const open = () => setPostOpen(true);
    window.addEventListener("cg:post", open);
    return () => window.removeEventListener("cg:post", open);
  }, []);
  return <App />;
}

createRoot(document.getElementById("root")).render(<App />);
