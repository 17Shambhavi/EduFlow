import { Link } from "react-router-dom";

function Home() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const features = [
    { icon: "🎥", title: "Video Lessons", text: "Kahin se bhi, kabhi bhi seekho apni speed se." },
    { icon: "📝", title: "Quizzes", text: "Har topic ke baad khud ko test karo." },
    { icon: "📈", title: "Progress Tracking", text: "Dekho kitna course complete ho gaya." },
    { icon: "🏆", title: "Certificates", text: "Course khatam karo, certificate pao." },
  ];

  const steps = [
    { no: "1", title: "Signup karo", text: "Student ya Instructor, apna role chuno." },
    { no: "2", title: "Course chuno", text: "Apne interest ka course enroll karo." },
    { no: "3", title: "Seekhte jao", text: "Lessons dekho, quiz do, certificate lo." },
  ];

  return (
    <>
      <style>{`
        .home-hero {
          background: linear-gradient(135deg, #e4e8cf 0%, #f5f0e1 55%, #f3dcc4 100%);
          padding: 80px 20px 90px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .home-hero::before, .home-hero::after {
          content: ""; position: absolute; border-radius: 50%; opacity: 0.35;
        }
        .home-hero::before { width: 320px; height: 320px; background: var(--olive-light); top: -100px; left: -80px; }
        .home-hero::after { width: 260px; height: 260px; background: #f0c9a0; bottom: -90px; right: -60px; }
        .home-hero > * { position: relative; z-index: 1; }
        .home-tag {
          display: inline-block; background: #fff; color: var(--olive-dark);
          border: 1px solid var(--border); padding: 6px 16px; border-radius: 30px;
          font-size: 13px; font-weight: 600; margin-bottom: 20px;
        }
        .home-title {
          font-size: clamp(32px, 6vw, 56px); font-weight: 800; line-height: 1.15;
          margin: 0 auto 16px; max-width: 760px; letter-spacing: -1px;
        }
        .home-title span { color: var(--olive); }
        .home-sub {
          font-size: 18px; color: var(--muted); max-width: 560px; margin: 0 auto 32px;
        }
        .home-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .home-btn {
          text-decoration: none; padding: 14px 28px; border-radius: 10px;
          font-weight: 700; font-size: 15px; transition: all 0.2s;
        }
        .home-btn.primary { background: var(--olive); color: #fff; box-shadow: var(--shadow); }
        .home-btn.primary:hover { background: var(--olive-dark); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
        .home-btn.ghost { background: #fff; color: var(--olive-dark); border: 1px solid var(--olive); }
        .home-btn.ghost:hover { background: var(--olive-light); transform: translateY(-2px); }

        .home-section { max-width: 1100px; margin: 0 auto; padding: 70px 20px 10px; }
        .home-h2 { text-align: center; font-size: 30px; font-weight: 800; margin: 0 0 8px; }
        .home-h2sub { text-align: center; color: var(--muted); margin: 0 0 36px; }

        .home-grid {
          display: grid; gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
        }
        .home-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: var(--radius); padding: 26px 22px;
          transition: all 0.25s; text-align: center;
        }
        .home-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--olive); }
        .home-icon {
          width: 60px; height: 60px; margin: 0 auto 14px; border-radius: 16px;
          background: var(--olive-light); display: flex; align-items: center;
          justify-content: center; font-size: 28px;
        }
        .home-card h3 { margin: 0 0 6px; font-size: 18px; }
        .home-card p { margin: 0; color: var(--muted); font-size: 14px; }

        .home-stepno {
          width: 44px; height: 44px; border-radius: 50%; margin: 0 auto 12px;
          background: var(--accent); color: #fff; font-weight: 800; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
        }

        .home-split { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
        .home-role {
          border-radius: var(--radius); padding: 34px 28px; color: #fff;
        }
        .home-role.student { background: linear-gradient(135deg, var(--olive), var(--olive-dark)); }
        .home-role.instructor { background: linear-gradient(135deg, #d98e55, #b5642b); }
        .home-role h3 { color: #fff; font-size: 24px; margin: 0 0 10px; }
        .home-role p { margin: 0 0 20px; opacity: 0.92; }
        .home-role a {
          display: inline-block; background: #fff; color: var(--text);
          text-decoration: none; padding: 11px 22px; border-radius: 8px; font-weight: 700;
          transition: transform 0.2s;
        }
        .home-role a:hover { transform: translateY(-2px); }

        .home-footer {
          margin-top: 80px; padding: 26px 20px; text-align: center;
          border-top: 1px solid var(--border); color: var(--muted); font-size: 14px;
        }
      `}</style>

      {/* HERO */}
      <section className="home-hero">
        <div className="home-tag">🌿 Seekho. Badho. Aage jao.</div>
        <h1 className="home-title">
          Apni skills ko agle level par le jao with <span>EduFlow</span>
        </h1>
        <p className="home-sub">
          Courses, quizzes aur certificates, sab ek hi jagah. Student ho ya
          instructor, yahan sabke liye kuch hai.
        </p>
        <div className="home-btns">
          <Link to="/courses" className="home-btn primary">Courses dekho →</Link>
          {!token && <Link to="/signup" className="home-btn ghost">Free mein join karo</Link>}
          {token && <Link to="/dashboard" className="home-btn ghost">Dashboard par jao</Link>}
        </div>
      </section>

      {/* FEATURES */}
      <section className="home-section">
        <h2 className="home-h2">Yahan kya-kya milega?</h2>
        <p className="home-h2sub">Seekhne ke liye jo bhi chahiye, sab ek jagah</p>
        <div className="home-grid">
          {features.map((f) => (
            <div className="home-card" key={f.title}>
              <div className="home-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="home-section">
        <h2 className="home-h2">Kaise kaam karta hai?</h2>
        <p className="home-h2sub">Bas 3 simple steps</p>
        <div className="home-grid">
          {steps.map((s) => (
            <div className="home-card" key={s.no}>
              <div className="home-stepno">{s.no}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STUDENT / INSTRUCTOR */}
      <section className="home-section">
        <div className="home-split">
          <div className="home-role student">
            <h3>🎓 Student ho?</h3>
            <p>Apne pasandida courses dhoondo, enroll karo aur apni speed se seekho.</p>
            <Link to="/courses">Courses explore karo</Link>
          </div>
          <div className="home-role instructor">
            <h3>👩‍🏫 Instructor ho?</h3>
            <p>Apna course banao, lessons upload karo aur students tak pahuncho.</p>
            {role === "INSTRUCTOR" ? (
              <Link to="/create-course">Course banao</Link>
            ) : (
              <Link to="/signup">Instructor ban jao</Link>
            )}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        © {new Date().getFullYear()} EduFlow · Made with 💚 for learners
      </footer>
    </>
  );
}

export default Home;