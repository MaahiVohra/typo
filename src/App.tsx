import { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import React from "react";
import { VscDebugRestart } from "react-icons/vsc";
import "./App.css";
import { getWords } from "./words";

function App() {
	const NO_OF_WORDS = 35;
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
		updateScore(Math.round((correctLetters.length / 5) * (60 / time)));
		setTime(1);
		// setScore(0);
	}

	const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
	const [correctLetters, setCorrectLetters] = useState<Number[]>([]);
	const [intervalId, setIntervalId] = useState(null);
	const [started, setStarted] = useState(false);
	const [time, setTime] = useState(1);
	const [loginModal, setLoginModal] = useState(false);
	const [registerModal, setRegisterModal] = useState(false);
	const nameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const [cookies, setCookies, removeCookie] = useCookies();
	const [token, setToken] = useState(cookies["TOKEN"] || null);
	const [user, setUser] = useState(cookies["USER"] || null);
	const [loggedIn, setLoggedIn] = useState(token ? true : false);
	const [error, setError] = useState("");
	const [highScore, setHighScore] = useState(cookies["HIGH_SCORE"] || 0);
	const startTimer = () => {
		if (!started) {
			const id = setInterval(() => {
				setTime((time) => time + 1);
			}, 1000);

			setIntervalId(id as any);
			setStarted(true);
		}
	};
	const stopTimer = () => {
		clearInterval(intervalId as any);
		setIntervalId(null);
		setStarted(false);
		// updateScore(Math.round((correctLetters.length / 5) * (60 / time)));
	};

	//used to autofocus on the text string
	const inputRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		inputRef.current?.focus();
		if (token) {
			setLoggedIn(true);
		}
	}, [tab, started]);
	// if (currentLetterIndex > textArray.length - 2 && started) {
	// 	stopTimer();
	// }
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
		} else if (e.key === "Backspace") {
			setCorrectLetters((prev) => {
				return [...prev].filter(
					(letter) => letter !== currentLetterIndex - 1
				);
			});
			if (currentLetterIndex !== 0)
				setCurrentLetterIndex((prev) => prev - 1);
		}
		if (currentLetterIndex > textArray.length - 2 && started) {
			stopTimer();
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
	function handleModal(e: React.MouseEvent) {
		const { target } = e;
		if ((target as HTMLButtonElement).id === "login-btn") {
			setLoginModal(true);
			setRegisterModal(false);
		}
		if ((target as HTMLButtonElement).id === "register-btn") {
			setLoginModal(false);
			setRegisterModal(true);
		}
		if ((target as HTMLButtonElement).id === "modal-close") {
			setError("");
			setRegisterModal(false);
			setLoginModal(false);
		}
	}
	async function login(event) {
		if (event != null) event.preventDefault();
		const url = "login";
		try {
			const formData = {
				email: emailRef.current?.value,
				password: passwordRef.current?.value,
				score: Math.round((correctLetters.length / 5) * (60 / time)),
			};
			const responseData = await performFetch({
				url,
				formData,
			})
				.then((response) => {
					return response;
				})
				.catch((error) => {
					console.error(error);
				});
			if (responseData) {
				setHighScore(responseData.score);
				setRegisterModal(false);
				setLoginModal(false);
				setToken(responseData.token);
				setUser(responseData.user);
				setCookies("TOKEN", responseData.token);
				setCookies("USER", responseData.user);
				setCookies("HIGH_SCORE", responseData.score);
				setLoggedIn(true);
				setError("");
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function register(event) {
		event.preventDefault();
		const url = "register";
		try {
			const formData = {
				name: nameRef.current?.value,
				email: emailRef.current?.value,
				password: passwordRef.current?.value,
			};
			const responseData = await performFetch({ url, formData });
			if (responseData) {
				await login(null);
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function performFetch({ url, formData }) {
		var myHeaders = new Headers();
		if (url === "update")
			myHeaders.append("Authorization", `Bearer ${token}`);
		myHeaders.append("Content-Type", "application/json");

		var requestOptions: RequestInit = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(formData),
		};

		// development
		// return await fetch(`http://localhost:5174/api/${url}`, requestOptions)
		// production
		return await fetch(`/api/${url}`, requestOptions)
			.then(async (response) => {
				if (response.status !== 200) {
					const data = await response.json();
					setError(data.message);
					return null;
				}
				return response.json();
			})
			.catch((error) => {
				return error;
			});
	}
	function logout() {
		removeCookie("TOKEN");
		removeCookie("USER");
		removeCookie("HIGH_SCORE");
		setToken(null);
		setUser(null);
		setLoggedIn(false);
		// setScore(0);
		setHighScore(0);
	}
	async function updateScore(newScore: number) {
		if (newScore > highScore) {
			// setScore(newScore);
			if (!user) return;
			const url = "update";
			try {
				const formData = {
					name: user,
					score: newScore,
				};
				const result = await performFetch({ url, formData });
				if (result) {
					setCookies("HIGH_SCORE", result.score);
					setHighScore(result.score);
				}
			} catch (err) {
				console.error(err);
			}
		}
	}
	return (
		<main className="AppContainer">
			<div className="app-box">
				<nav>
					<ul>
						<li className="logo">tYPO</li>
						{loggedIn ? (
							<li>
								<span className="username">{user}</span>
								<span className="score">{highScore}</span>
								<button
									className="btn logout-btn"
									onClick={logout}
								>
									Logout
								</button>
							</li>
						) : (
							<li>
								<button
									id="login-btn"
									className="login-btn"
									onClick={(e) => handleModal(e)}
								>
									Login
								</button>
								<button
									id="register-btn"
									className="register-btn"
									onClick={(e) => handleModal(e)}
								>
									Register
								</button>
							</li>
						)}
					</ul>
				</nav>

				<main>
					<div className="tab-container">
						<div
							className={
								tab === "word" ? "active-tab tab" : "tab"
							}
							id="word"
							onClick={(e) => handleTabChange(e)} // handletabchange returns void so have to put it inside an arrow function
						>
							Word
						</div>
						<div
							className={
								tab === "sentence" ? "active-tab tab" : "tab"
							}
							id="sentence"
							onClick={(e) => handleTabChange(e)}
						>
							Sentence
						</div>
						<div className="tab" onClick={reset}>
							<VscDebugRestart />
						</div>
					</div>
					{time > 60 || currentLetterIndex >= textArray.length ? (
						<section className="App">
							<div className="wpm">
								WPM :{" "}
								{Math.round(
									(correctLetters.length / 5) * (60 / time)
								)}
							</div>
							<div className="correct">
								<span>{correctLetters.length}</span>/
								<span style={{ color: "yellow" }}>
									{currentLetterIndex - correctLetters.length}
								</span>
							</div>
							<div className="accuracy">
								Accuracy :{" "}
								{(
									(correctLetters.length /
										currentLetterIndex) *
									100
								).toFixed(3)}
								%
							</div>
							<div className="tab" onClick={reset}>
								<VscDebugRestart />
							</div>
							{loggedIn ? null : (
								<div className="save-score">
									<span
										className="login-sm"
										id="login-btn"
										onClick={(e) => {
											handleModal(e);
										}}
									>
										Login
									</span>{" "}
									to save your score
								</div>
							)}
						</section>
					) : (
						<section
							onKeyDown={controller}
							tabIndex={1}
							ref={inputRef}
							className="App"
						>
							<div className="wpm">
								{Math.round(
									(correctLetters.length / 5) * (60 / time)
								)}{" "}
								, {time - 1}
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
						</section>
					)}
				</main>
				{(loginModal || registerModal) && (
					<section className="login-modal-container">
						<div className="login-modal">
							<button
								id="modal-close"
								onClick={(e) => handleModal(e)}
							>
								X
							</button>
							<h3>{loginModal ? "Login" : "Register"}</h3>
							<form
								id={loginModal ? "login" : "register"}
								onSubmit={loginModal ? login : register}
							>
								{registerModal && (
									<input
										type="text"
										placeholder="Username"
										ref={nameRef}
									/>
								)}
								<input
									type="email"
									placeholder="Email"
									ref={emailRef}
								/>
								<input
									type="password"
									placeholder="Password"
									ref={passwordRef}
								/>
								{error && <div className="error">{error}</div>}
								<button type="submit">
									{loginModal ? "Login" : "Register"}
								</button>
								{loginModal ? (
									<p className="save-score">
										Need an Account ?{" "}
										<span
											className="login-sm"
											id="register-btn"
											onClick={(e) => handleModal(e)}
										>
											Register
										</span>
									</p>
								) : (
									<p className="save-score">
										Already have an Account ?{" "}
										<span
											className="login-sm"
											id="login-btn"
											onClick={(e) => handleModal(e)}
										>
											Login
										</span>
									</p>
								)}
							</form>
						</div>
					</section>
				)}
			</div>
		</main>
	);
}

export default App;
