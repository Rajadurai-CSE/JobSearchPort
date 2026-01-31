package com.job.mapper;

import com.job.dto.jobseeker.JSProfileUpdateRequestDto;
import com.job.dto.jobseeker.JSProfileUpdateResponseDto;
import com.job.entity.jobseeker.JobSeekerProfile;

public class JobSeekerMapper {

  // public static JobSeekerProfile toEntity(JobSeekerProfile
  // profile,JSProfileUpdateRequestDto req){
  // profile.setCertifications(req.getCertifications());
  // profile.setName(req.getName());
  // profile.setDob(req.getDob());
  // profile.setSkills(req.getSkills());
  // profile.setResumeUrl(req.getResumeUrl());
  // profile.setCertifications(req.getCertifications());
  // profile.setCertificationsUrl(req.getCertificationsUrl());
  // profile.setPhoneNo(req.getPhoneNo());
  // profile.setLocation(req.getLocation());
  // return profile;
  // }

  public static JSProfileUpdateResponseDto toDto(JobSeekerProfile req) {
    JSProfileUpdateResponseDto profile = new JSProfileUpdateResponseDto();
    profile.setUserId(req.getUserId());
    profile.setName(req.getName());
    profile.setDob(req.getDob());
    profile.setSkills(req.getSkills());
    profile.setResumeUrl(req.getResumeUrl());
    profile.setCertifications(req.getCertifications());
    profile.setCertificationsUrl(req.getCertificationsUrl());
    profile.setPhoneNo(req.getPhoneNo());
    profile.setLocation(req.getLocation());
    profile.setEmail(req.getEmail());
    profile.setExperience(req.getExperience());

    return profile;
  }

}
