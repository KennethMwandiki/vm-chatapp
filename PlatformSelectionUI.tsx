import React from "react";
import './Branding CSS Styling.css';

interface PlatformSelectionUIProps {
  allPlatforms: string[];
  setAllPlatforms: (platforms: string[]) => void;
  selectedPlatforms: string[];
  setSelectedPlatforms: (platforms: string[]) => void;
}

const PlatformSelectionUI: React.FC<PlatformSelectionUIProps> = ({ allPlatforms, setAllPlatforms, selectedPlatforms, setSelectedPlatforms }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newPlatformName, setNewPlatformName] = React.useState("");

  const handleChange = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="platform-selection">
      <h3>Select Platforms:</h3>
      <div className="platform-grid">
        {allPlatforms.map(platform => (
          <label key={platform} className="platform-item">
            <input
              type="checkbox"
              checked={selectedPlatforms.includes(platform)}
              onChange={() => handleChange(platform)}
            />
            {platform}
          </label>
        ))}
      </div>
      <button className="add-custom-rtmp-btn" onClick={() => setIsModalOpen(true)}>Add Custom RTMP</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Add Custom RTMP</h3>
            <input
              type="text"
              value={newPlatformName}
              onChange={(e) => setNewPlatformName(e.target.value)}
              placeholder="Enter platform name"
            />
            <button onClick={() => {
              setAllPlatforms([...allPlatforms, newPlatformName]);
              setIsModalOpen(false);
              setNewPlatformName("");
            }}>Save</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformSelectionUI;

