package com.job.service;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.job.dto.job.JobResponseDto;
import com.job.dto.job.JobSearchRequestdto;
import com.job.dto.jobseeker.ApplicationDto;
import com.job.dto.jobseeker.BookmarkDto;
import com.job.dto.jobseeker.FlaggedJobStatusDto;
import com.job.dto.jobseeker.JSProfileUpdateRequestDto;
import com.job.dto.jobseeker.JSProfileUpdateResponseDto;
import com.job.entity.job.FlaggedJobs;
import com.job.entity.job.JobApplicationId;
import com.job.entity.job.JobApplications;
import com.job.entity.job.JobEntity;
import com.job.entity.jobseeker.BookMarkedJobs;
import com.job.entity.jobseeker.JobSeekerProfile;
import com.job.enums.ApplicationStage;
import com.job.repository.job.JobApplicationRepo;
import com.job.repository.job.JobEntityRepo;
import com.job.repository.jobseeker.BookMarkedJobsRepo;
import com.job.repository.jobseeker.FlaggedJobsRepo;
import com.job.repository.jobseeker.JobSeekerProfileRepo;
import com.job.mapper.JobMapper;
import com.job.mapper.JobSeekerMapper;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobSeekerService {

    @Autowired
    private FlaggedJobsRepo flaggedJobsRepo;

    @Autowired
    private JobEntityRepo jobEntityRepo;

    @Autowired
    private JobSeekerProfileRepo jobSeekerProfileRepo;

    @Autowired
    private JobApplicationRepo jobApplicationRepo;

    @Autowired
    private BookMarkedJobsRepo bookmarkRepo;

    public JSProfileUpdateResponseDto updateProfile(JSProfileUpdateRequestDto req) {
        JobSeekerProfile profile = jobSeekerProfileRepo.findById(req.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found with id: " + req.getUserId()));

        profile.setCertifications(req.getCertifications());
        profile.setName(req.getName());
        profile.setDob(req.getDob());
        profile.setSkills(req.getSkills());
        profile.setResumeUrl(req.getResumeUrl());
        profile.setCertifications(req.getCertifications());
        profile.setCertificationsUrl(req.getCertificationsUrl());
        profile.setPhoneNo(req.getPhoneNo());
        profile.setLocation(req.getLocation());
        if (req.getExperience() != null) {
            profile.setExperience(req.getExperience());
        }
        jobSeekerProfileRepo.save(profile);
        return JobSeekerMapper.toDto(profile);
    }

    public JSProfileUpdateResponseDto getProfile(Long userId) {
        JobSeekerProfile profile = jobSeekerProfileRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found with id: " + userId));
        return JobSeekerMapper.toDto(profile);
    }

    public JobResponseDto getJobDetails(Long jobId) {
        JobEntity job = jobEntityRepo.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with id: " + jobId));

        return JobMapper.JobResponseDto(job);
    }

    public List<ApplicationDto> getApplications(Long seekerId) {
        JobSeekerProfile profile = jobSeekerProfileRepo.findById(seekerId)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found with id: " + seekerId));
        List<JobApplications> apps = jobApplicationRepo.findByJobSeeker(profile);
        List<ApplicationDto> dtos = new ArrayList<>();
        for (JobApplications app : apps) {
            ApplicationDto dto = new ApplicationDto();
            if (app.getJob() != null) {
                dto.setJobId(app.getJob().getJobId());
                dto.setJobTitle(app.getJob().getTitle());
                dto.setCompanyName(app.getJob().getEmployerProfile() != null &&
                        app.getJob().getEmployerProfile().getCompany() != null
                                ? app.getJob().getEmployerProfile().getCompany().getCompanyName()
                                : null);
            }
            dto.setStage(app.getStage());
            dto.setDescription(app.getDescription());
            dto.setAppliedAt(app.getAppliedAt());
            dto.setUpdatedAt(app.getUpdatedAt());
            dtos.add(dto);
        }
        return dtos;
    }

    public void bookmarkJob(Long seekerId, Long jobId) {
        List<BookMarkedJobs> existing = bookmarkRepo.findByJobSeekerId(seekerId);
        for (BookMarkedJobs b : existing) {
            if (b.getJob() != null && b.getJob().getJobId().equals(jobId)) {
                throw new IllegalStateException("Job already bookmarked");
            }
        }

        JobEntity job = jobEntityRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        BookMarkedJobs bookmark = new BookMarkedJobs();
        bookmark.setJob(job);
        bookmark.setJobSeekerId(seekerId);
        bookmarkRepo.save(bookmark);
    }

    public List<BookmarkDto> getBookmarks(Long seekerId) {
        List<BookMarkedJobs> bookmarks = bookmarkRepo.findByJobSeekerId(seekerId);
        List<BookmarkDto> dtos = new ArrayList<>();
        for (BookMarkedJobs b : bookmarks) {
            BookmarkDto dto = new BookmarkDto();
            dto.setBookmarkId(b.getBookmarkId());
            if (b.getJob() != null) {
                dto.setJobId(b.getJob().getJobId());
                dto.setJobTitle(b.getJob().getTitle());
                dto.setCompanyName(b.getJob().getEmployerProfile() != null &&
                        b.getJob().getEmployerProfile().getCompany() != null
                                ? b.getJob().getEmployerProfile().getCompany().getCompanyName()
                                : null);
                dto.setLocation(b.getJob().getLocation());
                dto.setSalaryRange(b.getJob().getSalaryRange());
            }
            dto.setBookmarkedAt(b.getBookmarkedAt());
            dtos.add(dto);
        }
        return dtos;
    }

    public void removeBookmark(Long bookmarkId) {
        BookMarkedJobs bookmark = bookmarkRepo.findById(bookmarkId)
                .orElseThrow(() -> new RuntimeException("Bookmark not found"));
        bookmarkRepo.delete(bookmark);
    }

    public void flagJob(Long jobId, Long seekerId, String reason) {
        // Check for duplicate flag
        if (flaggedJobsRepo.existsByJobIdAndJobSeeker_UserId(jobId, seekerId)) {
            throw new IllegalStateException("You have already reported this job");
        }

        if (!jobEntityRepo.existsById(jobId)) {
            throw new IllegalArgumentException("Job not found with id: " + jobId);
        }
        JobSeekerProfile p = jobSeekerProfileRepo.findById(seekerId)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found with id: " + seekerId));
        FlaggedJobs flag = new FlaggedJobs();
        flag.setJobId(jobId);
        flag.setJobSeeker(p);
        flag.setReason(reason);
        flaggedJobsRepo.save(flag);
    }

    public List<FlaggedJobStatusDto> getFlaggedJobStatus(Long seekerId) {
        List<FlaggedJobs> flags = flaggedJobsRepo.findByJobSeeker_UserId(seekerId);
        List<FlaggedJobStatusDto> dtos = new ArrayList<>();
        for (FlaggedJobs f : flags) {
            FlaggedJobStatusDto dto = new FlaggedJobStatusDto();
            dto.setRequestId(f.getRequestId());
            dto.setJobId(f.getJobId());
            dto.setReason(f.getReason());
            dto.setAppliedAt(f.getAppliedAt());
            dto.setStatus(
                    FlaggedJobStatusDto.Status.valueOf(
                            f.getStatus().name()));
            dtos.add(dto);
        }
        return dtos;
    }

    public void withdrawApplication(Long jobId, Long seekerId) {
        JobApplicationId id = new JobApplicationId();
        id.setJobId(jobId);
        id.setJobSeekerId(seekerId);

        JobApplications app = jobApplicationRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Application not found for jobId: " + jobId + ", seekerId: " + seekerId));
        app.setStage(ApplicationStage.WITHDRAWN);
        app.setUpdatedAt(LocalDate.now());
        jobApplicationRepo.save(app);
    }

    public List<JobResponseDto> getAllJobs() {
        List<JobEntity> jobs = jobEntityRepo.findByDeletedFalse();
        List<JobResponseDto> out = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (JobEntity j : jobs) {
            // Only include jobs where deadline is null or >= today
            if (j.getDeadline() == null || !j.getDeadline().isBefore(today)) {
                out.add(JobMapper.JobResponseDto(j));
            }
        }
        return out;
    }

    public List<JobResponseDto> searchJobs(JobSearchRequestdto req) {
        List<JobEntity> allJobs = jobEntityRepo.findByDeletedFalse();
        LocalDate today = LocalDate.now();

        return allJobs.stream()
                .filter(job -> {
                    // Filter out expired jobs first
                    if (job.getDeadline() != null && job.getDeadline().isBefore(today)) {
                        return false;
                    }

                    // Filter by title
                    if (req.getTitle() != null && !req.getTitle().isEmpty()) {
                        if (job.getTitle() == null ||
                                !job.getTitle().toLowerCase().contains(req.getTitle().toLowerCase())) {
                            return false;
                        }
                    }

                    // Filter by location
                    if (req.getLocation() != null && !req.getLocation().isEmpty()) {
                        if (job.getLocation() == null ||
                                !job.getLocation().toLowerCase().contains(req.getLocation().toLowerCase())) {
                            return false;
                        }
                    }

                    // Filter by skills
                    if (req.getSkills() != null && !req.getSkills().isEmpty()) {
                        if (job.getRequiredSkills() == null) {
                            return false;
                        }
                        String[] searchSkills = req.getSkills().toLowerCase().split(",");
                        String[] jobSkills = job.getRequiredSkills().toLowerCase().split(",");
                        boolean hasMatchingSkill = false;
                        // for (String skill : searchSkills) {
                        // if (jobSkills.contains(skill.trim())) {
                        // hasMatchingSkill = true;
                        // break;
                        // }
                        // }
                        for (String skill : searchSkills) {
                            for (String jobreqskill : jobSkills) {
                                if (jobreqskill.contains(skill.trim())) {
                                    hasMatchingSkill = true;
                                    break;
                                }
                            }
                        }
                        if (!hasMatchingSkill)
                            return false;
                    }

                    // Filter by minimum experience
                    // Only apply filter if minExperience is provided
                    // Job passes if its required experience <= user's experience
                    if (req.getMinExperience() != null) {
                        int userExp = req.getMinExperience();
                        int jobExp = job.getMinExperience(); // primitive int, defaults to 0
                        if (jobExp > userExp) {
                            return false;
                        }
                    }

                    return true;
                })
                .map(JobMapper::JobResponseDto)
                .collect(Collectors.toList());
    }

    public void applyForJob(Long jobId, Long jobseekerId, String resumeUrl) {
        JobEntity job = jobEntityRepo.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with id: " + jobId));
        JobSeekerProfile seeker = jobSeekerProfileRepo.findById(jobseekerId)
                .orElseThrow(() -> new IllegalArgumentException("JobSeeker not found with id: " + jobseekerId));

        JobApplicationId id = new JobApplicationId();
        id.setJobId(jobId);
        id.setJobSeekerId(jobseekerId);

        JobApplications application = jobApplicationRepo.findById(id).orElse(null);
        if (application == null) {
            application = new JobApplications();
            application.setId(id);
            application.setJob(job);
            application.setJobSeeker(seeker);
            application.setAppliedAt(LocalDate.now());
        } else {
            if (application.getStage() != ApplicationStage.WITHDRAWN) {
                throw new IllegalStateException("You have already applied for this job");
            }
        }
        application.setStage(ApplicationStage.APPLIED);
        application.setUpdatedAt(LocalDate.now());
        application.setResumeUrl(resumeUrl);
        jobApplicationRepo.save(application);
    }

    public List<com.job.dto.jobseeker.FlaggedJobDto> getMyFlaggedJobs(Long userId) {
        List<FlaggedJobs> flags = flaggedJobsRepo.findByJobSeeker_UserId(userId);
        return flags.stream().map(flag -> {
            com.job.dto.jobseeker.FlaggedJobDto dto = new com.job.dto.jobseeker.FlaggedJobDto();
            dto.setRequestId(flag.getRequestId());
            dto.setJobId(flag.getJobId());
            dto.setReason(flag.getReason());
            dto.setStatus(flag.getStatus().name());
            dto.setFlaggedAt(flag.getAppliedAt());
            // Get job title if job exists
            jobEntityRepo.findById(flag.getJobId()).ifPresent(job -> dto.setJobTitle(job.getTitle()));
            return dto;
        }).collect(Collectors.toList());
    }
}