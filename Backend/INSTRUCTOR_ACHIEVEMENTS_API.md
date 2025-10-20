# Instructor Achievement System API Documentation

## Overview
The Instructor Achievement System allows admins to create, manage, and evaluate achievement rules for instructors based on their rating, joining date, and number of bookings received.

## Features
- ✅ Admin CRUD operations for instructor achievement rules
- ✅ Automatic achievement evaluation based on multiple criteria
- ✅ Support for rating-based, time-based, and booking-based achievements
- ✅ Real-time achievement preview
- ✅ Instructor leaderboard system
- ✅ Bulk evaluation of all instructors
- ✅ Achievement statistics and analytics

## Models

### AchievementRule Model (Enhanced)
```javascript
{
  name: String,                    // Unique rule name
  title: String,                   // Display title
  description: String,             // Achievement description
  label: String,                   // Category label
  adventure: ObjectId,             // Optional specific adventure
  targetType: String,              // "user" | "instructor"
  metric: String,                  // "rating" | "joiningDate" | "bookingCount" | "completedSessions" | "confirmedBookings"
  threshold: Number,               // Base threshold value
  instructorCriteria: {            // Additional criteria for instructors
    minRating: Number,             // Minimum rating (0-5)
    minMonthsSinceJoining: Number, // Minimum months since joining
    minBookings: Number            // Minimum number of bookings received
  },
  icon: String,                    // Display icon
  active: Boolean                  // Whether rule is active
}
```

### InstructorAchievement Model (New)
```javascript
{
  instructorId: ObjectId,          // Reference to User
  email: String,                   // Instructor email
  name: String,                    // Instructor name
  level: Number,                   // Current level
  currentRating: Number,           // Current average rating
  totalBookingsReceived: Number,   // Total confirmed bookings
  monthsSinceJoining: Number,      // Calculated months since joining
  totalExperiencePoints: Number,   // Total XP earned
  achievements: [{                 // Array of earned achievements
    name: String,
    description: String,
    category: String,
    level: Number,
    earnedAt: Date,
    icon: String,
    criteria: {                    // Criteria when earned
      rating: Number,
      monthsSinceJoining: Number,
      bookingCount: Number
    }
  }],
  badges: [{                       // Performance badges
    type: String,                  // "rating" | "experience" | "popularity" | "loyalty"
    level: String,                 // "bronze" | "silver" | "gold" | "platinum"
    earnedAt: Date
  }],
  stats: {
    totalAchievements: Number,
    lastEvaluated: Date,
    streak: Number
  }
}
```

## API Endpoints

### Admin Endpoints

#### 1. Create Instructor Achievement Rule
```http
POST /api/achievement-rules/instructor
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Elite Instructor",
  "description": "Achieve 4.8+ rating with 100+ bookings and 12+ months experience",
  "targetType": "instructor",
  "metric": "rating",
  "threshold": 4.8,
  "instructorCriteria": {
    "minRating": 4.8,
    "minBookings": 100,
    "minMonthsSinceJoining": 12
  },
  "icon": "👑",
  "active": true
}
```

#### 2. List Instructor Achievement Rules
```http
GET /api/achievement-rules/instructor?active=true&adventure=<adventure_id>
Authorization: Bearer <admin_token>
```

#### 3. Get Single Instructor Achievement Rule
```http
GET /api/achievement-rules/instructor/:id
Authorization: Bearer <admin_token>
```

#### 4. Update Instructor Achievement Rule
```http
PUT /api/achievement-rules/instructor/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "description": "Updated description",
  "threshold": 4.9,
  "active": false
}
```

#### 5. Delete Instructor Achievement Rule
```http
DELETE /api/achievement-rules/instructor/:id
Authorization: Bearer <admin_token>
```

#### 6. Evaluate Specific Instructor
```http
POST /api/achievement-rules/instructor/evaluate/:instructorId
Authorization: Bearer <admin_token>
```

#### 7. Bulk Evaluate All Instructors
```http
POST /api/achievement-rules/instructor/evaluate-all
Authorization: Bearer <admin_token>
```

#### 8. Get Instructor Achievements (Admin)
```http
GET /api/achievement-rules/instructor/achievements/:instructorId
Authorization: Bearer <admin_token>
```

### Instructor Endpoints

#### 1. Evaluate My Achievements
```http
POST /api/achievement-rules/instructor/evaluate
Authorization: Bearer <instructor_token>
```

#### 2. Get My Achievements
```http
GET /api/achievement-rules/instructor/achievements
Authorization: Bearer <instructor_token>
```

## Achievement Rule Examples

### 1. Rating-Based Achievement
```json
{
  "name": "Top Rated Instructor",
  "description": "Achieve an average rating of 4.5 or higher",
  "targetType": "instructor",
  "metric": "rating",
  "threshold": 4.5,
  "instructorCriteria": {
    "minRating": 4.5
  },
  "icon": "⭐",
  "active": true
}
```

### 2. Experience-Based Achievement
```json
{
  "name": "Veteran Guide",
  "description": "Complete 12 months as an instructor",
  "targetType": "instructor",
  "metric": "joiningDate",
  "threshold": 12,
  "instructorCriteria": {
    "minMonthsSinceJoining": 12
  },
  "icon": "🎯",
  "active": true
}
```

### 3. Popularity-Based Achievement
```json
{
  "name": "Popular Instructor",
  "description": "Receive 100 confirmed bookings",
  "targetType": "instructor",
  "metric": "bookingCount",
  "threshold": 100,
  "instructorCriteria": {
    "minBookings": 100
  },
  "icon": "🔥",
  "active": true
}
```

### 4. Multi-Criteria Achievement
```json
{
  "name": "Master Instructor",
  "description": "Elite instructor with excellent rating, experience, and popularity",
  "targetType": "instructor",
  "metric": "rating",
  "threshold": 4.8,
  "instructorCriteria": {
    "minRating": 4.8,
    "minBookings": 200,
    "minMonthsSinceJoining": 18
  },
  "icon": "👑",
  "active": true
}
```

## Service Integration

### Auto-Evaluation Triggers

#### 1. After Booking Completion
```javascript
import { instructorAchievementService } from './services/instructorAchievement.service.js';

// In your booking completion logic
const newAchievements = await instructorAchievementService.evaluateAfterBooking(instructorUserId);
if (newAchievements.length > 0) {
  console.log('New achievements earned:', newAchievements);
}
```

#### 2. After Rating Update
```javascript
// In your rating update logic
const newAchievements = await instructorAchievementService.evaluateAfterRatingUpdate(instructorUserId);
```

#### 3. Scheduled Evaluation (Cron Job)
```javascript
// Add to your scheduled tasks
await instructorAchievementService.scheduledEvaluation();
```

### Utility Functions

#### 1. Get Instructor Statistics
```javascript
const stats = await instructorAchievementService.getInstructorStats(instructorUserId);
// Returns: { totalAchievements, level, experiencePoints, currentRating, totalBookings, monthsSinceJoining, recentAchievements }
```

#### 2. Get Leaderboard
```javascript
const leaderboard = await instructorAchievementService.getLeaderboard(10);
// Returns top 10 instructors by level and achievements
```

#### 3. Preview Achievements
```javascript
const preview = await instructorAchievementService.previewAchievements({
  rating: 4.7,
  monthsSinceJoining: 8,
  bookingCount: 75
});
// Returns achievements the instructor would earn with these metrics
```

## Response Formats

### Success Response
```json
{
  "statusCode": 200,
  "data": {
    // Response data
  },
  "message": "Success message",
  "success": true
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "errors": []
}
```

## Testing

Run the test script to verify the implementation:

```bash
cd Backend
node test-instructor-achievements.js
```

## Database Indexes

The following indexes are automatically created for optimal performance:

- `AchievementRule`: `{ adventure: 1, name: 1, targetType: 1 }` (unique)
- `InstructorAchievement`: `{ instructorId: 1 }` (unique)
- `InstructorAchievement`: `{ level: -1 }`
- `InstructorAchievement`: `{ totalExperiencePoints: -1 }`
- `InstructorAchievement`: `{ currentRating: -1 }`

## Security Notes

- All admin endpoints require `verifyAdmin` middleware
- Instructor endpoints require `verifyJWT` middleware
- Input validation is implemented for all criteria fields
- Achievement rules can only be created/modified by admins
- Instructors can only evaluate their own achievements (unless admin)

## Future Enhancements

1. **Notification System**: Integrate with email/push notifications
2. **Achievement Categories**: Add more granular categorization
3. **Seasonal Achievements**: Time-limited special achievements
4. **Team Achievements**: Group-based instructor achievements
5. **Custom Metrics**: Allow custom evaluation criteria
6. **Achievement Sharing**: Social media integration
7. **Achievement Analytics**: Detailed performance analytics