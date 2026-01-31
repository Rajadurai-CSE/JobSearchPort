package com.job.dto.job;

import java.time.LocalDate;

/**
 * Simplified DTO for job updates.
 * Only vacancies and deadline can be updated.
 * Other fields require creating a new job.
 */
public class JobUpdateRequestDto {
    private Integer noOfVacancies;
    private LocalDate applicationDeadline;

    public Integer getNoOfVacancies() {
        return noOfVacancies;
    }

    public void setNoOfVacancies(Integer noOfVacancies) {
        this.noOfVacancies = noOfVacancies;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }
}
