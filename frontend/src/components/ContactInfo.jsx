
import React from 'react';

const ContactInfo = ({ contact }) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <span className="w-24 text-gray-600">Name</span>
        <span>{contact.name}</span>
      </div>
      <div className="flex gap-4">
        <span className="w-24 text-gray-600">Email</span>
        <span>{contact.email}</span>
      </div>
      <div className="flex gap-4">
        <span className="w-24 text-gray-600">Phone no.</span>
        <span>{contact.phone}</span>
      </div>
    </div>
  );
};

export default ContactInfo;
