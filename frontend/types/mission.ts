export interface Mission {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    point: number;
    require_proof: boolean;
    active: boolean;
    created_at: string;
}
