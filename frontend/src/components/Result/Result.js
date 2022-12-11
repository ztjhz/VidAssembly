import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast';
import { isValidUuid } from '../InputTabs/UuidTab';
import Spinner from '../Spinner/Spinner';

const STATUS_DONE = 200;

const Result = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { alert, showAlert } = useToast();

  let [resultData, setResultData] = useState({ status: 0 });
  let fetchUrl = useRef('');
  useEffect(() => {
    // get results (every 10 sec)
    const getReqTimeout = setTimeout(() => {
      fetch(fetchUrl.current, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          // setResultData
          setResultData((resultData) => ({ ...resultData, ...data }));
        });
    }, 10000);
    // if done, stop making GET requests
    if (resultData?.status === STATUS_DONE) clearTimeout(getReqTimeout);
    // Error from server
    if (resultData?.status === 500) {
      clearTimeout(getReqTimeout);
      return showAlert('Process failed.');
    }
  }, [resultData]);

  useEffect(() => {
    // invalid uuid -> navigate back to homepage
    if (!isValidUuid(uuid)) {
      alert('Invalid uuid!');
      navigate('/');
    }

    const server = localStorage.getItem('server');
    fetchUrl.current =
      server === 'cloud'
        ? `https://ayaka-apps.shn.hk/vidassembly/result/${uuid}`
        : `http://127.0.0.1:5000/result/${uuid}`; // CHANGE API ENDPOINT

    // reset status to 0 (to ensure re-rendering of results page when navigating between different uuids)
    setResultData((r) => ({ ...r, status: 0 }));
  }, [uuid, navigate]);

  // ------------------------------------------------------------------------------------------------------------------ //

  const [tab, setTab] = useState('transcription');

  return (
    <>
      <div className='flex justify-center mt-10'>
        {resultData.status === 500 ? (
          <div className='flex justify-center mt-10'>{alert}</div>
        ) : resultData.status < 2 ? (
          <div className='scale-150 p-10'>
            <Spinner
              completionStatusId={2}
              curStatusId={resultData.status}
              text='We are working hard on your video... 🏃🏻‍♀️🏃🏻‍♂️'
            />
          </div>
        ) : (
          <div className='mx-3 max-w-2xl w-full bg-white rounded-t-lg border shadow-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden'>
            <TabContainer currTab={tab} setTab={setTab} />
            <ContentContainer tab={tab} resultData={resultData} />
          </div>
        )}
      </div>
    </>
  );
};

const TabContainer = ({ currTab, setTab }) => {
  const tabs = ['Transcription', 'Translation', 'Keywords', 'Summary'];
  const selectedTabStyles = [
    'text-blue-600',
    'dark:text-teal-500',
    'border-blue-600',
    'dark:border-teal-500',
    'bg-gray-100',
    'dark:bg-gray-600',
  ];
  const deselectedTabStyles = ['bg-gray-50', 'dark:bg-gray-700'];

  const Tab = () => {
    return (
      <div className='text-sm font-medium text-center text-gray-500 rounded-lg divide-x divide-gray-200 sm:flex dark:divide-gray-600 dark:text-gray-400'>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`w-full inline-block p-4 w-full hover:bg-gray-100 focus:outline-none dark:hover:bg-gray-600 hover:text-blue-600 dark:hover:text-teal-500 
                ${
                  currTab === tab.toLowerCase()
                    ? selectedTabStyles.join(' ')
                    : deselectedTabStyles.join(' ')
                }`}
            onClick={() => setTab(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Tab />
    </>
  );
};

const ContentContainer = ({ tab, resultData }) => {
  return (
    <div className='border-t border-gray-200 dark:border-gray-600 p-4'>
      <div className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 text-left'>
        {tab === 'transcription' &&
          (resultData.status < 2 ? (
            <Spinner
              completionStatusId={2}
              curStatusId={resultData.status}
              text='Transcribing... ✍🏻'
            />
          ) : (
            <TranscriptionContent content={resultData.transcript} />
          ))}

        {tab === 'translation' &&
          (resultData.status < 6 ? (
            <Spinner
              completionStatusId={6}
              curStatusId={resultData.status}
              text='Translating... 📖'
            />
          ) : (
            <TranscriptionContent content={resultData.translated} />
          ))}
        {tab === 'keywords' &&
          (resultData.status < 3 ? (
            <Spinner
              completionStatusId={3}
              curStatusId={resultData.status}
              text='Generating keywords...'
            />
          ) : (
            <Keywords keywords={resultData.keywords} />
          ))}
        {tab === 'summary' &&
          (resultData.status < 4 ? (
            <Spinner
              completionStatusId={4}
              curStatusId={resultData.status}
              text='Summarising... 🧾'
            />
          ) : (
            <Summary summaries={resultData.summaries} />
          ))}
      </div>
    </div>
  );
};

const TranscriptionContent = ({ content }) => {
  return content?.split('\n').map((text) => (
    <div key={Math.random()} className='mb-2'>
      {text}
    </div>
  ));
};

const Keywords = ({ keywords }) => {
  return (
    <div className='md:text-3xl text-xl text-center'>
      {keywords?.map((keyword, index) => (
        <div key={keyword} className='mb-3'>
          <mark className='px-2 bg-indigo-700 dark:bg-teal-500 text-white dark:text-black rounded'>
            {keyword}
          </mark>
        </div>
      ))}
    </div>
  );
};

const Summary = ({ summaries }) => {
  const { uuid } = useParams();
  const server = localStorage.getItem('server');
  const endpoint =
    server === 'cloud'
      ? 'https://ayaka-apps.shn.hk/vidassembly/'
      : 'http://127.0.0.1:5000/';

  return summaries?.map((s, index) => {
    return (
      <div key={index}>
        <div className='text-2xl underline font-semibold text-center mb-4'>
          {s.gist}
        </div>
        <div className='text-center mb-4 italic'>{s.headline}</div>
        {s?.image || s?.original_image ? (
          <img
            src={`${endpoint}static/${uuid}/${s.image || s.original_image}`}
            alt={s.text}
            className='m-auto'
          ></img>
        ) : (
          <></>
        )}
        {/* CHANGE API ENDPOINT */}
        <div className='mt-2 text-center'>{s.text}</div>
        <br />
        <hr class='my-6 h-px bg-gray-200 border-0 dark:bg-gray-700' />
      </div>
    );
  });
};

export default Result;
