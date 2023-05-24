import { type NextPage } from "next";
import Head from "next/head";
import Auth from "../components/auth";
import Sidebar from "../components/sidebar";

function Home() {
  return (
    <>
      <Auth>
        <PageContent />
      </Auth>
    </>
  );
}

const PageContent: NextPage = () => {
  return (
    <>
      <Head>
        <title>Twitter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Sidebar />
      </main>
    </>
  );
};

export default Home;
