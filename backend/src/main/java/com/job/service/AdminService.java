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
		jobEntityRepo.deleteById(jobId);
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

	    if (user.getRole() == Role.EMPLOYER) {
	        EmployerProfile employer = user.getEmployerProfile();
	        if (employer != null) {
	            employerProfileRepo.delete(employer);
	            user.setEmployerProfile(null);
	        }

	    } else if (user.getRole() == Role.JOB_SEEKER) {
	        JobSeekerProfile seeker = user.getJobseeker();
	        if (seeker != null) {
	            jobSeekerProfileRepo.delete(seeker);
	            user.setJobseeker(null);
	        }
	    }
	    userAuthRepository.save(user);
	    return "User revoked and profile deleted";
	}

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
			} else{
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
                        : null
        );
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
}