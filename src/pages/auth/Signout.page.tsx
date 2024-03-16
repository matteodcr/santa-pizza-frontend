import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { LoadingOverlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { SIGNIN } from '@/routes';
import { useRootStore } from '@/stores/Root.store';
import { showSuccessNotification } from '@/utils/notification';

const Signout: React.FC = observer(() => {
  const navigate = useNavigate();
  const store = useRootStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(false);
      localStorage.removeItem('accessToken');
      store.reset();
      navigate(SIGNIN);
      await showSuccessNotification('Signed out successfully');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;
  }

  return null;
});

export default Signout;
