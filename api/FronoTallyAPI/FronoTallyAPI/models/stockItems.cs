using System;


namespace Fronotallyapi.Models
{
  public class stockItems
  {
    public int ItemId { get; set; }
    public int CompanyProfileId { get; set; }
    public string ItemCode { get; set; }
    public string ItemName { get; set; }
    public string ItemDescription { get; set; }
    public string ItemType { get; set; }
    public bool IsActive { get; set; }
    public decimal OpeningStock { get; set; }
    public string UnitShortName { get; set; }
    public string DepartmentName { get; set; }
    public string SubCategoryName { get; set; }
    public string HSNCode { get; set; }
    public string Taxability { get; set; }
    public string TaxType { get; set; }
    public decimal IGST { get; set; }
    public decimal SGST { get; set; }
    public decimal CGST { get; set; }
    public decimal Cess { get; set; }


  }
}
