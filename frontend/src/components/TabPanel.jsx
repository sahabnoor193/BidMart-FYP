import React, { useState } from 'react';

const TabPanel = ({ tabs = [
  {
    id: 'tab1',
    label: 'Tab 1',
    content: <div>Content 1</div>
  }
]}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2 border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium transition-colors duration-200 whitespace-nowrap hover:text-red-600 focus:outline-none focus:text-red-600 ${
              activeTab === tab.id
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-600 hover:text-red-500'
            }`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          className={`p-4 bg-gray-50 rounded-lg mt-4 transition-opacity duration-200 ${
            activeTab === tab.id ? 'block' : 'hidden'
          }`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

export default TabPanel;