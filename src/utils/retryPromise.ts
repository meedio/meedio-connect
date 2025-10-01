import logger from './logging/faro';

type RetryPromiseProps<T> = {
  fn: () => Promise<T>;
  retries?: number;
  delay?: number;
  label?: string;
};

const retryPromise = <T>({ fn, retries = 3, delay = 1000, label }: RetryPromiseProps<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    const attempt = (currentRetry = 0) => {
      fn()
        .then(resolve)
        .catch((err) => {
          if (currentRetry >= retries) return reject(err);

          logger.warn(`Promise attempt failed, current attempt: ${currentRetry}, label: ${label}`, err);
          setTimeout(() => attempt(currentRetry + 1), delay);
        });
    };

    attempt();
  });

export default retryPromise;
