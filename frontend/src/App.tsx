import Dashboard from './Dashboard';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>📊 OpenWrapped</h1>
        <p>Deine Anwendungsstatistiken in Echtzeit</p>
      </header>
      <Dashboard />
    </div>
  );
}
