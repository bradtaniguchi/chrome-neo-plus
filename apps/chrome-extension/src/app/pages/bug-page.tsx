import { GITHUB_ISSUE_URL } from '../constants/github-issue-url';

/**
 * This page will show how to report bugs, which will mainly be
 * done through GitHub issues.
 */
export default function BugPage() {
  return (
    <div>
      <h1>Report an Issue</h1>
      <p>
        To report issues please fill out a report on github{' '}
        <a
          href={GITHUB_ISSUE_URL}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>
        . Thanks!
      </p>
      {/* TODO: add google forms to report errors */}
    </div>
  );
}
