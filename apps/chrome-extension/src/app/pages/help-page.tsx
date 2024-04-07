import { Card, Label } from 'flowbite-react';
import { useMemo, useState } from 'react';
import { CONSOLIDATED_HELP_ENTRIES } from '../core/consolidated-help-entries';

/**
 * The help page will show application specific information, and act like
 * an appendix.
 */
export default function HelpPage() {
  const [search, setSearch] = useState<string>('');

  const entries = useMemo(() => {
    // TODO: move to fuse.js
    // see #29
    return CONSOLIDATED_HELP_ENTRIES.filter((entry) =>
      entry.key.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Card className="dark:bg-slate-800 dark:text-white">
      <h1>Help</h1>
      <p>
        This page provides information on all the information provided on the
        details page. Consider it an appendix.
      </p>
      <div>
        <div className="my-2 flex h-10 w-full flex-row gap-1 align-middle">
          <div className="flex flex-col justify-center">
            <Label htmlFor="search-input" value="Search" />
          </div>
          <input
            id="search-input"
            type="text"
            className="flex flex-grow rounded-xl p-2 text-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table>
          <thead>
            <tr className="text-left">
              <th>Key</th>
              <th>Description</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.key}>
                <td>{entry.key}</td>
                <td>{entry.description}</td>
                <td>{entry.dataType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*
        TODO: add "help-entry" components
        TODO: add "search" component, using fuzzy
      */}
    </Card>
  );
}
