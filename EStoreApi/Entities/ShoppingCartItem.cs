using System.ComponentModel.DataAnnotations.Schema;
using EStoreApi.Entities;
namespace EStoreApi.Models;
[Table("ShoppingCartItems")]
public class ShoppingCartItem
{
    public int Id { get; set; }
    public int Quantity { get; set; } = 0;

    public int ProductId { get; set; }

    public Product Product { get; set; }

    public ShoppingCart ShoppingCart { get; set; }

    public int ShoppingCartId { get; set; }
}