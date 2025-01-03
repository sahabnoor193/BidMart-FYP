import React, { useState } from 'react';

const BackgroundChecker = () => {
  const [bgColor, setBgColor] = useState('#ffffff'); // Default white background

  const handleChangeColor = (event) => {
    setBgColor(event.target.value);
  };

  return (
    <div style={{ backgroundColor: bgColor, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <input
        type="color"
        value={bgColor}
        onChange={handleChangeColor}
        style={{ padding: '10px', border: 'none', borderRadius: '5px' }}
      />
      <span style={{ marginLeft: '10px', fontSize: '20px' }}>Pick a background color</span>
    </div>
  );
};

export default BackgroundChecker;