import React from 'react';
import { FaStore, FaShoppingCart, FaUsers, FaChartLine } from 'react-icons/fa';

const teamMembers = [
  { name: 'Sahab Noor', role: 'MERN Developer & Designer' },
  { name: 'Sania Aimen', role: 'MERN Developer' },
];

const AboutUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Our Story */}
      <section className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <h2 className="text-4xl font-bold mb-4">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            BidMart was born from a vision to transform online marketplaces into dynamic, interactive communities. By combining real-time bidding, seamless product management, and live support, we've created a platform that empowers buyers and sellers alike.
            <br /><br />
            Built on the MERN stack, BidMart offers a fast, secure, and engaging experience where every bid brings you closer to your next great deal.
          </p>
        </div>
        <div>
          <img
            src="/your-image-path.jpg"
            alt="Team"
            className="rounded-xl w-full shadow-xl"
          />
        </div>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center mb-20">
        {/* Card 1 */}
        <div className="group bg-white p-6 rounded-xl shadow transition duration-300 hover:bg-red-500 hover:text-white cursor-pointer">
          <FaStore className="mx-auto text-3xl text-red-500 mb-2 transition duration-300 group-hover:text-white" />
          <h3 className="text-2xl font-bold">0k</h3>
          <p className="mt-1">Sellers active our site</p>
        </div>

        {/* Card 2 */}
        <div className="group bg-white p-6 rounded-xl shadow transition duration-300 hover:bg-red-500 hover:text-white cursor-pointer">
          <FaShoppingCart className="mx-auto text-3xl text-red-500 mb-2 transition duration-300 group-hover:text-white" />
          <h3 className="text-2xl font-bold">0k</h3>
          <p className="mt-1">Monthly Product Sale</p>
        </div>

        {/* Card 3 */}
        <div className="group bg-white p-6 rounded-xl shadow transition duration-300 hover:bg-red-500 hover:text-white cursor-pointer">
          <FaUsers className="mx-auto text-3xl text-red-500 mb-2 transition duration-300 group-hover:text-white" />
          <h3 className="text-2xl font-bold">0k</h3>
          <p className="mt-1">Customer active in our site</p>
        </div>

        {/* Card 4 */}
        <div className="group bg-white p-6 rounded-xl shadow transition duration-300 hover:bg-red-500 hover:text-white cursor-pointer">
          <FaChartLine className="mx-auto text-3xl text-red-500 mb-2 transition duration-300 group-hover:text-white" />
          <h3 className="text-2xl font-bold">0k</h3>
          <p className="mt-1">Annual gross sale in our site</p>
        </div>
      </section>

      {/* Team */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-10">Our Team</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
            >
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-4"></div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
