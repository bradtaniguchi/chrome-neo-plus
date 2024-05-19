import { Card, Spinner } from 'flowbite-react';
import { NeoShortInfo, NeoShortInfoJplLink } from '../../components';
import { useGetNeos, useNeoBookmark } from '../../hooks';
import { NeoShortInfoBookmark } from '../../components/neo-short-info/neo-short-info-bookmark';
import { DetailedStats } from './detailed-stats';
import { useParams } from 'react-router-dom';

/**
 * The view-neo component shows detailed information for
 * the given neo.
 *
 * TODO: setup this page to be served in the main-client
 */
export function ViewNeo() {
  const { id: asteroid_id } = useParams();

  const {
    error,
    loading,
    neoResponse: neo,
  } = useGetNeos({
    asteroid_id,
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
    return <div>No NEO found {asteroid_id ?? 'no id'}</div>;
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
              footer={<NeoShortInfoJplLink neo={neo} />}
            />
          </Card>
        </li>
        <li>
          <Card className="dark:bg-slate-800 dark:text-white">
            <h1 className="text-lg">Detailed Stats</h1>
            {/*
              Previous version showed all the data in a "table-like" view here:
              This version is way more cut-down and simplified.

              TODO: add help tooltips, using the help text
              https://github.com/bradtaniguchi/chrome-neo/blob/b852e58ca487a5d8922c982d31330acc8f53b1ab/app/views/stats/stats.controller.js
             */}
            <DetailedStats neo={neo} />
          </Card>
        </li>
        {/* TODO: add another view that tries to find any pictures/extra info here */}
      </ul>
    </div>
  );
}
