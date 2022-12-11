import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Hero } from './components/Hero';
import { InputTabs } from './components/InputTabs';
import { Result } from './components/Result';
import { Navbar } from './components/Navbar'

const Container = ({children}) => {
  return (
    <div className="pt-32 min-h-screen">
      {children}
    </div>
  )
}

function App() {
  return (
    <div className='lg:text-center min-h-screen bg-sky-100 dark:bg-slate-900'>
      <Navbar />
      <Container>
        <Routes>
          <Route path='/' element={<Hero />} />
          <Route path='/input' element={<InputTabs />} />
          <Route path='/result/:uuid' element={<Result />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
