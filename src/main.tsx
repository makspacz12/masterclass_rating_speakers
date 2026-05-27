import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Bez StrictMode — unika podwójnego montowania sceny Spline w trybie dev,
// co potrafiło powodować zacinanie się śledzenia kursora przez robota.
ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
