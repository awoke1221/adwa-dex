import React from 'react';
import ProfileOverview from './ProfileOverview';
import PoolChart from './PoolChart';
import PopularPools from './PopularPools';

const ProfilePage: React.FC = () => {
  // Mock data for charts
  const tvlData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [100000, 150000, 180000, 220000, 280000, 320000],
  };

  const volumeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [50000, 75000, 90000, 110000, 140000, 160000],
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Profile Overview</h1>
      
      <ProfileOverview />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PoolChart
          data={tvlData}
          label="Total Value Locked (TVL)"
          color="#3B82F6"
        />
        <PoolChart
          data={volumeData}
          label="Trading Volume"
          color="#10B981"
        />
      </div>

      <PopularPools />
    </div>
  );
};

export default ProfilePage;