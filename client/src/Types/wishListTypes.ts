export interface iWishInfo {
  wish_name: string;
  wish_image: File | undefined ;
  wish_price: string;
  wish_category: string;
}

export interface iWish {
  wish_name: string;
  wish_image: string | undefined | File;
  wish_price: string;
  wish_category: string;
  wish_id: string;
}

export interface iCart {
created_date?: null | string | number;
creator_id?: string;
wish_category: string | null;
wish_id: string;
wish_image: string | undefined | File;
wish_name: string;
wish_price: number | string;
wish_type?: string | null;
quantity?: number;
}

export type cartProps = {
  cart: iCart[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
};