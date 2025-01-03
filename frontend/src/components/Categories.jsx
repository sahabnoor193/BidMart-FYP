// src/components/Categories.jsx
import { FiSmartphone, FiMonitor, FiWatch, FiCamera, FiHeadphones, FiZap } from 'react-icons/fi'

const Categories = () => {
  const categories = [
    { name: "Phones", icon: FiSmartphone },
    { name: "Computers", icon: FiMonitor },
    { name: "Smartwatch", icon: FiWatch },
    { name: "Cameras", icon: FiCamera },
    { name: "Headphones", icon: FiHeadphones },
    { name: "Gaming", icon: FiZap },
  ]

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-8">Browse By Category</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <div
              key={category.name}
              className="flex flex-col items-center p-6 bg-white rounded-lg hover:shadow-md transition cursor-pointer"
            >
              <category.icon className="w-8 h-8 mb-3" />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories