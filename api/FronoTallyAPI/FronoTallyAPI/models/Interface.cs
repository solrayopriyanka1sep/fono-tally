using fronotallyapi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FronoTallyAPI.models
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
