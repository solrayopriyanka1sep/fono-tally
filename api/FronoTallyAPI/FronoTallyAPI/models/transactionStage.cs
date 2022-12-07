using System;
using System.Collections.Generic;

namespace Fronotallyapi.Models
{
  public class LedgerEntry
  {
    public string LedgerName { get; set; }
    public string DebitCredit { get; set; }
    public decimal LineAmount { get; set; }
  }

  public class InventoryEntry
  {
    public string StockItem { get; set; }
    public decimal Qty { get; set; }
    public decimal Rate { get; set; }
    public decimal LineAmount { get; set; }
  }


  public class transactionStage
  {
    public int fronocompanyId { get; set; }
    public string TallyVoucherType { get; set; }

    public string Action { get; set; }
    public string VoucherNumber { get; set; }
    public DateTime VoucherDate { get; set; }

    public string VoucherRef { get; set; }
    public DateTime VoucherRefDate { get; set; }
    public string HeaderLedger { get; set; }
    public string Narration { get; set; }

    public List<LedgerEntry> LedgerEntries { get; set; } = new List<LedgerEntry>();
    public List<InventoryEntry> InventoryEntries { get; set; } = new List<InventoryEntry>();
    
  }
}
