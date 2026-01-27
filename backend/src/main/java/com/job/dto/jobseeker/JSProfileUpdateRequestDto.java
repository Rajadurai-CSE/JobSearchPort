package com.job.dto.jobseeker;

public class JSProfileUpdateRequestDto {
  	private Long userId;
	private String name;
	private String dob;
	private String location;
	private String phoneNo;
	private String skills;
	private int experience;
	private String resumeUrl;
	private String certifications;
	private String certificationsUrl;
  

    /**
     * @return String return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return String return the dob
     */
    public String getDob() {
        return dob;
    }

    /**
     * @param dob the dob to set
     */
    public void setDob(String dob) {
        this.dob = dob;
    }

    /**
     * @return String return the location
     */
    public String getLocation() {
        return location;
    }

    /**
     * @param location the location to set
     */
    public void setLocation(String location) {
        this.location = location;
    }

    /**
     * @return String return the phoneNo
     */
    public String getPhoneNo() {
        return phoneNo;
    }

    /**
     * @param phoneNo the phoneNo to set
     */
    public void setPhoneNo(String phoneNo) {
        this.phoneNo = phoneNo;
    }

    /**
     * @return String return the skills
     */
    public String getSkills() {
        return skills;
    }

    /**
     * @param skills the skills to set
     */
    public void setSkills(String skills) {
        this.skills = skills;
    }

    /**
     * @return int return the experience
     */
    public int getExperience() {
        return experience;
    }

    /**
     * @param experience the experience to set
     */
    public void setExperience(int experience) {
        this.experience = experience;
    }

    /**
     * @return String return the resumeUrl
     */
    public String getResumeUrl() {
        return resumeUrl;
    }

    /**
     * @param resumeUrl the resumeUrl to set
     */
    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    /**
     * @return String return the certifications
     */
    public String getCertifications() {
        return certifications;
    }

    /**
     * @param certifications the certifications to set
     */
    public void setCertifications(String certifications) {
        this.certifications = certifications;
    }

    /**
     * @return String return the certificationsUrl
     */
    public String getCertificationsUrl() {
        return certificationsUrl;
    }

    /**
     * @param certificationsUrl the certificationsUrl to set
     */
    public void setCertificationsUrl(String certificationsUrl) {
        this.certificationsUrl = certificationsUrl;
    }


    /**
     * @return Long return the userId
     */
    public Long getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(Long userId) {
        this.userId = userId;
    }

}