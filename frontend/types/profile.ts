export interface profileResponse {
    id: number;
    uuid: string;
    name: string;
    email: string;
    password: string;
    coins: number;
    pref: string | null;
    city: string | null;
    admin: number;
    created_at: Date;
}
