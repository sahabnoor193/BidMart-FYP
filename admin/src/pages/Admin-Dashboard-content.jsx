// import React, { useState, useEffect } from 'react';
// import { FiUsers, FiShoppingCart, FiUserCheck, FiTrendingUp } from 'react-icons/fi';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { fetchAllUsers } from '../features/Dashboard_Slices';
// import { useDispatch, useSelector } from 'react-redux';

// const AnimatedCounter = ({ target, duration = 1000 }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const increment = target / (duration / 16);

//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= target) {
//         setCount(target);
//         clearInterval(timer);
//       } else {
//         setCount(Math.ceil(start));
//       }
//     }, 16);

//     return () => clearInterval(timer);
//   }, [target, duration]);

//   return <span>{count.toLocaleString()}</span>;
// };

// const StatBox = ({ icon, title, value, trend, color }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div 
//       className={`bg-white rounded-2xl p-6 hover:bg-gray-50 shadow-md transition-all duration-300 cursor-pointer ${isHovered ? 'transform -translate-y-1 shadow-lg' : ''}`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div className="flex items-start justify-between">
//         <div>
//           <div className={`w-12 h-12 rounded-full ${color} bg-opacity-20 flex items-center justify-center mb-4`}>
//             {React.cloneElement(icon, { className: `text-xl ${color}` })}
//           </div>
//           <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
//           <p className="text-2xl font-semibold mt-1">
//             <AnimatedCounter target={value} />
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-white p-4 shadow-md rounded-lg border border-gray-100">
//         <p className="font-semibold">{label}</p>
//         <p className="text-blue-500">Total Users: {payload[0].value.toLocaleString()}</p>
//         <p className="text-purple-500">Buyers: {payload[1].value.toLocaleString()}</p>
//         <p className="text-orange-500">Sellers: {payload[2].value.toLocaleString()}</p>
//       </div>
//     );
//   }
//   return null;
// };

// const Admin_Dashboard_Content = () => {
//   const dispatch = useDispatch();
//   const { user_Data, loading, error } = useSelector((state) => state.dashboard);
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     buyers: 0,
//     sellers: 0
//   });
//   const [userGrowthData, setUserGrowthData] = useState([]);

//   // Fetch users on component mount
//   useEffect(() => {
//     dispatch(fetchAllUsers());
//   }, [dispatch]);

//   // Calculate statistics when user data changes
//   useEffect(() => {
//     if (user_Data && user_Data.length > 0) {
//       // Calculate total counts based on user type
//       const totalUsers = user_Data.length;
//       const buyers = user_Data.filter(user => user.type === 'buyer').length;
//       const sellers = user_Data.filter(user => user.type === 'seller').length;

//       setStats({
//         totalUsers,
//         buyers,
//         sellers
//       });

//       // Generate monthly growth data
//       const currentDate = new Date();
//       const monthsData = Array.from({ length: 7 }, (_, i) => {
//         const date = new Date(currentDate);
//         date.setMonth(currentDate.getMonth() - (6 - i));
        
//         return {
//           date,
//           monthName: date.toLocaleString('default', { month: 'short' }),
//           year: date.getFullYear()
//         };
//       });

//       // Calculate cumulative counts for each month
//       const growthData = monthsData.map(({ monthName, date }) => {
//         const usersUpToDate = user_Data.filter(user => {
//           const userDate = new Date(user.createdAt);
//           return userDate <= new Date(date.getFullYear(), date.getMonth() + 1, 0);
//         });

//         return {
//           name: monthName,
//           totalUsers: usersUpToDate.length,
//           buyers: usersUpToDate.filter(u => u.type === 'buyer').length,
//           sellers: usersUpToDate.filter(u => u.type === 'seller').length,
//           // For tooltip display
//           month: date.toLocaleString('default', { month: 'long' }),
//           year: date.getFullYear()
//         };
//       });

//       setUserGrowthData(growthData);
//     }
//   }, [user_Data]);

//   if (loading) {
//     return (
//       <div className="w-full mx-auto space-y-6 p-6 pt-[75px] flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="w-full mx-auto space-y-6 p-6 pt-[75px]">
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
//           <p>Error loading dashboard data: {error}</p>
//           <button 
//             onClick={() => dispatch(fetchAllUsers())}
//             className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full mx-auto space-y-6 p-6 pt-[75px]">
//       {/* Stats Overview */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <StatBox
//           icon={<FiUsers />}
//           title="Total Users"
//           value={stats.totalUsers}
//           trend={{ value: 'Last 30 days', percentage: 12.5, color: 'text-green-500' }}
//           color="text-blue-500"
//         />
//         <StatBox
//           icon={<FiShoppingCart />}
//           title="Buyers"
//           value={stats.buyers}
//           trend={{ value: 'Last 30 days', percentage: 8.2, color: 'text-green-500' }}
//           color="text-purple-500"
//         />
//         <StatBox
//           icon={<FiUserCheck />}
//           title="Sellers"
//           value={stats.sellers}
//           trend={{ value: 'Last 30 days', percentage: 4.3, color: 'text-green-500' }}
//           color="text-orange-500"
//         />
//       </div>

//       {/* User Growth Chart Section */}
//       <div className="bg-white rounded-2xl p-6 shadow-md">
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-lg font-semibold">User Growth</h2>
//           <div className="flex items-center text-green-500">
//             <FiTrendingUp className="mr-1" />
//             <span>Last 7 Months</span>
//           </div>
//         </div>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart
//               data={userGrowthData}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//               <XAxis dataKey="name" stroke="#888" />
//               <YAxis stroke="#888" />
//               <Tooltip 
//                 content={<CustomTooltip />}
//                 formatter={(value, name) => {
//                   if (name === 'Total Users') return [value, 'Total Users'];
//                   if (name === 'Buyers') return [value, 'Buyers'];
//                   if (name === 'Sellers') return [value, 'Sellers'];
//                   return value;
//                 }}
//                 labelFormatter={(label) => {
//                   const dataPoint = userGrowthData.find(d => d.name === label);
//                   return dataPoint ? `${dataPoint.month} ${dataPoint.year}` : label;
//                 }}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="totalUsers"
//                 stroke="#3b82f6"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//                 name="Total Users"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="buyers"
//                 stroke="#8b5cf6"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//                 name="Buyers"
//               />
//               <Line
//                 type="monotone"
//                 dataKey="sellers"
//                 stroke="#f97316"
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//                 name="Sellers"
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Admin_Dashboard_Content;

import React, { useState, useEffect } from 'react';
import { FiUsers, FiShoppingCart, FiUserCheck, FiTrendingUp } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAllUsers } from '../features/Dashboard_Slices';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ target, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const StatBox = ({ icon, title, value, trend, color }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorMap = {
    'text-[#016A6D]': '#016A6D',
    'text-[#E16A3D]': '#E16A3D',
    'text-[#FFAA5D]': '#FFAA5D'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-[#016A6D]/20 hover:shadow-2xl transition-all duration-300 ${
        isHovered ? 'ring-2 ring-[#016A6D]/10' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-[${colorMap[color]}]/20 to-white flex items-center justify-center mb-4`}>
            {React.cloneElement(icon, { className: `text-xl ${color}` })}
          </div>
          <h2 className="text-[#043E52]/80 text-sm font-medium">{title}</h2>
          <p className="text-2xl font-semibold mt-1 text-[#043E52]">
            <AnimatedCounter target={value} />
          </p>
        </div>
        <span className={`text-sm ${trend.color}`}>
          ↑ {trend.percentage}%
        </span>
      </div>
    </motion.div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/90 backdrop-blur-lg p-4 shadow-xl rounded-lg border border-[#016A6D]/20"
      >
        <p className="font-semibold text-[#043E52]">{label}</p>
        <div className="space-y-1 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#016A6D] rounded-full" />
            <span className="text-[#016A6D]">Total Users: {payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#E16A3D] rounded-full" />
            <span className="text-[#E16A3D]">Buyers: {payload[1].value.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#FFAA5D] rounded-full" />
            <span className="text-[#FFAA5D]">Sellers: {payload[2].value.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

const Admin_Dashboard_Content = () => {
  // ... existing logic remains unchanged ...
  const dispatch = useDispatch();
  const { user_Data, loading, error } = useSelector((state) => state.dashboard);
  const [stats, setStats] = useState({
    totalUsers: 0,
    buyers: 0,
    sellers: 0
  });
  const [userGrowthData, setUserGrowthData] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  // Calculate statistics when user data changes
  useEffect(() => {
    if (user_Data && user_Data.length > 0) {
      // Calculate total counts based on user type
      const totalUsers = user_Data.length;
      const buyers = user_Data.filter(user => user.type === 'buyer').length;
      const sellers = user_Data.filter(user => user.type === 'seller').length;

      setStats({
        totalUsers,
        buyers,
        sellers
      });

      // Generate monthly growth data
      const currentDate = new Date();
      const monthsData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(currentDate);
        date.setMonth(currentDate.getMonth() - (6 - i));
        
        return {
          date,
          monthName: date.toLocaleString('default', { month: 'short' }),
          year: date.getFullYear()
        };
      });

      // Calculate cumulative counts for each month
      const growthData = monthsData.map(({ monthName, date }) => {
        const usersUpToDate = user_Data.filter(user => {
          const userDate = new Date(user.createdAt);
          return userDate <= new Date(date.getFullYear(), date.getMonth() + 1, 0);
        });

        return {
          name: monthName,
          totalUsers: usersUpToDate.length,
          buyers: usersUpToDate.filter(u => u.type === 'buyer').length,
          sellers: usersUpToDate.filter(u => u.type === 'seller').length,
          // For tooltip display
          month: date.toLocaleString('default', { month: 'long' }),
          year: date.getFullYear()
        };
      });

      setUserGrowthData(growthData);
    }
  }, [user_Data]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="h-12 w-12 border-4 border-[#016A6D] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="max-w-md mx-auto mt-8 p-4 bg-[#E16A3D]/10 text-[#E16A3D] rounded-lg border border-[#E16A3D]/20"
      >
        ⚠️ Error: {error}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-[#e6f2f5] to-white font-serif py-12 px-4 sm:px-6 lg:px-8 w-full"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-gradient-to-r from-[#E16A3D] via-[#FFAA5D] to-[#016A6D] mb-8"
        />

        {/* Stats Overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatBox
            icon={<FiUsers />}
            title="Total Users"
            value={stats.totalUsers}
            trend={{ value: 'Last 30 days', percentage: 12.5, color: 'text-[#016A6D]' }}
            color="text-[#016A6D]"
          />
          <StatBox
            icon={<FiShoppingCart />}
            title="Buyers"
            value={stats.buyers}
            trend={{ value: 'Last 30 days', percentage: 8.2, color: 'text-[#E16A3D]' }}
            color="text-[#E16A3D]"
          />
          <StatBox
            icon={<FiUserCheck />}
            title="Sellers"
            value={stats.sellers}
            trend={{ value: 'Last 30 days', percentage: 4.3, color: 'text-[#FFAA5D]' }}
            color="text-[#FFAA5D]"
          />
        </motion.div>

        {/* User Growth Chart Section */}
        <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-[#016A6D]/20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-[#043E52]">User Growth</h2>
            <div className="flex items-center text-[#016A6D] gap-2">
              <FiTrendingUp className="w-5 h-5" />
              <span className="font-medium">Last 7 Months</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6f2f5" />
                <XAxis
                  dataKey="name"
                  stroke="#043E52"
                  tick={{ fill: '#043E52' }}
                />
                <YAxis
                  stroke="#043E52"
                  tick={{ fill: '#043E52' }}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ stroke: '#016A6D', strokeWidth: 1 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: 20 }}
                  formatter={(value) => (
                    <span className="text-[#043E52]">{value}</span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="totalUsers"
                  stroke="#016A6D"
                  strokeWidth={2}
                  dot={{ fill: '#016A6D', r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="buyers"
                  stroke="#E16A3D"
                  strokeWidth={2}
                  dot={{ fill: '#E16A3D', r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="sellers"
                  stroke="#FFAA5D"
                  strokeWidth={2}
                  dot={{ fill: '#FFAA5D', r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Admin_Dashboard_Content;