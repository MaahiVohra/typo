import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
	// converts the text string to an array to use the map function
	var originalText = "this is a letter";
	const originalTextArray = originalText.split("");

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
		console.log(e.key);
		var move = 1;
		if (e.key === originalText[currentLetterIndex]) {
			setCorrectLetters((prev) => {
				return [...prev, currentLetterIndex];
			});
		}
		if (e.key === "Backspace") {
			move = -1;
			setCorrectLetters((prev) => {
				return [...prev].filter(
					(letter) => letter !== currentLetterIndex - 1
				);
			});
		}
		if (currentLetterIndex + move < 0) move = 0;
		setCurrentLetterIndex((prev) => prev + move);
		return true;
	}

	//return color for the characters
	function getColor(index: number) {
		if (correctLetters.includes(index)) return "white";
		if (index >= currentLetterIndex) return "gray";
		else return "yellow";
	}

	return (
		<div className="App" onKeyDown={controller} tabIndex={1} ref={inputRef}>
			<span className="cursor">|</span>
			{originalTextArray.map((text, index: number) => {
				return (
					<span
						style={{ color: getColor(index) }}
						className={
							currentLetterIndex === index ? "active" : undefined
						}
						key={index}
					>
						{text}
					</span>
				);
			})}
		</div>
	);
}

export default App;
