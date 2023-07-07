import "./App.css";
import Table from "./components/Table";
import Search from "./components/Search";

function App() {
	return (
		<>
			<div className='App'>
				<header id='header'>
					<h1 id='head'> Discord Playlists </h1>
				</header>{" "}
				<Search />
				<Table />
			</div>
		</>
	);
}

export default App;
