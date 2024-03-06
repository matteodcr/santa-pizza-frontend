import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { Loader } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { SIGNIN } from '@/routes';

const Signout: React.FC = observer(() => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      localStorage.removeItem('accessToken');
      navigate(SIGNIN);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader color="blue" />;
  }

  return null;
});

export default Signout;
