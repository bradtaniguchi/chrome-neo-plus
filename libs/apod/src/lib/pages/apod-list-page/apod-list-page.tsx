import styles from './apod-list-page.module.scss';

/* eslint-disable-next-line */
export interface ApodListPageProps {}

export function ApodListPage(props: ApodListPageProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to ApodListPage!</h1>
    </div>
  );
}

export default ApodListPage;
