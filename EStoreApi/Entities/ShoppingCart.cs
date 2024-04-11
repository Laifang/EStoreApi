using System.ComponentModel.DataAnnotations.Schema;
using EStoreApi.Entities;

namespace EStoreApi.Models;

[Table("ShoppingCarts")]
public class ShoppingCart
{
    public int Id { get; set; }
    public string UserId { get; set; }

    public List<ShoppingCartItem> Items { get; set; } = [];


    // add item to cart
    public void AddItem(Product product, int quantity = 1)
    {
        // 当购物车中没有该商品时，添加商品到购物车
        // 否则，更新商品的数量
        if (!Items.Any(x => x.ProductId == product.Id))
        {
            Items.Add(new ShoppingCartItem { Product = product, Quantity = quantity });
            return;
        }

        var ExsistingItem = Items.FirstOrDefault(x => x.ProductId == product.Id);
        if (ExsistingItem != null) ExsistingItem.Quantity += quantity;
    }

    // remove item from cart
    public void RemoveItem(int productId, int quantity)
    {
        // 找到购物车中该商品，并减少数量
        var item = Items.FirstOrDefault(i => i.ProductId == productId);
        // 商品不存在, 直接返回
        if (item == null) return;

        // 商品数量减少到0，则从购物车中移除
        if (item.Quantity <= quantity) Items.Remove(item);
        // 商品数量大于0，则减少数量
        item.Quantity -= quantity;
    }
}
