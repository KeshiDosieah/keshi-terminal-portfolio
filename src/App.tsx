import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import About from './pages/About';
import Toolkit from './pages/Toolkit';
import Contact from './pages/Contact';

export default function App() {
  return <Routes><Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:slug" element={<Projects />} />
    <Route path="/experience" element={<Experience />} />
    <Route path="/about" element={<About />} />
    <Route path="/toolkit" element={<Toolkit />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="*" element={<Home />} />
  </Route></Routes>;
}
