import { useState } from "react";

const SAMPLE_ERROR = `TypeError: Cannot read properties of undefined (reading 'map')
    at UserList (UserList.tsx:14:23)`;

const SAMPLE_CODE = `function UserList({ users }) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

function App() {
  const [users, setUsers] = useState();

  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);

  return <UserList users={users} />;
}`;

export default function Home() {
  const [error, setError] = useState(SAMPLE_ERROR);
  const [code, setCode] = useState(SAMPLE_CODE);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function handleAnalyze() {
    setLoading(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (e) {
      setErr(e.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="wrap">
        <div className="eyebrow">stack_trace &gt; resolved</div>
        <h1>Paste the error. Get the fix.</h1>
        <p className="sub">
          Built for React and TypeScript. No account, no setup — just the
          stack trace and the code around it.
        </p>

        <label className="label">error</label>
        <textarea
          value={error}
          onChange={(e) => setError(e.target.value)}
          rows={3}
        />

        <label className="label">code</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
        />

        <button onClick={handleAnalyze} disabled={loading || !error.trim() || !code.trim()}>
          {loading ? "Analyzing…" : "Analyze error"}
        </button>

        {err && <div className="error-msg">{err}</div>}

        {result && (
          <div className="results">
            <div>
              <div className="label">diagnosis</div>
              <p>{result.diagnosis}</p>
            </div>
            <div>
              <div className="label">fix</div>
              <pre>{result.fix}</pre>
            </div>
            <div>
              <div className="label">why</div>
              <p className="why">{result.explanation}</p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          background: #151312;
          color: #ede6da;
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>

      <style jsx>{`
        .wrap {
          max-width: 880px;
          margin: 0 auto;
          padding: 56px 24px 80px;
        }
        .eyebrow {
          display: inline-block;
          font-family: monospace;
          font-size: 13px;
          color: #e8874a;
          letter-spacing: 1px;
          margin-bottom: 12px;
          border: 1px solid #3a332c;
          padding: 3px 10px;
          border-radius: 3px;
        }
        h1 {
          font-size: 34px;
          font-weight: 600;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
          line-height: 1.15;
        }
        .sub {
          color: #9a9186;
          font-size: 15px;
          margin: 0 0 32px;
          max-width: 520px;
        }
        .label {
          font-family: monospace;
          font-size: 12px;
          color: #e8874a;
          display: block;
          margin-bottom: 6px;
          margin-top: 20px;
        }
        textarea {
          width: 100%;
          box-sizing: border-box;
          background: #1d1a18;
          border: 1px solid #3a332c;
          border-radius: 6px;
          color: #ede6da;
          font-family: monospace;
          font-size: 13px;
          padding: 14px;
          resize: vertical;
          outline: none;
        }
        button {
          background: #e8874a;
          color: #151312;
          border: none;
          border-radius: 6px;
          padding: 12px 22px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 24px;
        }
        button:disabled {
          background: #3a332c;
          color: #9a9186;
          cursor: default;
        }
        .error-msg {
          color: #e8874a;
          font-size: 14px;
          margin-top: 16px;
        }
        .results {
          border-top: 1px solid #3a332c;
          margin-top: 32px;
          padding-top: 28px;
          display: grid;
          gap: 24px;
        }
        .results p {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
        }
        .results .why {
          color: #9a9186;
          font-size: 14px;
        }
        pre {
          background: #1d1a18;
          border: 1px solid #2e6b4f;
          border-left: 3px solid #4caf7d;
          border-radius: 6px;
          padding: 16px;
          overflow-x: auto;
          margin: 0;
          font-family: monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #c9f0d9;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}
