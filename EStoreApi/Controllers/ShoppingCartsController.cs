using System.Reflection.Metadata.Ecma335;
using EStoreApi.Controllers;
using EStoreApi.Data;
using EStoreApi.Dtos;
using EStoreApi.Entities;
using EStoreApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace EStoreApi.Controllers;
public class ShoppingCartsController : BasicApiController
{
    private readonly StoreContext _context;

    public ShoppingCartsController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet(Name=nameof(GetShoppingCart))]
    public async Task<ActionResult<ShoppingCartDto>> GetShoppingCart()
    {
        var shoppingcart = await CheckShoppingCart();

        if (shoppingcart == null) return NotFound();

        // Todo： Dto 与 model的转换 太麻烦了 有没有更优雅自动化的办法
        return MapShoppingCartDto(shoppingcart);
    }



    // Add Item To shopping cart

    [HttpPost("addItem")]
    public async Task<ActionResult<ShoppingCartDto>> AddItemToShoppingCart(int productId, int quantity)
    {
        // 1. 获取/创建 shpping cart
        // 2. 获取/检查 product
        // 3. Add item to shopping cart
        // 4. Save changes
        // 5. Return StatutCode 201(CreatedAtRoute)

        var shoppingcart = await CheckShoppingCart();
        shoppingcart ??= CreateShoppingCart();
        var product = await _context.FindAsync<Product>(productId);
        if (product == null) return NotFound();
        shoppingcart.AddItem(product, quantity);
        var addResutl = await _context.SaveChangesAsync() > 0;

        if (addResutl) return CreatedAtRoute(nameof(GetShoppingCart), MapShoppingCartDto(shoppingcart));

        return BadRequest(new ProblemDetails { Title = "向购物车添加商品时发生错误" });
    }

    [HttpDelete("removeItem")]
    public async Task<ActionResult> RemoveShoppingCartItem(int productId, int quantity)
    {
        // 1. 获取/检查 shopping cart
        // 2. 检查 product 是否存在
        // 3. 检查是否有足够的数量，如果有，则减少数量，如果没有，则从购物车中删除Item
        // 4. 保存更改
        // 5. 返回 201

        var shoppingcart = await CheckShoppingCart();
        if (shoppingcart == null) return NotFound();

        var isProductExists = await _context.FindAsync<Product>(productId) != null;
        if (!isProductExists) return BadRequest(new ProblemDetails { Title = "商品不存在" });

        var isProductInShoppingCart = shoppingcart.Items.All(i => i.ProductId != productId);
        if (isProductInShoppingCart) return BadRequest(new ProblemDetails { Title = "商品不在购物车中" });

        shoppingcart.RemoveItem(productId, quantity);
        var removeResult = await _context.SaveChangesAsync() > 0;
        if (removeResult) return Ok();

        return BadRequest(new ProblemDetails { Title = "从购物车中移除商品时发生错误" });
    }


    private async Task<ShoppingCart?> CheckShoppingCart()
    {
        return await _context.ShoppingCarts
                .Include(cart => cart.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.UserId == Request.Cookies["userId"]);
    }


    private ShoppingCart CreateShoppingCart()
    {

        var userId = Guid.NewGuid().ToString();

        var cookieOptions = new CookieOptions
        {
            IsEssential = true, // 设置为必要cookie
            Expires = DateTime.Now.AddDays(30),
            HttpOnly = false, // 不要设置httpOnly，否则无法通过js获取cookie
        };
        // 创建cooikie
        Response.Cookies.Append("userId", userId, cookieOptions);
        // 创建shopping cart
        var shoppingcart = new ShoppingCart { UserId = userId };
        // 添加到数据库
        _context.ShoppingCarts.Add(shoppingcart);
        _context.SaveChanges();
        return shoppingcart;

    }


    private ShoppingCartDto MapShoppingCartDto(ShoppingCart shoppingcart)
    {
        return new ShoppingCartDto
        {
            Id = shoppingcart.Id,
            UserId = shoppingcart.UserId,
            Items = shoppingcart.Items.Select(item => new ShoppingCartItemDto
            {
                ProductId = item.ProductId,
                Price = item.Product.Price,
                ProductNmae = item.Product.Name,
                ImageUrl = item.Product.ImageUrl,
                Type = item.Product.Type,
                Brand = item.Product.Brand,
                Quantity = item.Quantity
            }).ToList()
        };
    }

}