import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatabaseTypeInput from './Inputs/DatabaseTypeInput';
import TranslatedLanguageInput from './Inputs/TranslatedLanguageInput';
import { Spinner } from '../Spinner';

const YoutubeLinkTab = ({ handleErrorMessage }) => {
  const navigate = useNavigate();
  let [submitedBool, setSubmitedBool] = useState(false);

  const isValidYoutubeUrl = (url) => {
    const re =
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
    return url.match(re);
    // returns null if not match
    // else returns an array of matched characters
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    let youtubeUrl = e.target[0].value;
    let translateLanguage = e.target[1].value;
    let server = e.target[2].value;

    if (!isValidYoutubeUrl(youtubeUrl))
      return handleErrorMessage('Invalid YouTube url!');
    else setSubmitedBool(true);

    let sendFormData = new FormData();
    sendFormData.append('type', 'youtube');
    sendFormData.append('url', youtubeUrl);
    sendFormData.append('translateLanguage', translateLanguage);
    sendFormData.append('server', server);

    localStorage.setItem('server', server);

    // ----- POST ----- //
    let fetchUrl =
      server === 'cloud'
        ? 'https://ayaka-apps.shn.hk/vidassembly/video'
        : 'http://127.0.0.1:5000/video';
    const res = await fetch(fetchUrl, {
      method: 'POST',
      body: sendFormData,
    });
    const uuid = await res.text();

    navigate(`/result/${uuid}`);
  };

  return (
    <div
      className='p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800'
      id='youtube-link-tab-content'
      role='tabpanel'
      aria-labelledby='youtube-link-tab-header'
    >
      <form className='space-y-6' onSubmit={handleOnSubmit}>
        <h5 className='text-xl font-medium text-gray-900 dark:text-white'>
          YouTube link
        </h5>
        {/* YouTube Link */}
        <div>
          <label
            htmlFor='youtube-link-input'
            className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
          >
            YouTube Link
          </label>
          <input
            id='youtube-link-input'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white'
            placeholder='https://www.youtube.com/watch?v=.....'
          />
        </div>

        {/* Translated Language */}
        <TranslatedLanguageInput />

        {/* Server */}
        <DatabaseTypeInput />

        {submitedBool ? (
          <>
            <button
              disabled
              type='submit'
              className='w-full text-white bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-600 dark:focus:ring-teal-700'
            >
              Uploading...
            </button>
            <Spinner
              completionStatusId={1}
              curStatusId={0}
              text='We are working hard on your video... ??????????????????????????????????'
            />
          </>
        ) : (
          <button
            type='submit'
            className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-teal-500 dark:hover:bg-teal-600 dark:focus:ring-teal-700'
          >
            Upload
          </button>
        )}
      </form>
    </div>
  );
};

export default YoutubeLinkTab;
