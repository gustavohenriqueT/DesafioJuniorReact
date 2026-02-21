import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const domains = [
	{ id: "1", name: "empresa.com" },
	{ id: "2", name: "startup.io" },
];

const emails = [
	{
		id: "1",
		domainId: "1",
		email: "financeiro@empresa.com",
		storage: 10240,
		isBlocked: false,
	},
	{
		id: "2",
		domainId: "1",
		email: "contato@empresa.com",
		storage: 5120,
		isBlocked: true,
	},
	{
		id: "3",
		domainId: "2",
		email: "admin@startup.io",
		storage: 20480,
		isBlocked: false,
	},
];

export const handleMockRoutes = (
	config: InternalAxiosRequestConfig,
): AxiosResponse => {
	const { url, method, data } = config;
	const parsedData = data
		? typeof data === "string"
			? JSON.parse(data)
			: data
		: null;

	const createResponse = (
		status: number,
		responseData: any,
	): AxiosResponse => ({
		data: responseData,
		status,
		statusText: status === 200 || status === 201 ? "OK" : "Error",
		headers: {},
		config,
	});

	if (url === "/login" && method === "post") {
		const isUserValid =
			parsedData?.email === "admin@vulkan.com" &&
			parsedData?.password === "123456";
		if (isUserValid) {
			return createResponse(200, { access_token: "fake-jtw-token" });
		}
		throw createResponse(401, {
			message: "Usuário ou senha inválidos. Tente admin@vulkan.com / 123456",
		});
	}

	if (url === "/domains" && method === "get") {
		return createResponse(200, domains);
	}

	const emailMatch = url?.match(/^\/domains\/(\d+)\/emails$/);
	if (emailMatch && method === "get") {
		const domainId = emailMatch[1];
		const domainEmails = emails.filter((e) => e.domainId === domainId);
		return createResponse(200, domainEmails);
	}

	if (emailMatch && method === "post") {
		const domainId = emailMatch[1];
		if (!parsedData?.email || !parsedData?.password || !parsedData?.storage) {
			throw createResponse(400, { message: "Dados incompletos" });
		}
		const newEmail = {
			id: Math.random().toString(36).substr(2, 9),
			domainId: domainId,
			email: parsedData.email,
			storage: Number(parsedData.storage),
			isBlocked: false,
		};
		emails.push(newEmail);
		return createResponse(201, newEmail);
	}

	const specificEmailMatch = url?.match(
		/^\/domains\/(\d+)\/emails\/([a-zA-Z0-9.-]+)$/,
	);
	if (specificEmailMatch) {
		const emailId = specificEmailMatch[2];
		const emailIndex = emails.findIndex((e) => e.id === emailId);

		if (emailIndex === -1) {
			throw createResponse(404, { message: "Conta não encontrada" });
		}

		if (method === "delete") {
			emails.splice(emailIndex, 1);
			return createResponse(200, { message: "Conta excluída com sucesso" });
		}

		if (method === "patch") {
			emails[emailIndex].isBlocked = !emails[emailIndex].isBlocked;
			return createResponse(200, emails[emailIndex]);
		}

		if (method === "put") {
			if (!parsedData?.storage || Number(parsedData.storage) <= 0) {
				throw createResponse(400, { message: "Armazenamento inválido" });
			}
			emails[emailIndex].storage = Number(parsedData.storage);
			return createResponse(200, emails[emailIndex]);
		}
	}

	const passwordMatch = url?.match(
		/^\/domains\/(\d+)\/emails\/([a-zA-Z0-9.-]+)\/password$/,
	);
	if (passwordMatch && method === "patch") {
		const emailId = passwordMatch[2];
		const emailIndex = emails.findIndex((e) => e.id === emailId);

		if (emailIndex !== -1) {
			if (!parsedData?.password || parsedData.password.length < 6) {
				throw createResponse(400, { message: "Senha inválida" });
			}
			return createResponse(200, { message: "Senha alterada com sucesso" });
		}
		throw createResponse(404, { message: "Conta não encontrada" });
	}

	throw createResponse(404, { message: "Rota não encontrada no Mock" });
};
