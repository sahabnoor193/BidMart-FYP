import React, { useState, useEffect } from 'react';
import { FiUsers, FiShoppingCart, FiUserCheck, FiTrendingUp } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchAllUsers } from '../features/Dashboard_Slices';
import { useDispatch, useSelector } from 'react-redux';

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

  return (
    <div 
      className={`bg-white rounded-2xl p-6 hover:bg-gray-50 shadow-md transition-all duration-300 cursor-pointer ${isHovered ? 'transform -translate-y-1 shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className={`w-12 h-12 rounded-full ${color} bg-opacity-20 flex items-center justify-center mb-4`}>
            {React.cloneElement(icon, { className: `text-xl ${color}` })}
          </div>
          <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
          <p className="text-2xl font-semibold mt-1">
            <AnimatedCounter target={value} />
          </p>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 shadow-md rounded-lg border border-gray-100">
        <p className="font-semibold">{label}</p>
        <p className="text-blue-500">Total Users: {payload[0].value.toLocaleString()}</p>
        <p className="text-purple-500">Buyers: {payload[1].value.toLocaleString()}</p>
        <p className="text-orange-500">Sellers: {payload[2].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const Admin_Dashboard_Content = () => {
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

  if (loading) {
    return (
      <div className="w-full mx-auto space-y-6 p-6 pt-[75px] flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto space-y-6 p-6 pt-[75px]">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>Error loading dashboard data: {error}</p>
          <button 
            onClick={() => dispatch(fetchAllUsers())}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-6 p-6 pt-[75px]">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatBox
          icon={<FiUsers />}
          title="Total Users"
          value={stats.totalUsers}
          trend={{ value: 'Last 30 days', percentage: 12.5, color: 'text-green-500' }}
          color="text-blue-500"
        />
        <StatBox
          icon={<FiShoppingCart />}
          title="Buyers"
          value={stats.buyers}
          trend={{ value: 'Last 30 days', percentage: 8.2, color: 'text-green-500' }}
          color="text-purple-500"
        />
        <StatBox
          icon={<FiUserCheck />}
          title="Sellers"
          value={stats.sellers}
          trend={{ value: 'Last 30 days', percentage: 4.3, color: 'text-green-500' }}
          color="text-orange-500"
        />
      </div>

      {/* User Growth Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">User Growth</h2>
          <div className="flex items-center text-green-500">
            <FiTrendingUp className="mr-1" />
            <span>Last 7 Months</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={userGrowthData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value, name) => {
                  if (name === 'Total Users') return [value, 'Total Users'];
                  if (name === 'Buyers') return [value, 'Buyers'];
                  if (name === 'Sellers') return [value, 'Sellers'];
                  return value;
                }}
                labelFormatter={(label) => {
                  const dataPoint = userGrowthData.find(d => d.name === label);
                  return dataPoint ? `${dataPoint.month} ${dataPoint.year}` : label;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalUsers"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Total Users"
              />
              <Line
                type="monotone"
                dataKey="buyers"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Buyers"
              />
              <Line
                type="monotone"
                dataKey="sellers"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Sellers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Admin_Dashboard_Content;