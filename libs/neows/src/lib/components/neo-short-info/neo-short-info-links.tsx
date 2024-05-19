import { ChartBarIcon } from '@heroicons/react/24/solid';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { NeowsResponse } from '../../models';
import { NeoShortInfoJplLink } from './neo-short-info-jpl-link';

export interface NeoShortFormProps {
  /**
   * The NEO to show the links for.
   */
  neo: Pick<NeowsResponse, 'id' | 'nasa_jpl_url'>;
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
      <NeoShortInfoJplLink neo={neo} />
    </li>
  );
});
