import { useState, useEffect } from 'react';

const RecentAnalysis = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/analysis/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAnalyses(data);
      setLoading(false);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Failed to fetch recent analyses');
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => (
        <div key={analysis._id} className="p-4 border rounded-lg hover:bg-gray-50">
          <h3 className="font-medium">{analysis.fileName}</h3>
          <p className="text-sm text-gray-500">
            {new Date(analysis.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2 flex space-x-2">
            <button 
              onClick={() => window.open(`/api/analysis/download/${analysis._id}`, '_blank')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Download
            </button>
            <button 
              onClick={() => window.open(`/api/analysis/view/${analysis._id}`, '_blank')}
              className="text-sm text-green-600 hover:text-green-800"
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentAnalysis;