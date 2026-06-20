# DevFix AI - Database Design

## Table 1: Users

Purpose:
Store registered users.

Fields:

id
name
email
password
role
created_at

---

## Table 2: Technologies

Purpose:
Store supported technologies.

Examples:
Java
Spring Boot
Node.js
MySQL
Git
Maven

Fields:

id
name
description

---

## Table 3: Errors

Purpose:
Store common errors and solutions.

Examples:

JAVA_HOME not set

Maven not recognized

Port 8080 already in use

Fields:

id
title
description
cause
solution
difficulty
technology_id
created_at

---

## Table 4: Knowledge Articles

Purpose:
Detailed troubleshooting guides.

Fields:

id
title
content
technology_id
created_at

---

## Table 5: Screenshot Uploads

Purpose:
Store uploaded screenshots.

Fields:

id
user_id
image_url
ocr_text
analysis_result
uploaded_at

---

## Relationships

Users
|
|---- Screenshot Uploads

Technologies
|
|---- Errors

Technologies
|
|---- Knowledge Articles

Technology Table Reason:

Store technology information only once.

Errors and Articles will reference Technology using technology_id.

This reduces duplication and follows database normalization principles.