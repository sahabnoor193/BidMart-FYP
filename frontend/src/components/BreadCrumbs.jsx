import React from 'react';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ paths }) => {
  return (
    <div className="flex items-center gap-2 text-2xl text-black mb-6 font-bold">
      <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
      {paths.map((path, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={16} />}
          <span className={index === paths.length - 1 ? 'text-red-500 ' : ''}>
            {path}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
