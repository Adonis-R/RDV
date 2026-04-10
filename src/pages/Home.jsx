import Header from "../components.jsx/Header";
import Hero from "../components.jsx/Hero";
import Footer from "../components.jsx/Footer";

function Home() {
  return (
    <>
      <Header />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Hero />
      </main>
      <Footer />
    </>
  );
}

export default Home;