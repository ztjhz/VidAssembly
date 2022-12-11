import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import UploadFileTab from './UploadFileTab';
import UuidTab from './UuidTab';
import YoutubeLinkTab from './YoutubeLinkTab';

const InputTabs = () => {
  const [tab, setTab] = useState('youtube-link');
  const { alert, showAlert, hideAlert } = useToast();

  const selectedTabStyle = [
    'text-blue-600',
    'dark:text-teal-500',
    'border-blue-600',
    'dark:border-teal-500',
    'bg-gray-100',
    'dark:bg-gray-600',
  ].join(' ');
  const unselectedTabStyle = ['bg-gray-50', 'dark:bg-gray-700'].join(' ');
  const tabs = {
    'youtube-link': 'YouTube Link',
    'upload-file': 'Upload File',
    'use-uuid': 'UUID',
  };

  return (
    <>
      <div className='flex justify-center my-10 mx-3'>
        <div className='max-w-2xl w-full bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700'>
          {/* Tab Headers */}
          <div
            className='text-sm font-medium text-center text-gray-500 rounded-t-lg divide-x divide-gray-200 sm:flex dark:divide-gray-600 dark:text-gray-400 overflow-hidden'
            id='fullWidthTab'
            data-tabs-toggle='#fullWidthTabContent'
            role='tablist'
          >
            {Object.keys(tabs).map((t) => (
              <div key={t} className='w-full'>
                <button
                  onClick={() => {
                    setTab(t);
                    hideAlert();
                  }}
                  className={`inline-block p-4 w-full hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-teal-500 ${
                    t === tab ? selectedTabStyle : unselectedTabStyle
                  }`}
                >
                  {tabs[t]}
                </button>
              </div>
            ))}
          </div>

          {/* Tab Content */}
          <div
            id='fullWidthTabContent'
            className='border-t border-gray-200 align-center dark:border-gray-600'
          >
            {tab === 'youtube-link' ? (
              <YoutubeLinkTab handleErrorMessage={showAlert} />
            ) : tab === 'upload-file' ? (
              <UploadFileTab handleErrorMessage={showAlert} />
            ) : (
              <UuidTab handleErrorMessage={showAlert} />
            )}
          </div>

          <div className='w-full flex justify-center'>{alert}</div>
        </div>
      </div>
    </>
  );
};

export default InputTabs;
