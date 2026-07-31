import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckHealthUseCase } from '../../application/use-cases/CheckHealthUseCase';
import { HttpHealthRepository } from '../../infrastructure/repositories/HttpHealthRepository';

const THIRTY_SECONDS_IN_MILLISECONDS = 30000;
const SERVICE_UNAVAILABLE_PATH = '/503';
const MAINTENANCE_PATH = '/maintenance';

const defaultRepository = new HttpHealthRepository();
const defaultUseCase = new CheckHealthUseCase(defaultRepository);

export function useHealthChecker(
  checkHealthUseCase: CheckHealthUseCase = defaultUseCase,
  intervalInMilliseconds: number = THIRTY_SECONDS_IN_MILLISECONDS,
): void {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isSubscribed = true;

    const performHealthCheck = async () => {
      const status = await checkHealthUseCase.execute();

      if (!isSubscribed) {
        return;
      }

      const isCurrentPathErrorPage =
        location.pathname === SERVICE_UNAVAILABLE_PATH ||
        location.pathname === MAINTENANCE_PATH;

      if (!status.isHealthy()) {
        if (isCurrentPathErrorPage) {
          return;
        }
        navigate(SERVICE_UNAVAILABLE_PATH, { replace: true });
        return;
      }

      if (isCurrentPathErrorPage) {
        navigate('/', { replace: true });
      }
    };

    performHealthCheck();

    const intervalId = setInterval(
      performHealthCheck,
      intervalInMilliseconds,
    );

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [checkHealthUseCase, intervalInMilliseconds, location.pathname, navigate]);
}
