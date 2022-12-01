import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { configData } from '../model/configData';

  

@Injectable({
  providedIn: 'root'
})

export class FronoIntService {
  private fronoURL:string = 'https://localhost:5001/api';

  private fronoURL1:string = 'http://localhost:5000/api';

  private FronoCompany: number = 0

  constructor(private http: HttpClient ) { 
    //this.FronoCompany = FronoCompanyId
    //this.XMLP = new XMLParser()
  }
  
  init(FronoCompanyId:number):void{
    this.FronoCompany = FronoCompanyId
  }

  getConfig(): Observable<any> {
    return this.http.get<any>(this.fronoURL + '/configData/' + this.FronoCompany )
  }

  AddUpdateConfig(configData:configData): Observable<any> {
    return this.http.post<any>(this.fronoURL + '/configData/' + this.FronoCompany , configData)
  }




  getGroups(): Observable<any> {
    return this.http.get<any>(this.fronoURL1 + '/AccountGroups/GetAllAccountGroups/' + this.FronoCompany )
  }

  AddUpdateGroup(reqData:any): Observable<any> {
    const postData = {
      "companyProfileId": this.FronoCompany,
      "displayOrder": 0,
      "isActive": true,
      "isDelete": false,
      "isDefault": true,
      "createdBy": 25,
      "modifiedBy": 0,
      "accountGroupsId": 0,
      "underAccountGroupsId": 4,
      "drCr": "",
      "isDisabled": false,
      "groupName": reqData.MasterName
    }
    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.fronoURL1 + '/AccountGroups/AddUpdate' , postData, {'headers':headers})
  }

  DeleteGroup(reqData:any): Observable<any> {
    const postData = {
      "accountGroupsId": 503,
      "modifiedBy": 25
    }
    const headers = { 'content-type': 'application/json'} 

    return this.http.post<any>(this.fronoURL1 + '/AccountGroups/Delete'  , postData, {'headers':headers})
  }



}