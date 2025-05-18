import { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import FileSaver from 'file-saver';

const ChartVisualization = ({ data = [] }) => {
  const [selectedAxes, setSelectedAxes] = useState({
    x: '',
    y: '',
    z: ''
  });
  const [chartType, setChartType] = useState('2d'); // '2d' or '3d'
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Get available columns from data
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  useEffect(() => {
    if (chartType === '2d' && chartRef.current) {
      // Destroy existing chart if any
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new 2D chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Excel Data',
            data: data.map(item => ({
              x: item[selectedAxes.x],
              y: item[selectedAxes.y]
            })),
            backgroundColor: 'rgba(75, 192, 192, 0.6)'
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: selectedAxes.x
              }
            },
            y: {
              title: {
                display: true,
                text: selectedAxes.y
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, selectedAxes, chartType]);

  // 3D Point component for Three.js
  const Points = ({ positions }) => {
    return (
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={new Float32Array(positions)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#4bc0c0" />
      </points>
    );
  };

  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnalysisHistory();
  }, []);

  const fetchAnalysisHistory = async () => {
    try {
      const response = await fetch('/api/analysis/history', {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      setAnalyses(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/analysis/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
          fileName: 'analysis_' + Date.now(),
          data,
          chartType,
          selectedAxes
        })
      });
      await fetchAnalysisHistory();
    } catch (error) {
      console.error('Error saving analysis:', error);
    }
    setLoading(false);
  };

  const handleDownload = async (analysisId) => {
    try {
      const response = await fetch(`/api/analysis/download/${analysisId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      });
      const data = await response.json();
      
      // Create Excel file
      // Import XLSX library if not already imported
// eslint-disable-next-line no-undef
const XLSX = require('xlsx');
      
      const ws = XLSX.utils.json_to_sheet(data.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Analysis');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      // Download file
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, `${data.fileName}.xlsx`);
    } catch (error) {
      console.error('Error downloading analysis:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex gap-4">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="2d">2D Chart</option>
          <option value="3d">3D Chart</option>
        </select>

        <select
          value={selectedAxes.x}
          onChange={(e) => setSelectedAxes(prev => ({ ...prev, x: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="">Select X Axis</option>
          {columns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        <select
          value={selectedAxes.y}
          onChange={(e) => setSelectedAxes(prev => ({ ...prev, y: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="">Select Y Axis</option>
          {columns.map(col => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>

        {chartType === '3d' && (
          <select
            value={selectedAxes.z}
            onChange={(e) => setSelectedAxes(prev => ({ ...prev, z: e.target.value }))}
            className="p-2 border rounded"
          >
            <option value="">Select Z Axis</option>
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        )}
      </div>

      {chartType === '2d' ? (
        <canvas ref={chartRef} className="w-full h-[600px]"></canvas>
      ) : (
        <div className="w-full h-[600px]">
          <Canvas camera={{ position: [5, 5, 5] }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            {data.length > 0 && selectedAxes.x && selectedAxes.y && selectedAxes.z && (
              <Points
                positions={data.flatMap(item => [
                  item[selectedAxes.x],
                  item[selectedAxes.y],
                  item[selectedAxes.z]
                ])}
              />
            )}
            <axesHelper args={[5]} />
          </Canvas>
        </div>
      )}
      
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Analysis'}
        </button>
      </div>

      {analyses.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Analysis History</h3>
          <div className="space-y-4">
            {analyses.map(analysis => (
              <div key={analysis._id} className="border p-4 rounded">
                <p className="font-medium">{analysis.fileName}</p>
                <p className="text-sm text-gray-600 mt-2">{analysis.summary}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleDownload(analysis._id)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartVisualization;