import { Spinner } from 'flowbite-react';
import { PropsWithChildren } from 'react';

/**
 * This component "wraps" any nested overview component. This manages
 * displaying errors and loading states automatically.
 *
 * @param props The props for the common overview wrapper.
 * @param props.loading Whether or not the overview is loading.
 * @param props.error The error that occurred, if any.
 */
export function CommonValueWrapper(
  props: PropsWithChildren<{ loading?: boolean; error?: unknown }>
) {
  const { loading, error, children } = props;
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center ">
        <Spinner color="info" aria-label="Loading data" />
      </div>
    );
  if (error)
    return (
      <div title={JSON.stringify(error, null, 2)}>Oops there was an error!</div>
    );
  return <div>{children}</div>;
}
