// 创建一个泛型类PageList，继承自List<T>，用于封装分页数据
using Microsoft.EntityFrameworkCore;

public class PageList<T> : List<T>
{
    public PageList(List<T> items, int pageNumber, int pageSize, int totalCount)
    {
        MetaData = new MetaData
        {
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
        // 这里的AddRange方法是List<T>的一个扩展方法，用于将items中的元素添加到当前的PageList中
        AddRange(items);
    }

    public MetaData MetaData { get; set; }

    // 创建一个静态异步方法 返回 PageList<T>,用于封装分页数据
    public static async Task<PageList<T>> ToPageListAsync(
        IQueryable<T> query,
        int pageNumber,
        int pageSize
    )
    {
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PageList<T>(items, pageNumber, pageSize, count);
    }
}
