import { useQuery } from "@tanstack/react-query";
import { domainService } from "../services/domainService";

export const useDomains = () => {
	return useQuery({
		queryKey: ["domains"],
		queryFn: domainService.getDomains,
	});
};
