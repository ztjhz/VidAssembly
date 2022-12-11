import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import InputTabs from './components/InputTabs/InputTabs';
import ThemeToggleButton from './components/ThemeToggleButton/ThemeToggleButton';
import Result from './components/Result/Result';

function App() {
  return (
    <div className='lg:text-center bg-sky-100 dark:bg-slate-900'>
      <ThemeToggleButton />
      <Header />
      <Routes>
        <Route path='/' element={<InputTabs />} />
        <Route path='/result/:uuid' element={<Result />} />
      </Routes>
    </div>
  );
}

export default App;
