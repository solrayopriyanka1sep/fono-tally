using System;


namespace Fronotallyapi.Models
{
  public class configData
  {
    public int FronoCompanyId { get; set; }
    public string TallycompanyName { get; set; }
    public bool LedgerMasters { get; set; }
    public bool StockMasters { get; set; }
    public bool Locations { get; set; }
    public bool CostCenters { get; set; }
    public bool CostCategories { get; set; }
    public bool SalesAndReturns { get; set; }
    public bool PurchaseAndReturns { get; set; }
    public bool ReceiptsAndPayments { get; set; }
    public bool Journals { get; set; }
    public bool SalesOrders { get; set; }
    public bool PurchaseOrders { get; set; }
    public bool TwoStep { get; set; }

  }
}
