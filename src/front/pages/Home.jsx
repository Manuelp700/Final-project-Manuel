import React, { useEffect, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
	const { store, dispatch } = useGlobalReducer();
	const [msg, setMsg] = useState(
		"Loading message from the backend (make sure your python 🐍 backend is running)..."
	);
	const API = import.meta.env.VITE_BACKEND_URL || "";

	useEffect(() => {
		fetch(`${API}/api/hello`)
			.then((r) => {
				if (!r.ok) throw new Error(r.status);
				return r.json();
			})
			.then((data) => setMsg(data.message || JSON.stringify(data)))
			.catch((err) => {
				console.error("Error:", err);
				setMsg("No se pudo conectar al backend.");
			});
	}, [API]);

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img
					src={rigoImageUrl}
					className="img-fluid rounded-circle mb-3"
					alt="Rigo Baby"
				/>
			</p>
			<div className="alert alert-info">
				<span>{msg}</span>
			</div>
		</div>
	);
};