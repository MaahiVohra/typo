import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { getWords } from "./words";
const NO_OF_WORDS = 10;
function App() {
	const [wordloader, setWordloader] = useState(true);
	var textArray: string[] = useMemo(
		() => getWords(NO_OF_WORDS),
		[wordloader]
	);
	const [textonScreen, setTextonScreen] = useState<String[]>([]);
	useEffect(() => {
		setTextonScreen(textArray);
	}, []);
	async function chooseRandomWords() {
		await setWordloader((prev) => !prev);
		setCorrectLetters([]);
		setCorrectLetters([]);
		setCurrentLetterIndex(0);
		setTextonScreen(textArray);
	}

	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const [correctLetters, setCorrectLetters] = useState<Number[]>([]);

	//used to autofocus on the text string
	const inputRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	//controls the input key press
	function controller(e: any) {
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
	function showstuff(e: any = null) {
		console.log("	");
		console.log(currentLetterIndex);
		console.log(textArray);
		console.log(e);
		console.log("	");
	}
	return (
		<div className="App" onKeyDown={controller} tabIndex={1} ref={inputRef}>
			<span className="cursor">|</span>
			{textonScreen &&
				textArray.map((text, index: number) => {
					return (
						<span
							style={{ color: getColor(index) }}
							className={
								currentLetterIndex === index
									? "active"
									: undefined
							}
							key={index}
						>
							{text}
						</span>
					);
				})}
			<button onClick={chooseRandomWords}>reset</button>
			<button onClick={showstuff}>show</button>
		</div>
	);
}

export default App;
