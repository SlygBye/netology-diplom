import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Book {
  id: string;
  title: string;
  description: string;
  authors: string;
}

export function App() {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('dima@example.com');
  const [password, setPassword] = useState('password123');

  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [description, setDescription] = useState('');

  const fetchBooks = async () => {
    try {
      const res = await axios.get<Book[]>('/api/books');
      setBooks(res.data);
    } catch (err) {
      console.error('Ошибка загрузки книг:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/signin', { email, password });
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem('token', newToken);
      alert('Успешный вход!');
    } catch (err) {
      alert('Ошибка входа!');
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert('Сначала авторизуйтесь!');
    try {
      await axios.post(
        '/api/books',
        { title, authors, description },
        { headers: { Authorization: 'Bearer ' + token } }
      );
      setTitle('');
      setAuthors('');
      setDescription('');
      fetchBooks();
    } catch (err) {
      alert('Ошибка при добавлении книги!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return alert('Сначала авторизуйтесь!');
    try {
      await axios.delete('/api/books/' + id, {
        headers: { Authorization: 'Bearer ' + token },
      });
      fetchBooks();
    } catch (err) {
      alert('Ошибка при удалении книги!');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Библиотека русской литературы</h1>

      {/* Блок авторизации */}
      <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{token ? 'Вы авторизованы' : '🔑 Вход в систему'}</h3>
        {!token ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              required
            />
            <button type="submit">Войти</button>
          </form>
        ) : (
          <button onClick={() => { setToken(''); localStorage.removeItem('token'); }}>Выйти</button>
        )}
      </div>

      {/* Форма добавления книги */}
      <form onSubmit={handleAddBook} style={{ background: '#eef6ff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>➕ Добавить книгу</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название книги"
            required
          />
          <input
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            placeholder="Автор"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
          />
          <button type="submit" disabled={!token}>
            {token ? 'Добавить книгу' : 'Авторизуйтесь, чтобы добавить'}
          </button>
        </div>
      </form>
{/* Список книг */}
      <h2>Список книг в базе ({books.length})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {books.map((book) => (
          <div key={book.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 5px 0' }}>{book.title}</h3>
            <p style={{ margin: '0 0 5px 0', color: '#555' }}><strong>Автор:</strong> {book.authors}</p>
            <p style={{ margin: '0 0 10px 0' }}>{book.description}</p>
            {token && (
              <button onClick={() => handleDelete(book.id)} style={{ color: 'red' }}>
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;