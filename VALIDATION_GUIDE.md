# 🔒 Validation Rules - Resort Management System

## Overview
This document outlines all validation rules implemented in the Resort Management System to ensure data integrity and security.

---

## 📋 Guest Management Validation

### Frontend (UI) Validation

**Guest ID**
- ✅ Required field
- ✅ Must be 3-10 alphanumeric characters (A-Z, 0-9)
- ✅ Auto-converted to uppercase
- ✅ Cannot be changed after creation
- ❌ Special characters not allowed
- **Example**: `G001`, `GUEST123`

**Name**
- ✅ Required field
- ✅ Only letters, spaces, dots (.), hyphens (-), and apostrophes (')
- ✅ Minimum 2 characters
- ✅ Maximum 100 characters
- ❌ Numbers not allowed
- ❌ Special characters (except . ' -) not allowed
- **Example**: `John Doe`, `Mary O'Brien`, `Jean-Paul Smith`

**Email**
- ✅ Required field
- ✅ Must be valid email format (name@domain.com)
- ✅ Auto-converted to lowercase
- ❌ Invalid formats rejected
- **Example**: `john@example.com`

**Phone**
- ✅ Required field
- ✅ Only digits, spaces, hyphens, parentheses, and plus sign
- ✅ Must be 10-15 characters
- ❌ Letters not allowed
- **Example**: `+1-234-567-8900`, `1234567890`, `(123) 456-7890`

**Address**
- ⚪ Optional field
- ✅ Maximum 500 characters
- **Example**: `123 Main St, City, State, 12345`

**Check-in/Check-out Dates**
- ⚪ Optional fields
- ✅ Must be valid dates
- ✅ Check-out date must be after check-in date
- ❌ Invalid date formats rejected

**Room Type**
- ⚪ Optional field
- ✅ Must be one of: Single, Double, Suite, Deluxe, Presidential

**Status**
- ✅ Required field
- ✅ Must be one of: Pending, Active, Checked-out, Cancelled
- ✅ Default: Pending

---

## 🏨 Room Management Validation

### Frontend (UI) Validation

**Room ID**
- ✅ Required field
- ✅ Must be 2-10 alphanumeric characters
- ✅ Auto-converted to uppercase
- ✅ Cannot be changed after creation
- ❌ Special characters not allowed
- **Example**: `R001`, `RM123`

**Room Number**
- ✅ Required field
- ✅ Must be 1-10 alphanumeric characters
- ✅ Hyphens allowed
- ✅ Auto-converted to uppercase
- ❌ Must be unique
- **Example**: `101`, `A-203`, `SUITE-5`

**Type**
- ✅ Required field
- ✅ Must be one of: Single, Double, Suite, Deluxe, Presidential

**Capacity**
- ✅ Required field
- ✅ Must be a whole number (integer)
- ✅ Minimum: 1 person
- ✅ Maximum: 20 people
- ❌ Decimals not allowed
- **Example**: `2`, `4`, `10`

**Price**
- ✅ Required field
- ✅ Must be a number
- ✅ Minimum: 0 (cannot be negative)
- ✅ Maximum: 1,000,000
- ✅ Decimals allowed (up to 2 places)
- **Example**: `150.00`, `299.99`

**Facilities**
- ⚪ Optional field
- ✅ Comma-separated list
- **Example**: `WiFi, TV, Air Conditioning, Mini Bar`

**Status**
- ✅ Required field
- ✅ Must be one of: Available, Occupied, Maintenance, Reserved
- ✅ Default: Available

---

## 📅 Booking Management Validation

### Backend Validation

**Booking ID**
- ✅ Required field
- ✅ Must be 3-15 alphanumeric characters
- ✅ Must be unique

**Guest ID**
- ✅ Required field
- ✅ Must reference an existing guest

**Room ID**
- ✅ Required field
- ✅ Must reference an existing room

**Check-in Date**
- ✅ Required field
- ✅ Must be a valid date

**Check-out Date**
- ✅ Required field
- ✅ Must be a valid date
- ✅ Must be after check-in date

**Paid Amount**
- ⚪ Optional (defaults to 0)
- ✅ Cannot be negative
- ✅ Maximum: 1,000,000

**Status**
- ✅ Must be one of: Pending, Confirmed, Checked-in, Checked-out, Cancelled
- ✅ Default: Pending

---

## 👥 Staff Management Validation

### Backend Validation

**Staff ID**
- ✅ Required field
- ✅ Must be 3-10 alphanumeric characters
- ✅ Must be unique

**Name**
- ✅ Required field
- ✅ Only letters, spaces, dots, hyphens, and apostrophes
- ✅ Minimum 2 characters
- ✅ Maximum 100 characters

**Role**
- ✅ Required field
- ✅ Must be one of: Manager, Receptionist, Housekeeping, Chef, Security, Maintenance

**Contact**
- ✅ Required field
- ✅ Must be 10-15 digits (with optional formatting)

**Join Date**
- ✅ Required field
- ✅ Must be a valid date

**Status**
- ✅ Must be one of: Active, On Leave, Inactive
- ✅ Default: Active

---

## 🚨 Real-time Validation Features

### Frontend Validation Features

1. **Instant Feedback**
   - Errors appear immediately when user enters invalid data
   - Red border highlights fields with errors
   - Error messages displayed below each field

2. **Preventive Input**
   - Name field only accepts letters and allowed characters
   - Phone field only accepts digits and formatting characters
   - ID fields auto-convert to uppercase
   - Number fields only accept numeric input

3. **Smart Validation**
   - Email format validated in real-time
   - Date ranges checked automatically
   - Duplicate IDs prevented at backend

4. **User-Friendly Messages**
   - Clear, specific error messages
   - Helpful examples in placeholders
   - Field requirements marked with asterisk (*)

---

## 🛡️ Backend Validation (MongoDB)

### Mongoose Schema Validation

All validations are enforced at the database level:

1. **Type Checking**
   - Ensures correct data types (String, Number, Date)
   - Rejects invalid types

2. **Custom Validators**
   - Regex patterns for IDs, names, emails, phones
   - Range checks for numbers
   - Date logic validation

3. **Error Handling**
   - Detailed validation error messages
   - Duplicate key detection (11000 error code)
   - Friendly error responses to frontend

4. **Data Sanitization**
   - `trim: true` removes whitespace
   - `lowercase: true` for emails
   - Auto-formatting where appropriate

---

## 📝 Validation Error Messages

### Common Error Messages

**Guest Errors:**
- "Guest ID is required"
- "Guest ID must be 3-10 alphanumeric characters"
- "Name can only contain letters, spaces, dots, hyphens, and apostrophes"
- "Please provide a valid email address"
- "Phone must be 10-15 digits (may include spaces, hyphens, parentheses, or +)"
- "Check-out date must be after check-in date"
- "Guest ID already exists. Please use a different ID."

**Room Errors:**
- "Room ID must be 2-10 alphanumeric characters"
- "Capacity must be at least 1"
- "Capacity must be a whole number"
- "Price cannot be negative"
- "roomNumber already exists. Please use a different value."

**Booking Errors:**
- "Check-out date must be after check-in date"
- "Paid amount cannot be negative"

---

## 🔧 Using Validation Utilities

### Frontend Validation Helper

Location: `client/src/utils/validation.js`

```javascript
import { validators, sanitizers } from '../utils/validation';

// Example usage:
const nameError = validators.name(formData.name);
const emailError = validators.email(formData.email);
const phoneError = validators.phone(formData.phone);

// Sanitize input:
const cleanedName = sanitizers.lettersOnly(inputValue);
const cleanedPhone = sanitizers.phoneOnly(inputValue);
```

### Available Validators:
- `validators.name(value)` - Name validation
- `validators.email(value)` - Email validation
- `validators.phone(value)` - Phone validation
- `validators.number(value, min, max, fieldName)` - Number validation
- `validators.alphanumeric(value, min, max, fieldName)` - Alphanumeric validation
- `validators.dateRange(startDate, endDate)` - Date range validation

### Available Sanitizers:
- `sanitizers.lettersOnly(value)` - Remove non-letter characters
- `sanitizers.numbersOnly(value)` - Remove non-numeric characters
- `sanitizers.phoneOnly(value)` - Keep only phone-valid characters
- `sanitizers.alphanumericOnly(value)` - Keep only letters and numbers

---

## ✅ Testing Validation

### How to Test:

1. **Try Invalid Guest Name:**
   - Enter: `John123` → ❌ Error: "Name can only contain letters..."
   - Enter: `John@Doe` → ❌ Error: "Name can only contain letters..."
   - Enter: `John Doe` → ✅ Valid

2. **Try Invalid Phone:**
   - Enter: `abc` → Prevented from typing (numbers only)
   - Enter: `123` → ❌ Error: "Phone must be 10-15 digits"
   - Enter: `+1-234-567-8900` → ✅ Valid

3. **Try Invalid Email:**
   - Enter: `notanemail` → ❌ Error: "Please provide a valid email"
   - Enter: `test@domain` → ❌ Error: "Please provide a valid email"
   - Enter: `test@domain.com` → ✅ Valid

4. **Try Invalid Room Capacity:**
   - Enter: `0` → ❌ Error: "Capacity must be at least 1"
   - Enter: `2.5` → ❌ Error: "Capacity must be a whole number"
   - Enter: `25` → ❌ Error: "Capacity cannot exceed 20"
   - Enter: `4` → ✅ Valid

5. **Try Invalid Dates:**
   - Check-in: `2025-11-10`, Check-out: `2025-11-05` → ❌ Error
   - Check-in: `2025-11-10`, Check-out: `2025-11-15` → ✅ Valid

---

## 🎯 Validation Summary

| Entity | Fields Validated | Frontend | Backend |
|--------|-----------------|----------|---------|
| Guest | 9 fields | ✅ | ✅ |
| Room | 7 fields | ✅ | ✅ |
| Booking | 7 fields | ⚪ | ✅ |
| Staff | 6 fields | ⚪ | ✅ |
| Amenity | 5 fields | ⚪ | ⚪ |
| Service | 6 fields | ⚪ | ⚪ |

**Legend:**
- ✅ = Fully implemented
- ⚪ = Basic validation only
- ❌ = Not implemented

---

## 🚀 Benefits of Validation

1. **Data Integrity**: Ensures only valid data enters the database
2. **User Experience**: Immediate feedback helps users correct mistakes
3. **Security**: Prevents injection attacks and malformed data
4. **Consistency**: Standardized formats across the application
5. **Error Prevention**: Catches issues before they reach the backend
6. **Professional**: Makes the application production-ready

---

**Note:** All validation rules are enforced on both frontend (for user experience) and backend (for security). This dual-layer approach ensures data integrity even if frontend validation is bypassed.
