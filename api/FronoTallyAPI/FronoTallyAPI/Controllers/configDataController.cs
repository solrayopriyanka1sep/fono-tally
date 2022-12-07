using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using Fronotallyapi.Models;
using System.Threading.Tasks;
using System;

//Configuration.GetConnectionString("ValueListDBConfiguration")

namespace fronotallyapi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class configDataController : ControllerBase
  {

    private readonly IConfigDataRepository _configRepo;


    public configDataController(IConfigDataRepository configRepo)
    {
      _configRepo = configRepo;
    }


    [HttpGet]
    public async Task<IActionResult> GetTallyConfig()
    {
      try
      {
        var companies = await _configRepo.GetTallyConfig();
        return Ok(companies);
      }
      catch (Exception ex)
      {
        //log error
        return StatusCode(500, ex.Message);
      }
    }

    [HttpGet("{id}", Name = "CompanyById")]
    public async Task<BaseDtos> GetCompanyConfig(int id)
    {
      try
      {
        var company = await _configRepo.GetCompanyConfig(id);
        if (company == null)
          return CreateObject.GetBaseDtos(500, 500, "Company "+ id +"Not found !");
        return CreateObject.GetBaseDtos(company, 200, "" ); 
      }
      catch (Exception ex)
      {
        //log error
        //return StatusCode(500, ex.Message);
        return CreateObject.GetBaseDtos(500, 500, ex.Message);
      }
    }

    [HttpPost("{id}")]
    public async Task<BaseDtos> AddUpdteConfigForCompany(int id, configData company)
    {
      try
      {
        var response = await _configRepo.AddUpdteConfigForCompany(id, company);
        return response;
      }
      catch (Exception ex)
      {
        //log error
        //return StatusCode(500, ex.Message);
        var baseDtos = CreateObject.GetBaseDtos(500, 500, ex.Message);
        return baseDtos;
      }
    }


    /*
      [HttpPost]
        public async Task<BaseDtos> AddConfigForCompany(configData newcompanyConfig)
        {
          try
          {
            var response = await _configRepo.AddConfigForCompany(newcompanyConfig);
            //return CreatedAtRoute("CompanyById", new { id = createdCompany.Id }, createdCompany);
            return response;
          }
          catch (Exception ex)
          {
            //log error
            //return StatusCode(500, ex.Message);
            var baseDtos = CreateObject.GetBaseDtos(500, 500, ex.Message);
            return baseDtos;

          }
        }
    */


    [HttpPut("{id}")]
    public async Task<BaseDtos> UpdateCompanyConfig(int id, configData company)
    {
      try
      {
        var dbCompany = await _configRepo.GetCompanyConfig(id);
        if (dbCompany == null) {
          return CreateObject.GetBaseDtos(500, 500, "Not Found!");
        }

        var response = await _configRepo.UpdateCompanyConfig(id, company);
        return response;
      }
      catch (Exception ex)
      {
        //log error
        //return StatusCode(500, ex.Message);
        var baseDtos = CreateObject.GetBaseDtos(500, 500, ex.Message);
        return baseDtos;
      }
    }

    [HttpDelete("{id}")]
    public async Task<BaseDtos> DeleteCompanyConfig(int id)
    {
      try
      {
        var dbCompany = await _configRepo.GetCompanyConfig(id);
        if (dbCompany == null)
          return CreateObject.GetBaseDtos(500, 500, "Not Found!");

        var response = await _configRepo.DeleteCompanyConfig(id);
        return response;
      }
      catch (Exception ex)
      {
        //log error
        //return StatusCode(500, ex.Message);
        return CreateObject.GetBaseDtos(500, 500, ex.Message);
      }
    }


  }
}
