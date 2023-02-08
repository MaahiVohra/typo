import { MouseEventHandler, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { getWords } from "./words";
const NO_OF_WORDS = 10;
function App() {
	const [tab, setTab] = useState("word");
	const [wordloader, setWordloader] = useState(true);
	var textArray: string[] = useMemo(
		() => getWords(NO_OF_WORDS, tab),
		[wordloader, tab]
	);
	const [textonScreen, setTextonScreen] = useState<String[]>([]);
	useEffect(() => {
		setTextonScreen(textArray);
	}, []);
	function reset() {
		setWordloader((prev) => !prev);
		setCorrectLetters([]);
		setCurrentLetterIndex(0);
		setTextonScreen(textArray);
		stopTimer();
	}

	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const [correctLetters, setCorrectLetters] = useState<Number[]>([]);
	const [intervalId, setIntervalId] = useState(null);
	const [started, setStarted] = useState(false);
	const [time, setTime] = useState(10);
	const startTimer = () => {
		if (!started) {
			const id = setInterval(() => {
				setTime((time) => time - 1);
			}, 1000);
			setIntervalId(id as any);
			setStarted(true);
		}
	};
	const stopTimer = () => {
		clearInterval(intervalId as any);
		setIntervalId(null);
		setStarted(false);
		setTime(10);
	};
	//used to autofocus on the text string
	const inputRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		inputRef.current?.focus();
	}, [tab, started]);
	//controls the input key press
	function controller(e: React.KeyboardEvent) {
		startTimer();
		e.preventDefault();
		if (e.key.length === 1) {
			if (e.key === textArray[currentLetterIndex]) {
				setCorrectLetters((prev) => {
					return [...prev, currentLetterIndex];
				});
			}
			setCurrentLetterIndex((prev) => prev + 1);
			return;
		}
		if (e.key === "Backspace") {
			setCorrectLetters((prev) => {
				return [...prev].filter(
					(letter) => letter !== currentLetterIndex - 1
				);
			});
			if (currentLetterIndex !== 0)
				setCurrentLetterIndex((prev) => prev - 1);
			return;
		}
		return true;
	}

	//return color for the characters
	function getColor(index: number) {
		if (correctLetters.includes(index)) return "white";
		if (index >= currentLetterIndex) return "gray";
		else return "yellow";
	}
	//testing stuff
	function showstuff(e: any = null) {
		console.log("	");
		console.log(currentLetterIndex);
		console.log(textArray);
		console.log(e);
		console.log("	");
	}

	//handles the type of text
	function handleTabChange(e: React.MouseEvent) {
		const { target } = e;
		reset();
		// to access target in context of HTML use HTMLButtonElement
		if ((target as HTMLButtonElement).id !== tab)
			setTab((prev) => (target as HTMLButtonElement).id);
	}

	return (
		<div className="App">
			<main>
				<div>
					<button
						className={tab === "word" ? "active-tab" : undefined}
						id="word"
						onClick={(e) => handleTabChange(e)} // handletabchange returns void so have to put it inside an arrow function
					>
						Word
					</button>
					<button
						className={
							tab === "sentence" ? "active-tab" : undefined
						}
						id="sentence"
						onClick={(e) => handleTabChange(e)}
					>
						Sentence
					</button>
				</div>
				{time < 0 ? (
					<section>
						<div>WPM : {Math.round(correctLetters.length / 5)}</div>
						<div>
							<span>{correctLetters.length}</span>/
							<span style={{ color: "yellow" }}>
								{currentLetterIndex - correctLetters.length}
							</span>
						</div>
						<div>
							Accuracy :{" "}
							{(
								(correctLetters.length / currentLetterIndex) *
								100
							).toFixed(3)}
						</div>
						<button onClick={reset}>reset</button>
					</section>
				) : (
					<section
						onKeyDown={controller}
						tabIndex={1}
						ref={inputRef}
						className="App"
					>
						<div>
							{Math.round(correctLetters.length / 5)} , {time}
						</div>
						{textonScreen &&
							textArray.map((text, index: number) => {
								return (
									<span
										style={{ color: getColor(index) }}
										className={
											currentLetterIndex === index
												? "active" + " letter"
												: "letter"
										}
										key={index}
									>
										{text}
									</span>
								);
							})}
						<button onClick={reset}>reset</button>
					</section>
				)}
			</main>
		</div>
	);
}

export default App;
