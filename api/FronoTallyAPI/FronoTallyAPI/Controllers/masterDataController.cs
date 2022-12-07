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
  public class masterDataController : ControllerBase
  {

    private readonly ImasterDataRepository _mastersRepo;


    public masterDataController(ImasterDataRepository mastersRepo)
    {
      _mastersRepo = mastersRepo;
    }




    [HttpGet]
    [Route("[action]/{companyId}")]
    public async Task<BaseDtos> GetStockGroups(int companyId)
    {
      try
      {
        var response = await _mastersRepo.GetStockGroups(companyId);
        //return CreateObject.GetBaseDtos(response, 200, "");
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

    

    [HttpGet]
    [Route("[action]/{companyId}")]
    public async Task<BaseDtos> GetStockCategories(int companyId)
    {
      try
      {
        var response = await _mastersRepo.GetStockCategories(companyId);
        //return CreateObject.GetBaseDtos(response, 200, "");
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

    [HttpGet]
    [Route("[action]/{companyId}")]
    public async Task<BaseDtos> GetStockItems(int companyId)
    {
      try
      {
        var response = await _mastersRepo.GetStockItems(companyId);
        //return CreateObject.GetBaseDtos(response, 200, "");
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



  }
}
