import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

// Page d'accueil : assemble Header, Hero (barre de recherche) et Footer
function Home() {
  return (
    <>
      <Header />
      {/* flex: 1 permet au main de prendre tout l'espace vertical disponible entre header et footer */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Hero />
      </main>
      <Footer />
    </>
  );
}

export default Home;
