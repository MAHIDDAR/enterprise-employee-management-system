import "./SettingsPage.css";

function SettingsPage() {

  return (

    <div className="settings-page">

      <div className="settings-header">

        <h1>
          Settings
        </h1>

        <p>
          Manage your application settings
          and preferences
        </p>

      </div>

      <div className="settings-grid">

        {/* PROFILE CARD */}
        <div className="settings-card">

          <h2>
            Admin Profile
          </h2>

          <div className="setting-item">

            <span>
              Admin Name
            </span>

            <strong>
              Admin User
            </strong>

          </div>

          <div className="setting-item">

            <span>
              Email
            </span>

            <strong>
              admin@gmail.com
            </strong>

          </div>

          <div className="setting-item">

            <span>
              Role
            </span>

            <strong>
              Super Admin
            </strong>

          </div>

        </div>

        {/* SYSTEM SETTINGS */}
        <div className="settings-card">

          <h2>
            System Settings
          </h2>

          <div className="setting-item">

            <span>
              Employee Management
            </span>

            <button className="active-btn">
              Active
            </button>

          </div>

          <div className="setting-item">

            <span>
              Attendance Tracking
            </span>

            <button className="active-btn">
              Enabled
            </button>

          </div>

          <div className="setting-item">

            <span>
              Database Status
            </span>

            <button className="active-btn">
              Connected
            </button>

          </div>

        </div>

        {/* SECURITY */}
        <div className="settings-card">

          <h2>
            Security
          </h2>

          <div className="setting-item">

            <span>
              Two Factor Authentication
            </span>

            <button className="inactive-btn">
              Disabled
            </button>

          </div>

          <div className="setting-item">

            <span>
              Password Protection
            </span>

            <button className="active-btn">
              Enabled
            </button>

          </div>

          <div className="setting-item">

            <span>
              Login Alerts
            </span>

            <button className="active-btn">
              Active
            </button>

          </div>

        </div>

        {/* APPLICATION INFO */}
        <div className="settings-card">

          <h2>
            Application Info
          </h2>

          <div className="setting-item">

            <span>
              Project Name
            </span>

            <strong>
              Enterprise Employee
              Management System
            </strong>

          </div>

          <div className="setting-item">

            <span>
              Frontend
            </span>

            <strong>
              React + Vite
            </strong>

          </div>

          <div className="setting-item">

            <span>
              Backend
            </span>

            <strong>
              FastAPI + SQLite
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SettingsPage;