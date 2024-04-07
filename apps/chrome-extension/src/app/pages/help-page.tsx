import { Card } from 'flowbite-react';

/**
 * The help page will show application specific information, and act like
 * an appendix.
 */
export default function HelpPage() {
  return (
    <Card className="dark:bg-slate-800 dark:text-white">
      <h1>Help</h1>
      <p>
        This page provides information on all the information provided on the
        details page. Consider it an appendix.
      </p>
      {/*
        TODO: add "help-entry" components
        TODO: add "search" component, using fuzzy
      */}
    </Card>
  );
}
