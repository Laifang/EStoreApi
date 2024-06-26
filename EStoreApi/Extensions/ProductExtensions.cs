using EStoreApi.Entities;

public static class ProductExtensions
{
    public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
    {
        if (string.IsNullOrEmpty(orderBy))
            return query.OrderBy(p => p.Name);
        query = orderBy switch
        {
            "price" => query.OrderBy(x => x.Price),
            "priceDesc" => query.OrderByDescending(x => x.Price),
            _ => query.OrderBy(x => x.Name) // _的方式是默认排序
        };
        return query;
    }

    // search 功能
    public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
    {
        if (string.IsNullOrEmpty(searchTerm))  return query;
           
        var lowerCaseSerachTerm = searchTerm.Trim().ToLower();

        return query.Where(p => p.Name.ToLower().Contains(lowerCaseSerachTerm));
    }

    // filter 功能

    public static IQueryable<Product> Filter(
        this IQueryable<Product> query,
        string brands,
        string types
    )
    {
        var brandList = new List<string>();
        var typeList = new List<string>();
        if (!string.IsNullOrEmpty(brands))
        {
            brandList.AddRange(brands.ToLower().Split(",").ToList());
        }
        if (!string.IsNullOrEmpty(types))
        {
            typeList.AddRange(types.ToLower().Split(",").ToList());
        }

        // Iqueryable 对象 连续赋值  最终会对两个条件进行 AND 运算, 即 同时满足两个条件才会被查询出来
        query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
        query = query.Where(p => typeList.Count == 0 || typeList.Contains(p.Type.ToLower()));

        return query;
    }
}
