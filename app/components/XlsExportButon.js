'use client'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import * as xls from 'xlsx'

const XlsExportButton = ({title = 'export', worksheetName='Sheet1', data=[], keysToInclude = null}) => {
  const [loading, setLoading] = useState(false)
  
  const handleExport = () => {
    if(!data || !Array.isArray(data) || data.length === 0) {
      console.log("#==================Export Error: No data to export");
      return;
    }
    
    try {
      setLoading(true);
      
      // For dynamic keys: if keysToInclude is provided, use only those keys
      // Otherwise, take all keys from the first item
      const dataToExport = data.map((item) => {
        if(keysToInclude && Array.isArray(keysToInclude) && keysToInclude.length > 0) {
          const filteredItem = {};
          keysToInclude.forEach((key) => {
            if(key in item) {
              filteredItem[key] = item[key];
            }
          });
          return filteredItem;
        } else {
          return {...item};
        }
      });
      
      const workbook = xls.utils.book_new();
      const worksheet = xls.utils.json_to_sheet(dataToExport);
      
      // Add the worksheet to the workbook
      xls.utils.book_append_sheet(workbook, worksheet, worksheetName);
      
      // SAVE WORK BOOK
      xls.writeFile(workbook, `${title}.xlsx`);
      console.log(`Exported data to ${title}.xlsx`);
    } catch(error) {
      console.error("Export error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button 
      variant='warning' 
      onClick={handleExport} 
      disabled={loading}
    >
      {loading ? 'EXPORTING...' : 'EXPORT XLS'}
    </Button>
  );
};

export default XlsExportButton;