import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const useRequiredParams = (key: string) => {
  const params = useParams();
  const navigate = useNavigate();

  const handleRedirect = useCallback(() => navigate('/404', { replace: true }), [navigate]);

  const param = params[key];

  if (!param) {
    handleRedirect();
    throw new Error(`Param ${key} is undefined`);
  }

  return param;
};

export default useRequiredParams;
