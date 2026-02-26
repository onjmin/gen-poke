import { useState } from 'react';
import Poke from './pages/Poke';
import Dqr from './pages/Dqr';
import { LayoutGridIcon, SwordIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'poke' | 'dqr'>('poke');

  return (
    // min-h-screen から h-screen に変更し、overflow-hidden でハミ出しをカット
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-white p-4 overflow-hidden">
      
      {/* ナビゲーションコンテナ（高さ固定） */}
      <div className="max-w-md mx-auto mb-4 w-full flex-shrink-0">
        <div className="flex p-1 bg-gray-100/10 rounded-xl border border-gray-300/20">
          <button
            onClick={() => setActiveTab('poke')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg transition-all ${
              activeTab === 'poke'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-100/20'
            }`}
          >
            <LayoutGridIcon size={18} className="mr-2" />
            <span className="font-bold text-sm">ポケポケ</span>
          </button>

          <button
            onClick={() => setActiveTab('dqr')}
            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg transition-all ${
              activeTab === 'dqr'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-500 hover:bg-gray-100/20'
            }`}
          >
            <SwordIcon size={18} className="mr-2" />
            <span className="font-bold text-sm">ライバルズ</span>
          </button>
        </div>
      </div>

      {/* メインコンテンツエリア（ここが残りの高さを埋める） */}
      <main className="flex-1 w-full max-w-4xl mx-auto overflow-hidden">
        <div className="h-full animate-in fade-in duration-300">
          {activeTab === 'poke' ? <Poke /> : <Dqr />}
        </div>
      </main>
    </div>
  );
}