# Autosuggest API Load Testing using k6

## 📌 Overview

This project performs load testing on the Autosuggest API endpoints using **k6**.  

The test simulates **100 concurrent virtual users** sending requests to the main `/autocomplete/suggest` endpoint for **30 seconds**.

---

## 🎯 Objectives

- Validate system readiness  
- Configure autosuggest settings  
- Generate authentication token  
- Load test the suggest endpoint  
- Measure performance metrics under concurrent load

---

## 🏗 Test Architecture

### Setup Phase (Runs Once)

1. `GET /autocomplete/status`  
2. `POST /autocomplete/config`  
3. `GET /autocomplete/token`  

The generated token is shared across all virtual users.

### Load Phase (Runs Per VU)

Each Virtual User:

- Sends `POST` requests to `/autocomplete/suggest`  
- Uses random query values to simulate real typing  
- Waits **1 second** between iterations

---

## ⚙ Test Configuration

- Virtual Users (VUs): 100
- Duration: 30 seconds
- Workload Model: Closed (VU-based)


---

## 📊 Metrics Measured

- HTTP request duration (avg, p90, p95)  
- Request failure rate  
- Total requests sent  
- Iteration duration per VU  

---

## 🧪 How to Run

### Install k6

**Mac:**
brew install k6

**Windows:**
choco install k6

**Verify Installation:**
k6 version

**Run the Test:**
k6 run autocomplete-load-test.js

## 🧠 Design Decisions

- `setup()` used to run status, config, and token once before load test

- Random queries prevent caching and simulate realistic user behavior

- `sleep(1)` simulates real-world user think time

- `check()` ensures API correctness during load
