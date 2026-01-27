package com.job.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.job.dto.Admin.DisplayEmployerProfileDto;
import com.job.dto.Admin.DisplayReportedJS;
import com.job.dto.Admin.FlaggedJobDto;
import com.job.dto.Admin.SystemStatisticsDto;
import com.job.dto.Admin.UserDto;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.employer.FlaggedJobSeekers;
import com.job.entity.job.FlaggedJobs;
import com.job.entity.registerentity.UserAuth;
import com.job.enums.Approval_Status;
import com.job.enums.Role;
import com.job.mapper.AdminMapper;
import com.job.repository.UserAuthRepository;
import com.job.repository.employer.EmployerProfileRepo;
import com.job.repository.job.FlaggedJobSeekersRepo;
import com.job.repository.job.JobApplicationRepo;
import com.job.repository.job.JobEntityRepo;
import com.job.repository.jobseeker.FlaggedJobsRepo;
import com.job.repository.jobseeker.JobSeekerProfileRepo;

@Service
public class AdminService {

	@Autowired
	private UserAuthRepository userAuthRepository;

	@Autowired
	private FlaggedJobSeekersRepo flagJobSeekersRepo;

	@Autowired
	private EmployerProfileRepo employerProfileRepo;

	@Autowired
	private JobSeekerProfileRepo jobSeekerProfileRepo;

	@Autowired
	private JobEntityRepo jobEntityRepo;

	@Autowired
	private JobApplicationRepo jobApplicationRepo;

	@Autowired
	private FlaggedJobsRepo flaggedJobsRepo;

	// Get all flagged job seekers
	public List<DisplayReportedJS> getService() {
		List<FlaggedJobSeekers> users = flagJobSeekersRepo.findAll();
		return AdminMapper.convertEntitytoDtoList(users);
	}

	// Update action on flagged job seeker
	public DisplayReportedJS updateReportedJobSeeker(Long requestId, String action_taken) {
		FlaggedJobSeekers f = flagJobSeekersRepo.findById(requestId)
				.orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
		f.setAction_taken(action_taken);
		FlaggedJobSeekers saved = flagJobSeekersRepo.save(f);
		return AdminMapper.convertEntitytoDto(saved);
	}

	// Get all employers for approval
	public List<DisplayEmployerProfileDto> getAllEmployers() {
		List<EmployerProfile> employers = employerProfileRepo.findAll();
		return AdminMapper.convertEmployerToDtoList(employers);
	}

	// Approve employer
	public String approveEmployer(Long userId) {
		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("Employer not found"));

		if (user.getRole() != Role.EMPLOYER) {
			throw new RuntimeException("User is not an employer");
		}

		user.setStatus(Approval_Status.APPROVED);
		userAuthRepository.save(user);
		return "Employer approved successfully";
	}

	// Deny employer
	public String denyEmployer(Long userId) {
		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("Employer not found"));

		if (user.getRole() != Role.EMPLOYER) {
			throw new RuntimeException("User is not an employer");
		}

		user.setStatus(Approval_Status.DENIED);
		userAuthRepository.save(user);
		return "Employer denied successfully";
	}

	// Revoke user access
	public String revokeUser(Long userId) {
		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setStatus(Approval_Status.REVOKED);
		userAuthRepository.save(user);
		return "User access revoked successfully";
	}

	// Get system statistics
	public SystemStatisticsDto getSystemStatistics() {
		SystemStatisticsDto stats = new SystemStatisticsDto();

		List<UserAuth> allUsers = userAuthRepository.findAll();

		long jobSeekers = allUsers.stream()
				.filter(u -> u.getRole() == Role.JOB_SEEKER)
				.count();

		long employers = allUsers.stream()
				.filter(u -> u.getRole() == Role.EMPLOYER)
				.count();

		long pendingEmployers = allUsers.stream()
				.filter(u -> u.getRole() == Role.EMPLOYER && u.getStatus() == Approval_Status.PENDING)
				.count();

		long revokedUsers = allUsers.stream()
				.filter(u -> u.getStatus() == Approval_Status.REVOKED)
				.count();

		stats.setTotalJobSeekers(jobSeekers);
		stats.setTotalEmployers(employers);
		stats.setTotalJobs(jobEntityRepo.count());
		stats.setTotalApplications(jobApplicationRepo.count());
		stats.setPendingEmployers(pendingEmployers);
		stats.setFlaggedJobSeekers(flagJobSeekersRepo.count());
		stats.setFlaggedJobs(flaggedJobsRepo.count());
		stats.setRevokedUsers(revokedUsers);

		return stats;
	}

	// Get all users
	public List<UserDto> getAllUsers() {
		List<UserAuth> users = userAuthRepository.findAll();
		List<UserDto> dtos = new ArrayList<>();

		for (UserAuth user : users) {
			UserDto dto = new UserDto();
			dto.setUserId(user.getUserid());
			dto.setEmail(user.getEmail());
			dto.setRole(user.getRole());
			dto.setStatus(user.getStatus());

			// Get name from profile if available
			if (user.getRole() == Role.JOB_SEEKER && user.getJobseeker() != null) {
				dto.setName(user.getJobseeker().getName());
			} else if (user.getRole() == Role.EMPLOYER && user.getEmployerProfile() != null) {
				dto.setName(user.getEmployerProfile().getName());
			}

			dtos.add(dto);
		}

		return dtos;
	}

	// Get all flagged jobs
	public List<FlaggedJobDto> getFlaggedJobs() {
		List<FlaggedJobs> flaggedJobs = flaggedJobsRepo.findAll();
		List<FlaggedJobDto> dtos = new ArrayList<>();

		for (FlaggedJobs flag : flaggedJobs) {
			FlaggedJobDto dto = new FlaggedJobDto();
			dto.setRequestId(flag.getRequestId());
			dto.setJobId(flag.getJob() != null ? flag.getJob().getJobId() : null);
			dto.setJobSeekerId(flag.getJobSeeker() != null ? flag.getJobSeeker().getUserId() : null);
			dto.setReason(flag.getReason());
			dto.setAppliedAt(flag.getAppliedAt());
			dtos.add(dto);
		}

		return dtos;
	}

	// Update action on flagged job
	public FlaggedJobDto updateFlaggedJob(Long requestId, String actionTaken) {
		FlaggedJobs flag = flaggedJobsRepo.findById(requestId)
				.orElseThrow(() -> new RuntimeException("Flagged job not found with id: " + requestId));

		// If action is to revoke, update the employer status
		if ("REVOKE_EMPLOYER".equals(actionTaken) && flag.getJob() != null) {
			EmployerProfile employer = flag.getJob().getEmployerProfile();
			if (employer != null && employer.getUserAuth() != null) {
				employer.getUserAuth().setStatus(Approval_Status.REVOKED);
				userAuthRepository.save(employer.getUserAuth());
			}
		}

		FlaggedJobDto dto = new FlaggedJobDto();
		dto.setRequestId(flag.getRequestId());
		dto.setJobId(flag.getJob() != null ? flag.getJob().getJobId() : null);
		dto.setJobSeekerId(flag.getJobSeeker() != null ? flag.getJobSeeker().getUserId() : null);
		dto.setReason(flag.getReason());
		dto.setAppliedAt(flag.getAppliedAt());
		dto.setActionTaken(actionTaken);

		return dto;
	}

	// Get revoked users
	public List<UserDto> getRevokedUsers() {
		List<UserAuth> users = userAuthRepository.findAll();
		List<UserDto> dtos = new ArrayList<>();

		for (UserAuth user : users) {
			if (user.getStatus() == Approval_Status.REVOKED) {
				UserDto dto = new UserDto();
				dto.setUserId(user.getUserid());
				dto.setEmail(user.getEmail());
				dto.setRole(user.getRole());
				dto.setStatus(user.getStatus());
				dtos.add(dto);
			}
		}

		return dtos;
	}

	// Delete revoked user
	public String deleteRevokedUser(Long userId) {
		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (user.getStatus() != Approval_Status.REVOKED) {
			throw new RuntimeException("Can only delete users with REVOKED status");
		}

		userAuthRepository.delete(user);
		return "User deleted successfully";
	}
}
