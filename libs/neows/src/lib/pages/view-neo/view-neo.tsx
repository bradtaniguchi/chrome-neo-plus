import { Card, Spinner } from 'flowbite-react';
import { NeoShortInfo } from '../../components';
import { useGetNeos, useNeoBookmark } from '../../hooks';
import { NeoShortInfoBookmark } from '../../components/neo-short-info/neo-short-info-bookmark';

/**
 * The view-neo component shows detailed information for
 * the given neo.
 *
 * TODO: leverage react-charts here
 * TODO: provide table with extended stats here
 * TODO: setup this page to be served in the main-client
 */
export function ViewNeo() {
  // TODO: use the id from the route, or use a query param
  // TODO: make http call to get information for the NEO
  // TODO: update get to utilize caching
  // const neo: LookupResponse = undefined;
  const {
    error,
    loading,
    neoResponse: neo,
  } = useGetNeos({
    asteroid_id: '3542519',
  });

  const { isBookmarked, handleToggleBookmark } = useNeoBookmark({
    neo,
  });

  if (loading) {
    return (
      <Card className="flex max-w-3xl flex-col items-center justify-center dark:bg-slate-800 dark:text-white">
        <Spinner color="info" aria-label="Info spinner example" />
      </Card>
    );
  }

  if (error) {
    // TODO: improve
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!neo) {
    // TODO: update
    return <div>No NEO found</div>;
  }

  return (
    <div>
      <ul className="flex flex-col gap-1">
        <li>
          {/* TODO: add a back-button here, and add the bookmark here. */}
        </li>
        <li>
          <Card className="dark:bg-slate-800 dark:text-white">
            <NeoShortInfo
              neo={neo}
              bookmark={
                <NeoShortInfoBookmark
                  bookmarkedChanged={handleToggleBookmark}
                  isBookmarked={isBookmarked}
                />
              }
            />
          </Card>
        </li>
        <li>
          <Card className="dark:bg-slate-800 dark:text-white">
            Detail stats
            {/* TODO
            Previous version showed all the data in a "table-like" view here:
            https://github.com/bradtaniguchi/chrome-neo/blob/b852e58ca487a5d8922c982d31330acc8f53b1ab/app/views/stats/stats.controller.js
            */}
          </Card>
        </li>
        {/* TODO: add another view that tries to find any pictures/extra info here */}
      </ul>
    </div>
  );
}
