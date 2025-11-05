# 🎯 Quick Test Guide - Validation Features

## How to See Validation Working

### 1️⃣ Test Guest Name Validation

**Steps:**
1. Open http://localhost:3000/guests
2. Click "Add New Guest" button
3. In the **Name** field:
   - Try typing: `John123` ← Numbers won't appear!
   - Try typing: `John@Doe` ← @ symbol won't appear!
   - Try typing: `John Doe` ← Works! ✅

**What You'll See:**
- Invalid characters are blocked while typing
- Only letters, spaces, dots, hyphens, apostrophes allowed
- Visual feedback: field border stays normal

---

### 2️⃣ Test Phone Number Validation

**Steps:**
1. In the **Phone** field:
   - Try typing: `abc` ← Letters won't appear!
   - Type: `123` then click Submit
   - See error: "Phone must be 10-15 digits..."
   - Change to: `1234567890` ← Error disappears! ✅

**What You'll See:**
- Letters blocked while typing
- Red border appears on error
- Error message below field
- Error clears when you fix it

---

### 3️⃣ Test Guest ID Validation

**Steps:**
1. In the **Guest ID** field:
   - Type: `g001` ← Auto-converts to `G001`! ✅
   - Try typing: `G@01` ← @ symbol won't appear!
   - Type just: `AB` then Submit
   - See error: "Guest ID must be 3-10 alphanumeric characters"

**What You'll See:**
- Auto-uppercase conversion
- Only letters and numbers allowed
- Length validation (3-10 chars)

---

### 4️⃣ Test Email Validation

**Steps:**
1. In the **Email** field:
   - Type: `notanemail` then Submit
   - See error: "Please provide a valid email address"
   - Change to: `test@` ← Still invalid
   - Change to: `test@example.com` ← Valid! ✅

**What You'll See:**
- Format validation (must have @domain.com)
- Red border on invalid email
- Error message appears/disappears

---

### 5️⃣ Test Check-out Date Validation

**Steps:**
1. Select **Check-in Date**: `2025-11-10`
2. Select **Check-out Date**: `2025-11-05` (earlier!)
3. Click Submit
4. See error: "Check-out date must be after check-in date"
5. Change Check-out to: `2025-11-15` ← Valid! ✅

**What You'll See:**
- Date comparison validation
- Logical date range checking

---

### 6️⃣ Test Room Capacity Validation

**Steps:**
1. Go to http://localhost:3000/rooms
2. Click "Add New Room"
3. In the **Capacity** field:
   - Type: `0` then Submit
   - See error: "Capacity must be at least 1"
   - Change to: `2.5` then Submit
   - See error: "Capacity must be a whole number"
   - Change to: `25` then Submit
   - See error: "Capacity cannot exceed 20"
   - Change to: `4` ← Valid! ✅

**What You'll See:**
- Minimum value validation (1)
- Integer validation (no decimals)
- Maximum value validation (20)

---

### 7️⃣ Test Room Price Validation

**Steps:**
1. In the **Price** field:
   - Type: `-50` then Submit
   - See error: "Price cannot be negative"
   - Change to: `1500000` then Submit
   - See error: "Price cannot exceed 1,000,000"
   - Change to: `150.00` ← Valid! ✅

**What You'll See:**
- Negative number rejection
- Maximum value validation
- Decimal values allowed

---

### 8️⃣ Test Duplicate ID Prevention

**Steps:**
1. Try to create a guest with ID: `G001` (already exists)
2. Fill all fields correctly
3. Click Submit
4. See error: "Guest ID already exists. Please use a different ID."
5. Change ID to: `G999` ← Works! ✅

**What You'll See:**
- Backend validation catches duplicates
- Clear error message
- Prevents database conflicts

---

## 🎨 Visual Indicators

### Normal State
```
┌─────────────────────────┐
│ Guest ID *              │
│ ┌─────────────────────┐ │
│ │ G001                │ │  ← Normal border (gray/blue)
│ └─────────────────────┘ │
└─────────────────────────┘
```

### Error State
```
┌─────────────────────────┐
│ Guest ID *              │
│ ┌─────────────────────┐ │
│ │ AB                  │ │  ← Red border
│ └─────────────────────┘ │
│ ⚠ Guest ID must be 3-10  │  ← Red error text
│   alphanumeric chars     │
└─────────────────────────┘
```

### Valid State (After Correction)
```
┌─────────────────────────┐
│ Guest ID *              │
│ ┌─────────────────────┐ │
│ │ G001                │ │  ← Border back to normal
│ └─────────────────────┘ │
│                         │  ← Error message gone
└─────────────────────────┘
```

---

## 🔍 What to Look For

### ✅ Preventive Validation (While Typing)
- Invalid characters don't appear in input
- Auto-formatting (uppercase for IDs)
- Character filtering (letters/numbers only)

### ✅ Submit Validation (On Form Submit)
- Red borders appear on invalid fields
- Error messages show specific problems
- Form doesn't submit until all valid

### ✅ Real-time Feedback
- Errors appear immediately
- Errors disappear when fixed
- Clear, helpful messages

### ✅ Backend Safety
- Duplicate detection
- Data type enforcement
- Range/format validation

---

## 📊 Validation Summary

| Field Type | Frontend Blocks | Shows Error | Backend Checks |
|------------|----------------|-------------|----------------|
| Name | Numbers, symbols | ✅ On submit | ✅ Regex pattern |
| Phone | Letters | ✅ On submit | ✅ Length/format |
| Email | None | ✅ On submit | ✅ Email format |
| Guest ID | Symbols | ✅ On submit | ✅ Unique + format |
| Capacity | None | ✅ On submit | ✅ Range + integer |
| Price | None | ✅ On submit | ✅ Range + positive |
| Dates | None | ✅ On submit | ✅ Date logic |

---

## 🎯 Quick Test Checklist

Try these in order:

- [ ] Type numbers in Name field → Blocked
- [ ] Type letters in Phone field → Blocked
- [ ] Enter short phone (3 digits) → Error shown
- [ ] Enter invalid email → Error shown
- [ ] Fix email → Error disappears
- [ ] Enter capacity = 0 → Error shown
- [ ] Enter capacity = 2.5 → Error shown
- [ ] Enter capacity = 4 → Success!
- [ ] Enter negative price → Error shown
- [ ] Set checkout before checkin → Error shown
- [ ] Try duplicate Guest ID → Error from backend
- [ ] Fill valid form → Success! ✅

---

## 💡 Tips

1. **Watch the borders**: Red = error, Normal = OK
2. **Read error messages**: They tell you exactly what's wrong
3. **Try edge cases**: Minimum/maximum values, special characters
4. **Check network tab**: See backend validation responses
5. **Refresh page**: New validation loads with page

---

## 🚀 Try It Now!

1. Go to: http://localhost:3000/guests
2. Click: "Add New Guest"
3. Follow the test scenarios above
4. See validation in action!

**Have fun testing! 🎉**
