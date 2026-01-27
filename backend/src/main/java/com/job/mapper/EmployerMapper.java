package com.job.mapper;

import com.job.dto.employer.CompanyDto;
import com.job.dto.employer.EmployerDto;
import com.job.entity.employer.EmployerProfile;

public class EmployerMapper{

    
    public static EmployerDto toEmployerDto(EmployerProfile e) {
        EmployerDto dto = new EmployerDto();
        // Prefer the 4-digit id from UserAuth when not present on Employer
        Long uid = (e.getUserId() != null) ? e.getUserId()
                : (e.getUserAuth() != null ? e.getUserAuth().getUserid() : null);
        dto.setUserId(uid);
        dto.setName(e.getName());
        dto.setEmail(e.getEmail());
        dto.setContactNo(e.getContactNo());
        dto.setEmployerVerificationUrl(e.getEmployerVerificationUrl());


        if (e.getCompany() != null) {
                    dto.setCompanyId(e.getCompany().getCompanyId());
            CompanyDto c = new CompanyDto();

            c.setCompanyName(e.getCompany().getCompanyName());
            c.setCompanyURL(e.getCompany().getCompanyURL());
            c.setCompanyDescription(e.getCompany().getCompanyDescription());
            dto.setCompanyId(e.getCompany().getCompanyId());
            dto.setCompany(c);
        }
        return dto;
    }
    }