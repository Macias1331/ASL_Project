import Header from './mini/Header';
import Body from './mini/Body';
import arrowLeft from "../assets/arrow-left.svg";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import spellingBee from '../assets/Spelling_Bee_Game.png'

const CARD_COUNT = 4;

function MiniGames() {
	const navigate = useNavigate();
	const [selected, setSelected] = useState<number>(0);
	const cards = new Array(CARD_COUNT).fill(null).map((_, i) => ({ id: i + 1 }));

	return (
		<>
			<Header />
			<Body tailwind="flex overflow-hidden">
				<div className="w-full max-w-[1800px] mx-auto px-6 flex flex-col h-full">
					<div className="mb-3">
						<div className="inline-block bg-[#FFEFB8] rounded-3xl px-[22px] py-[8px] text-2xl font-bold mt-4">Select game mode</div>
					</div>

					<div className="grid grid-cols-4 grid-rows-1 gap-x-4 gap-y-4 flex-1 min-h-0">
						{cards.map((c, i) => (
							(i == 0) ?
							<button
								key={c.id}
								onClick={() => navigate("spelling-bee")}
								className={`bg-white rounded-xl w-full h-full shadow-md focus:outline-none transition-all duration-150 flex items-center justify-center ${selected === i ? 'ring-[6px] ring-[#F6D052]' : 'hover:-translate-y-1'}`}
							>
								<img src={spellingBee} alt="spelling bee" className="w-full h-full object-contain" />
							</button> :
							<button
								key={c.id}
								onClick={() => navigate("/store")}
								className={`bg-[rgb(200,200,200)] rounded-xl w-full h-full shadow-md focus:outline-none transition-all duration-150 flex items-center justify-center ${selected === i ? 'ring-[6px] ring-[#F6D052]' : 'hover:-translate-y-1'}`}
							>
								<h1 className="font-bold text-2xl">Buy DLC: ASL Master Bundle ($40)</h1>
							</button>
						))}
					</div>

					<div className="pb-3 pt-2">
						<button
							aria-label="back"
							className="bg-[#F6D052] rounded-3xl p-[10px] w-[56px] h-[56px] flex items-center justify-center shadow-md"
							onClick={() => navigate('/menu')}
						>
							<img src={arrowLeft} alt="back" />
						</button>
					</div>
				</div>
			</Body>
		</>
	);
}

export default MiniGames;
