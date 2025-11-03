import React from 'react';
import MetricsDashboard from '../components/MetricsDashboard';

function DashboardPage() {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <a href="/api/auth/logout" className="logout-button">Logout</a>
      </div>
      <MetricsDashboard />
    </div>
  );
}
import React from 'react';
import MetricsDashboard from '../components/MetricsDashboard';

function DashboardPage() {
  return (
    <div>
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <a href="/api/auth/logout" className="logout-button">Logout</a>
      </div>
      <MetricsDashboard />
    </div>
  );
}

export default DashboardPage;

export default DashboardPage;