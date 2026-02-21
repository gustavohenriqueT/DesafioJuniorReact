import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 1,
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<Toaster position="top-right" reverseOrder={false} />{" "}
				<AppRoutes />
			</AuthProvider>
		</QueryClientProvider>
	);
}

export default App;
