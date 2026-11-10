import { Link } from "react-router-dom";

function Dashboard() {
  const name = localStorage.getItem("name") || "there";
  const role = localStorage.getItem("role");

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const studentCards = [
    { title: "Browse Courses", text: "Find a new course and enroll.", to: "/courses", tag: "Explore" },
    { title: "My Enrollments", text: "Continue the courses you joined.", to: "/my-enrollments", tag: "Learn" },
    { title: "Quizzes", text: "Test what you have learned.", soon: true, tag: "Soon" },
    { title: "Certificates", text: "Download your earned certificates.", soon: true, tag: "Soon" },
  ];

  const instructorCards = [
    { title: "Create Course", text: "Start a brand new course.", to: "/create-course", tag: "Create" },
    { title: "My Courses", text: "Manage lessons and content.", to: "/my-courses", tag: "Manage" },
    { title: "Browse Courses", text: "See what others are teaching.", to: "/courses", tag: "Explore" },
    { title: "Student Progress", text: "See how your students are doing.", soon: true, tag: "Soon" },
  ];

  const adminCards = [
    { title: "Pending Courses", text: "Approve or reject new courses.", to: "/admin/courses", tag: "Review" },
    { title: "Browse Courses", text: "See all available courses.", to: "/courses", tag: "Explore" },
    { title: "Manage Users", text: "View and manage accounts.", soon: true, tag: "Soon" },
    { title: "Platform Analytics", text: "Revenue and enrollment overview.", soon: true, tag: "Soon" },
  ];

  const cards =
    role === "INSTRUCTOR" ? instructorCards : role === "ADMIN" ? adminCards : studentCards;

  return (
    <div className="db-page">
      <style>{`
        .db-page { max-width: 1100px; margin: 0 auto; padding: 36px 24px 60px; }

        .db-hero {
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
          background: linear-gradient(135deg, var(--olive), var(--olive-dark));
          border-radius: 20px; padding: 32px 34px; color: #fff; margin-bottom: 30px;
          box-shadow: var(--shadow-lg);
        }
        .db-user { display: flex; align-items: center; gap: 18px; }
        .db-avatar {
          width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.18);
          border: 2px solid rgba(255,255,255,0.5); display: flex; align-items: center;
          justify-content: center; font-size: 26px; font-weight: 800;
        }
        .db-hello { margin: 0 0 4px; font-size: 14px; opacity: 0.85; text-align: left; }
        .db-name { margin: 0; font-size: 28px; font-weight: 800; color: #fff; text-align: left; }
        .db-role {
          display: inline-block; margin-top: 8px; background: rgba(255,255,255,0.18);
          padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700;
          text-transform: capitalize;
        }
        .db-logout {
          background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.6);
          padding: 10px 22px; border-radius: 8px; font-weight: 600; font-size: 14px;
          transition: all 0.2s;
        }
        .db-logout:hover { background: #fff; color: var(--olive-dark); }

        .db-title { margin: 0 0 16px; font-size: 20px; font-weight: 800; text-align: left; }

        .db-grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }

        .db-card {
          display: block; text-decoration: none; color: var(--text); position: relative;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 24px 22px; transition: all 0.25s;
        }
        .db-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--olive); }
        .db-card.soon { opacity: 0.65; cursor: not-allowed; }
        .db-card.soon:hover { transform: none; box-shadow: none; border-color: var(--border); }

        .db-tag {
          display: inline-block; font-size: 12px; font-weight: 700; padding: 3px 10px;
          border-radius: 20px; background: var(--olive-light); color: var(--olive-dark); margin-bottom: 14px;
        }
        .db-card.soon .db-tag { background: #ece5d0; color: var(--muted); }
        .db-card h3 { margin: 0 0 6px; font-size: 18px; text-align: left; }
        .db-card p { margin: 0 0 16px; color: var(--muted); font-size: 14px; line-height: 1.55; text-align: left; }
        .db-go { font-size: 14px; font-weight: 700; color: var(--olive-dark); }
        .db-card.soon .db-go { color: var(--muted); }

        @media (max-width: 600px) {
          .db-hero { padding: 24px 20px; }
          .db-name { font-size: 22px; }
        }
      `}</style>

      <div className="db-hero">
        <div className="db-user">
          <div className="db-avatar">{name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="db-hello">{greeting},</p>
            <h1 className="db-name">{name}</h1>
            {role && <span className="db-role">{role.toLowerCase()}</span>}
          </div>
        </div>
        <button className="db-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <h2 className="db-title">Quick actions</h2>
      <div className="db-grid">
        {cards.map((c) =>
          c.soon ? (
            <div className="db-card soon" key={c.title}>
              <span className="db-tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="db-go">Coming soon</span>
            </div>
          ) : (
            <Link to={c.to} className="db-card" key={c.title}>
              <span className="db-tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="db-go">Open →</span>
            </Link>
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;