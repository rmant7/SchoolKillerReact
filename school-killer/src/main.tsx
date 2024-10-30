import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Solution from './pages/Solution';
import CheckSolution from './pages/CheckSolution';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/solution" element={<Solution />} />
            <Route path="/check-solution" element={<CheckSolution />} />
        </Routes>
    </Router>
);
