using System;


namespace Fronotallyapi.Models
{
  public class unitsMaster
  {
    public int SAUnitId { get; set; }
    public string UnitName { get; set; }
    public string UnitShortName { get; set; }
    public bool IsActive { get; set; }
    public bool IsDelete { get; set; }
    public int DisplayOrder { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public int ModifiedBy { get; set; }
    public DateTime ModifiedDate { get; set; }

  }
}
