import './App.css';
import { Toolbar } from './components/Toolbar';

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toolbar mapId="demo-map" mapTitle="Story Mapper" />
      <main className="p-6">
        <p className="text-sm text-slate-700">
          Use the Export menu to generate Markdown requirements documents for your story map.
        </p>
      </main>
    </div>
  );
}
