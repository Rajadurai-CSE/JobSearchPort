package com.job.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.job.dto.Admin.DisplayEmployerProfileDto;
import com.job.dto.Admin.DisplayReportedJS;
import com.job.dto.Admin.FlaggedJobDto;
import com.job.dto.Admin.SystemStatisticsDto;
import com.job.dto.Admin.UserDto;
import com.job.service.AdminService;

@RestController
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;

	// System Statistics
	@GetMapping("/statistics")
	public ResponseEntity<SystemStatisticsDto> getStatistics() {
		return ResponseEntity.ok(adminService.getSystemStatistics());
	}

	// All Users
	@GetMapping("/users")
	public ResponseEntity<List<UserDto>> getAllUsers() {
		return ResponseEntity.ok(adminService.getAllUsers());
	}

	// Flagged Job Seekers
	@GetMapping("/flagged-jobseekers")
	public ResponseEntity<List<DisplayReportedJS>> getFlaggedJobSeekers() {
		return ResponseEntity.ok(adminService.getService());
	}

	@PutMapping("/flagged-jobseeker/{id}/action")
	public ResponseEntity<DisplayReportedJS> updateFlaggedJobSeeker(
			@PathVariable("id") Long requestId,
			@RequestBody String action) {
		DisplayReportedJS saved = adminService.updateReportedJobSeeker(requestId, action);
		return new ResponseEntity<>(saved, HttpStatus.OK);
	}

	// Flagged Jobs
	@GetMapping("/flagged-jobs")
	public ResponseEntity<List<FlaggedJobDto>> getFlaggedJobs() {
		return ResponseEntity.ok(adminService.getFlaggedJobs());
	}

	@PutMapping("/flagged-job/{id}/action")
	public ResponseEntity<FlaggedJobDto> updateFlaggedJob(
			@PathVariable("id") Long requestId,
			@RequestBody String actionTaken) {
		return ResponseEntity.ok(adminService.updateFlaggedJob(requestId, actionTaken));
	}

	// Employers
	@GetMapping("/employers")
	public ResponseEntity<List<DisplayEmployerProfileDto>> getAllEmployers() {
		return ResponseEntity.ok(adminService.getAllEmployers());
	}

	@PutMapping("/employers/{id}/approve")
	public ResponseEntity<String> approveEmployer(@PathVariable Long id) {
		return ResponseEntity.ok(adminService.approveEmployer(id));
	}

	@PutMapping("/employers/{id}/deny")
	public ResponseEntity<String> denyEmployer(@PathVariable Long id) {
		return ResponseEntity.ok(adminService.denyEmployer(id));
	}

	@PutMapping("/users/{id}/revoke")
	public ResponseEntity<String> revokeUser(@PathVariable Long id) {
		return ResponseEntity.ok(adminService.revokeUser(id));
	}

	// Revoked Users
	@GetMapping("/revoked-users")
	public ResponseEntity<List<UserDto>> getRevokedUsers() {
		return ResponseEntity.ok(adminService.getRevokedUsers());
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {
		return ResponseEntity.ok(adminService.deleteRevokedUser(id));
	}
}
