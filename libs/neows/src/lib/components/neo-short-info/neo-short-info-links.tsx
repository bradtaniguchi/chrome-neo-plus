import {
  ChartBarIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/solid';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { LookupResponse } from '../../models';

export interface NeoShortFormProps {
  /**
   * The NEO to show the links for.
   */
  neo: Pick<LookupResponse, 'id' | 'nasa_jpl_url'>;
}

/**
 * Component that shows the links for the short info.
 *
 * @param props the props for the component
 */
export const NeoShortInfoLinks = memo(function NeoShortInfoLinks(
  props: NeoShortFormProps
) {
  const { neo } = props;

  return (
    <li className="flex flex-row justify-end gap-2">
      <Link to={`/neo/${neo.id}`} className="flex flex-row gap-1">
        <ChartBarIcon className="w-4" />
        <div>detailed stats</div>
      </Link>
      <a
        href={neo.nasa_jpl_url}
        target="_blank"
        rel="noreferrer"
        className="flex flex-row gap-1"
      >
        <ArrowTopRightOnSquareIcon className="w-4" />
        <div>JPL Link</div>
      </a>
    </li>
  );
});
