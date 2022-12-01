using System;
namespace fronotallyapi.Models
{
  public class masterStage
  {
    public int fronocompanyId { get; set; }
    public string TallyMasterType { get; set; }
    public string Action { get; set; }

    public long Id { get; set; }
    public string Name { get; set; }
    public long ParentId { get; set; }

    public string Address1 { get; set; }
    public string Address2 { get; set; }
    public string Address3 { get; set; }
    public string Address4 { get; set; }

    public string PinCode { get; set; }

    public string StateName { get; set; }
    public string CountryName { get; set; }

    public string Email { get; set; }
    public string Phone { get; set; }
    public string Mobile { get; set; }
    public string Fax { get; set; }
    public string Contact { get; set; }
    public string IncomeTaxNumber { get; set; }
    public string PartyGSTIN { get; set; }
    public bool GSTApplicable { get; set; }
    public string GSTRegistrationType { get; set; }
    public string TaxType { get; set; }
    public string GSTType { get; set; }
    public string GSTDutyHead { get; set; }
    public string GSTTypeOfSupply { get; set; }
    public string RoundingMethod { get; set; }
    public int RoundingLimit { get; set; }
    public bool IsBillwiseOn { get; set; }
    public string IsCostCentresOn { get; set; }
    public bool IsInterestOn { get; set; }
    public bool AffectsStock { get; set; }
    public string PrimaryGroup { get; set; }

    public decimal OpeningBalance { get; set; }
    public string DrCr { get; set; }


  }
}
