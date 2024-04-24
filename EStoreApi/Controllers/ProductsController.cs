using System.Text.Json;
using EStoreApi.Data;
using EStoreApi.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SQLitePCL;

namespace EStoreApi.Controllers;

public class ProductsController : BasicApiController
{
    private readonly StoreContext _context;

    public ProductsController(StoreContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<PageList<Product>>> GetProductsAsync(
        [FromQuery] ProductParams productParams
    )
    {
        var query = _context
            .Products.Sort(productParams.OrderBy)
            .Search(productParams.SearchTerm)
            .Filter(productParams.Brands, productParams.Types);

        var products = await PageList<Product>.ToPageListAsync(
            query,
            productParams.PageNumber,
            productParams.PageSize
        );

        Response.AddPaginationMetaData(products.MetaData);

        return products;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProductAsync(Product product)
    {
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetProductAsync), new { id = product.Id }, product);
    }

    // 返回products 的 type 和 brand 列表 ，方便前端创建选择列表
      [HttpGet("filters")]
    public async Task<IActionResult> GetFiltersAsync()
    {
        var brands = await _context.Products.Select(p => p.Brand).Distinct().ToListAsync();
        var types = await _context.Products.Select(p => p.Type).Distinct().ToListAsync();

        return Ok(new { brands, types });
    }
}
