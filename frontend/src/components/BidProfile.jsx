import React from 'react';

const BidProfile = ({ profile = {
  name: '',
  years: '',
  time: '',
  bids: ''
}}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="p-2 text-gray-700">Profile</th>
            <th className="p-2 text-gray-700">Years</th>
            <th className="p-2 text-gray-700">Time</th>
            <th className="p-2 text-gray-700">Bids</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white hover:bg-gray-50 transition-colors">
            <td className="p-2 border-t">{profile.name}</td>
            <td className="p-2 border-t">{profile.years}</td>
            <td className="p-2 border-t">{profile.time}</td>
            <td className="p-2 border-t">{profile.bids}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BidProfile;