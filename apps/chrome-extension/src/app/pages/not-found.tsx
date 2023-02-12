import { BugAntIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

/**
 * 404 - Not Found page, shown if a route isn't found or doesn't exist
 */
export default function NotFound() {
  return (
    <div>
      <h1>404 - Not Found!</h1>
      <p>
        This may be a configuration issue, please create an issue by clicking on
        the <BugAntIcon className="w-2" /> at the top of the page. Thanks!
      </p>
      <div>
        <Link to="/">Home</Link>
      </div>
    </div>
  );
}
