import {
	Circle,
	Download,
	Droplets,
	Flame,
	Image as ImageIcon,
	Leaf,
	Moon,
	Plus,
	Trash2,
	Zap,
	ZoomIn,
} from "lucide-react";
import { type ChangeEvent, useState } from "react"; // Reactを削除し、useStateと型をimport

// エネルギータイプの定義
const ENERGY_TYPES = {
	GRASS: { name: "草", color: "#77cc55", emoji: ":GRASS:" },
	FIRE: { name: "炎", color: "#ff4422", emoji: ":FIRE:" },
	WATER: { name: "水", color: "#3399ff", emoji: ":WATER:" },
	LIGHTNING: { name: "雷", color: "#ffcc33", emoji: ":LIGHTNING:" },
	PSYCHIC: { name: "超", color: "#ff66aa", emoji: ":PSYCHIC:" },
	FIGHTING: { name: "闘", color: "#ff9944", emoji: ":FIGHTING:" },
	DARKNESS: { name: "悪", color: "#778899", emoji: ":DARKNESS:" },
	METAL: { name: "鋼", color: "#99aabb", emoji: ":METAL:" },
	COLORLESS: { name: "無", color: "#dde0e2", emoji: ":COLORLESS:" },
} as const; // as const を追加して型を固定

type EnergyType = keyof typeof ENERGY_TYPES;

const FistIcon = ({ size = 18 }: { size?: number }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="currentColor"
		xmlns="http://www.w3.org/2000/svg"
		role="img"
		aria-labelledby="fist-icon-title"
	>
		<title id="fist-icon-title">闘タイプアイコン</title>
		<path d="M7 11.5V6.5C7 5.67 7.67 5 8.5 5C9.33 5 10 5.67 10 6.5V10.5M10 10.5V5.5C10 4.67 10.67 4 11.5 4C12.33 4 13 4.67 13 5.5V10.5M13 10.5V6.5C13 5.67 13.67 5 14.5 5C15.33 5 16 5.67 16 6.5V11.5M16 11.5V9.5C16 8.67 16.67 8 17.5 8C18.33 8 19 8.67 19 9.5V15.5C19 19.09 16.09 22 12.5 22C8.91 22 6 19.09 6 15.5V11.5H7ZM18 11.5V15.5C18 18.54 15.54 21 12.5 21C9.46 21 7 18.54 7 15.5V12.5H16.5C17.33 12.5 18 11.83 18 11V11.5Z" />
	</svg>
);

const EnergyIcon = ({
	type,
	size = 16,
	shadow = true,
}: {
	type: string;
	size?: number;
	shadow?: boolean;
}) => {
	const config = ENERGY_TYPES[type as EnergyType] || ENERGY_TYPES.COLORLESS;
	return (
		<span
			className="rounded-full flex items-center justify-center inline-flex align-middle"
			style={{
				backgroundColor: config.color,
				width: size,
				height: size,
				boxShadow: shadow ? "inset 0 1px 2px rgba(0,0,0,0.4)" : "none",
			}}
		>
			<span
				className="text-white flex items-center justify-center"
				style={{ transform: `scale(${size / 24})` }}
			>
				{type === "GRASS" && <Leaf size={18} fill="currentColor" />}
				{type === "FIRE" && <Flame size={18} fill="currentColor" />}
				{type === "WATER" && <Droplets size={18} fill="currentColor" />}
				{type === "LIGHTNING" && <Zap size={18} fill="currentColor" />}
				{type === "PSYCHIC" && <Moon size={18} fill="currentColor" />}
				{type === "FIGHTING" && <FistIcon size={20} />}
				{type === "DARKNESS" && <Moon size={18} fill="currentColor" className="rotate-180" />}
				{type === "COLORLESS" && <Circle size={18} fill="currentColor" />}
			</span>
		</span>
	);
};

const renderTextWithIcons = (text: string) => {
	if (!text) return null;
	const parts = text.split(/(:[A-Z]+:)/g);
	return parts.map((part, i) => {
		const typeKey = Object.keys(ENERGY_TYPES).find(
			(key) => ENERGY_TYPES[key as EnergyType].emoji === part,
		) as EnergyType | undefined;

		if (typeKey) {
			return (
				<span key={i} className="mx-0.5">
					<EnergyIcon type={typeKey} size={12} shadow={false} />
				</span>
			);
		}
		return <span key={i}>{part}</span>;
	});
};

const App = () => {
	// --- ここからステータスの型定義 ---
	const [cardData, setCardData] = useState({
		name: "アルセウス",
		hp: "140",
		type: "COLORLESS" as string,
		stage: "たね",
		isEx: true,
		isRare: true,
		rarity: 4,
		hasAbility: true,
		abilityName: "しんわのかがやき",
		abilityDesc: "このポケモンは特殊状態にならない。",
		preEvoImage: null as string | null,
		bgImage: null as string | null,
		artImage: null as string | null,
		bgPos: { x: 50, y: 50, scale: 100 },
		artPos: { x: 50, y: 50, scale: 100 },
		attacks: [
			{
				id: 1,
				name: "アルティメットフォース",
				damage: "70+",
				description: "自分のベンチポケモンの数×20ダメージ追加。",
				energy: ["COLORLESS", "COLORLESS", "COLORLESS"] as string[],
			},
		],
		weakness: "FIGHTING" as string,
		retreat: 2,
		baseColor: "#1a1a1a",
		subColor: "#666666",
		cardBgColor: "#f2f2f2",
	});

	const [activeLayer, setActiveLayer] = useState("art");

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, target: string) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setCardData((prev) => ({ ...prev, [target]: reader.result as string }));
			reader.readAsDataURL(file);
		}
	};

	const updatePos = (key: string, val: number) => {
		const layerKey = activeLayer === "art" ? "artPos" : "bgPos";
		setCardData((prev) => ({
			...prev,
			[layerKey]: { ...prev[layerKey as "artPos" | "bgPos"], [key]: val },
		}));
	};

	return (
		<div className="h-screen bg-slate-950 flex flex-col md:flex-row p-4 md:p-8 gap-8 items-start justify-center font-sans overflow-hidden">
			{/* プレビューエリア */}
			<div className="w-full max-w-[380px] flex-shrink-0 mx-auto lg:sticky lg:top-0">
				<div
					id="card-preview"
					className="relative aspect-[1/1.4] w-full rounded-[2.2rem] overflow-hidden shadow-2xl select-none"
					style={{ backgroundColor: cardData.cardBgColor }}
				>
					{/* 背景テクスチャ */}
					<div
						className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-multiply"
						style={{
							backgroundImage:
								"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
						}}
					/>

					{/* イラストエリア */}
					<div className="absolute top-[80px] left-[35px] right-[35px] h-[36%] z-10 overflow-hidden rounded-[2px] bg-gray-200 border border-black/10">
						<div className="absolute inset-0">
							{cardData.bgImage ? (
								<img
									src={cardData.bgImage}
									className="absolute w-full h-full object-cover"
									style={{
										transform: `scale(${cardData.bgPos.scale / 100}) translate(${cardData.bgPos.x - 50}%, ${cardData.bgPos.y - 50}%)`,
										imageRendering: "pixelated",
									}}
									alt=""
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
							)}
						</div>
						<div className="absolute inset-0 flex items-center justify-center">
							{cardData.artImage && (
								<img
									src={cardData.artImage}
									className="max-w-none"
									style={{
										height: "95%",
										transform: `scale(${cardData.artPos.scale / 100}) translate(${cardData.artPos.x - 50}%, ${cardData.artPos.y - 50}%)`,
										imageRendering: "pixelated",
									}}
									alt=""
								/>
							)}
						</div>
					</div>

					{/* レア枠（銀縁） */}
					{cardData.isRare && (
						<div
							className="absolute inset-0 z-40 pointer-events-none rounded-[2.2rem] border-[12px]"
							style={{
								borderColor: "transparent",
								background:
									"linear-gradient(135deg, #cbd5e1 0%, #ffffff 25%, #94a3b8 50%, #f1f5f9 75%, #475569 100%) border-box",
								mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
								WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
								maskComposite: "exclude",
								WebkitMaskComposite: "destination-out",
							}}
						/>
					)}

					{/* コンテンツレイヤー */}
					<div className="absolute inset-0 z-20 flex flex-col p-[22px] pt-[26px] pointer-events-none">
						{/* ヘッダー: 名前は枠の右側に配置 */}
						<div className="flex justify-between items-end h-[44px]">
							<div className="flex items-center gap-2 h-full">
								{cardData.stage !== "たね" ? (
									<div className="w-[42px] h-[42px] rounded-lg border border-black/10 bg-white overflow-hidden flex-shrink-0 shadow-sm flex items-center justify-center">
										{cardData.preEvoImage ? (
											<img
												src={cardData.preEvoImage}
												className="w-full h-full object-cover"
												alt=""
											/>
										) : (
											<ImageIcon size={20} className="text-gray-300" />
										)}
									</div>
								) : (
									<div className="bg-gray-100 px-2 py-0.5 rounded-[4px] text-[8px] font-black text-black border border-black/5 self-end mb-1">
										たね
									</div>
								)}
								<div className="flex flex-col justify-end">
									{cardData.stage !== "たね" && (
										<span
											className="text-[7px] font-bold leading-none mb-0.5"
											style={{ color: cardData.subColor }}
										>
											{cardData.stage}から進化
										</span>
									)}
									<h1
										className="text-[20px] font-black tracking-tighter leading-none flex items-baseline gap-1"
										style={{ color: cardData.baseColor }}
									>
										{cardData.name}
										{cardData.isEx && <span className="italic text-[22px] tracking-tight">ex</span>}
									</h1>
								</div>
							</div>

							<div className="flex items-baseline gap-0.5 mb-1">
								<span className="text-[9px] font-black" style={{ color: cardData.subColor }}>
									HP
								</span>
								<span
									className="text-[22px] font-black italic tracking-tighter leading-none"
									style={{ color: cardData.baseColor }}
								>
									{cardData.hp}
								</span>
								<div className="ml-1">
									<EnergyIcon type={cardData.type} size={22} />
								</div>
							</div>
						</div>

						{/* イラストエリア分の高さ確保 */}
						<div className="h-[40%]" />

						{/* テキストエリア */}
						<div className="flex-1 flex flex-col gap-4 mt-8">
							{cardData.hasAbility && (
								<div className="px-2">
									<div className="flex items-center gap-2 mb-0.5">
										<div className="bg-[#cc0000] text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm italic">
											特性
										</div>
										<span
											className="text-[14px] font-black tracking-tight"
											style={{ color: "#cc0000" }}
										>
											{cardData.abilityName}
										</span>
									</div>
									<p
										className="text-[10px] font-bold leading-[1.2]"
										style={{ color: cardData.baseColor }}
									>
										{renderTextWithIcons(cardData.abilityDesc)}
									</p>
								</div>
							)}

							{cardData.attacks.map((atk) => (
								<div key={atk.id} className="px-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-1 flex-1 min-w-0">
											<div className="flex gap-0.5 shrink-0">
												{atk.energy.map((e, idx) => (
													<EnergyIcon key={idx} type={e} size={16} />
												))}
											</div>
											<span
												className="text-[15px] font-black truncate ml-1"
												style={{ color: cardData.baseColor }}
											>
												{atk.name}
											</span>
										</div>
										<span
											className="text-[20px] font-black italic tracking-tighter shrink-0"
											style={{ color: cardData.baseColor }}
										>
											{atk.damage}
										</span>
									</div>
									{atk.description && (
										<p
											className="text-[9px] font-bold mt-0.5 leading-tight"
											style={{ color: cardData.baseColor }}
										>
											{renderTextWithIcons(atk.description)}
										</p>
									)}
								</div>
							))}
						</div>

						{/* フッター */}
						<div className="mt-auto">
							<div className="flex justify-between items-center border-b border-black/5 pb-1 mb-2">
								<div className="flex flex-col items-center">
									<span
										className="text-[7px] font-bold mb-0.5"
										style={{ color: cardData.subColor }}
									>
										じゃくてん
									</span>
									<div className="flex items-center gap-1">
										<EnergyIcon type={cardData.weakness} size={14} />
										<span className="text-[9px] font-black" style={{ color: cardData.baseColor }}>
											x2
										</span>
									</div>
								</div>
								<div className="flex flex-col items-center">
									<span
										className="text-[7px] font-bold mb-0.5"
										style={{ color: cardData.subColor }}
									>
										にげる
									</span>
									<div className="flex gap-0.5">
										{Array.from({ length: cardData.retreat }).map((_, i) => (
											<EnergyIcon key={i} type="COLORLESS" size={12} />
										))}
									</div>
								</div>
							</div>

							<div className="flex justify-between items-end h-[28px]">
								<div className="flex gap-0.5 pb-1">
									{Array.from({ length: cardData.rarity }).map((_, i) => (
										<div
											key={i}
											className="w-[10px] h-[12px] bg-sky-500"
											style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
										/>
									))}
								</div>
								{cardData.isEx && (
									<div className="bg-black text-white px-3 py-1 rounded-sm flex items-center gap-2 transform skew-x-[-10deg]">
										<div className="transform skew-x-[10deg] flex items-center gap-2">
											<span className="text-[8px] font-black italic text-yellow-400 border-r border-yellow-400/30 pr-2 leading-none">
												exルール
											</span>
											<span className="text-[6.5px] font-bold leading-none tracking-tighter">
												ポケモンexがきぜつしたとき、相手はサイドを2ポイントとる。
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* 設定パネル */}
			<div className="flex-1 w-full max-w-[500px] h-full overflow-y-auto pr-2 space-y-6 pb-24 no-print text-white scrollbar-thin scrollbar-thumb-gray-100/20">
				{/* イラスト操作セクション */}
				<section className="bg-gray-100/10 p-6 rounded-3xl border border-gray-100/10 space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-bold flex items-center gap-2 text-white">
							<ImageIcon size={20} /> イラスト操作
						</h2>
						<div className="flex gap-4">
							<label className="flex items-center gap-2 cursor-pointer bg-gray-100/10 px-3 py-1 rounded-full border border-white/5 hover:bg-gray-100/20 transition-colors">
								<input
									type="checkbox"
									checked={cardData.isRare}
									onChange={(e) => setCardData({ ...cardData, isRare: e.target.checked })}
									className="w-4 h-4 rounded"
								/>
								<span className="text-xs font-bold text-white">レア枠</span>
							</label>
						</div>
					</div>
					<div className="flex gap-2 p-1 bg-black/20 rounded-2xl">
						{["art", "bg", "pre"].map((layer) => (
							<button
								key={layer}
								onClick={() => setActiveLayer(layer)}
								className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${activeLayer === layer ? "bg-blue-600 shadow-lg text-white" : "text-gray-500 hover:bg-gray-100/10"}`}
							>
								{layer === "art" ? "メイン" : layer === "bg" ? "背景" : "進化前"}
							</button>
						))}
					</div>
					<input
						type="file"
						accept="image/*"
						onChange={(e) =>
							handleImageUpload(
								e,
								activeLayer === "art"
									? "artImage"
									: activeLayer === "bg"
										? "bgImage"
										: "preEvoImage",
							)
						}
						className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer"
					/>

					{activeLayer !== "pre" && (
						<div className="grid grid-cols-1 gap-4">
							<div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl">
								<ZoomIn size={16} className="text-gray-500" />
								<input
									type="range"
									min="10"
									max="800"
									value={activeLayer === "art" ? cardData.artPos.scale : cardData.bgPos.scale}
									onChange={(e) => updatePos("scale", Number(e.target.value))}
									className="flex-1 accent-blue-600"
								/>
							</div>
							<div className="grid grid-cols-2 gap-2">
								<div className="bg-black/20 p-3 rounded-xl space-y-2">
									<span className="text-[10px] font-bold text-gray-500 uppercase">X 位置</span>
									<input
										type="range"
										min="0"
										max="100"
										value={activeLayer === "art" ? cardData.artPos.x : cardData.bgPos.x}
										onChange={(e) => updatePos("x", Number(e.target.value))}
										className="w-full accent-blue-600"
									/>
								</div>
								<div className="bg-black/20 p-3 rounded-xl space-y-2">
									<span className="text-[10px] font-bold text-gray-500 uppercase">Y 位置</span>
									<input
										type="range"
										min="0"
										max="100"
										value={activeLayer === "art" ? cardData.artPos.y : cardData.bgPos.y}
										onChange={(e) => updatePos("y", Number(e.target.value))}
										className="w-full accent-blue-600"
									/>
								</div>
							</div>
						</div>
					)}
				</section>

				{/* 基本情報セクション */}
				<section className="bg-gray-100/10 p-6 rounded-3xl border border-gray-100/10 space-y-4">
					<div className="flex justify-between items-center">
						<h2 className="text-lg font-bold text-white">基本情報</h2>
						<label className="flex items-center gap-2 cursor-pointer text-blue-400">
							<input
								type="checkbox"
								checked={cardData.isEx}
								onChange={(e) => setCardData({ ...cardData, isEx: e.target.checked })}
								className="w-4 h-4"
							/>
							<span className="text-sm font-black italic">ex化</span>
						</label>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-2">ポケモン名</label>
							<input
								type="text"
								value={cardData.name}
								onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
								className="w-full bg-gray-100/10 border-0 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-2">HP</label>
							<input
								type="number"
								value={cardData.hp}
								onChange={(e) => setCardData({ ...cardData, hp: e.target.value })}
								className="w-full bg-gray-100/10 border-0 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-2">タイプ</label>
							<select
								value={cardData.type}
								onChange={(e) => setCardData({ ...cardData, type: e.target.value })}
								className="w-full bg-gray-100/10 border-0 rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer focus:ring-1 focus:ring-blue-500"
							>
								{Object.entries(ENERGY_TYPES).map(([k, v]) => (
									<option key={k} value={k} className="bg-white text-black">
										{v.name}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-2">進化段階</label>
							<select
								value={cardData.stage}
								onChange={(e) => setCardData({ ...cardData, stage: e.target.value })}
								className="w-full bg-gray-100/10 border-0 rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer focus:ring-1 focus:ring-blue-500"
							>
								<option value="たね" className="bg-white text-black">
									たね
								</option>
								<option value="1進化" className="bg-white text-black">
									1進化
								</option>
								<option value="2進化" className="bg-white text-black">
									2進化
								</option>
							</select>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5 mt-2">
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-2">
								レアリティ (ダイヤ数)
							</label>
							<input
								type="range"
								min="1"
								max="5"
								value={cardData.rarity}
								onChange={(e) => setCardData({ ...cardData, rarity: Number(e.target.value) })}
								className="w-full accent-blue-600"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-2">地の色 (背景色)</label>
							<div className="flex items-center gap-2 bg-gray-100/10 rounded-xl px-3 py-1.5 h-[42px]">
								<input
									type="color"
									value={cardData.cardBgColor}
									onChange={(e) => setCardData({ ...cardData, cardBgColor: e.target.value })}
									className="w-8 h-8 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
								/>
								<span className="text-xs font-mono uppercase text-gray-400">
									{cardData.cardBgColor}
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* 弱点・にげる設定セクション（新規追加） */}
				<section className="bg-gray-100/10 p-6 rounded-3xl border border-gray-100/10 space-y-4">
					<h2 className="text-lg font-bold text-white">ステータス詳細</h2>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-2">じゃくてん</label>
							<select
								value={cardData.weakness}
								onChange={(e) => setCardData({ ...cardData, weakness: e.target.value })}
								className="w-full bg-gray-100/10 border-0 rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer focus:ring-1 focus:ring-blue-500"
							>
								{Object.entries(ENERGY_TYPES).map(([k, v]) => (
									<option key={k} value={k} className="bg-white text-black">
										{v.name}
									</option>
								))}
							</select>
						</div>
						<div className="space-y-1">
							<label className="text-[10px] font-bold text-gray-500 ml-2">にげるエネルギー</label>
							<div className="flex items-center gap-4 bg-gray-100/10 p-2.5 rounded-xl">
								<input
									type="range"
									min="0"
									max="4"
									value={cardData.retreat}
									onChange={(e) => setCardData({ ...cardData, retreat: Number(e.target.value) })}
									className="flex-1 accent-blue-600"
								/>
								<span className="text-sm font-bold w-4 text-center">{cardData.retreat}</span>
							</div>
						</div>
					</div>
				</section>

				{/* わざ・特性セクション */}
				<section className="bg-gray-100/10 p-6 rounded-3xl border border-gray-100/10 space-y-4">
					<div className="flex justify-between items-center border-b border-white/5 pb-2">
						<h2 className="text-lg font-bold">わざ・特性</h2>
						<button
							onClick={() => setCardData({ ...cardData, hasAbility: !cardData.hasAbility })}
							className={`px-4 py-1 rounded-full text-[10px] font-black tracking-widest transition-all ${cardData.hasAbility ? "bg-red-600 text-white" : "bg-gray-100/10 text-gray-500 hover:bg-gray-100/20"}`}
						>
							特性 {cardData.hasAbility ? "ON" : "OFF"}
						</button>
					</div>

					{cardData.hasAbility && (
						<div className="space-y-3 p-4 bg-red-600/5 rounded-2xl border border-red-600/10">
							<input
								type="text"
								placeholder="特性の名前"
								value={cardData.abilityName}
								onChange={(e) => setCardData({ ...cardData, abilityName: e.target.value })}
								className="w-full bg-gray-100/10 border-0 rounded-xl px-4 py-2 text-sm text-white focus:ring-1 focus:ring-red-500"
							/>
							<textarea
								placeholder="説明文"
								value={cardData.abilityDesc}
								onChange={(e) => setCardData({ ...cardData, abilityDesc: e.target.value })}
								className="w-full h-16 bg-gray-100/10 border-0 rounded-xl px-4 py-2 text-xs text-white resize-none focus:ring-1 focus:ring-red-500"
							/>
						</div>
					)}

					{cardData.attacks.map((atk) => (
						<div
							key={atk.id}
							className="p-4 bg-gray-100/10 rounded-2xl border border-gray-100/10 relative space-y-3"
						>
							<button
								onClick={() =>
									setCardData({
										...cardData,
										attacks: cardData.attacks.filter((a) => a.id !== atk.id),
									})
								}
								className="absolute top-2 right-2 text-gray-500 hover:text-red-400"
							>
								<Trash2 size={16} />
							</button>
							<div className="grid grid-cols-4 gap-2">
								<input
									type="text"
									placeholder="わざ名"
									value={atk.name}
									onChange={(e) =>
										setCardData({
											...cardData,
											attacks: cardData.attacks.map((a) =>
												a.id === atk.id ? { ...a, name: e.target.value } : a,
											),
										})
									}
									className="col-span-3 bg-gray-100/10 border-0 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-blue-500"
								/>
								<input
									type="text"
									placeholder="ダメージ"
									value={atk.damage}
									onChange={(e) =>
										setCardData({
											...cardData,
											attacks: cardData.attacks.map((a) =>
												a.id === atk.id ? { ...a, damage: e.target.value } : a,
											),
										})
									}
									className="bg-gray-100/10 border-0 rounded-lg px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-blue-500"
								/>
							</div>
							<div className="flex gap-1.5 p-2 bg-black/10 rounded-xl flex-wrap">
								{atk.energy.map((e, i) => (
									<button
										key={i}
										onClick={() => {
											const n = [...atk.energy];
											n.splice(i, 1);
											setCardData({
												...cardData,
												attacks: cardData.attacks.map((a) =>
													a.id === atk.id ? { ...a, energy: n } : a,
												),
											});
										}}
										className="hover:opacity-50 transition-opacity"
									>
										<EnergyIcon type={e} size={20} />
									</button>
								))}
								<div className="h-6 w-px bg-white/10 mx-1" />
								{Object.keys(ENERGY_TYPES).map((t) => (
									<button
										key={t}
										onClick={() =>
											setCardData({
												...cardData,
												attacks: cardData.attacks.map((a) =>
													a.id === atk.id ? { ...a, energy: [...a.energy, t].slice(0, 4) } : a,
												),
											})
										}
										className="hover:scale-110 transition-transform"
									>
										<EnergyIcon type={t} size={16} />
									</button>
								))}
							</div>
							<textarea
								placeholder="わざの効果"
								value={atk.description}
								onChange={(e) =>
									setCardData({
										...cardData,
										attacks: cardData.attacks.map((a) =>
											a.id === atk.id ? { ...a, description: e.target.value } : a,
										),
									})
								}
								className="w-full h-16 bg-gray-100/10 border-0 rounded-lg px-3 py-2 text-xs text-white resize-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>
					))}
					{cardData.attacks.length < 2 && (
						<button
							onClick={() =>
								setCardData({
									...cardData,
									attacks: [
										...cardData.attacks,
										{ id: Date.now(), name: "", damage: "", description: "", energy: [] },
									],
								})
							}
							className="w-full py-3 border-2 border-dashed border-white/5 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-100/20 flex items-center justify-center gap-2 transition-all"
						>
							<Plus size={14} /> わざを追加
						</button>
					)}
				</section>

				<button
					onClick={() => window.print()}
					className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
				>
					<Download size={22} className="group-hover:translate-y-0.5 transition-transform" />{" "}
					カードを保存
				</button>
			</div>

			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700;900&display=swap');
        body { font-family: 'Noto Sans JP', sans-serif; background: #020617; color: white; }
        
        input[type="range"] { -webkit-appearance: none; background: rgba(255,255,255,0.05); height: 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; background: #3b82f6; border-radius: 50%; cursor: pointer; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); }

        select option { background-color: white !important; color: black !important; padding: 10px; }

        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          #card-preview { 
            border: none !important; 
            box-shadow: none !important; 
            margin: 0 auto; 
            width: 8.8cm !important; 
            height: 12.3cm !important;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
		</div>
	);
};

export default App;
