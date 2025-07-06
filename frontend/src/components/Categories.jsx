// import {
//   FiSmartphone,
//   FiMonitor,
//   FiWatch,
//   FiCamera,
//   FiHeadphones,
// } from "react-icons/fi";
// import { motion } from "framer-motion";
// import { Link } from "react-router-dom";

// const Categories = () => {
//   const categories = [
//     {
//       name: "Mobile Phones",
//       icon: FiSmartphone,
//       bg: "bg-[#FFAA5D]/10",
//       iconColor: "text-[#FFAA5D]",
//       hover: "hover:bg-[#FFAA5D]/20"
//     },
//     {
//       name: "Laptops",
//       icon: FiMonitor,
//       bg: "bg-[#016A6D]/10",
//       iconColor: "text-[#016A6D]",
//       hover: "hover:bg-[#016A6D]/20"
//     },
//     {
//       name: "Tablets",
//       icon: FiWatch,
//       bg: "bg-[#E16A3D]/10",
//       iconColor: "text-[#E16A3D]",
//       hover: "hover:bg-[#E16A3D]/20"
//     },
//     {
//       name: "Camera Equipment",
//       icon: FiCamera,
//       bg: "bg-[#043E52]/10",
//       iconColor: "text-[#043E52]",
//       hover: "hover:bg-[#043E52]/20"
//     },
//     {
//       name: "Home Appliances",
//       icon: FiHeadphones,
//       bg: "bg-[#FFAA5D]/10",
//       iconColor: "text-[#FFAA5D]",
//       hover: "hover:bg-[#FFAA5D]/20"
//     }
//   ];

//   return (
//     <section className="py-20 bg-[#e6f2f5]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.8 }}
//           className="text-center mb-16"
//         >
//           <motion.h2
//             className="text-sm font-semibold text-[#016A6D] uppercase tracking-wider mb-2"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.2 }}
//           >
//             Browse Categories
//           </motion.h2>
//           <div className="relative inline-block">
//             <motion.h1
//               className="text-4xl font-bold text-[#043E52] mb-4 relative z-10"
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ delay: 0.3 }}
//             >
//               Shop By <span className="text-[#FFAA5D]">Category</span>
//             </motion.h1>
//             <motion.div
//               initial={{ width: 0 }}
//               whileInView={{ width: "100%" }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//               className="absolute bottom-2 h-2 bg-[#016A6D]/30 -z-0"
//             />
//           </div>
//           <motion.p
//             className="text-lg text-[#043E52]/80 max-w-2xl mx-auto"
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             transition={{ delay: 0.5 }}
//           >
//             Discover products in your favorite categories
//           </motion.p>
//         </motion.div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center items-center text-center">
//           {categories.map((category, index) => (
//             <motion.div
//               key={category.name}
//               initial={{ scale: 0.9, opacity: 0, y: 20 }}
//               whileInView={{ scale: 1, opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{
//                 duration: 0.6,
//                 delay: index * 0.1,
//                 type: "spring",
//                 stiffness: 100
//               }}
//               whileHover={{
//                 y: -8,
//                 scale: 1.03,
//                 boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//               }}
//             >
//               <Link
//                 to={`/allproducts?category=${encodeURIComponent(category.name)}`}
//                 className={`flex flex-col items-center p-8 rounded-xl justify-items-center ${category.bg} ${category.hover} transition-all duration-300 cursor-pointer border border-[#016A6D]/10`}
//               >
//                 <motion.div
//                   whileHover={{ rotate: 10, scale: 1.1 }}
//                   transition={{ type: "spring" }}
//                 >
//                   <category.icon className={`w-10 h-10 mb-4 ${category.iconColor}`} />
//                 </motion.div>
//                 <span className="text-lg font-medium text-[#043E52]">
//                   {category.name}
//                 </span>
//                 <motion.div
//                   className="w-0 h-0.5 bg-[#FFAA5D] mt-2"
//                   initial={{ width: 0 }}
//                   whileHover={{ width: "40%" }}
//                   transition={{ duration: 0.3 }}
//                 />
//               </Link>
//             </motion.div>
//           ))}
//         </div>

//         {/* Decorative elements */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 0.1 }}
//           transition={{ duration: 1 }}
//           className="absolute left-0 -bottom-20 w-full h-40 bg-[#FFAA5D] blur-3xl -z-10"
//         />
//       </div>
//     </section>
//   );
// };

// export default Categories;


import {
  FiSmartphone,
  FiMonitor,
  FiWatch,
  FiCamera,
  FiHeadphones,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = [
    {
      name: "Mobile Phones",
      icon: FiSmartphone,
      bg: "bg-[#FFAA5D]/10",
      iconColor: "text-[#FFAA5D]",
      hover: "hover:bg-[#FFAA5D]/20",
    },
    {
      name: "Laptops",
      icon: FiMonitor,
      bg: "bg-[#016A6D]/10",
      iconColor: "text-[#016A6D]",
      hover: "hover:bg-[#016A6D]/20",
    },
    {
      name: "Tablets",
      icon: FiWatch, // Consider changing this icon if it doesn't represent tablets well
      bg: "bg-[#E16A3D]/10",
      iconColor: "text-[#E16A3D]",
      hover: "hover:bg-[#E16A3D]/20",
    },
    {
      name: "Camera Equipment",
      icon: FiCamera,
      bg: "bg-[#043E52]/10",
      iconColor: "text-[#043E52]",
      hover: "hover:bg-[#043E52]/20",
    },
    {
      name: "Home Appliances",
      icon: FiHeadphones, // Consider changing this icon if it doesn't represent home appliances well
      bg: "bg-[#FFAA5D]/10",
      iconColor: "text-[#FFAA5D]",
      hover: "hover:bg-[#FFAA5D]/20",
    },
  ];

  return (
    <section className="py-20 bg-[#e6f2f5] font-sans"> {/* Added font-sans here */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"> {/* Added relative for blur element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-sm font-semibold text-[#016A6D] uppercase tracking-wider mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Browse Categories
          </motion.h2>
          <div className="relative inline-block">
            <motion.h1
              className="text-4xl font-bold text-[#043E52] mb-4 relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Shop By <span className="text-[#FFAA5D]">Category</span>
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute bottom-2 h-2 bg-[#016A6D]/30 -z-0"
            />
          </div>
          <motion.p
            className="text-lg text-[#043E52]/80 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Discover products in your favorite categories
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"> {/* Removed justify-items-center and items-center */}
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                y: -8,
                scale: 1.03,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
              // Add fixed width and height or aspect-ratio here
              className="w-full" // Ensure it takes full width of its grid cell
            >
              <Link
                to={`/allproducts?category=${encodeURIComponent(category.name)}`}
                // Crucial for fixed size: flex-col, justify-center, items-center, h-48 or aspect-square
                className={`flex flex-col items-center justify-center p-4 rounded-xl ${category.bg} ${category.hover} 
                           transition-all duration-300 cursor-pointer border border-[#016A6D]/10
                           h-48 w-full text-center relative overflow-hidden`} 
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring" }}
                  className="flex-shrink-0"
                >
                  <category.icon className={`w-12 h-12 mb-3 ${category.iconColor}`} /> {/* Increased icon size and reduced margin for better fit */}
                </motion.div>
                <span className="text-lg font-medium text-[#043E52] leading-tight px-2"> {/* Added leading-tight and px */}
                  {category.name}
                </span>
                <motion.div
                  className="w-0 h-0.5 bg-[#FFAA5D] mt-2 absolute bottom-4"
                  initial={{ width: 0 }}
                  whileHover={{ width: "40%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Decorative elements - ensure it's within the relative parent div */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute left-0 -bottom-20 w-full h-40 bg-[#FFAA5D] blur-3xl -z-10"
        />
      </div>
    </section>
  );
};

export default Categories;