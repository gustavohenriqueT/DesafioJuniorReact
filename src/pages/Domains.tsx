import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDomains } from "../hooks/useDomains";

export const Domains = () => {
	const navigate = useNavigate();
	const { logout } = useAuth();

	const { data: domains, isLoading, isError } = useDomains();

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				{/* Cabeçalho */}
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-800">Meus Domínios</h1>
					<button
						onClick={logout}
						className="text-red-600 hover:text-red-800 font-medium transition-colors"
					>
						Sair
					</button>
				</div>

				{/* Estado de Loading */}
				{isLoading && (
					<div className="space-y-4">
						{[1, 2].map((i) => (
							<div
								key={i}
								className="h-20 bg-gray-200 animate-pulse rounded-lg w-full"
							></div>
						))}
					</div>
				)}

				{/* Estado de Erro */}
				{isError && (
					<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
						<p className="text-red-700 font-medium">
							Erro ao carregar os domínios. Tente novamente mais tarde.
						</p>
					</div>
				)}

				{/* Estado Vazio */}
				{!isLoading && !isError && domains?.length === 0 && (
					<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
						<p className="text-gray-500 text-lg">Nenhum domínio encontrado.</p>
					</div>
				)}

				{/* Lista de Dados */}
				{!isLoading && !isError && domains && domains.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{domains.map((domain) => (
							<div
								key={domain.id}
								onClick={() => navigate(`/domains/${domain.id}`)}
								className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-500 cursor-pointer transition-all flex items-center justify-between group"
							>
								<div className="flex items-center space-x-4">
									<div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
										{domain.name.charAt(0).toUpperCase()}
									</div>
									<span className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
										{domain.name}
									</span>
								</div>
								<svg
									className="w-5 h-5 text-gray-400 group-hover:text-blue-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
