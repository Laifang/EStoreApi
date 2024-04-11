export interface ShoppingCart {
    id: number
    userId: string
    items: ShoppingCartItem[]
  }
  
  export interface ShoppingCartItem {
    productId: number
    productName: string
    price: number
    imageUrl: string
    brand: string
    quantity: number
    type: string
  }