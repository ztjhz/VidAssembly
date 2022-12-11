import React from 'react';
import { Link } from 'react-router-dom';
import DemoLink from './DemoLink';

const highlightedText = (text) => {
  return (
    <mark className='px-2 bg-indigo-700 dark:bg-teal-500 text-white dark:text-black rounded'>
      {text}
    </mark>
  );
};

export const Title = () => {
  return (
    <p className='text-3xl font-semibold leading-8 tracking-tight text-indigo-700 hover:text-indigo-500 sm:text-4xl dark:text-teal-500 dark:hover:text-teal-600'>
      <Link to='/' relative='path'>
        VidAssembly
      </Link>
    </p>  
  )
}

const Description = () => {
  return (
    <>
      <p className='mt-4 mb-4 max-w-2xl text-lg text-gray-500 mx-auto dark:text-gray-300'>
        Are you tired of watching long, boring videos? 😴 Say hello to
        VidAssembly, the cutting-edge deep learning solution powered by{' '}
        {highlightedText('Assembly AI')}
      </p>
      <p className='mt-4 max-w-2xl text-md text-gray-500 mx-auto dark:text-gray-300'>
        In just minutes, VidAssembly can transform any video, from a one hour
        lecture to a 30-minute meeting, into{' '}
        {highlightedText('fun, bite-sized content')} for you to digest
        quickly.
      </p>
      <p className='mt-4 max-w-2xl text-md text-gray-500 mx-auto dark:text-gray-300'>
        With VidAssembly, you can easily {highlightedText('transcribe')},{' '}
        {highlightedText('summarize')}, and {highlightedText('translate')}{' '}
        your videos, plus extract {highlightedText('key words')} and{' '}
        {highlightedText('important slides')} for easy reference.
      </p>
      <p className='mt-4 max-w-2xl text-md text-gray-500 mx-auto dark:text-gray-300'>
        Say goodbye to boredom and hello to VidAssembly today!
      </p>
      <DemoLink />
    </>
  )
}

const Header = () => {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
      <div id='header-content' className='text-center'>
        {/* Title */}
        <Title />

        {/* Description */}
        <Description />
      </div>
    </div>
  );
};

export default Header;
