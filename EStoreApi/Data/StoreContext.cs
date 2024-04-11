using EStoreApi.Entities;
using EStoreApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EStoreApi.Data
{

    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<Product> Products { get; set; }

        public DbSet<ShoppingCart> ShoppingCarts { get; set; }
    }
}