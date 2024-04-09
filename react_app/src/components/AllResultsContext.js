import React, { createContext, useState, useContext } from 'react';

const AllResultsContext = createContext();

export const AllResultsProvider = ({ children }) => {
  const [allResultText, setAllResultText] = useState('');
  const [categoryImageData, setCategoryImageData] = useState('');
  const [overallScoreImageData, setOverallScoreImageData] = useState('');
  const [brandName, setbrandName] = useState('');
  const [dealershipName, setdealershipName] = useState('');
  const [department, setdepartment] = useState('');
  const [submission, setsubmission] = useState('');
  const [CategoryResultsData, setCategoryResultsData]= useState('');


  return (
    <AllResultsContext.Provider value={{ allResultText, setAllResultText, categoryImageData, setCategoryImageData, overallScoreImageData, setOverallScoreImageData,brandName, setbrandName,dealershipName, setdealershipName,department, setdepartment,submission, setsubmission,CategoryResultsData, setCategoryResultsData }}>
      {children}
    </AllResultsContext.Provider>
  );
};

export const useAllResults = () => useContext(AllResultsContext);