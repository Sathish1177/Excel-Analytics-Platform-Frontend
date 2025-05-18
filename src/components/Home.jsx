import React from 'react';
import { Link } from 'react-router-dom';
import FileUpload from './File-uploading-component/Fileupload';
import ChartVisualization from './ChartVisualization';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-gray-800">Excel Analytics Platform</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Upload and Analyze Excel Files</h2>
            <FileUpload />
          </div>

          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Data Visualization</h2>
            <ChartVisualization />
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Analyses</h2>
              <div className="space-y-4">
                {/* Add your analysis history component here */}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  Download Latest Analysis
                </button>
                <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                  Generate AI Summary
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;