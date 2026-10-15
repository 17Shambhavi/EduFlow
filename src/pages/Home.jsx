import { useState } from "react";
import { Link } from "react-router-dom";

const Icon = ({ name }) => {
  const paths = {
    video: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </>
    ),
    quiz: (
      <>
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <polyline points="14 3 14 9 20 9" />
        <polyline points="9 15 11 17 15 13" />
      </>
    ),
    progress: (
      <>
        <polyline points="3 17 9 11 13 15 21 7" />
        <polyline points="15 7 21 7 21 13" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14.5 7 22l5-3 5 3-1.5-7.5" />
      </>
    ),
  };
  return <svg viewBox="0 0 24 24">{paths[name]}</svg>;
};

function Home() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [openFaq, setOpenFaq] = useState(0);

  const features = [
    { icon: "video", title: "Video Lessons", text: "Learn at your own pace with structured, easy-to-follow lessons." },
    { icon: "quiz", title: "Quizzes", text: "Test your understanding after every module with timed quizzes." },
    { icon: "progress", title: "Progress Tracking", text: "See exactly how far you have come in every course." },
    { icon: "award", title: "Certificates", text: "Complete a course and earn a certificate to showcase your skills." },
  ];

  const categories = [
    { name: "Web Development", count: "12 courses" },
    { name: "Programming", count: "18 courses" },
    { name: "Data Science", count: "9 courses" },
    { name: "UI/UX Design", count: "7 courses" },
    { name: "Business", count: "8 courses" },
    { name: "Marketing", count: "6 courses" },
  ];

  const steps = [
    { no: "1", title: "Create your account", text: "Sign up as a student or an instructor in under a minute." },
    { no: "2", title: "Pick a course", text: "Browse the catalog and enroll in what interests you." },
    { no: "3", title: "Learn and get certified", text: "Watch lessons, take quizzes and earn your certificate." },
  ];

  const reviews = [
    { name: "Aarav S.", role: "Student", text: "The lessons are clear and the quizzes really help me remember things." },
    { name: "Priya M.", role: "Student", text: "Tracking my progress keeps me motivated to finish every course." },
    { name: "Rohan K.", role: "Instructor", text: "Creating a course and adding content was simple and quick." },
  ];

  const faqs = [
    {
      q: "Is it free to join EduFlow?",
      a: "Yes. Creating an account is completely free. Some courses may be paid, and the price is shown on each course page.",
    },
    {
      q: "How do I earn a certificate?",
      a: "Finish all the lessons in a course and complete its quizzes. Your certificate is then available in your dashboard.",
    },
    {
      q: "Can I learn at my own pace?",
      a: "Absolutely. Once you enroll, you can open your lessons anytime and continue exactly where you stopped.",
    },
    {
      q: "How do I become an instructor?",
      a: "Sign up and choose the Instructor role. After that you can create courses, add sections and upload lessons.",
    },
    {
      q: "What kind of content can I find in a lesson?",
      a: "Lessons can be videos, PDFs or text notes, so you can learn in the way that suits you best.",
    },
  ];

  return (
    <div className="home">
      <style>{`
        .home { width: 100%; }
        .home-wrap { width: 100%; max-width: 1180px; margin: 0 auto; padding: 0 24px; }

        /* HERO */
        .home-hero {
          background: linear-gradient(135deg, #e9edd5 0%, #f5f0e1 55%, #ebe0ca 100%);
          padding: 80px 0 90px;
          position: relative; overflow: hidden;
        }
        .home-hero::before {
          content: ""; position: absolute; width: 420px; height: 420px; border-radius: 50%;
          background: #dfe6c0; opacity: 0.5; top: -160px; left: -120px;
        }
        .home-hero::after {
          content: ""; position: absolute; width: 360px; height: 360px; border-radius: 50%;
          background: #d9c8a6; opacity: 0.45; bottom: -150px; right: -80px;
        }
        .home-hero-grid {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center;
        }
        .home-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; border: 1px solid var(--border); color: var(--olive-dark);
          padding: 6px 14px; border-radius: 30px; font-size: 13px; font-weight: 600; margin-bottom: 22px;
        }
        .home-tag i { width: 8px; height: 8px; border-radius: 50%; background: var(--olive); display: block; }
        .home-title {
          font-size: clamp(34px, 5vw, 58px); font-weight: 800; line-height: 1.1;
          letter-spacing: -1.5px; margin: 0 0 18px; text-align: left;
        }
        .home-title span { color: var(--olive); }
        .home-sub { font-size: 18px; color: var(--muted); max-width: 520px; margin: 0 0 30px; text-align: left; }
        .home-btns { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 40px; }
        .home-btn {
          text-decoration: none; padding: 14px 28px; border-radius: 10px;
          font-weight: 700; font-size: 15px; transition: all 0.2s; display: inline-block;
        }
        .home-btn.primary { background: var(--olive); color: #fff; box-shadow: var(--shadow); }
        .home-btn.primary:hover { background: var(--olive-dark); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .home-btn.ghost { background: #fff; color: var(--olive-dark); border: 1px solid var(--olive); }
        .home-btn.ghost:hover { background: var(--olive-light); transform: translateY(-2px); }

        .home-stats { display: flex; gap: 36px; flex-wrap: wrap; }
        .home-stat b { display: block; font-size: 26px; color: var(--olive-dark); }
        .home-stat span { font-size: 13px; color: var(--muted); }

        /* HERO VISUAL */
        .home-visual { position: relative; display: flex; justify-content: center; padding: 20px 0; }
        .home-preview {
          width: 100%; max-width: 380px; background: #fff; border: 1px solid var(--border);
          border-radius: 18px; box-shadow: var(--shadow-lg); padding: 18px;
        }
        .home-preview-thumb {
          height: 150px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, var(--olive), var(--olive-dark)); margin-bottom: 16px;
        }
        .home-play {
          width: 54px; height: 54px; border-radius: 50%; background: rgba(255,255,255,0.95);
          display: flex; align-items: center; justify-content: center;
        }
        .home-play::after {
          content: ""; border-left: 16px solid var(--olive-dark);
          border-top: 10px solid transparent; border-bottom: 10px solid transparent; margin-left: 4px;
        }
        .home-preview h4 { margin: 0 0 4px; font-size: 17px; text-align: left; }
        .home-preview p { margin: 0 0 14px; font-size: 13px; color: var(--muted); text-align: left; }
        .home-bar { height: 8px; background: var(--olive-light); border-radius: 10px; overflow: hidden; }
        .home-bar div { width: 68%; height: 100%; background: linear-gradient(90deg, var(--olive), #9aa95a); border-radius: 10px; }
        .home-bar-text { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-top: 8px; }

        .home-float {
          position: absolute; background: #fff; border: 1px solid var(--border);
          border-radius: 12px; box-shadow: var(--shadow-lg); padding: 10px 14px;
          font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 8px;
          animation: floaty 4s ease-in-out infinite;
        }
        .home-float .dot { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; }
        .home-float.one { top: 0; left: -10px; }
        .home-float.one .dot { background: var(--success); }
        .home-float.two { bottom: 6px; right: -10px; animation-delay: 1.5s; }
        .home-float.two .dot { background: var(--accent); }
        @keyframes floaty { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        /* SECTIONS */
        .home-section { padding: 80px 0 0; }
        .home-eyebrow { text-align: center; color: var(--accent); font-weight: 700; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 8px; }
        .home-h2 { text-align: center; font-size: 34px; font-weight: 800; margin: 0 0 10px; letter-spacing: -0.5px; }
        .home-h2sub { text-align: center; color: var(--muted); margin: 0 auto 44px; max-width: 520px; }

        .home-grid4 { display: grid; gap: 22px; grid-template-columns: repeat(4, 1fr); }
        .home-grid3 { display: grid; gap: 22px; grid-template-columns: repeat(3, 1fr); }

        .home-card {
          background: var(--card); border: 1px solid var(--border); border-radius: 16px;
          padding: 28px 24px; transition: all 0.25s;
        }
        .home-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--olive); }
        .home-icon {
          width: 54px; height: 54px; border-radius: 14px; background: var(--olive-light);
          color: var(--olive-dark); display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
        }
        .home-icon svg { width: 26px; height: 26px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .home-card h3 { margin: 0 0 8px; font-size: 18px; text-align: left; }
        .home-card p { margin: 0; color: var(--muted); font-size: 14px; line-height: 1.6; text-align: left; }

        /* CATEGORIES */
        .home-cat {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          background: var(--card); border: 1px solid var(--border); border-radius: 14px;
          padding: 20px 22px; text-decoration: none; color: var(--text); transition: all 0.25s;
        }
        .home-cat:hover { background: var(--olive-light); border-color: var(--olive); transform: translateY(-3px); }
        .home-cat b { display: block; font-size: 16px; }
        .home-cat small { color: var(--muted); }
        .home-cat-arrow {
          width: 34px; height: 34px; border-radius: 50%; background: var(--olive); color: #fff;
          display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0;
        }

        .home-stepno {
          width: 44px; height: 44px; border-radius: 12px; background: var(--accent); color: #fff;
          font-weight: 800; font-size: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;
        }

        .home-stars { color: #d4a73c; letter-spacing: 2px; margin-bottom: 10px; font-size: 16px; }
        .home-user { display: flex; align-items: center; gap: 10px; margin-top: 18px; }
        .home-user-av {
          width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--olive), var(--olive-dark));
          color: #fff; font-weight: 700; display: flex; align-items: center; justify-content: center;
        }
        .home-user b { display: block; font-size: 14px; }
        .home-user small { color: var(--muted); }

        /* ROLES */
        .home-split { display: grid; gap: 22px; grid-template-columns: repeat(2, 1fr); }
        .home-role { border-radius: 18px; padding: 38px 34px; color: #fff; }
        .home-role.student { background: linear-gradient(135deg, var(--olive), var(--olive-dark)); }
        .home-role.instructor { background: linear-gradient(135deg, #9a7650, #6b4f30); }
        .home-role h3 { color: #fff; font-size: 26px; margin: 0 0 10px; text-align: left; }
        .home-role p { margin: 0 0 24px; opacity: 0.92; text-align: left; }
        .home-role a {
          display: inline-block; background: #fff; color: var(--text); text-decoration: none;
          padding: 12px 24px; border-radius: 10px; font-weight: 700; transition: transform 0.2s;
        }
        .home-role a:hover { transform: translateY(-2px); }

        /* FAQ */
        .home-faq { max-width: 780px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
        .home-faq-item {
          background: var(--card); border: 1px solid var(--border); border-radius: 14px; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .home-faq-item.open { border-color: var(--olive); box-shadow: var(--shadow); }
        .home-faq-q {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px;
          background: none; border: none; padding: 18px 22px; text-align: left;
          font-size: 16px; font-weight: 600; color: var(--text);
        }
        .home-faq-icon {
          width: 28px; height: 28px; border-radius: 50%; background: var(--olive-light); color: var(--olive-dark);
          display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700;
          flex-shrink: 0; transition: transform 0.25s, background 0.25s;
        }
        .home-faq-item.open .home-faq-icon { background: var(--olive); color: #fff; transform: rotate(45deg); }
        .home-faq-a { padding: 0 22px 20px; color: var(--muted); font-size: 15px; line-height: 1.65; text-align: left; }

        /* CTA */
        .home-cta {
          background: linear-gradient(135deg, var(--olive), var(--olive-dark));
          border-radius: 22px; padding: 56px 30px; text-align: center; color: #fff;
        }
        .home-cta h2 { color: #fff; font-size: 32px; margin: 0 0 10px; }
        .home-cta p { margin: 0 0 26px; opacity: 0.88; }
        .home-cta a {
          display: inline-block; background: #f5f0e1; color: var(--olive-dark); text-decoration: none;
          padding: 14px 32px; border-radius: 10px; font-weight: 700; transition: all 0.2s;
        }
        .home-cta a:hover { transform: translateY(-2px); background: #fff; }

        /* FOOTER */
        .home-footer { margin-top: 80px; border-top: 1px solid var(--border); background: var(--card); }
        .home-footer-in {
          display: flex; justify-content: space-between; align-items: center; gap: 16px;
          flex-wrap: wrap; padding: 28px 24px; max-width: 1180px; margin: 0 auto;
        }
        .home-footer b { font-size: 20px; color: var(--olive-dark); }
        .home-footer b span { color: var(--accent); }
        .home-footer small { color: var(--muted); }
        .home-footer-links { display: flex; gap: 20px; }
        .home-footer-links a { color: var(--muted); text-decoration: none; font-size: 14px; }
        .home-footer-links a:hover { color: var(--olive-dark); }

        @media (max-width: 960px) {
          .home-hero-grid { grid-template-columns: 1fr; }
          .home-grid4 { grid-template-columns: repeat(2, 1fr); }
          .home-grid3 { grid-template-columns: 1fr; }
          .home-split { grid-template-columns: 1fr; }
          .home-float.one { left: 0; }
          .home-float.two { right: 0; }
        }
        @media (max-width: 560px) {
          .home-grid4 { grid-template-columns: 1fr; }
          .home-hero { padding: 50px 0 60px; }
        }
      `}</style>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-wrap">
          <div className="home-hero-grid">
            <div>
              <div className="home-tag"><i></i> Learn. Grow. Succeed.</div>
              <h1 className="home-title">
                Learn new skills and build your <span>future</span>
              </h1>
              <p className="home-sub">
                EduFlow brings courses, quizzes and certificates together in one
                place, for students who want to learn and instructors who want to teach.
              </p>
              <div className="home-btns">
                <Link to="/courses" className="home-btn primary">Browse Courses</Link>
                {!token && <Link to="/signup" className="home-btn ghost">Get Started Free</Link>}
                {token && <Link to="/dashboard" className="home-btn ghost">Go to Dashboard</Link>}
              </div>
              <div className="home-stats">
                <div className="home-stat"><b>500+</b><span>Learners</span></div>
                <div className="home-stat"><b>50+</b><span>Courses</span></div>
                <div className="home-stat"><b>20+</b><span>Instructors</span></div>
              </div>
            </div>

            <div className="home-visual">
              <div className="home-float one"><span className="dot">✓</span> Quiz passed</div>
              <div className="home-preview">
                <div className="home-preview-thumb"><div className="home-play"></div></div>
                <h4>Full Stack Web Development</h4>
                <p>Lesson 8 of 12 · Spring Boot Basics</p>
                <div className="home-bar"><div></div></div>
                <div className="home-bar-text"><span>Progress</span><span>68%</span></div>
              </div>
              <div className="home-float two"><span className="dot">★</span> Certificate earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-section">
        <div className="home-wrap">
          <div className="home-eyebrow">Features</div>
          <h2 className="home-h2">Everything you need to learn</h2>
          <p className="home-h2sub">Simple tools that keep you focused and moving forward.</p>
          <div className="home-grid4">
            {features.map((f) => (
              <div className="home-card" key={f.title}>
                <div className="home-icon"><Icon name={f.icon} /></div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="home-section">
        <div className="home-wrap">
          <div className="home-eyebrow">Categories</div>
          <h2 className="home-h2">Explore popular topics</h2>
          <p className="home-h2sub">Find the subject you want to master.</p>
          <div className="home-grid3">
            {categories.map((c) => (
              <Link to="/courses" className="home-cat" key={c.name}>
                <div>
                  <b>{c.name}</b>
                  <small>{c.count}</small>
                </div>
                <span className="home-cat-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section">
        <div className="home-wrap">
          <div className="home-eyebrow">How it works</div>
          <h2 className="home-h2">Get started in 3 easy steps</h2>
          <p className="home-h2sub">From signing up to your first certificate.</p>
          <div className="home-grid3">
            {steps.map((s) => (
              <div className="home-card" key={s.no}>
                <div className="home-stepno">{s.no}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="home-section">
        <div className="home-wrap">
          <div className="home-eyebrow">Testimonials</div>
          <h2 className="home-h2">Loved by learners and teachers</h2>
          <p className="home-h2sub">Here is what people say about EduFlow.</p>
          <div className="home-grid3">
            {reviews.map((r) => (
              <div className="home-card" key={r.name}>
                <div className="home-stars">★★★★★</div>
                <p>"{r.text}"</p>
                <div className="home-user">
                  <div className="home-user-av">{r.name.charAt(0)}</div>
                  <div><b>{r.name}</b><small>{r.role}</small></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="home-section">
        <div className="home-wrap">
          <div className="home-split">
            <div className="home-role student">
              <h3>For Students</h3>
              <p>Discover courses you love, enroll in seconds and learn at your own pace.</p>
              <Link to="/courses">Explore Courses</Link>
            </div>
            <div className="home-role instructor">
              <h3>For Instructors</h3>
              <p>Create your own course, upload lessons and reach students everywhere.</p>
              {role === "INSTRUCTOR" ? (
                <Link to="/create-course">Create a Course</Link>
              ) : (
                <Link to="/signup">Become an Instructor</Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="home-section">
        <div className="home-wrap">
          <div className="home-eyebrow">FAQ</div>
          <h2 className="home-h2">Frequently asked questions</h2>
          <p className="home-h2sub">Quick answers to things people often ask.</p>
          <div className="home-faq">
            {faqs.map((f, i) => (
              <div
                key={f.q}
                className={`home-faq-item ${openFaq === i ? "open" : ""}`}
              >
                <button
                  className="home-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {f.q}
                  <span className="home-faq-icon">+</span>
                </button>
                {openFaq === i && <div className="home-faq-a">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!token && (
        <section className="home-section">
          <div className="home-wrap">
            <div className="home-cta">
              <h2>Ready to start learning?</h2>
              <p>Join EduFlow today and take your first step.</p>
              <Link to="/signup">Create Free Account</Link>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="home-footer-in">
          <div>
            <b>Edu<span>Flow</span></b>
            <div><small>© {new Date().getFullYear()} EduFlow. All rights reserved.</small></div>
          </div>
          <div className="home-footer-links">
            <Link to="/courses">Courses</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;