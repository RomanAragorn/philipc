import { RowDataPacket } from 'mysql2';

export type Product = {
    full_name: string;
    username: string;
    listing_id: number;
    seller_id: number;
    seller_avatar?: string | null;
    category: string;
    item_name: string;
    item_condition: string;
    item_price: number;
    item_description: string;
    item_location: string;
    is_avail: boolean;
    image_url?: string;
};

export type Seller = {
    avg_rating: number;
    review_count: number;
    product_count: number;
};

export interface CreateProductInput {
    seller_id: number;
    category: string;
    item_name: string;
    item_price: number;
    item_condition: string;
    item_description: string;
    item_location: string;
}

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

export type UserSession = {
    user_id: number;
    username: string;
    first_name: string;
    last_name: string;
    profile_pic_url?: string | null;
};

export type Review = {
    review_id: number;
    transac_id: number;
    review_text: string;
    review_rating: number;
    buyer_first_name: string;
    buyer_last_name: string;
    item_name: string;
    item_price: number;
    image?: string;
};

export type RatingSummary = {
    avg_rating: number;
    count: number;
};

export type Row<T> = T & RowDataPacket;
