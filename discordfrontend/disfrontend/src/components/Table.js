import React, { useEffect, useState } from "react";
import axios from "axios";

const Table = () => {
	const [data, setData] = useState([]);
	const [count] = useState(1); // Initialize the count variable to 1

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

	const getAllUser = () => {
		fetch("http://localhost:8080/fetchall", {
			method: "GET",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data, "userData");
				setData(data.data);
			});
	};

	// const removeSong = (id, title) => {
	// 	if (window.confirm(`Are you sure you want to remove this ${title}`)) {
	// 		fetch("http://localhost:8080/deleteUser", {
	// 			method: "POST",
	// 			crossDomain: true,
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Accept: "application/json",
	// 				"Access-Control-Allow-Origin": "*",
	// 			},
	// 			body: JSON.stringify({
	// 				userid: id,
	// 			}),
	// 		})
	// 			.then((res) => res.json())
	// 			.then((data) => {
	// 				alert(data.data);
	// 				getAllUser();
	// 			});
	// 	} else {
	// 	}
	// };
	const removeSong = (id, title) => {
		if (window.confirm(`Are you sure you want to remove this ${title}`)) {
			fetch("http://localhost:8080/deleteUser", {
				method: "POST",
				crossDomain: true,
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					"Access-Control-Allow-Origin": "*",
				},
				body: JSON.stringify({
					userid: id,
				}),
			})
				.then((res) => res.json())
				.then((data) => {
					alert(data.data);
					getAllUser();
				})
				.catch((error) => {
					console.error("Error removing song:", error);
				});
		} else {
			// User canceled the removal
		}
	};

	return (
		<>
			<div className='table-container'>
				<table>
					<thead>
						<tr>
							<th>#</th>
							<th>Cover</th>
							<th>Title</th>
							<th>⏱️</th>
							<th>Link</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<td>{count + index}</td>
								<td>
									<img src={item.thumbnail} className='cover' />
								</td>{" "}
								<td>{item.title}</td>
								<td>{item.duration}</td>
								<td>{item.url}</td>
								<td>
									<button onClick={() => removeSong(item._id, item.title)}>
										🗑️
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
};

export default Table;
