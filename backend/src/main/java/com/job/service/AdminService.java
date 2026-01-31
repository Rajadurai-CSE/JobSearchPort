package com.job.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.job.dto.admin.DisplayEmployerProfileDto;
import com.job.dto.admin.DisplayReportedJS;
import com.job.dto.admin.FlaggedJobDto;
import com.job.dto.admin.SystemStatisticsDto;
import com.job.dto.admin.UserDto;
import com.job.entity.employer.EmployerProfile;
import com.job.entity.employer.FlaggedJobSeekers;
import com.job.entity.job.FlaggedJobs;
import com.job.entity.job.JobApplications;
import com.job.entity.job.JobEntity;
import com.job.entity.jobseeker.JobSeekerProfile;
import com.job.entity.registerentity.UserAuth;
import com.job.enums.Approval_Status;
import com.job.enums.Role;
import com.job.exceptions.InvalidEmployerOperationException;
import com.job.exceptions.UserNotFoundException;
import com.job.mapper.AdminMapper;
import com.job.repository.UserAuthRepository;
import com.job.repository.employer.EmployerProfileRepo;
import com.job.repository.job.FlaggedJobSeekersRepo;
import com.job.repository.job.JobApplicationRepo;
import com.job.repository.job.JobEntityRepo;
import com.job.repository.jobseeker.FlaggedJobsRepo;
import com.job.repository.jobseeker.JobSeekerProfileRepo;
import jakarta.transaction.Transactional;

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

	public List<DisplayReportedJS> getService() {
		List<FlaggedJobSeekers> users = flagJobSeekersRepo.findAll();
		return AdminMapper.convertEntitytoDtoList(users);
	}

	public DisplayReportedJS updateReportedJobSeeker(Long requestId, String action_taken) {
		FlaggedJobSeekers f = flagJobSeekersRepo.findById(requestId)
				.orElseThrow(() -> new RuntimeException("Request not found with id: " + requestId));
		f.setAction_taken(action_taken);
		FlaggedJobSeekers saved = flagJobSeekersRepo.save(f);
		return AdminMapper.convertEntitytoDto(saved);
	}

	public List<DisplayEmployerProfileDto> getAllEmployers() {
		List<EmployerProfile> employers = employerProfileRepo.findAll();
		return AdminMapper.convertEmployerToDtoList(employers);
	}

	public void ignoreFlag(Long flagId) {

		FlaggedJobs flag = flaggedJobsRepo.findById(flagId)
				.orElseThrow(() -> new RuntimeException("Flag not found with id: " + flagId));

		flag.setStatus(FlaggedJobs.Status.IGNORED);
		flaggedJobsRepo.save(flag);
	}

	@Transactional
	public void deleteJobUsingFlagId(Long flagId) {
		FlaggedJobs flag = flaggedJobsRepo.findById(flagId)
				.orElseThrow(() -> new RuntimeException("Flag not found with id: " + flagId));

		Long jobId = flag.getJobId();

		if (jobId == null) {
			throw new RuntimeException("No jobId associated with this flag");
		}

		List<FlaggedJobs> allFlags = flaggedJobsRepo.findByJobId(jobId);
		for (FlaggedJobs f : allFlags) {
			f.setStatus(FlaggedJobs.Status.DELETED);
		}

		flaggedJobsRepo.saveAll(allFlags);

		if (!jobEntityRepo.existsById(jobId)) {
			throw new RuntimeException("Job not found with id: " + jobId);
		}

		// Soft delete - mark as deleted instead of removing
		JobEntity job = jobEntityRepo.findById(jobId).get();

		// Mark all applications as JOB_DELETED
		List<JobApplications> applications = jobApplicationRepo.findByJob_JobId(jobId);
		for (JobApplications app : applications) {
			app.setStage(com.job.enums.ApplicationStage.JOB_DELETED);
			app.setDescription("Job was deleted by admin");
			jobApplicationRepo.save(app);
		}

		job.setDeleted(true);
		jobEntityRepo.save(job);
	}

	public String approveEmployer(Long userId) {
		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("Employer not found"));

		if (user.getRole() != Role.EMPLOYER) {
			throw new InvalidEmployerOperationException("User is not an employer");
		}

		user.setStatus(Approval_Status.APPROVED);
		userAuthRepository.save(user);
		return "Employer approved successfully";
	}

	public String denyEmployer(Long userId) {
		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("Employer not found"));

		if (user.getRole() != Role.EMPLOYER) {
			throw new InvalidEmployerOperationException("User is not an employer");
		}

		user.setStatus(Approval_Status.DENIED);
		userAuthRepository.save(user);
		return "Employer denied successfully";
	}

	@Transactional
	public String revokeUser(Long userId) {

		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setStatus(Approval_Status.REVOKED);
		userAuthRepository.save(user); // Only update status, keep profile

		return "User revoked successfully";
	}

	public List<UserDto> getAllUsers() {
		List<UserAuth> users = userAuthRepository.findAll();
		List<UserDto> dtos = new ArrayList<>();

		for (UserAuth user : users) {
			UserDto dto = new UserDto();
			dto.setUserId(user.getUserid());
			dto.setEmail(user.getEmail());
			dto.setRole(user.getRole());
			dto.setStatus(user.getStatus());
			if (user.getRole() == Role.JOB_SEEKER && user.getJobseeker() != null) {
				dto.setName(user.getJobseeker().getName());
			} else if (user.getRole() == Role.EMPLOYER && user.getEmployerProfile() != null) {
				dto.setName(user.getEmployerProfile().getName());
			} else {
				dto.setName("Admin");
			}

			dtos.add(dto);
		}

		return dtos;
	}

	public List<FlaggedJobDto> getFlaggedJobs() {

		List<FlaggedJobs> flaggedJobs = flaggedJobsRepo.findAll();
		List<FlaggedJobDto> dtos = new ArrayList<>();

		for (FlaggedJobs flag : flaggedJobs) {
			FlaggedJobDto dto = new FlaggedJobDto();
			dto.setRequestId(flag.getRequestId());
			dto.setJobId(flag.getJobId());
			dto.setJobSeekerId(
					flag.getJobSeeker() != null
							? flag.getJobSeeker().getUserId()
							: null);
			dto.setReason(flag.getReason());
			dto.setAppliedAt(flag.getAppliedAt());
			dto.setStatus(FlaggedJobDto.Status.valueOf(flag.getStatus().name()));
			dtos.add(dto);
		}

		return dtos;
	}

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

	public String deleteRevokedUser(Long userId) {
		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (user.getStatus() != Approval_Status.REVOKED) {
			throw new RuntimeException("Can only delete users with REVOKED status");
		}

		userAuthRepository.delete(user);
		return "User deleted successfully";
	}

	@Transactional
	public String reinstateUser(Long userId) {
		UserAuth user = userAuthRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));

		if (user.getStatus() != Approval_Status.REVOKED) {
			throw new RuntimeException("Can only reinstate users with REVOKED status");
		}

		// Set status back to APPROVED
		user.setStatus(Approval_Status.APPROVED);

		// Check if profile exists, if not create new (for legacy revoked users)
		if (user.getRole() == Role.EMPLOYER) {
			if (user.getEmployerProfile() == null) {
				EmployerProfile profile = new EmployerProfile();
				profile.setName("");
				profile.setEmail(user.getEmail());
				profile.setUserId(user.getUserid());
				profile.setUserAuth(user);
				user.setEmployerProfile(profile);
			}
		} else if (user.getRole() == Role.JOB_SEEKER) {
			if (user.getJobseeker() == null) {
				JobSeekerProfile profile = new JobSeekerProfile();
				profile.setName("");
				profile.setEmail(user.getEmail());
				profile.setUserId(user.getUserid());
				profile.setUserAuth(user);
				user.setJobseeker(profile);
			}
		}

		userAuthRepository.save(user);
		return "User reinstated successfully. User must complete their profile.";
	}

	public SystemStatisticsDto getSystemStatistics() {
		SystemStatisticsDto stats = new SystemStatisticsDto();

		stats.setTotalJobSeekers(jobSeekerProfileRepo.count());
		stats.setTotalEmployers(employerProfileRepo.count());
		// Only count NON-deleted jobs
		stats.setTotalJobs(jobEntityRepo.findByDeletedFalse().size());
		stats.setTotalApplications(jobApplicationRepo.count());

		List<UserAuth> users = userAuthRepository.findAll();
		stats.setPendingEmployers(users.stream()
				.filter(u -> u.getStatus() == Approval_Status.PENDING && u.getRole() == Role.EMPLOYER).count());
		stats.setRevokedUsers(users.stream().filter(u -> u.getStatus() == Approval_Status.REVOKED).count());
		stats.setFlaggedJobSeekers(flagJobSeekersRepo.count());
		stats.setFlaggedJobs(flaggedJobsRepo.count());

		return stats;
	}
}