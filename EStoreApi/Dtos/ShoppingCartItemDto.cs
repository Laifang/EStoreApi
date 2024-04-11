namespace EStoreApi.Dtos;

using EStoreApi.Models;

public class ShoppingCartItemDto
{
    public int ProductId { get; set; }
    public string ProductNmae { get; set; }

    public Decimal Price { get; set; }

    public string ImageUrl { get; set; }

    public string Brand { get; set; }

    public int Quantity { get; set; }

    public string Type { get; set; }



}