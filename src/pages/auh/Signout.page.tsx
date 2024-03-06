import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { LoadingOverlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { SIGNIN } from '@/routes';
import { useRootStore } from '@/stores/Root.store';

const Signout: React.FC = observer(() => {
  const navigate = useNavigate();
  const store = useRootStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      localStorage.removeItem('accessToken');
      store.reset();
      navigate(SIGNIN);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;
  }

  return null;
});

export default Signout;
