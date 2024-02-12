import { BookOpenIcon } from '@heroicons/react/24/solid';
import { Button } from 'flowbite-react';
import { memo } from 'react';

export interface NeoShortInfoBookmarkProps {
  /**
   * If the bookmark is currently bookmarked.
   */
  isBookmarked: boolean;
  /**
   * Function that is called when the bookmark is changed.
   */
  bookmarkedChanged: (bookmarked: boolean) => void;
}

/**
 * Component that can be passed to the NeoShortForm to handle the bookmarks
 *
 * @param props the props for the component
 */
export const NeoShortInfoBookmark = memo(function NeoShortInfoBookmark(
  props: NeoShortInfoBookmarkProps
) {
  const { bookmarkedChanged, isBookmarked } = props;
  /**
   * Handle the on-bookmark click event.
   */
  const handleOnBookmark = () => {
    if (typeof bookmarkedChanged === 'function')
      bookmarkedChanged(!isBookmarked);
  };

  return (
    <Button pill={true} outline={!isBookmarked} onClick={handleOnBookmark}>
      <BookOpenIcon className="w-4" />
    </Button>
  );
});
