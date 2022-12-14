using System;
namespace Fronotallyapi.Models
{
  public class mappingData
  {
    public int FronoCompanyId { get; set; }
    public string VoucherType { get; set; }
    public string TransactionType { get; set; }
    public string GSTType { get; set; }
    public decimal GSTRate { get; set; }
    public string TallyLedgerName { get; set; }

  }
}
