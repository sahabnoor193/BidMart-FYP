// src/components/Categories.jsx
import {
  FiSmartphone,
  FiMonitor,
  FiWatch,
  FiCamera,
  FiHeadphones,
  FiZap,
} from "react-icons/fi";

const Categories = () => {
  const categories = [
    { name: "Phones", icon: FiSmartphone },
    { name: "Computers", icon: FiMonitor },
    { name: "Smartwatch", icon: FiWatch },
    { name: "Cameras", icon: FiCamera },
    { name: "Headphones", icon: FiHeadphones },
    { name: "Gaming", icon: FiZap },
  ];

  return (
    <section className="pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-black flex items-center">
            <span className="bg-red-500 h-6 w-2 rounded-full mr-2"></span>
            Categories
          </h2>
          
          <div className="flex space-x-2">
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
              &lt;
            </button>
            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-red-500 mb-6">
          Browse By Categories
        </h1>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-300 hover:shadow-md transition cursor-pointer"
            >
              <category.icon className="w-8 h-8 mb-3 text-black" />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Line */}
      <div className="flex justify-center mt-8">
        <hr
          className="border-black w-11/12 border-2"
          style={{ margin: '0 auto' }}
        />
      </div>

    </section>
  );
};

export default Categories;
