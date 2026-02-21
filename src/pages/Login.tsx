import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { type LoginFormData, loginSchema } from "../schemas/auth";

export const Login = () => {
	const navigate = useNavigate();
	const { login } = useAuth();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const loginMutation = useMutation({
		mutationFn: async (data: LoginFormData) => {
			const response = await api.post("/login", data);
			return response.data;
		},
		onSuccess: (data) => {
			login(data.access_token);
			navigate("/domains", { replace: true });
		},
		onError: () => {
			alert("Credenciais inválidas. Tente novamente.");
		},
	});

	const onSubmit = (data: LoginFormData) => {
		loginMutation.mutate(data);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
			<div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
				<h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
					Painel Vulkan
				</h2>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* Campo de E-mail */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							E-mail
						</label>
						<input
							type="email"
							{...register("email")}
							className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								errors.email ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="seu@email.com"
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-500">
								{errors.email.message}
							</p>
						)}
					</div>

					{/* Campo de Senha */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Senha
						</label>
						<input
							type="password"
							{...register("password")}
							className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								errors.password ? "border-red-500" : "border-gray-300"
							}`}
							placeholder="******"
						/>
						{errors.password && (
							<p className="mt-1 text-sm text-red-500">
								{errors.password.message}
							</p>
						)}
					</div>

					{/* Botão de Submit */}
					<button
						type="submit"
						disabled={loginMutation.isPending}
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
					>
						{loginMutation.isPending ? "Entrando..." : "Entrar"}
					</button>
				</form>
			</div>
		</div>
	);
};
