// I'm a comment!
// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;


contract SimpleStorage {
   
struct adminInfo {
    string ssn;
    address account;
    string meta;
}


//...................................Admins..........................................//
   //create an array of admins  
    adminInfo[] internal admins;

 //Mapping to search for admins with address return the struct 
    
        mapping(address => adminInfo) public adminaddressTossn;


//admin store function
  
    function addAdmin(string memory _ssn, address _adminAddress, string memory _meta) public {
        adminInfo memory newAdmin;
        newAdmin.ssn=_ssn;
        newAdmin.account=_adminAddress;
        newAdmin.meta=_meta;
        admins.push(newAdmin);
        adminaddressTossn[_adminAddress] = newAdmin;
     }

     //admin verify/view function
     function getAdmin(address _adminAddress) public view returns (string memory, string memory){
        adminInfo memory s = adminaddressTossn[_adminAddress];
        return (s.ssn,s.meta);
    }
    //...................................patients..........................................//

struct patientInfo {
    string ssn;
    address account;
    address doctor;
    string meta;
}



   //create an array of admins  
    patientInfo[] internal patients;

 //Mapping to search for patient with address return the struct 
    
        mapping(address => patientInfo) public patientaddressTossn;


//patient store function
  
    function addPatient(string memory _ssn, address _patientAddress, address _doctorAddress, string memory _meta) public {
        patientInfo memory newPatient;
        newPatient.ssn=_ssn;
        newPatient.account=_patientAddress;
        newPatient.doctor=_doctorAddress;
        newPatient.meta=_meta;

        patients.push(newPatient);
        patientaddressTossn[_patientAddress] = newPatient;
     }

     //patient verify/view function
     function getPatient(address _patientAddress) public view returns (string memory, address, string memory){
        patientInfo memory s = patientaddressTossn[_patientAddress];
        return (s.ssn, s.doctor, s.meta);
    }


//...................................Doctors..........................................//

struct doctorsInfo {
    string ssn;
    address account;
    string meta;
}


   //create an array of doctors  
    doctorsInfo[] internal doctors;

 //Mapping to search for doctors with address return the struct 
    
        mapping(address => doctorsInfo) public doctoraddressTossn;


//doctor store function
  
    function addDoctor(string memory _ssn, address _doctorAddress, string memory _meta) public {
        doctorsInfo memory newDoctor;
        newDoctor.ssn=_ssn;
        newDoctor.account=_doctorAddress;
        newDoctor.meta=_meta;
        doctors.push(newDoctor);
        doctoraddressTossn[_doctorAddress] = newDoctor;
     }

     //doctor verify/view function
     function getDoctor(address _doctorAddress) public view returns (string memory, string memory){
        doctorsInfo memory s = doctoraddressTossn[_doctorAddress];
        return (s.ssn,s.meta);
    }

}