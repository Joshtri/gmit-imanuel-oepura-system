import Head from "next/head";

export default function PageTitle({ title, description }) {
  const baseTitle = "GMIT Imanuel Oepura";
  const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}