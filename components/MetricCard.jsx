import React from 'react';

const MetricCard = ({ title, value, unit, icon: Icon, description, trend }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            trend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <span className="text-sm font-normal text-gray-500">{unit}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      </div>
    </div>
  );
};

export default MetricCard;
