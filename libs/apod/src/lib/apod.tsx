import styles from './apod.module.scss';

/* eslint-disable-next-line */
export interface ApodProps {}

export function Apod(props: ApodProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Apod!</h1>
    </div>
  );
}

export default Apod;
