# EthnoHack 2026

## Creation & GitHub Repository Submission Guidelines

To participate in EthnoHack 2026, each team is required to create and submit a comprehensive GitHub repository representing their work on **one of the four available challenges/topics**.

The repository is a key part of the evaluation and must be properly structured, functional, and explanatory.

## **Repository Creation** 

## Each team must create a new repository on GitHub with the following naming format:

makeathon-2026-\[team-name\]-\[challenge-name\]

When creating the repository, it is recommended to:

* Be **Public**, unless instructed otherwise  
* Include a **README.md** file  
* Include a **.gitignore** file appropriate for the technology used

## **Adding Team Members (Collaborators)**

For proper collaboration and access for all members:

* Add all team members as collaborators  
* Grant appropriate permissions (Write or Admin)  
* Ensure everyone has access to the repository

## 

## 

## **Sensitive Data Protection**

Data security is a fundamental requirement.

### **Strictly prohibited:**

* Publishing API keys  
* Publishing tokens or credentials  
* Embedding sensitive information in code

### **Instead:**

* Use environment files (e.g., `.env`)  
* Include these files in `.gitignore`

Indicative example:

.env  
\*.env  
config/secrets.json

## **API Key Management**

In case external services are used:

### **Required:**

* Do **not include** API keys in the repository  
* Describe in detail in the README the process of acquiring and using them

Indicatively, the README may include:

* Where the API key is created  
* How it is stored locally  
* How connection to the application is made

## **README (Mandatory)**

The README file is the main point of understanding the project and must include:

### **Project Description**

* The chosen challenge  
* The problem being solved

### **Technologies**

* Programming languages  
* Libraries and frameworks

### **Execution Instructions**

* Installation steps  
* How to run the application

### **API Management (if applicable)**

* Instructions for setting up API keys

### **Presentation**

* Screenshots, demo, or link to video

## **Development Best Practices**

* Use frequent and clear commits  
* Descriptive commit messages  
* Use branches for development (e.g., `dev`, `feature-*`)  
* Avoid uploading large files (prefer external links)

## **Repository Submission**

Before final submission, ensure that:

* The repository is fully updated  
* The README is complete and understandable  
* The project can be executed based on the instructions  
* There are no exposed sensitive data

## 

## **Common Mistakes (To Avoid)**

* Uploading `.env` files  
* Hardcoded API keys in code  
* Incomplete documentation  
* Non-functional code

## **Important Note**

Your GitHub repository is not just a code folder, but the **complete technical presentation of your work**.

Clarity, organization, and reproducibility of the project will be taken seriously into account during evaluation.

**Final Reminder**

Focus on the quality and cleanliness of your work.  
A well-structured and documented repository can highlight your idea and implementation even further.

Good luck to all teams\! 🚀

