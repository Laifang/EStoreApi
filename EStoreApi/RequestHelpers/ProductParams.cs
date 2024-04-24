// 创建商品查询参数类，继承自PaginationParams，支持分页查询
public class ProductParams : PaginationParams
{
    public string OrderBy { get; set; }
    public string Brands { get; set; }
    public string SearchTerm { get; set; }
    public string Types { get; set; }
}
