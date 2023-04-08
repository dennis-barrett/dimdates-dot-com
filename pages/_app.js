import '@styles/globals.css';

import Layout from '@components/Layout';

export default function Application({ Component, pageProps }) {
  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
