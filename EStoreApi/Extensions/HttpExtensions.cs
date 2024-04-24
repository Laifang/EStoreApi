// 创建一个静态扩展类用于生成分页信息的MetaData

using System.Text.Json;

public static class HttpExtensions
{
    // 定义方法 在HttpHeader 中添加分页MetaData 信息
    public static void AddPaginationMetaData(this HttpResponse response, MetaData metaData)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
        // 添加分页信息到HttpHeader，序列化命名规则是驼峰式
        response.Headers.Append("pagination", JsonSerializer.Serialize(metaData, options));
        // 允许客户端获取分页信息
        response.Headers.Append("Access-Control-Expose-Headers", "pagination");
    }
}
