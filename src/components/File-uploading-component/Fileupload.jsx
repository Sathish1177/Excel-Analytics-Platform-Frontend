import React from "react";
import { useState } from 'react';
import * as XLSX from 'xlsx';
import ChartVisualization from '../ChartVisualization';

const Fileupload = () => {
  const [excelData, setExcelData] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload only Excel files (.xlsx or .xls)');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(jsonData);
        setError('');
      };
      reader.readAsArrayBuffer(file);
    } catch {
      setError('Error reading file');
    }
  };

  return (
    <div className="p-4 bg-gray-200 text-gray-800 rounded-lg shadow text-center border-4 border-dashed border-gray-400">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {error && <p className="text-red-500">{error}</p>}
      {excelData && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Data Visualization</h3>
          <ChartVisualization data={excelData} />
        </div>
      )}
    </div>
  );
};

export default Fileupload;
