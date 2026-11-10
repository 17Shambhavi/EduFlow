import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BANNERS = [
  "linear-gradient(135deg, #6b7a3a, #4a5528)",
  "linear-gradient(135deg, #8a6a45, #5f4529)",
  "linear-gradient(135deg, #9aa95a, #6b7a3a)",
  "linear-gradient(135deg, #a88b64, #8a6a45)",
  "linear-gradient(135deg, #556b2f, #3b4a1f)",
];

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/courses/public")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.content || [];
        setCourses(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...new Set(courses.map((c) => c.category).filter(Boolean))];
  const levels = ["All", ...new Set(courses.map((c) => c.level).filter(Boolean))];

  const filtered = courses.filter((c) => {
    const text = `${c.title || ""} ${c.description || ""}`.toLowerCase();
    const matchSearch = text.includes(search.toLowerCase());
    const matchCategory = category === "All" || c.category === category;
    const matchLevel = level === "All" || c.level === level;
    return matchSearch && matchCategory && matchLevel;
  });

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setLevel("All");
  };

  const formatPrice = (price) =>
    !price || Number(price) === 0 ? "Free" : `₹${price}`;

  return (
    <div className="cs-page">
      <style>{`
        .cs-page { max-width: 1180px; margin: 0 auto; padding: 36px 24px 60px; }
        .cs-head { margin-bottom: 26px; }
        .cs-head h1 { margin: 0 0 6px; font-size: 34px; font-weight: 800; letter-spacing: -0.5px; text-align: left; }
        .cs-head p { margin: 0; color: var(--muted); text-align: left; }

        .cs-filters {
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 14px; padding: 14px; margin-bottom: 26px;
        }
        .cs-search { flex: 1; min-width: 220px; }
        .cs-filters input, .cs-filters select { width: 100%; font-size: 14px; }
        .cs-select { min-width: 160px; }
        .cs-clear {
          background: transparent; border: 1px solid var(--olive); color: var(--olive-dark);
          padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 14px;
          transition: background 0.2s;
        }
        .cs-clear:hover { background: var(--olive-light); }

        .cs-count { color: var(--muted); font-size: 14px; margin-bottom: 16px; text-align: left; }

        .cs-grid { display: grid; gap: 22px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }

        .cs-card {
          display: flex; flex-direction: column; text-decoration: none; color: var(--text);
          background: var(--card); border: 1px solid var(--border); border-radius: 16px;
          overflow: hidden; transition: all 0.25s;
        }
        .cs-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--olive); }

        .cs-banner {
          height: 140px; display: flex; align-items: center; justify-content: center;
          position: relative; color: rgba(255,255,255,0.92);
          font-size: 56px; font-weight: 800;
        }
        .cs-cat {
          position: absolute; top: 12px; left: 12px; background: rgba(255,255,255,0.92);
          color: var(--olive-dark); font-size: 12px; font-weight: 700;
          padding: 4px 10px; border-radius: 20px;
        }

        .cs-body { padding: 18px 18px 16px; display: flex; flex-direction: column; flex: 1; }
        .cs-body h3 { margin: 0 0 8px; font-size: 18px; line-height: 1.3; text-align: left; }
        .cs-desc {
          margin: 0 0 16px; color: var(--muted); font-size: 14px; line-height: 1.55; text-align: left;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .cs-foot {
          margin-top: auto; display: flex; align-items: center; justify-content: space-between;
          padding-top: 14px; border-top: 1px solid var(--border);
        }
        .cs-level {
          font-size: 12px; font-weight: 600; color: var(--olive-dark);
          background: var(--olive-light); padding: 4px 10px; border-radius: 20px;
        }
        .cs-price { font-size: 18px; font-weight: 800; color: var(--accent); }
        .cs-price.free { color: var(--success); }

        /* Loading skeleton */
        .cs-skel { border-radius: 16px; border: 1px solid var(--border); background: var(--card); overflow: hidden; }
        .cs-skel-top, .cs-skel-line {
          background: linear-gradient(90deg, #ece5d0 25%, #f5f0e1 50%, #ece5d0 75%);
          background-size: 200% 100%; animation: shimmer 1.3s infinite;
        }
        .cs-skel-top { height: 140px; }
        .cs-skel-body { padding: 18px; }
        .cs-skel-line { height: 14px; border-radius: 6px; margin-bottom: 12px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        .cs-empty {
          text-align: center; padding: 60px 20px; background: var(--card);
          border: 1px dashed var(--border); border-radius: 16px;
        }
        .cs-empty h3 { margin: 0 0 6px; }
        .cs-empty p { margin: 0 0 18px; color: var(--muted); }

        @media (max-width: 600px) {
          .cs-page { padding: 24px 16px 40px; }
          .cs-select { min-width: 100%; }
        }
      `}</style>

      <div className="cs-head">
        <h1>Explore Courses</h1>
        <p>Find the right course and start learning today.</p>
      </div>

      <div className="cs-filters">
        <div className="cs-search">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="cs-select">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All categories" : c}
              </option>
            ))}
          </select>
        </div>
        <div className="cs-select">
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            {levels.map((l) => (
              <option key={l} value={l}>
                {l === "All" ? "All levels" : l}
              </option>
            ))}
          </select>
        </div>
        <button className="cs-clear" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {loading && (
        <div className="cs-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div className="cs-skel" key={n}>
              <div className="cs-skel-top"></div>
              <div className="cs-skel-body">
                <div className="cs-skel-line" style={{ width: "70%" }}></div>
                <div className="cs-skel-line" style={{ width: "100%" }}></div>
                <div className="cs-skel-line" style={{ width: "55%" }}></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="cs-empty">
          <h3>Could not load courses</h3>
          <p>Please check that the server is running and try again.</p>
          <button className="btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="cs-empty">
          <h3>No courses yet</h3>
          <p>Approved courses will show up here.</p>
        </div>
      )}

      {!loading && !error && courses.length > 0 && (
        <>
          <div className="cs-count">
            Showing {filtered.length} of {courses.length} courses
          </div>

          {filtered.length === 0 ? (
            <div className="cs-empty">
              <h3>No matching courses</h3>
              <p>Try a different search or clear the filters.</p>
              <button className="btn" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="cs-grid">
              {filtered.map((course, i) => (
                <Link to={`/courses/${course.id}`} className="cs-card" key={course.id}>
                  <div
                    className="cs-banner"
                    style={{ background: BANNERS[i % BANNERS.length] }}
                  >
                    {course.category && <span className="cs-cat">{course.category}</span>}
                    {(course.title || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="cs-body">
                    <h3>{course.title}</h3>
                    <p className="cs-desc">{course.description}</p>
                    <div className="cs-foot">
                      {course.level ? (
                        <span className="cs-level">{course.level}</span>
                      ) : (
                        <span></span>
                      )}
                      <span
                        className={`cs-price ${
                          !course.price || Number(course.price) === 0 ? "free" : ""
                        }`}
                      >
                        {formatPrice(course.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Courses;