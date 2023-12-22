let promise$:
  | Promise<{
      apiKey: string;
    }>
  | undefined;

/**
 * Returns the config json file that should be used for the app.
 *
 * @param params The params for the function.
 * @param params.url The url of the config json file.
 * @returns The config json file.
 */
export async function getApiConfig(params: { url?: string } = {}): Promise<{
  apiKey: string;
}> {
  const url = params?.url ?? 'api-config.json';
  if (promise$) {
    return promise$;
  }
  promise$ = fetch(url).then((res) => {
    if (res.ok) return res.json();
    throw new Error(res.statusText);
  });
  return promise$;
}
