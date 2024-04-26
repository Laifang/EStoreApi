import { PropsWithChildren, createContext, useContext, useState } from "react";
import { ShoppingCart, ShoppingCartItem } from "../models/shoppingCart";


// 定义StoreContext的类型，用于共享上下文数据
interface StoreContextValue {
    shoppingCart: ShoppingCart | null;
    setShoppingCart: (shoppingCart: ShoppingCart | null) => void;
    removeItem: (productId: number, quatity: number) => void;
}

// 创建StoreContext，并设置默认值undefined
export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useStoreContext() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw Error("当前不在app.tsx组件中，所以无法访问StoreContext");
    }
    return context;

}

// 定义并导出StoreProvider，用于提供上下文数据
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function StoreProvider({ children }: PropsWithChildren<any>) {
    const [shoppingCart, setShoppingCart] = useState<ShoppingCart | null>(null);

    function removeItem(productId: number, quatity: number=1) {
        if (!shoppingCart) return; // 如果购物车为空，直接返回

        // 创建一个新数组，用于存储更新后的商品列表
        const updatedItems = shoppingCart.items.map(item => {
            // 如果找到要删除的商品
            if (item.productId === productId) {
                // 如果要删除的数量大于等于商品的数量，则移除该商品
                if (quatity >= item.quantity) {
                    return null; // 返回null表示从数组中移除该商品
                } else {
                    // 否则减少商品的数量
                    return { ...item, quantity: item.quantity - quatity };
                }
            }
            // 如果不是要删除的商品，保持不变
            return item;
        })
        // 过滤掉null值，即移除的商品
        .filter(item => item !== null) as ShoppingCartItem[];
    
        // 更新购物车状态
        setShoppingCart({ ...shoppingCart, items: updatedItems });
    }
    
    return (
        <StoreContext.Provider value={{ shoppingCart, setShoppingCart, removeItem }}>
            {children}
        </StoreContext.Provider>
    );
    
}