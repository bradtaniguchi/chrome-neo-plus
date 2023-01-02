import { Card } from 'flowbite-react';

/**
 * The 404 page that is rendered when a page isn't found
 */
export default function PageNotFound() {
  return (
    <div className="mt-32 flex justify-center">
      <Card>
        <h5 className="text-lg dark:text-white">Page Not Found</h5>
      </Card>
    </div>
  );
}
