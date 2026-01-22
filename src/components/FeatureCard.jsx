import React from 'react';

export default function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-600 hover:border-blue-500 transition-all">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

