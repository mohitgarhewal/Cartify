import '@/styles/globals.css';
import { CartProvider } from '@/lib/CartContext';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
    </>
  );
}
