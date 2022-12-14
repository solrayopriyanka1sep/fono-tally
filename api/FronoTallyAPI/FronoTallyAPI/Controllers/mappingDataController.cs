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
  public class mappingDataController : ControllerBase
  {

    private readonly ImappingDataRepository _mappingRepo;


    public mappingDataController(ImappingDataRepository mappingRepo)
    {
      _mappingRepo = mappingRepo;
    }


    [HttpGet]
    public async Task<IActionResult> GetTallyMapping()
    {
      try
      {
        var companyymappings = await _mappingRepo.GetTallyMapping();
        return Ok(companyymappings);
      }
      catch (Exception ex)
      {
        //log error
        return StatusCode(500, ex.Message);
      }
    }

    [HttpGet("{id}")]
    public async Task<BaseDtos> GetCompanyMapping(int id)
    {
      try
      {
        var response = await _mappingRepo.GetCompanyMapping(id);
        return response;

        //if (resp == null)
        //  return CreateObject.GetBaseDtos(500, 500, "Company "+ id +"Not found !");
        //return CreateObject.GetBaseDtos(resp, 200, "" ); 
      }
      catch (Exception ex)
      {
        //log error
        //return StatusCode(500, ex.Message);
        return CreateObject.GetBaseDtos(ex, 500, ex.Message);
      }
    }

    [HttpPost("{id}")]
    public async Task<BaseDtos> AddUpdteMappingForCompany(int id, mappingData[] mappingInfo)
    {
      try
      {
        var response = await _mappingRepo.AddUpdteMappingForCompany(id, mappingInfo);
        //return response;
        return CreateObject.GetBaseDtos(response, 200, "200");
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
        var dbCompanyMappings = await _mappingRepo.GetCompanyMapping(id);
        if (dbCompanyMappings == null)
          return CreateObject.GetBaseDtos(500, 500, "Not Found!");

        var response = await _mappingRepo.DeleteMappingForCompany(id);
        //return response;
        return CreateObject.GetBaseDtos(response, 500, "");
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
