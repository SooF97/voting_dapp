import "@/styles/globals.css";
import Navbar from "./components/Navbar";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
};
export default App;
