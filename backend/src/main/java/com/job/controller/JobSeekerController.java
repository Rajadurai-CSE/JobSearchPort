package com.job.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.job.dto.job.JobResponseDto;
import com.job.dto.job.JobSearchRequestdto;
import com.job.dto.jobseeker.ApplicationDto;
import com.job.dto.jobseeker.BookmarkDto;
import com.job.dto.jobseeker.FlaggedJobStatusDto;
import com.job.dto.jobseeker.JSProfileUpdateRequestDto;
import com.job.dto.jobseeker.JSProfileUpdateResponseDto;
import com.job.service.JobSeekerService;

@RestController
@RequestMapping("/jobseeker")
public class JobSeekerController {

	@Autowired
	private JobSeekerService service;

	// Profile endpoints
	@GetMapping("/profile/{userId}")
	public ResponseEntity<JSProfileUpdateResponseDto> getProfile(@PathVariable Long userId) {
		return ResponseEntity.ok(service.getProfile(userId));
	}

	@PutMapping("/update_profile")
	public ResponseEntity<JSProfileUpdateResponseDto> updateProfile(@RequestBody JSProfileUpdateRequestDto req) {
		JSProfileUpdateResponseDto res = service.updateProfile(req);
		return new ResponseEntity<>(res, HttpStatus.OK);
	}

	// Job viewing endpoints
	@GetMapping("/jobs")
	public ResponseEntity<List<JobResponseDto>> viewAllJobs() {
		return new ResponseEntity<>(service.getAllJobs(), HttpStatus.OK);
	}

	@GetMapping("/jobs/{jobId}")
	public ResponseEntity<JobResponseDto> viewJob(@PathVariable Long jobId) {
		return ResponseEntity.ok(service.getJobDetails(jobId));
	}

	// Job search
	@PostMapping("/jobs/search")
	public ResponseEntity<List<JobResponseDto>> searchJobs(@RequestBody JobSearchRequestdto request) {
		return ResponseEntity.ok(service.searchJobs(request));
	}

	// Applications
	@PostMapping("/apply/{seekerId}/{jobId}")
	public ResponseEntity<String> applyForJob(@PathVariable Long jobId, @PathVariable Long seekerId) {
		service.applyForJob(jobId, seekerId);
		return new ResponseEntity<>("Applied successfully", HttpStatus.CREATED);
	}

	@GetMapping("/applications/{seekerId}")
	public ResponseEntity<List<ApplicationDto>> viewMyApplications(@PathVariable Long seekerId) {
		return ResponseEntity.ok(service.getApplications(seekerId));
	}

	@PutMapping("/{jobId}/withdraw/{seekerId}")
	public ResponseEntity<String> withdraw(@PathVariable Long jobId, @PathVariable Long seekerId) {
		service.withdrawApplication(jobId, seekerId);
		return ResponseEntity.ok("Application withdrawn successfully");
	}

	// Bookmarks
	@PostMapping("/bookmark/{seekerId}/{jobId}")
	public ResponseEntity<String> addBookmark(@PathVariable Long seekerId, @PathVariable Long jobId) {
		service.bookmarkJob(seekerId, jobId);
		return ResponseEntity.ok("Job bookmarked successfully!");
	}

	@GetMapping("/bookmarks/{seekerId}")
	public ResponseEntity<List<BookmarkDto>> getBookmarks(@PathVariable Long seekerId) {
		return ResponseEntity.ok(service.getBookmarks(seekerId));
	}

	@DeleteMapping("/bookmark/{bookmarkId}")
	public ResponseEntity<String> removeBookmark(@PathVariable Long bookmarkId) {
		service.removeBookmark(bookmarkId);
		return ResponseEntity.ok("Bookmark removed successfully");
	}

	// Flag job
	@PostMapping("/flag-job")
	public ResponseEntity<String> flagJob(
			@RequestParam Long jobId,
			@RequestParam Long seekerId,
			@RequestParam String reason) {
		service.flagJob(jobId, seekerId, reason);
		return ResponseEntity.ok("Job flagged successfully");
	}

	@GetMapping("/flag-status/{seekerId}")
	public ResponseEntity<List<FlaggedJobStatusDto>> getFlaggedJobStatus(@PathVariable Long seekerId) {
		return ResponseEntity.ok(service.getFlaggedJobStatus(seekerId));
	}
}
