package com.job.entity.employer;


import java.util.List;

import com.job.entity.job.JobEntity;

import jakarta.persistence.*;

@Entity
@Table(name = "company")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_url", length = 300)
    private String companyURL;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(name = "company_description", length = 2000)
    private String companyDescription;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmployerProfile> employers;

    // Getters/Setters
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyURL() { return companyURL; }
    public void setCompanyURL(String companyURL) { this.companyURL = companyURL; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyDescription() { return companyDescription; }
    public void setCompanyDescription(String companyDescription) { this.companyDescription = companyDescription; }
}

