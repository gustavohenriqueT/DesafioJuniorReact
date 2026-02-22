import type React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DomainDetails } from "../pages/DomainDetails";
import { Domains } from "../pages/Domains";
import { Login } from "../pages/Login";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export const AppRoutes = () => {
	return (
		<BrowserRouter>
			<Routes>
				{/* Rota Pública */}
				<Route path="/login" element={<Login />} />

				{/* Rotas Privadas */}
				<Route
					path="/domains"
					element={
						<PrivateRoute>
							<Domains />
						</PrivateRoute>
					}
				/>
				<Route
					path="/domains/:id"
					element={
						<PrivateRoute>
							<DomainDetails />
						</PrivateRoute>
					}
				/>

				{/* qualquer rota inválida vai para /domains */}
				<Route path="*" element={<Navigate to="/domains" replace />} />
			</Routes>
		</BrowserRouter>
	);
};
