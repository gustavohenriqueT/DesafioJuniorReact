import {api} from '../api/axios';

export interface Domain {
    id: string;
    name: string;
}

export const domainService = {
    getDomains: async (): Promise<Domain[]> => {
        const reponse = await api.get<Domain[]>('/domains');
        return reponse.data;
    }
}