using System;


namespace fronotallyapi.Models
{
  public class unitsMaster
  {
    public Int64 SAUnitId { get; set; }
    public string UnitName { get; set; }
    public string UnitShortName { get; set; }
    public bool IsActive { get; set; }
    public bool IsDelete { get; set; }
    public Int16 DisplayOrder { get; set; }
    public Int64 CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public Int64 ModifiedBy { get; set; }
    public DateTime ModifiedDate { get; set; }

  }
}
