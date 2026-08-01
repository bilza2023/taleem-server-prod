I think you've arrived at a very clean design. Each file answers **one question only**.

---

# 1. `content-list.json`

```
content/data/content-list.json
```

## Purpose

**Controls access to individual content.**

Question it answers:

> **"Does this content require authorization?"**

If a `contentId` is **not present**, it is automatically **PUBLIC**.

Example:

```json
[
  {
    "contentId": "9math-ch1-quickref-real-numbers",
    "access": "course",
    "courseId": "9math-quickref"
  },
  {
    "contentId": "my-bookmarks",
    "access": "restricted"
  }
]
```

Used by:

* Authorization middleware

Never used for:

* Prices
* Titles
* Users
* Subscription dates

---

# 2. `course-list.json`

```
content/data/course-list.json
```

## Purpose

**Defines all courses available in the system.**

Question it answers:

> **"What courses exist?"**

Example:

```json
[
  {
    "courseId": "9math-quickref",
    "title": "Class 9 Mathematics Quick Reference",
    "description": "Complete quick reference for FBISE Class 9 Mathematics.",
    "image": "/content/images/9math-quickref.png",
    "price": 500,
    "durationDays": 365
  }
]
```

Used by:

* Purchase page
* Pricing page
* Course catalogue
* Admin
* Payment system

Never used for:

* User permissions

---

# 3. `subscription-list.json`

```
content/data/subscription-list.json
```

## Purpose

**Stores which user owns which course.**

Question it answers:

> **"Does this user currently own this course?"**

Example:

```json
[
  {
    "userId": 42,
    "courseId": "9math-quickref",
    "startDate": "2026-07-20",
    "endDate": "2027-07-20"
  }
]
```

Used by:

```js
hasAccess(userId, courseId)
```

Never used for:

* Prices
* Course titles
* Content metadata

---

# Complete flow

```
User requests content
        │
        ▼
content-list.json
        │
        ├── Not found
        │       │
        │       ▼
        │    PUBLIC ✅
        │
        ├── restricted
        │       │
        │       ▼
        │   JWT required
        │
        └── course
                │
                ▼
          courseId
                │
                ▼
 hasAccess(userId, courseId)
                │
                ▼
 subscription-list.json
                │
                ▼
        Allow / Deny
```

---

# Responsibilities

| File                     | Responsibility                                              | Used By                       |
| ------------------------ | ----------------------------------------------------------- | ----------------------------- |
| `content-list.json`      | Access rules for content                                    | Authorization middleware      |
| `course-list.json`       | Definition of courses (title, price, duration, image, etc.) | Frontend, admin, payment      |
| `subscription-list.json` | User-course ownership                                       | `hasAccess(userId, courseId)` |

The nice thing about this design is that the three files are completely independent:

* **Content** decides **what protection is needed**.
* **Courses** define **what can be purchased**.
* **Subscriptions** record **who currently has access**.

No file mixes responsibilities, which keeps the system easy to understand and maintain.
