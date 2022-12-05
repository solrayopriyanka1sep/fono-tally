using fronotallyapi.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using FronoTallyAPI.models;
using System.Threading.Tasks;
using System;

//Configuration.GetConnectionString("ValueListDBConfiguration")

namespace fronotallyapi.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class unitsMasterController : ControllerBase
  {

    private readonly IunitsMasterRepository _unitsRepo;


    public unitsMasterController(IunitsMasterRepository unitsRepo)
    {
      _unitsRepo = unitsRepo;
    }


    [HttpGet]
    public async Task<BaseDtos> GetunitsMaster()
    {
      try
      {
        var units = await _unitsRepo.GetunitsMaster();
        //return Ok(units);
        return CreateObject.GetBaseDtos(units, 200, "");
      }
      catch (Exception ex)
      {
        //log error
        return CreateObject.GetBaseDtos(500, 500, ex.Message);
      }
    }


    
    [HttpPost("{id}")]
    public async Task<BaseDtos> AddUpdteUnitsMaster(int id, unitsMaster unitData)
    {
      try
      {
        var response = await _unitsRepo.AddUpdteUnitsMaster(id, unitData);
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


        
    [HttpDelete("{id}")]
    public async Task<BaseDtos> DeleteUnitMaster(int id)
    {
      try
      {
        var dbUnit = await _unitsRepo.GetSingleUnit(id);
        if (dbUnit == null)
          return CreateObject.GetBaseDtos(500, 500, "Not Found!");

        var response = await _unitsRepo.DeleteUnitMaster(id);
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
