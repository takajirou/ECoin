export interface Reward {
    ID: number;
    Name: string;
    Description: string;
    RequiredPoints: number;
    ImagePath: string;
    Active: boolean;
    CreatedAt: string;
}

export type RewardResponse = Reward[];