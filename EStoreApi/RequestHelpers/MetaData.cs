public class MetaData
{
    // 创建MetaData类，用于封装分页信息,包括当前页码，总页数，每页大小，总记录数
    public int PageNumber { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

}
