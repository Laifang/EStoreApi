using EStoreApi.Dtos;
using EStoreApi.Models;

public class ShoppingCartDto
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public List<ShoppingCartItemDto> Items  { get; set; } = [];
}