using Dapper;
using fronotallyapi.Models;
using FronoTallyAPI.context;
using FronoTallyAPI.models;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;


namespace FronoTallyAPI.Repository
{

  public class ConfigDataRepository : IConfigDataRepository
  {
    private readonly DapperContext _context;
    public ConfigDataRepository(DapperContext context)
    {
      _context = context;
    }

    public async Task<IEnumerable<configData>> GetTallyConfig()
    {
      var query = "SELECT * FROM TallyConfig";

      using (var connection = _context.CreateConnection())
      {
        var allcompaniesConfig = await connection.QueryAsync<configData>(query);
        return allcompaniesConfig.ToList();
      }
    }

    public async Task<configData> GetCompanyConfig(int id)
    {
      var query = "SELECT * FROM TallyConfig WHERE FronoCompanyId = @Id";
      using (var connection = _context.CreateConnection())
      {
        var companyConfig = await connection.QuerySingleOrDefaultAsync<configData>(query, new { id });
        return companyConfig;
      }
    }

    public async Task<BaseDtos> AddUpdteConfigForCompany(int id, configData companyConfig)
    {
      object respData = null;
      var query = "";
      var msg = "";

      if(id != companyConfig.FronoCompanyId)
      {
        return CreateObject.GetBaseDtos(500, 500, "Compnay Id parameter does not match with data");
      }

      query = "SELECT * FROM TallyConfig WHERE FronoCompanyId = @Id";
      using (var connection = _context.CreateConnection())
      {
        respData = await connection.QuerySingleOrDefaultAsync<configData>(query, new { id });        
      }
      
      if (respData == null)
      {
        query = "INSERT INTO TallyConfig(FronoCompanyId, TallycompanyName, LedgerMasters, StockMasters, Locations, CostCenters, CostCategories, SalesAndReturns, PurchaseAndReturns, ReceiptsAndPayments, Journals, SalesOrders, PurchaseOrders, TwoStep) VALUES ( @FronoCompanyId, @TallycompanyName, @LedgerMasters, @StockMasters, @Locations, @CostCenters, @CostCategories, @SalesAndReturns, @PurchaseAndReturns, @ReceiptsAndPayments, @Journals, @SalesOrders, @PurchaseOrders, @TwoStep)";
        msg = "Data Added";
      }
      else
      {
        query = "UPDATE TallyConfig SET TallycompanyName = @TallycompanyName, LedgerMasters = @LedgerMasters, StockMasters = @StockMasters, Locations = @Locations, CostCenters = @CostCenters, CostCategories = @CostCategories, SalesAndReturns = @SalesAndReturns, PurchaseAndReturns = @PurchaseAndReturns, ReceiptsAndPayments = @ReceiptsAndPayments, Journals = @Journals, SalesOrders = @SalesOrders, PurchaseOrders = @PurchaseOrders, TwoStep = @TwoStep WHERE FronoCompanyId = @FronoCompanyId";
        msg = "Data Updated";
      }

      var parameters = new DynamicParameters();
      parameters.Add("FronoCompanyId", companyConfig.FronoCompanyId, DbType.Int64);
      parameters.Add("TallycompanyName", companyConfig.TallycompanyName, DbType.String);
      parameters.Add("LedgerMasters", companyConfig.LedgerMasters, DbType.Boolean);
      parameters.Add("StockMasters", companyConfig.StockMasters, DbType.Boolean);
      parameters.Add("Locations", companyConfig.Locations, DbType.Boolean);
      parameters.Add("CostCenters", companyConfig.CostCenters, DbType.Boolean);
      parameters.Add("CostCategories", companyConfig.CostCategories, DbType.Boolean);
      parameters.Add("SalesAndReturns", companyConfig.SalesAndReturns, DbType.Boolean);
      parameters.Add("PurchaseAndReturns", companyConfig.PurchaseAndReturns, DbType.Boolean);
      parameters.Add("ReceiptsAndPayments", companyConfig.ReceiptsAndPayments, DbType.Boolean);
      parameters.Add("Journals", companyConfig.Journals, DbType.Boolean);
      parameters.Add("SalesOrders", companyConfig.SalesOrders, DbType.Boolean);
      parameters.Add("PurchaseOrders", companyConfig.PurchaseOrders, DbType.Boolean);
      parameters.Add("TwoStep", companyConfig.TwoStep, DbType.Boolean);

      try
      {
        using (var connection = _context.CreateConnection())
        {
          await connection.ExecuteAsync(query, parameters);
        }
        var baseDtos = CreateObject.GetBaseDtos(200, 200, msg);
        return baseDtos;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        throw;
      }
    }



    public async Task<BaseDtos> AddConfigForCompany(configData companyConfig)
    {
      //var query = "INSERT INTO Companies (Name, Address, Country) VALUES (@Name, @Address, @Country)";

      var query = "INSERT INTO TallyConfig(FronoCompanyId, TallycompanyName, LedgerMasters, StockMasters, Locations, CostCenters, CostCategories, SalesAndReturns, PurchaseAndReturns, ReceiptsAndPayments, Journals, SalesOrders, PurchaseOrders) VALUES ( @FronoCompanyId, @TallycompanyName, @LedgerMasters, @StockMasters, @Locations, @CostCenters, @CostCategories, @SalesAndReturns, @PurchaseAndReturns, @ReceiptsAndPayments, @Journals, @SalesOrders, @PurchaseOrders)";

      var parameters = new DynamicParameters();
      parameters.Add("FronoCompanyId", companyConfig.FronoCompanyId, DbType.Int64);
      parameters.Add("TallycompanyName", companyConfig.TallycompanyName, DbType.String);
      parameters.Add("LedgerMasters", companyConfig.LedgerMasters, DbType.Boolean);
      parameters.Add("StockMasters", companyConfig.StockMasters, DbType.Boolean);
      parameters.Add("Locations", companyConfig.Locations, DbType.Boolean);
      parameters.Add("CostCenters", companyConfig.CostCenters, DbType.Boolean);
      parameters.Add("CostCategories", companyConfig.CostCategories, DbType.Boolean);
      parameters.Add("SalesAndReturns", companyConfig.SalesAndReturns, DbType.Boolean);
      parameters.Add("PurchaseAndReturns", companyConfig.PurchaseAndReturns, DbType.Boolean);
      parameters.Add("ReceiptsAndPayments", companyConfig.ReceiptsAndPayments, DbType.Boolean);
      parameters.Add("Journals", companyConfig.Journals, DbType.Boolean);
      parameters.Add("SalesOrders", companyConfig.SalesOrders, DbType.Boolean);
      parameters.Add("PurchaseOrders", companyConfig.PurchaseOrders, DbType.Boolean);

      try
      {
        using (var connection = _context.CreateConnection())
        {
          //IDataReader dr
           await connection.ExecuteAsync(query, parameters) ;
          //while (dr.Read())
          //{
          //  var id = Convert.ToInt32(dr["Id"]);
          //  var responseMessage = dr["ResponseMessage"].ToString();
          //}
        }
        var baseDtos = CreateObject.GetBaseDtos(200, 200, "Data Added");
        return baseDtos;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        throw;
      }
    }

    public async Task<BaseDtos> UpdateCompanyConfig(int id, configData companyConfig)
    {
      //var query = "UPDATE Companies SET Name = @Name, Address = @Address, Country = @Country WHERE Id = @Id";

      var query = "UPDATE TallyConfig SET TallycompanyName = @TallycompanyName, LedgerMasters = @LedgerMasters, StockMasters = @StockMasters, Locations = @Locations, CostCenters = @CostCenters, CostCategories = @CostCategories, SalesAndReturns = @SalesAndReturns, PurchaseAndReturns = @PurchaseAndReturns, ReceiptsAndPayments = @ReceiptsAndPayments, Journals = @Journals, SalesOrders = @SalesOrders, PurchaseOrders = @PurchaseOrders WHERE FronoCompanyId = @FronoCompanyId";

      var parameters = new DynamicParameters();
      parameters.Add("FronoCompanyId", companyConfig.FronoCompanyId, DbType.Int64);
      parameters.Add("TallycompanyName", companyConfig.TallycompanyName, DbType.String);
      parameters.Add("LedgerMasters", companyConfig.LedgerMasters, DbType.Boolean);
      parameters.Add("StockMasters", companyConfig.StockMasters, DbType.Boolean);
      parameters.Add("Locations", companyConfig.Locations, DbType.Boolean);
      parameters.Add("CostCenters", companyConfig.CostCenters, DbType.Boolean);
      parameters.Add("CostCategories", companyConfig.CostCategories, DbType.Boolean);
      parameters.Add("SalesAndReturns", companyConfig.SalesAndReturns, DbType.Boolean);
      parameters.Add("PurchaseAndReturns", companyConfig.PurchaseAndReturns, DbType.Boolean);
      parameters.Add("ReceiptsAndPayments", companyConfig.ReceiptsAndPayments, DbType.Boolean);
      parameters.Add("Journals", companyConfig.Journals, DbType.Boolean);
      parameters.Add("SalesOrders", companyConfig.SalesOrders, DbType.Boolean);
      parameters.Add("PurchaseOrders", companyConfig.PurchaseOrders, DbType.Boolean);


      try
      {
        using (var connection = _context.CreateConnection())
        {
          //IDataReader dr
          await connection.ExecuteAsync(query, parameters);
          //while (dr.Read())
          //{
          //  var id = Convert.ToInt32(dr["Id"]);
          //  var responseMessage = dr["ResponseMessage"].ToString();
          //}
        }
        var baseDtos = CreateObject.GetBaseDtos(200, 200, "Data Updated");
        return baseDtos;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        throw;
      }
    }
    public async Task<BaseDtos> DeleteCompanyConfig(int id)
    {
      var query = "DELETE FROM TallyConfig WHERE FronoCompanyId = @Id";

      try
      {
        using (var connection = _context.CreateConnection())
        {
          await connection.ExecuteAsync(query, new { id });
        }
        var baseDtos = CreateObject.GetBaseDtos(200, 200, "Data Deleted");
        return baseDtos;
      }
      catch (Exception ex)
      {
        Console.WriteLine(ex.ToString());
        throw;
      }
    }

  }

}
