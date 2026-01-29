package com.job.mapper;

import java.util.ArrayList;
import java.util.List;
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
    public static List<JobResponseDto> JobResponseDto(List<JobEntity> jobs) {
        List<JobResponseDto> dtos = new ArrayList<>();
        if (jobs == null) {
            return dtos;
        }

        for (JobEntity job : jobs) {
            dtos.add(JobMapper.JobResponseDto(job));
        }
        return dtos;
    }
}