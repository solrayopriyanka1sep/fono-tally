using Dapper;
//using fronotallyapi.Models;
using FronoTallyAPI.context;
using Fronotallyapi.Models;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Drawing.Printing;
using System.Diagnostics;
using System.ComponentModel.Design;

namespace FronoTallyAPI.Repository
{

  public class mapppnigDataRepository : ImappingDataRepository
  {
    private readonly DapperContext _context;
    public mapppnigDataRepository(DapperContext context)
    {
      _context = context;
    }

    public async Task<IEnumerable<mappingData>> GetTallyMapping()
    {
      var query = "SELECT * FROM TallyMapping";

      using (var connection = _context.CreateConnection())
      {
        var allcompaniesMapping = await connection.QueryAsync<mappingData>(query);
        return allcompaniesMapping.ToList();
      }
    }

    public async Task<BaseDtos> GetCompanyMapping(int id)
    {
      var query = "SELECT * FROM TallyMapping WHERE FronoCompanyId = @id";

      using (var connection = _context.CreateConnection())
      {
        var allvalues = await connection.QueryAsync<mappingData>(query, new { id });

        var valuesList = allvalues.ToList();
        return CreateObject.GetBaseDtos(valuesList, 200, "");
      }


    }

    public async Task<BaseDtos> AddUpdteMappingForCompany(int id, mappingData[] companyMapping)
    {
      //object respData = null;
      var query = "";
//      var msg = "";
      var str1 = "";

      if(id != companyMapping[0].FronoCompanyId)
      {
        return CreateObject.GetBaseDtos(500, 500, "Compnay Id parameter does not match with data");
      }

      query = "DELETE FROM TallyMapping WHERE FronoCompanyId = @Id";
      using (var connection = _context.CreateConnection())
      {
        await connection.ExecuteAsync(query, new { id });
      }

      query = "INSERT INTO TallyMapping (FronoCompanyId, VoucherType, TransactionType, GSTType, GSTRate, TallyLedgerName) VALUES ";
      //foreach (mappingData cMapping in companyMapping)
      for (int i = 0; i < companyMapping.Length; i++)
      {
        str1 = "";
        str1 = str1 + "( " + companyMapping[i].FronoCompanyId + ", ";
        str1 = str1 + "'" + companyMapping[i].VoucherType + "', ";
        str1 = str1 + "'" + companyMapping[i].TransactionType + "', ";
        str1 = str1 + "'" + companyMapping[i].GSTType + "', ";
        str1 = str1 +  companyMapping[i].GSTRate + ", ";
        str1 = str1 + "'" + companyMapping[i].TallyLedgerName + "') ";
        str1 = str1 + (i == companyMapping.Length - 1 ? " " : ", ");
        query = query + str1;
      }

      try
      {
        using (var connection = _context.CreateConnection())
        {
          await connection.ExecuteAsync(query );
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
   

    public async Task<BaseDtos> DeleteMappingForCompany(int id)
    {
      var query = "DELETE FROM TallyMapping WHERE FronoCompanyId = @Id";

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
