using System;


namespace Fronotallyapi.Models
{
  public class stockCategories
  {
    public int Id { get; set; }
    public int CompanyProfileId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryDesc { get; set; }
    public bool IsActive { get; set; }
    public string Parent { get; set; }
    public int DOrder { get; set; }

  }
}
