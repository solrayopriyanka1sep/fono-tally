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

  public class masterDataRepository : ImasterDataRepository
  {
    private readonly DapperContext _context;
    public masterDataRepository(DapperContext context)
    {
      _context = context;
    }

    
    public async Task<BaseDtos> GetStockGroups(int companyId)
    {
      var query = "SELECT * FROM DepartmentValueList WHERE CompanyProfileId = @companyId";

      using (var connection = _context.CreateConnection())
      {
        var allvalues = await connection.QueryAsync<stockGroups>(query, new { companyId });

        var valuesList = allvalues.ToList();
        return CreateObject.GetBaseDtos(valuesList, 200, "");
      }
    }


    public async Task<BaseDtos> GetStockCategories(int companyId)
    {
      var query = "select CategoryId as Id, CompanyProfileId, CategoryName, CategoryDesc,IsActive, 'Primary' as Parent, 1 as DOrder from CategoryMaster " +
                  "union " +
                  "select A.SubCategoryId as Id, A.CompanyProfileId, A.SubCategoryName, A.SubCategoryDesc, A.IsActive, B.CategoryName as Parent, 2 as DOrder " +
                  "FROM SubCategoryMaster A, CategoryMaster B " +
                  "WHERE A.CategoryId = B.CategoryId " +
                  "AND A.CompanyProfileId = B.CompanyProfileId " +
                  "AND A.CompanyProfileId = @companyId " +
                  "order by DOrder ";

      using (var connection = _context.CreateConnection())
      {
        var allvalues = await connection.QueryAsync<stockCategories>(query, new { companyId });

        var valuesList = allvalues.ToList();
        return CreateObject.GetBaseDtos(valuesList, 200, "");
      }
    }

    public async Task<BaseDtos> GetStockItems(int companyId)
    {
      var query = "select A.ItemId, A.ItemCode, A.ItemName, A.ItemDescription, A.ItemType, A.CompanyProfileId, A.IsActive, A.OpeningStock, " +
                   "B.UnitShortName, C.DepartmentName, D.SubCategoryName, E.HSNCode, " +
                   "CASE WHEN F.Taxability IS NULL THEN G.Taxability ELSE F.Taxability END as Taxability, " +
                   "CASE WHEN F.TaxType IS NULL THEN G.TaxType ELSE F.TaxType END as TaxType, " +
                   "CASE WHEN F.IGST IS NULL THEN G.IGST ELSE F.IGST END as IGST, " +
                   "CASE WHEN F.SGST IS NULL THEN G.SGST ELSE F.SGST END as SGST, " +
                   "CASE WHEN F.CGST IS NULL THEN G.CGST ELSE F.CGST END as CGST, " +
                   "CASE WHEN F.Cess IS NULL THEN G.Cess ELSE F.Cess END as Cess  " +
                   "from ItemMaster A  " +
                   "left join SAUnitMaster B on A.UnitId = B.SAUnitId  " +
                   "left join DepartmentValueList C on A.DepartmentId = C.DepartmentId AND A.CompanyProfileId = C.CompanyProfileId  " +
                   "left join SubCategoryMaster D on A.CategoryId = D.CategoryId AND a.SubCategoryId = D.SubCategoryId AND A.CompanyProfileId = D.CompanyProfileId  " +
                   "left join HSNCodeValueList E on A.HSNCodeId = E.HSNCodeId AND A.CompanyProfileId = E.CompanyProfileId  " +
                   "left join SATaxTypeValueList F on A.TaxTypeId = F.SATaxTypeId  " +
                   "left join TaxTypeValueList G on A.TaxTypeId = G.TaxTypeId AND A.CompanyProfileId = G.CompanyProfileId  " +
                   "WHERE A.CompanyProfileId = @companyId" ;  

      using (var connection = _context.CreateConnection())
      {
        var allvalues = await connection.QueryAsync<stockItems>(query, new { companyId });

        var valuesList = allvalues.ToList();
        return CreateObject.GetBaseDtos(valuesList, 200, "");
      }
    }




  }




}
