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
