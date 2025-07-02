import Head from 'next/head';

export default function Layout({ children, title = 'Post Management System' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Create, edit, and manage your posts with ease" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto p-6">{children}</div>
      </div>
    </>
  );
}
