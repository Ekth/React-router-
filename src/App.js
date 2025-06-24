import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

// Composant CarteCinema
function CarteCinema({ film }) {
  return (
    <Link to={`/film/${film.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="card h-100" style={{ maxWidth: 200, minHeight: 350, margin: '0 auto', cursor: 'pointer' }}>
        <img src={film.posterURL} className="card-img-top" alt={film.titre} style={{height: '220px', objectFit: 'cover'}} />
        <div className="card-body p-2">
          <h5 className="card-title" style={{ fontSize: '1rem' }}>{film.titre}</h5>
          <p className="card-text" style={{ fontSize: '0.9rem', minHeight: 30 }}>{film.description}</p>
          <span className="badge bg-primary">⭐ {film.classement}</span>
        </div>
      </div>
    </Link>
  );
}

// Composant ListeFilms
function ListeFilms({ films }) {
  return (
    <div className="row g-4">
      {films.map((film, idx) => (
        <div className="col-md-4" key={film.id}>
          <CarteCinema film={film} />
        </div>
      ))}
    </div>
  );
}

// Composant Filtre
function Filtre({ filtreTitre, setFiltreTitre, filtreClassement, setFiltreClassement }) {
  return (
    <div className="d-flex gap-3 mb-4">
      <input
        type="text"
        className="form-control"
        placeholder="Filtrer par titre..."
        value={filtreTitre}
        onChange={e => setFiltreTitre(e.target.value)}
        style={{maxWidth: 300}}
      />
      <input
        type="number"
        className="form-control"
        placeholder="Classement minimum"
        min="0"
        max="5"
        value={filtreClassement}
        onChange={e => setFiltreClassement(e.target.value)}
        style={{maxWidth: 180}}
      />
    </div>
  );
}

// Composant pour ajouter un film
function AjouterFilm({ onAjouter }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [posterURL, setPosterURL] = useState('');
  const [classement, setClassement] = useState('');
  const [trailer, setTrailer] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titre || !description || !posterURL || !classement || !trailer) return;
    onAjouter({ titre, description, posterURL, classement: Number(classement), trailer });
    setTitre(''); setDescription(''); setPosterURL(''); setClassement(''); setTrailer('');
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="row g-2 align-items-end">
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Titre" value={titre} onChange={e => setTitre(e.target.value)} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control" placeholder="Poster URL" value={posterURL} onChange={e => setPosterURL(e.target.value)} style={{ fontSize: '0.85rem', padding: '0.3rem 0.5rem' }} />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="Classement (0-5)" min="0" max="5" value={classement} onChange={e => setClassement(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control" placeholder="Trailer URL (YouTube embed)" value={trailer} onChange={e => setTrailer(e.target.value)} style={{ fontSize: '0.85rem', padding: '0.3rem 0.5rem', minWidth: 120 }} />
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-success w-100">Ajouter</button>
        </div>
      </div>
    </form>
  );
}

// Page de description du film
function FilmDescription({ films }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const film = films.find(f => String(f.id) === id);
  if (!film) return <div className="text-center mt-5">Film introuvable</div>;
  return (
    <div className="container py-5" style={{fontFamily: 'Segoe UI, Arial, sans-serif', maxWidth: 600}}>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>← Retour</button>
      <div className="card mb-3">
        <img src={film.posterURL} className="card-img-top" alt={film.titre} style={{height: '300px', objectFit: 'cover'}} />
        <div className="card-body">
          <h2 className="card-title mb-2">{film.titre}</h2>
          <p className="card-text">{film.description}</p>
          <span className="badge bg-primary mb-2">⭐ {film.classement}</span>
          <div className="ratio ratio-16x9 mt-3">
            <iframe src={film.trailer} title="Trailer" allowFullScreen style={{borderRadius: 8}}></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

function Home({ films, setFilms, filtreTitre, setFiltreTitre, filtreClassement, setFiltreClassement, ajouterFilm }) {
  const filmsFiltres = films.filter(film =>
    film.titre.toLowerCase().includes(filtreTitre.toLowerCase()) &&
    (filtreClassement === '' || film.classement >= Number(filtreClassement))
  );
  return (
    <div className="container py-5" style={{fontFamily: 'Segoe UI, Arial, sans-serif'}}>
      <h1 className="mb-4 text-center" style={{fontWeight: 700}}>Mes Films & Séries Favoris</h1>
      <Filtre
        filtreTitre={filtreTitre}
        setFiltreTitre={setFiltreTitre}
        filtreClassement={filtreClassement}
        setFiltreClassement={setFiltreClassement}
      />
      <AjouterFilm onAjouter={ajouterFilm} />
      <ListeFilms films={filmsFiltres} />
    </div>
  );
}

function App() {
  const [films, setFilms] = useState([
    {
      id: 1,
      titre: 'Inception',
      description: 'Un voleur qui infiltre les rêves.',
      posterURL: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg',
      classement: 5,
      trailer: 'https://www.youtube.com/embed/YoHD9XEInc0'
    },
    {
      id: 2,
      titre: 'Interstellar',
      description: "Voyage à travers l'espace et le temps.",
      posterURL: 'https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg',
      classement: 3,
      trailer: 'https://www.youtube.com/embed/zSWdZVtXT7E'
    },
    {
      id: 3,
      titre: 'The Dark Knight',
      description: 'Batman affronte le Joker.',
      posterURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnhQoFxFYsLZx2r9Vh2F8E63WGrgp9ylg1Tg&s',
      classement: 4,
      trailer: 'https://www.youtube.com/embed/EXeTwQWrcwY'
    }
  ]);
  const [filtreTitre, setFiltreTitre] = useState('');
  const [filtreClassement, setFiltreClassement] = useState('');

  // Pour ajouter un film avec un id unique
  const ajouterFilm = (film) => setFilms([{ ...film, id: Date.now() }, ...films]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home films={films} setFilms={setFilms} filtreTitre={filtreTitre} setFiltreTitre={setFiltreTitre} filtreClassement={filtreClassement} setFiltreClassement={setFiltreClassement} ajouterFilm={ajouterFilm} />} />
        <Route path="film/:id" element={<FilmDescription films={films} />} />
      </Routes>
    </Router>
  );
}

export default App;
