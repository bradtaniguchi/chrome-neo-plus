import { useTheme } from '@nx-template/common-react';
import { Button, Navbar } from 'flowbite-react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import Link from 'next/link';
import './styles.css';

/**
 * The key that should be used to save the theme
 * to local-storage
 */
export const USE_THEME_KEY = 'color-theme';

/**
 *
 * Core app, used to render every page.
 *
 *
 * @param root0 AppProps
 * @param root0.Component the component to render on this page
 * @param root0.pageProps the props to pass to the component rendered
 */
function App({ Component, pageProps }: AppProps) {
  const {
    handleToggleTheme,
    selectedTheme,
    systemTheme,
    theme,
    themeDisplay,
    themeIcon,
  } = useTheme();

  return (
    <>
      <Head>
        <title>Nx Template</title>
      </Head>
      <div
        data-automation-id="theme-toggle"
        className={`min-h-screen ${theme}`}
      >
        <div className="min-h-screen bg-white dark:bg-slate-700">
          <Navbar fluid={true} rounded={true} className="bg-slate-200">
            <div className="flex w-full justify-between">
              <div>
                <Link href="/" className="text-lg dark:text-white">
                  nx-template
                </Link>
              </div>
              <div className="dark:hover:text-white">
                <Button
                  color={'white'}
                  outline={true}
                  onClick={handleToggleTheme}
                  data-selected-theme={selectedTheme}
                  data-system-theme={systemTheme}
                  data-theme={theme}
                >
                  {themeIcon}
                  <span className="ml-1 hidden sm:block">{themeDisplay}</span>
                </Button>
              </div>
            </div>
          </Navbar>
          <main className="app">
            <Component {...pageProps} />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
