import { useState, useEffect } from 'react';
import { Plus, Github, ExternalLink, Trash2, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const [links, setLinks] = useState(() => {
    const saved = localStorage.getItem('gh-pages-links');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    localStorage.setItem('gh-pages-links', JSON.stringify(links));
  }, [links]);

  const addLink = (e) => {
    e.preventDefault();
    if (!title || !url) return;

    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }

    const newLink = {
      id: Date.now(),
      title,
      url: formattedUrl,
      createdAt: new Date().toISOString()
    };

    setLinks([newLink, ...links]);
    setTitle('');
    setUrl('');
    setIsAdding(false);
  };

  const deleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
  };

  return (
    <div className="container">
      <header className="header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="logo-section"
        >
          <Github className="icon-main" />
          <h1>My GitHub Showcase</h1>
          <p>Manage and browse your hosted projects in one place</p>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="add-btn"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? "Cancel" : <><Plus size={20} /> Add Project</>}
        </motion.button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="form-container"
          >
            <form onSubmit={addLink} className="add-form">
              <div className="input-group">
                <label>Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. My Awesome Portfolio"
                  required
                />
              </div>
              <div className="input-group">
                <label>GitHub Pages URL</label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. username.github.io/repo"
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={!title || !url}>Save Project</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="link-grid">
        <AnimatePresence>
          {links.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <Globe size={48} />
              <h3>No projects added yet</h3>
              <p>Click the "Add Project" button to start showcasing your work.</p>
            </motion.div>
          ) : (
            links.map((link) => (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="link-card"
              >
                <div className="card-header">
                  <div className="link-icon-bg">
                    <Globe size={24} />
                  </div>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="delete-btn"
                    title="Delete project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="card-body">
                  <h3>{link.title}</h3>
                  <p className="url-text">{link.url.replace(/^https?:\/\//, '')}</p>
                </div>
                <div className="card-footer">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="visit-link"
                  >
                    Visit Site <ExternalLink size={16} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
