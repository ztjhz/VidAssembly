import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DemoLink = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(
      'https://ayaka-apps.shn.hk/vidassembly/result/ca0b6e1b-0796-44a2-baaa-0fab874b3631'
    );
    const data = await res.json();

    if (data.status === -1) return alert('Uuid does not exist in database!');
    else if (data.status === 500) return alert(data.error_message);

    localStorage.setItem('server', 'cloud');

    // // navigate to page
    if (
      location.pathname.startsWith('/result/') &&
      location.pathname !== `/result/ca0b6e1b-0796-44a2-baaa-0fab874b3631`
    ) {
      navigate('/'); // refresh page to re-render
      navigate(`/result/ca0b6e1b-0796-44a2-baaa-0fab874b3631`);
    } else navigate(`/result/ca0b6e1b-0796-44a2-baaa-0fab874b3631`);
  };

  return (
    <div>
      <form
        onSubmit={handleOnSubmit}
        className='mt-2 max-w-2xl text-md text-gray-500 mx-auto dark:text-gray-300'
      >
        View a preprocessed result of a lecture video&nbsp;
        <button
          type='submit'
          className='underline text-indigo-700 hover:text-blue-800 focus:text-blue-800 font-medium text-center dark:text-teal-500 dark:hover:text-teal-600 dark:focus:text-teal-600'
        >
          here
        </button>
      </form>
    </div>
  );
};

export default DemoLink;
