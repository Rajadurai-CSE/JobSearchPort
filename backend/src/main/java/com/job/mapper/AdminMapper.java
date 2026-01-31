package com.job.mapper;

import java.util.ArrayList;
import java.util.List;

import com.job.dto.admin.DisplayEmployerProfileDto;
import com.job.dto.admin.DisplayReportedJS;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.employer.FlaggedJobSeekers;

public class AdminMapper {

    public static DisplayReportedJS convertEntitytoDto(FlaggedJobSeekers ele) {
        if (ele == null)
            return null;

        String jobSeekerName = ele.getJobSeeker() != null ? ele.getJobSeeker().getName() : "Unknown";
        String jobSeekerEmail = ele.getJobSeeker() != null ? ele.getJobSeeker().getEmail() : "Unknown";
        String employerName = ele.getEmployer() != null ? ele.getEmployer().getName() : "Unknown";

        return new DisplayReportedJS(
                ele.getRequest_id(),
                ele.getJobSeeker() != null ? ele.getJobSeeker().getUserId() : null,
                jobSeekerName,
                jobSeekerEmail,
                ele.getEmployer() != null ? ele.getEmployer().getUserId() : null,
                employerName,
                ele.getReason(),
                ele.getCreatedAt(),
                ele.getAction_taken());
    }

    public static List<DisplayReportedJS> convertEntitytoDtoList(List<FlaggedJobSeekers> objs) {
        if (objs == null)
            return new ArrayList<>();

        List<DisplayReportedJS> listdto = new ArrayList<>();

        for (FlaggedJobSeekers ele : objs) {
            listdto.add(convertEntitytoDto(ele));
        }
        return listdto;
    }

    public static DisplayEmployerProfileDto convertEmployerToDto(EmployerProfile emp) {
        if (emp == null)
            return null;

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

        if (employers == null)
            return dtoList;

        for (EmployerProfile emp : employers) {
            dtoList.add(convertEmployerToDto(emp));
        }

        return dtoList;
    }

}
