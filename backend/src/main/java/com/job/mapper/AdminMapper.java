package com.job.mapper;

import java.util.ArrayList;
import java.util.List;

import com.job.dto.admin.DisplayEmployerProfileDto;
import com.job.dto.admin.DisplayReportedJS;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.employer.FlaggedJobSeekers;

public class AdminMapper {
  
  public static DisplayReportedJS convertEntitytoDto(FlaggedJobSeekers ele) {
    if (ele == null) return null;

    return new DisplayReportedJS(
        ele.getRequest_id(),
        ele.getJobSeeker().getUserId(),
        ele.getEmployer().getUserId(),
        ele.getReason(),
        ele.getCreatedAt(),
        ele.getAction_taken()
    );
}

    public static List<DisplayReportedJS> convertEntitytoDtoList(List<FlaggedJobSeekers> objs){
    // if(dto == null) return null;

    List<DisplayReportedJS> listdto = new ArrayList<>();

    for(FlaggedJobSeekers ele:objs){
      listdto.add(new DisplayReportedJS(ele.getRequest_id(), ele.getJobSeeker().getUserId(), ele.getEmployer().getUserId(), ele.getReason(), ele.getCreatedAt(), ele.getAction_taken()));
    }
    return listdto;
  }

    public static DisplayEmployerProfileDto convertEmployerToDto(EmployerProfile emp) {
        if (emp == null) return null;

        DisplayEmployerProfileDto dto = new DisplayEmployerProfileDto();

        dto.setUserId(emp.getUserId());
        dto.setEmail(emp.getEmail());
        dto.setName(emp.getName());
        dto.setContactNo(emp.getContactNo());
        dto.setEmployerVerificationUrl(emp.getEmployerVerificationUrl());

        // Approval status comes from UserAuth
        if (emp.getUserAuth() != null) {
            dto.setStatus(emp.getUserAuth().getStatus());
        }

        // Company mapping
        if (emp.getCompany() != null) {
            dto.setCompany(emp.getCompany());
        }

        return dto;
    }
        public static List<DisplayEmployerProfileDto> convertEmployerToDtoList(
            List<EmployerProfile> employers) {

        List<DisplayEmployerProfileDto> dtoList = new ArrayList<>();

        if (employers == null) return dtoList;

        for (EmployerProfile emp : employers) {
            dtoList.add(convertEmployerToDto(emp));
        }

        return dtoList;
    }

}
