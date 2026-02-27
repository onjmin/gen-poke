import { LayoutGridIcon, SwordIcon } from "lucide-react";
import { useState } from "react";
import Dqr from "./pages/Dqr";
import Poke from "./pages/Poke";

export default function App() {
	const [activeTab, setActiveTab] = useState<"poke" | "dqr">("poke");

	return (
		<div className="h-screen flex flex-col bg-[#1a1a1a] text-white p-4 overflow-hidden">
			{/* --- タイトルセクション（控えめな1行） --- */}
			<header className="text-center mb-4 flex-shrink-0">
				<h1 className="text-sm font-bold tracking-widest text-gray-500 uppercase">
					ポケポケカードジェネレーター
				</h1>
			</header>

			{/* ナビゲーションコンテナ（高さ固定） */}
			<div className="max-w-xs mx-auto mb-4 w-full flex-shrink-0">
				<div className="flex p-1 bg-gray-100/10 rounded-xl border border-white/5">
					<button
						onClick={() => setActiveTab("poke")}
						className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded-lg transition-all ${
							activeTab === "poke"
								? "bg-green-600 text-white shadow-lg"
								: "text-gray-500 hover:bg-gray-100/20"
						}`}
					>
						<LayoutGridIcon size={16} className="mr-2" />
						<span className="font-bold text-xs">ポケポケ</span>
					</button>

					<button
						onClick={() => setActiveTab("dqr")}
						className={`flex-1 flex items-center justify-center py-1.5 px-3 rounded-lg transition-all ${
							activeTab === "dqr"
								? "bg-green-600 text-white shadow-lg"
								: "text-gray-500 hover:bg-gray-100/20"
						}`}
					>
						<SwordIcon size={16} className="mr-2" />
						<span className="font-bold text-xs">ライバルズ</span>
					</button>
				</div>
			</div>

			{/* メインコンテンツエリア */}
			<main className="flex-1 w-full max-w-6xl mx-auto overflow-hidden">
				<div className="h-full animate-in fade-in duration-300">
					{activeTab === "poke" ? <Poke /> : <Dqr />}
				</div>
			</main>
		</div>
	);
}
