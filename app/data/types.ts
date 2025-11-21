import { RowDataPacket } from 'mysql2';

export type Product = {
    listing_id: number;
    seller_id: number;
    seller_avatar?: string;
    category: string;
    item_name: string;
    item_condition: string;
    item_price: number;
    item_description: string;
    item_location: string;
    is_avail: boolean;
    full_name: string;
    images?: string[];
};

export type User = {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_no: string;
    username: string;
    fb_link: string;
    password: string;
    image?: string;
};

export type Review = {
    review_id: number;
    transac_id: number;
    review_text: string;
    review_rating: number;
};

export type Row<T> = T & RowDataPacket;
