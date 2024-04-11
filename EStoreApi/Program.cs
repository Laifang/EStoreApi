using EStoreApi.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
builder.Services.AddControllers();
// 添加跨域中间件
builder.Services.AddCors();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<StoreContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});




var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 注册授权中间件
// app.UseAuthorization();

// 注册控制器
app.MapControllers();

// 实现数据库 自动初始化
var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

try
{
    context.Database.Migrate(); 
    DbInit.Initialize(context); 
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occurred while migrating the database."); // 捕获异常并抛出
}

app.UseCors(options =>{
    // 为 域名 http://localhost:3000  
    // AllowAnyHeader 作用：允许任何请求头
    // AllowAnyMethod 作用：允许任何请求方法
    // AllowCredentials 作用：允许跨域请求带有凭据（cookies、HTTP认证等）
    // WithOrigins 作用：允许跨域请求的源
    options.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
});

app.Run();
