import { Tag } from '../../tag/models/tag.model';

export class Anemometer{
    id!: number;
    name!: string;
    latitude!: string;
    longitude!: string;
    altitude!: number;
    tags?: Tag[];
    mean_speed_today?: any;
    mean_speed_week?: any;
}