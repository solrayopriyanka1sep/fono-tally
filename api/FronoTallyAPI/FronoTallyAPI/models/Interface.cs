using Fronotallyapi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace Fronotallyapi.Models
{
  public interface IConfigDataRepository
  {
    public Task<IEnumerable<configData>> GetTallyConfig();
    public Task<configData> GetCompanyConfig(int FronoCompanyId);
    public Task<BaseDtos> AddUpdteConfigForCompany(int id, configData companyConfig);
    public Task<BaseDtos> AddConfigForCompany(configData companyConfig);
    public Task<BaseDtos> UpdateCompanyConfig(int id, configData companyConfig);
    public Task<BaseDtos> DeleteCompanyConfig(int id);

  }

  public interface ImappingDataRepository
  {
    public Task<IEnumerable<mappingData>> GetTallyMapping();
    public Task<BaseDtos> GetCompanyMapping(int FronoCompanyId);
    //public Task<IEnumerable<mappingData>> GetCompanyMapping(int FronoCompanyId);

    public Task<BaseDtos> AddUpdteMappingForCompany(int id, mappingData[] companyMapping);
    public Task<BaseDtos> DeleteMappingForCompany(int id);

  }


  public interface IunitsMasterRepository
  {
    public Task<BaseDtos> GetunitsMaster();
    public Task<BaseDtos> GetSingleUnit(int id);
    public Task<BaseDtos> AddUpdteUnitsMaster(int id, unitsMaster unitData);
    public Task<BaseDtos> DeleteUnitMaster(int id);

  }


  public interface ImasterDataRepository
  {
    public Task<BaseDtos> GetStockGroups(int companyId);

    public Task<BaseDtos> GetStockCategories(int companyId);

    public Task<BaseDtos> GetStockItems(int companyId);
  }




  public sealed class BaseDtos
  {
    public long MessageId { get; set; }
    public string MessageText { get; set; }
    public object Data { get; set; }
  }

  public class CreateObject
  {
    public static BaseDtos GetBaseDtos<T>(T data, long messageId = 0, string messageText = "")
    {
      var baseDtos = new BaseDtos()
      {
        MessageId = messageId,
        MessageText = messageText,
        Data = data
      };
      return baseDtos;
    }

  }

}
