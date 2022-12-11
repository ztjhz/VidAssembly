import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="w-full h-72 flex flex-col justify-center items-center">
          <h1 className=" text-center text-5xl text-black dark:text-white font-bold drop-shadow-lg">INTRODUCING
          <span className="text-amber-500"> VidAssembly</span>
          </h1>
          <p className="mt-5 text-center text-lg text-black dark:text-white opacity-70">
            Turning any videos into fun, bite-sized content for you to digest quickly | Powered by {' '}
            <a href="https://www.assemblyai.com/" rel="noopener noreferrer" target="_blank"  className="hover:cursor-pointer hover:font-bold px-2 bg-indigo-700 dark:bg-teal-500 text-white dark:text-black rounded">Assembly AI</a>
          </p>
          <div
            onClick={() => navigate('/input')}
            className="mt-8 px-12 py-3 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-xl text-black/70 dark:text-white/70 font-semibold drop-shadow-lg rounded-full cursor-pointer">
            Get Started
          </div>
      </div>
      <div className="container p-10">
        <Header />
      </div>
    </div>
  )
}

export default Hero