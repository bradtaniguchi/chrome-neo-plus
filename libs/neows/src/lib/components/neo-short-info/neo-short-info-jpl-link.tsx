import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import { memo } from 'react';
import { NeowsResponse } from '../../models';

export interface NeoShortInfoJplLinkProps {
  /**
   * The NEO to show the links for.
   */
  neo: Pick<NeowsResponse, 'nasa_jpl_url'>;
}

/**
 * Component that represents the JPL link for short info
 *
 * @param props the props for the component
 */
export const NeoShortInfoJplLink = memo(function NeoShortInfoJplLink(
  props: NeoShortInfoJplLinkProps
) {
  const { neo } = props;

  return (
    <a
      href={neo.nasa_jpl_url}
      target="_blank"
      rel="noreferrer"
      className="flex flex-row gap-1"
    >
      <ArrowTopRightOnSquareIcon className="w-4" />
      <div>JPL Link</div>
    </a>
  );
});
