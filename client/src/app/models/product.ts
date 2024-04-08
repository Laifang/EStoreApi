export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    brand: string;
    type?: string,
    quantityInStock?: number
}
/*
json to ts interface

{
    "id": 0,
    "name": "string",
    "description": "string",
    "price": 0,
    "imageUrl": "string",
    "type": "string",
    "brand": "string",
    "quantityInStock": 0
}

*/