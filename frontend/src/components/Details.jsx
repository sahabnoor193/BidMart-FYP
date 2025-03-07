
import React from 'react';

const Details = ({ quantity, brand, dateStart, dateEnd, description }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg">
          <h3 className="text-lg font-medium">Quantity</h3>
          <p>{quantity}</p>
        </div>
        <div className="p-4 bg-white rounded-lg">
          <h3 className="text-lg font-medium">Brand</h3>
          <p>{brand}</p>
        </div>
        <div className="p-4 bg-white rounded-lg">
          <h3 className="text-lg font-medium">Date Start</h3>
          <p>{dateStart}</p>
        </div>
        <div className="p-4 bg-white rounded-lg">
          <h3 className="text-lg font-medium">Date End</h3>
          <p>{dateEnd}</p>
        </div>
      </div>
      <div className="p-4 bg-white rounded-lg">
        <h3 className="text-lg font-medium mb-2">Description</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Details;
