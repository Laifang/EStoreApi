using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionMiddleware(RequestDelegate next,ILogger<ExceptionMiddleware> logger,IHostEnvironment env)
    {
        _next= next;
        _logger= logger;
        _env = env;
    }


    public async Task InvokeAsync(HttpContext context){
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex,ex.Message);
            // 封装异常信息
            // 响应客户端 内容类型为json
            context.Response.ContentType = "application/json";
            // 设置状态码
            context.Response.StatusCode = 500;

            // 设置响应内容
            var resp= new ProblemDetails{
                Title = ex.Message,
                Status = 500,
                Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : "An error occurred while processing your request."
            };

            // 设置序列化选项
            var options = new JsonSerializerOptions{
                // 以驼峰形式序列化属性名
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            };
            // 序列化响应内容
            var json = JsonSerializer.Serialize(resp,options);
            // 写入响应内容
            await context.Response.WriteAsync(json);
        }
    }   
}