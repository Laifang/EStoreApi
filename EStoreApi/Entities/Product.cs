using System.ComponentModel.DataAnnotations.Schema;

namespace EStoreApi.Entities;


// 商品类，包含商品的各项属性
[Table("Products")]
public class Product
{
    // 商品ID
    public int Id { get; set; }

    // 商品名称
    public string Name { get; set; }

    // 商品描述
    public string Description { get; set; }

    // 商品价格
    public long Price { get; set; } = 0;

    // 商品图片链接
    public string ImageUrl { get; set; }

    // 商品类型
    public string Type { get; set; }

    // 商品品牌
    public string Brand { get; set; }

    // 商品库存数量
    public int QuantityInStock { get; set; } = 0;
}
