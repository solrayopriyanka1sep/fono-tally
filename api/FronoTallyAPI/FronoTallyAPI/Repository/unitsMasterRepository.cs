using Dapper;
using Fronotallyapi.Models;
using FronoTallyAPI.context;
using Microsoft.OpenApi.Any;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;


namespace FronoTallyAPI.Repository
{

  public class unitsMasterRepository : IunitsMasterRepository
  {
    private readonly DapperContext _context;
    public unitsMasterRepository(DapperContext context)
    {
      _context = context;
    }

    public async Task<BaseDtos> GetunitsMaster()
    {
      var query = "SELECT * FROM SAUnitMaster";

      using (var connection = _context.CreateConnection())
      {
        var allunits = await connection.QueryAsync<unitsMaster>(query);

        var unitsList = allunits.ToList();
        return CreateObject.GetBaseDtos(unitsList, 200, "");
      }
    }


    public async Task<BaseDtos> GetSingleUnit(int Id)
    {
      var query = "SELECT * FROM SAUnitMaster WHERE SAUnitId = @Id";

      try
      {
          using (var connection = _context.CreateConnection())
        {
          var unitData = await connection.QueryAsync<unitsMaster>(query);
          return CreateObject.GetBaseDtos(unitData, 200, "");
        }
      }
      catch (Exception ex)
      {
        //Console.WriteLine(ex.ToString());
        //throw;
        return CreateObject.GetBaseDtos(ex, 500, "500");
      }
    }


    public async Task<BaseDtos> AddUpdteUnitsMaster(int id, unitsMaster unitData)
    {
      object respData = null;
      var query = "";
      var msg = "";


      query = "SELECT * FROM SAUnitMaster WHERE SAUnitId = @Id";
      using (var connection = _context.CreateConnection())
      {
        respData = await connection.QuerySingleOrDefaultAsync<configData>(query, new { id });        
      }
      
      if (respData == null)
      {
        query = "INSERT INTO SAUnitMaster (SAUnitId, UnitName, UnitShortName, IsActive, IsDelete, DisplayOrder, CreatedBy, CreatedDate, ModifiedBy, ModifiedDate) VALUES ( @SAUnitId , @UnitName, @UnitShortName, @IsActive, @IsDelete, @DisplayOrder, @CreatedBy, @CreatedDate, @ModifiedBy, @ModifiedDate)";
        msg = "Data Added";
      }
      else
      {
        query = "UPDATE SAUnitMaster  SET UnitName = @UnitName, UnitShortName = @UnitShortName, IsActive = @IsActive, IsDelete = @IsDelete, DisplayOrder = @DisplayOrder, CreatedBy = @CreatedBy, CreatedDate = @CreatedDate, ModifiedBy = @ModifiedBy, ModifiedDate = @ModifiedDate WHERE SAUnitId = @SAUnitId";
        msg = "Data Updated";
      }

      var parameters = new DynamicParameters();
      parameters.Add("SAUnitId", unitData.SAUnitId, DbType.Int64);
      parameters.Add("UnitName", unitData.UnitName, DbType.String);
      parameters.Add("UnitShortName", unitData.UnitShortName, DbType.String);
      parameters.Add("IsActive", unitData.IsActive, DbType.Boolean);
      parameters.Add("IsDelete", unitData.IsDelete, DbType.Boolean);
      parameters.Add("DisplayOrder", unitData.DisplayOrder, DbType.Int16);
      parameters.Add("CreatedBy", unitData.CreatedBy, DbType.Int64);
      parameters.Add("CreatedDate", unitData.CreatedDate, DbType.DateTime);
      parameters.Add("ModifiedBy", unitData.ModifiedBy, DbType.Int64);
      parameters.Add("ModifiedDate", unitData.ModifiedDate, DbType.DateTime);

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
        //Console.WriteLine(ex.ToString());
        //throw;
        return CreateObject.GetBaseDtos(ex, 500, "500");
      }
    }



    public async Task<BaseDtos> DeleteUnitMaster(int id)
    {
      var query = "DELETE FROM SAUnitMaster WHERE SAUnitId = @Id";

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
        //Console.WriteLine(ex.ToString());
        //throw;
        return CreateObject.GetBaseDtos(ex, 500, "500");
      }
    }




  }

}
