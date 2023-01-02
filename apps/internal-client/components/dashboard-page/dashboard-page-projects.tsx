import { Card } from 'flowbite-react';
import Link from 'next/link';
import { memo } from 'react';

export const DashboardPageProjects = memo(function DashboardPageProjects({
  typedocProjects,
}: {
  typedocProjects: string[];
}) {
  return (
    <Card>
      <h5 className="text-lg dark:text-white">Generated TSDocs</h5>
      <div>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {typedocProjects.map((project) => (
            <li key={project}>
              <div className="flex flex-row align-middle dark:text-white">
                {/* <ArticleIcon color="primary" /> */}
                <Link href={`docs/${project}`}>{`${project} TSDocs`}</Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
});
