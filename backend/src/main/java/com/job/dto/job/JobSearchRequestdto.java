package com.job.dto.job;

public class JobSearchRequestdto {
	private String location;
	private String skills;
	private Integer minExperience;
	private String salaryRange;
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getSkills() {
		return skills;
	}
	public void setSkills(String skills) {
		this.skills = skills;
	}
	public Integer getMinExperience() {
		return minExperience;
	}
	public void setMinExperience(Integer minExperience) {
		this.minExperience = minExperience;
	}
	public String getSalaryRange() {
		return salaryRange;
	}
	public void setSalaryRange(String salaryRange) {
		this.salaryRange = salaryRange;
	}
	
	
}
