import React, { useEffect, useState } from "react";

const Search = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("http://localhost:8080/fetchall");
				const json = await response.json();
				setData(json.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	const [searchTerm, setSearchTerm] = useState("");

	return (
		<>
			<header id='tableheader'></header>
			<div className='search-bar'>
				<input
					className='search-input'
					type='text'
					placeholder='What song do you want to find?'
					onChange={(event) => {
						setSearchTerm(event.target.value);
					}}
				/>
				<i className='search-icon'>🔍</i>
			</div>
			{searchTerm !== "" && (
				<div className='filter'>
					{data
						.filter((val) => {
							if (val.title.toLowerCase().includes(searchTerm)) {
								return val;
							}
						})
						.map((val, key) => {
							return (
								<div key={key}>
									<img src={val.thumbnail} className='coverSearch' />
									<div className='searchInfo'>{val.title}</div>
								</div>
							);
						})}
				</div>
			)}
		</>
	);
};

export default Search;
