import { useState, useRef, useCallback, memo, type ChangeEvent } from 'react';
import { 
  Download, 
  RotateCcw, 
  Type, 
  Image as ImageIcon, 
  Move, 
  Maximize, 
  Layers,
  type LucideIcon
} from 'lucide-react';

// --- 型定義 ---

interface ControlSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: string) => void;
  icon?: LucideIcon;
}

interface LayerData {
  url: string;
  x: number;
  y: number;
  scale: number;
}

interface LayersState {
  [key: string]: LayerData;
  unitImg: LayerData;
  bgImg: LayerData;
}

interface CardData {
  name: string;
  tribe: string;
  cost: number;
  attack: number;
  hp: number;
  description: string;
  fontSize: number;
  [key: string]: string | number;
}

// --- コンポーネント ---

const ControlSlider = memo(({ label, value, min, max, step, onChange, icon: Icon }: ControlSliderProps) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] text-gray-500 uppercase tracking-wider items-center font-bold">
      <span className="flex items-center gap-1">{Icon && <Icon size={10} />} {label}</span>
      <span>{value}</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="w-full h-1.5 bg-gray-100/10 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:bg-gray-100/20 transition-all"
    />
  </div>
));

const Dqr = () => {
  const CARD_WIDTH = 380;
  const CARD_HEIGHT = 475;

  const FRAME_SCALES: Record<string, number> = {
    unit: 1.07,
    skill: 1.00
  };

  const FRAME_IMAGES: Record<string, string> = {
    unit: 'https://onjmin.github.io/gen-poke/images/dqr/unit-48px.png',
    skill: 'https://onjmin.github.io/gen-poke/images/dqr/skill-52px.png'
  };

  const [cardType, setCardType] = useState<'unit' | 'skill'>('unit');
  const [cardData, setCardData] = useState<CardData>({
    name: '魔女グレイツェル',
    tribe: '冒険者',
    cost: 6,
    attack: 5,
    hp: 5,
    description: '[おうえん]　[召喚時]：\nランダムな敵1体を\n次のターン終了時まで\n攻撃不能にする\n\n[スキルブースト]：+1体',
    fontSize: 16,
  });

  const [layers, setLayers] = useState<LayersState>({
    unitImg: { url: '', x: 0, y: 0, scale: 1 },
    bgImg: { url: '', x: 0, y: 0, scale: 1 }
  });

  const cardRef = useRef<HTMLDivElement>(null);

  const getAutoCorrectionScale = () => cardType === 'unit' ? 1.2 : 1.04;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleLayerChange = useCallback((layer: string, key: keyof LayerData, value: string) => {
    setLayers(prev => ({
      ...prev,
      [layer]: { ...prev[layer], [key]: parseFloat(value) }
    }));
  }, []);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, layer: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLayers(prev => ({
        ...prev,
        [layer]: { ...prev[layer], url }
      }));
    }
  };

  const parseDescription = (text: string) => {
    if (!text || text.trim() === "") return <span>&nbsp;</span>;
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return <span key={i} style={{ color: '#f8bb44' }} className="font-bold">{part.slice(1, -1)}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex h-full bg-[#0f1115] overflow-hidden font-sans text-white rounded-lg">
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black/20 overflow-auto">
        <div 
          ref={cardRef}
          className="relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.9)] card-font rounded-lg bg-black select-none shrink-0"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT, imageRendering: 'pixelated' }}
        >
          {layers.bgImg.url && (
            <div className="absolute inset-0 z-0 pointer-events-none"
              style={{
                transform: `translate3d(${layers.bgImg.x}px, ${layers.bgImg.y}px, 0) scale(${layers.bgImg.scale})`,
                backgroundImage: `url(${layers.bgImg.url})`,
                backgroundSize: 'cover', backgroundPosition: 'center', imageRendering: 'pixelated'
              }}
            />
          )}

          {layers.unitImg.url && (
            <div className="absolute inset-0 z-10 pointer-events-none"
              style={{
                transform: `translate3d(${layers.unitImg.x}px, ${layers.unitImg.y}px, 0) scale(${layers.unitImg.scale * getAutoCorrectionScale()})`,
                backgroundImage: `url(${layers.unitImg.url})`,
                backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', imageRendering: 'pixelated'
              }}
            />
          )}

          <img 
            src={FRAME_IMAGES[cardType]} 
            alt="frame" 
            className="absolute top-0 left-0 z-20 pointer-events-none select-none"
            style={{ 
              imageRendering: 'pixelated', width: CARD_WIDTH, height: CARD_HEIGHT,
              transform: `scale(${FRAME_SCALES[cardType]})`, transformOrigin: 'top left' 
            }}
          />

          <div className="absolute top-[-1px] left-[2px] w-[85px] h-[85px] z-30 flex items-center justify-center">
            <span className="text-white text-[58px] font-black tracking-tighter stat-font black-outline">{cardData.cost}</span>
          </div>

          <div className="absolute left-0 w-full z-30 flex justify-center top-[241px]">
            <span className="text-white text-[20px] font-bold tracking-tighter name-outline">{cardData.name}</span>
          </div>

          <div className={`absolute left-1/2 -translate-x-1/2 w-[290px] z-30 flex items-center justify-center px-4 text-center ${cardType === 'unit' ? 'bottom-[78px] h-[110px]' : 'bottom-[70px] h-[125px]'}`}>
            <div className="font-bold leading-[1.3] w-full" style={{ fontSize: `${cardData.fontSize}px`, textShadow: '2px 2px 2px rgba(0,0,0,1)', color: '#ffffff' }}>
              {cardData.description.split('\n').map((line, idx) => (
                <div key={idx} className="min-h-[1em]">{parseDescription(line)}</div>
              ))}
            </div>
          </div>

          {cardType === 'unit' && (
            <>
              <div className="absolute left-0 w-full z-30 flex justify-center bottom-[31px]">
                <span className="text-white text-[14px] font-bold tracking-tight tribe-outline">{cardData.tribe}</span>
              </div>
              <div className="absolute bottom-[7px] left-[5px] w-[75px] h-[75px] z-30 flex items-center justify-center">
                <span className="text-white text-[52px] font-black tracking-tighter stat-font black-outline">{cardData.attack}</span>
              </div>
              <div className="absolute bottom-[7px] right-[10px] w-[75px] h-[75px] z-30 flex items-center justify-center">
                <span className="text-white text-[52px] font-black tracking-tighter stat-font black-outline">{cardData.hp}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-[450px] border-l border-white/5 bg-[#161920] flex flex-col h-full shadow-2xl">
        <div className="p-6 flex items-center justify-between border-b border-white/5 bg-gray-100/5">
          <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Layers className="text-yellow-500" size={20} /> CARD EDITOR
          </h1>
          <button className="bg-yellow-600 hover:bg-yellow-500 p-2 rounded-lg transition-all active:scale-95 shadow-lg">
            <Download size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          <div className="flex p-1 bg-gray-100/10 rounded-xl border border-white/5">
            <button onClick={() => setCardType('unit')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${cardType === 'unit' ? 'bg-yellow-600 shadow-lg' : 'text-gray-500 hover:text-white'}`}>ユニット</button>
            <button onClick={() => setCardType('skill')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${cardType === 'skill' ? 'bg-yellow-600 shadow-lg' : 'text-gray-500 hover:text-white'}`}>特技</button>
          </div>

          <div className="bg-gray-100/10 p-5 rounded-2xl border border-white/5 space-y-4">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2"><Type size={12} className="text-yellow-500" /> 文字情報</h2>
            <div className="space-y-3">
              <div className={`grid ${cardType === 'unit' ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1 font-bold">カード名</label>
                  <input name="name" value={cardData.name} onChange={handleInputChange} className="w-full bg-gray-100/10 rounded-lg p-2 text-sm outline-none border border-white/5 focus:border-yellow-500/50 transition-all text-white" />
                </div>
                {cardType === 'unit' && (
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-1 font-bold">系統 (最大5文字)</label>
                    <input name="tribe" maxLength={5} value={cardData.tribe} onChange={handleInputChange} className="w-full bg-gray-100/10 rounded-lg p-2 text-sm outline-none border border-white/5 focus:border-yellow-500/50 transition-all text-white" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-gray-500 block mb-1 font-bold">コスト</label>
                  <input type="number" name="cost" value={cardData.cost} onChange={handleInputChange} className="w-full bg-gray-100/10 rounded-lg p-2 text-sm outline-none border border-white/5 text-white" />
                </div>
                {cardType === 'unit' && (
                  <>
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1 font-bold">攻撃力</label>
                      <input type="number" name="attack" value={cardData.attack} onChange={handleInputChange} className="w-full bg-gray-100/10 rounded-lg p-2 text-sm outline-none border border-white/5 text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 block mb-1 font-bold">HP</label>
                      <input type="number" name="hp" value={cardData.hp} onChange={handleInputChange} className="w-full bg-gray-100/10 rounded-lg p-2 text-sm outline-none border border-white/5 text-white" />
                    </div>
                  </>
                )}
              </div>
              <textarea name="description" rows={5} value={cardData.description} onChange={handleInputChange} className="w-full bg-gray-100/10 rounded-lg p-3 text-sm outline-none resize-none leading-relaxed border border-white/5 text-white" />
              <ControlSlider label="フォントサイズ" value={cardData.fontSize} min={10} max={30} step={1} onChange={(v) => setCardData(p => ({...p, fontSize: parseInt(v)}))} />
            </div>
          </div>

          <div className="bg-gray-100/10 p-5 rounded-2xl border border-white/5 space-y-6">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2"><ImageIcon size={12} className="text-blue-500" /> 画像調整</h2>
            {(['unitImg', 'bgImg'] as const).map((layerKey) => (
              <div key={layerKey} className="space-y-3 p-3 bg-black/20 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-gray-300">{layerKey === 'unitImg' ? 'イラスト' : '背景'}</span>
                  <label className="cursor-pointer text-blue-400 text-[10px] hover:text-blue-300 font-black uppercase">UPLOAD<input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, layerKey)} /></label>
                </div>
                <div className="space-y-3">
                  <ControlSlider icon={Move} label="X" value={layers[layerKey].x} min={-500} max={500} step={1} onChange={(v) => handleLayerChange(layerKey, 'x', v)} />
                  <ControlSlider icon={Move} label="Y" value={layers[layerKey].y} min={-500} max={500} step={1} onChange={(v) => handleLayerChange(layerKey, 'y', v)} />
                  <ControlSlider icon={Maximize} label="Scale" value={layers[layerKey].scale} min={0.1} max={5} step={0.01} onChange={(v) => handleLayerChange(layerKey, 'scale', v)} />
                </div>
              </div>
            ))}
          </div>

          <button 
            className="w-full bg-gray-100/10 hover:bg-gray-100/20 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/5 text-sm font-bold"
            onClick={() => {
              setLayers({unitImg: { url: '', x: 0, y: 0, scale: 1 }, bgImg: { url: '', x: 0, y: 0, scale: 1 }});
              setCardData(prev => ({...prev, tribe: '冒険者'}));
            }}
          ><RotateCcw size={16} /> リセット</button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@700;800;900&family=Oswald:wght@700&display=swap');
        .card-font { font-family: 'M PLUS Rounded 1c', sans-serif; }
        .stat-font { font-family: 'Oswald', sans-serif; transform: scaleY(1.02); display: inline-block; }
        .black-outline {
        paint-order: stroke fill;
        -webkit-text-stroke: 6px #000000;
        text-shadow:
            0 1px 0 #000,
            -0.5px 2px 0 #000, 0 2px 0 #000, 0.5px 2px 0 #000,
            -1px 3px 0 #000,   0 3px 0 #000, 1px 3px 0 #000,
            -1.5px 4px 0 #000, 0 4px 0 #000, 1.5px 4px 0 #000,
            -2px 5px 0 #000,   0 5px 0 #000, 2px 5px 0 #000;
        }
        .name-outline { paint-order: stroke fill; -webkit-text-stroke: 3.5px #000000; text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000; }
        .tribe-outline { paint-order: stroke fill; -webkit-text-stroke: 2.5px #000000; text-shadow: 1px 1px 0 #000, -1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000; }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="range"] { -webkit-appearance: none; background: transparent; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 16px; width: 16px; border-radius: 50%;
          background: #eab308; cursor: pointer; margin-top: -6px; border: 2px solid #161920; box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        input[type="range"]::-webkit-slider-runnable-track { width: 100%; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
};

export default Dqr;