import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const IntegratedDashboard: React.FC = () => {
  // States for metrics and graphs
  const [metrics, setMetrics] = useState<any[]>([]);
  const [qualityData, setQualityData] = useState<any>({ labels: [], datasets: [] });
  const [viewerData, setViewerData] = useState<any>({ labels: [], datasets: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:3000/stream-metrics", {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        const data = await response.json();
        setMetrics(data.metrics);

        // Prepare data for Quality Trends Graph
        const qualityLabels = data.metrics.map((metric: any) => `Stream ${metric.streamId}`);
        const qualityValues = data.metrics.map((metric: any) =>
          parseFloat(metric.quality.replace("%", ""))
        );

        setQualityData({
          labels: qualityLabels,
          datasets: [
            {
              label: "Stream Quality (%)",
              data: qualityValues,
              backgroundColor: "rgba(0, 82, 204, 0.5)",
              borderColor: "#0052CC",
            },
          ],
        });

        // Prepare data for Viewer Trends Graph
        const viewerLabels = qualityLabels;
        const viewerValues = data.metrics.map((metric: any) => metric.viewers);

        setViewerData({
          labels: viewerLabels,
          datasets: [
            {
              label: "Viewers Over Time",
              data: viewerValues,
              backgroundColor: "rgba(255, 122, 0, 0.5)",
              borderColor: "#FF7A00",
            },
          ],
        });
      } catch (err) {
        setError("Failed to fetch metrics");
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#0052CC", color: "white" }}>
      <h1 style={{ color: "#FF7A00", fontSize: "2rem" }}>Live Stream Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Quality Trends Graph */}
      <div style={{ background: "white", borderRadius: "8px", margin: "20px 0", padding: "20px" }}>
        <h2 style={{ color: "#0052CC" }}>Quality Trends</h2>
        <Line data={qualityData} />
      </div>

      {/* Viewer Trends Graph */}
      <div style={{ background: "white", borderRadius: "8px", margin: "20px 0", padding: "20px" }}>
        <h2 style={{ color: "#FF7A00" }}>Viewers Over Time</h2>
        <Line data={viewerData} />
      </div>

      {/* Raw Metrics Data */}
      <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "20px" }}>
        <h2 style={{ color: "#0052CC" }}>Raw Metrics</h2>
        {metrics.map((metric, index) => (
          <div key={index} style={{ margin: "10px 0", borderBottom: "1px solid #ccc" }}>
            <p>
              <strong>Stream ID:</strong> {metric.streamId}
            </p>
            <p>
              <strong>Platforms:</strong> {metric.platforms.join(", ")}
            </p>
            <p>
              <strong>Quality:</strong> {metric.quality}
            </p>
            <p>
              <strong>Viewers:</strong> {metric.viewers}
            </p>
            <p>
              <strong>Duration:</strong> {metric.duration} seconds
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegratedDashboard;
