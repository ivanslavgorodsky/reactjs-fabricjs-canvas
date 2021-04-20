import React from 'react';
import Structure from './Structure';
import GlobalProvider from '../components/config/global'  

const App = () => {
  return (
    <GlobalProvider>
      <Structure/>
    </GlobalProvider>
  )
};
export default App; 