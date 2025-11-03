import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MetricsDashboard() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/api/stream-metrics');
        setMetrics(response.data.metrics);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          // Redirect to login if not authenticated
          window.location.href = '/';
        } else {
          setError('Failed to fetch stream metrics. Please try again later.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading metrics...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="metrics-container">
      <h3>Live Stream Metrics</h3>
      {metrics.length === 0 ? (
        <p>No active streams. Start a stream to see metrics here.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Stream ID</th>
              <th>Viewers</th>
              <th>Duration (s)</th>
              <th>Quality</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((stream) => (
              <tr key={stream.streamId}>
                <td>{stream.streamId}</td>
                <td>{stream.viewers}</td>
                <td>{stream.duration}</td>
                <td>{stream.quality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MetricsDashboard;