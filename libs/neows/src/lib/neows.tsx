import styles from './neows.module.scss';

/* eslint-disable-next-line */
export interface NeowsProps {}

export function Neows(props: NeowsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Neows!</h1>
    </div>
  );
}

export default Neows;
