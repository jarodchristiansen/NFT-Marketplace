import "../styles/globals.css";
import Link from "next/link";
import { CanvasProvider } from "../components/CreatePage/Canvas/CanvasContext";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6 bg-black">
        <p className="text-4xl font-bold text-white">
          Moon<span className="text-tahiti">Market</span>
        </p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500 font-bold">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500 font-bold">Sell Digital Asset</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500 font-bold">My Digital Assets</a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500 font-bold">Creator Dashboard</a>
          </Link>
        </div>
      </nav>
      <CanvasProvider>
        <Component {...pageProps} />
      </CanvasProvider>
    </div>
  );
}

export default MyApp;
