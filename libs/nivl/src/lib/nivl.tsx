import styles from './nivl.module.scss';

/* eslint-disable-next-line */
export interface NivlProps {}

export function Nivl(props: NivlProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Nivl!</h1>
    </div>
  );
}

export default Nivl;
