using System;


namespace Fronotallyapi.Models
{
  public class stockGroups
  {
    public int DepartmentId { get; set; }
    public int CompanyProfileId { get; set; }
    public string DepartmentName { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsDefault { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public int ModifiedBy { get; set; }
    public DateTime ModifiedDate { get; set; }

  }
}
