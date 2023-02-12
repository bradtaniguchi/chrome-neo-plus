import { Spinner } from 'flowbite-react';

/**
 * Generic loading spinner
 */
export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center ">
      <Spinner color="info" aria-label="Loading data" />
    </div>
  );
}
