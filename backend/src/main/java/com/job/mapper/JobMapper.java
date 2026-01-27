package com.job.mapper;

import com.job.dto.job.JobResponseDto;
import com.job.entity.job.JobEntity;

public class JobMapper {
 
    public static JobResponseDto JobResponseDto(JobEntity j) {
        JobResponseDto dto = new JobResponseDto();
        dto.setJobId(j.getJobId());
        dto.setUserId(j.getEmployerProfile().getUserId());
        dto.setTitle(j.getTitle());
        dto.setDescription(j.getDescription());
        dto.setLocation(j.getLocation());
        dto.setRequiredSkills(j.getRequiredSkills());
        dto.setSalaryRange(j.getSalaryRange());
        dto.setNoOfVacancies(j.getVacancies());
        dto.setMinimumExperience(j.getMinExperience());
        dto.setEmploymentType(j.getEmploymentType());
        dto.setCreatedAt(j.getCreatedAt());
        dto.setApplicationDeadline(j.getDeadline());
        return dto;
    } 
}
