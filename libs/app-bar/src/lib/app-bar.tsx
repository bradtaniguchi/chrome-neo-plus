import {
  BugAntIcon,
  Cog6ToothIcon,
  MagnifyingGlassCircleIcon,
  QuestionMarkCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { Label } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

/* eslint-disable-next-line */
export interface AppBarProps {
  /**
   * If the component is in "search" mode.
   */
  isSearching?: boolean;
  /**
   * The value of the search input.
   */
  search?: string;
}

/**
 * The app-bar is shown at the top of the page, and provides top level
 * functionality.
 *
 * TODO: add hover coloring
 * TODO: add active coloring
 * TODO: add focus coloring
 *
 * @param props The properties of the AppBar component
 */
export function AppBar(props: AppBarProps) {
  const { isSearching: propIsSearching, search: propSearch } = props;

  const [search, setSearch] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (propIsSearching !== undefined) setIsSearching(!!propIsSearching);
  }, [propIsSearching]);
  useEffect(() => {
    if (typeof propSearch === 'string') setSearch(propSearch);
  }, [propSearch]);

  const handleToggleSearch = useCallback(() => {
    setIsSearching(!isSearching);
  }, [isSearching]);

  return (
    <nav className="flex h-10 flex-row justify-between p-2 align-middle dark:bg-slate-800 dark:text-white">
      {isSearching ? (
        <div className="flex w-full flex-row gap-1 align-middle">
          <div className="flex flex-col justify-center">
            <Label htmlFor="search-input" value="Search NEOs" />
          </div>
          <input
            id="search-input"
            type="text"
            className="flex flex-grow rounded-xl p-2 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            aria-label="stop searching"
            onClick={handleToggleSearch}
          >
            <XCircleIcon className="w-6" />
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-row gap-1">
            <button
              type="button"
              aria-label="search neos"
              title="Search NEOs"
              onClick={handleToggleSearch}
            >
              <MagnifyingGlassCircleIcon className="w-6" />
            </button>
            {/* TODO: make "home-button" */}
            <h1>Chrome-NEO</h1>
          </div>
          <div className="flex flex-row gap-1">
            <Link
              to="/bug"
              className="content-center"
              title="Report a bug"
              aria-label="report a bug"
            >
              <BugAntIcon className="w-6" />
            </Link>
            <Link
              to="/help"
              className="content-center"
              title="Help"
              aria-label="help"
            >
              <QuestionMarkCircleIcon className="w-6" />
            </Link>
            <Link
              to="/settings"
              className="content-center"
              title="Settings"
              aria-label="settings"
            >
              <Cog6ToothIcon className="w-6" />
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}

export default AppBar;
