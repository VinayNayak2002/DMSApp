# React Native Document Management System (DMS)

This is a React Native application for managing documents.  
It allows users to log in using OTP, upload files with categories and tags, search documents, preview them, and download.

---

## Project Setup

- Initialized with `npx @react-native-community/cli@latest init DMSApp`.
- Navigation implemented using `@react-navigation/native`.
- Project organized into `navigation`, `screens`, and `services`.

## Project Structure

### Main Entry (App.jsx)

```text
App.jsx - Main entry, wraps AuthProvider and AppNavigator
src/
├── navigation/
│ └── AppNavigator.js # Handles navigation between screens
├── context/
│ └── authContext.js # Authentication state management
├── screens/
│ ├── LoginScreen.js # Login with OTP
│ ├── HomeScreen.js # Dashboard after login
│ ├── UploadScreen.js # Upload documents with metadata
│ ├── SearchScreen.js # Search documents by filters
│ └── PreviewScreen.js # Preview image/pdf
├── services/
│ ├── api.js # API base config
│ ├── uploadService.js # File upload logic
│ ├── searchService.js # Document search logic
│ └── authService.js # OTP generation and validation
```

## Features Implemented

- **OTP-Based Login**

  - Implemented a login screen allowing users to enter their mobile number.
  - Added OTP input and validation interface.
  - Successfully stores a token after OTP verification.

- **File Upload Component**

  - Implemented file upload functionality for images and PDFs.
  - Added a Date Picker for selecting document date.
  - Created dynamic dropdowns for category selection:
    - Major category: Personal / Professional
    - Minor category: Names or Departments depending on the major category selection.
  - Added Tag Input Field to allow adding new tags and displaying pre-existing ones.
  - Included a text field for remarks.
  - Option to select files from gallery or capture using camera.

- **File Search**

  - Developed a search interface with category selection, tag input, and date range filters.
  - Search API is integrated and returns results,  
    but filtering is **notfully functional** since the backend is not responding correctly as intended.
  - Currently, no matter what filters are applied, the backend always returns all records. With the right guidance on **how the API requests are intended to be used**, this functionality can be completed as expected.

- **File Preview and Download**

  - Displayed search results in a list format.
  - Preview implemented, but not working fully since the file URI from the API is not behaving as intended.

- **Navigation and State Management**
  - Implemented navigation across screens using React Navigation.
  - Managed application state using React Context API to maintain user session and document data.
  - Provides `login`, `logout`.

---

## Installation & Running

1. Clone the repository

   ```bash
   git clone <your-repo-url>
   ```

2. Navigate into the project folder

   ```bash
   cd DMSApp
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Run the app

   - For Android:

     ```bash
     npx react-native run-android
     ```

   - For iOS:

     ```bash
     npx react-native run-ios
     ```

---

## Features Description

### Authentication (authContext.js)

- OTP-based login using backend API.
- Stores user token in context for authenticated requests.
- Provides login, logout, and isAuthenticated state globally.

### UploadScreen.js

- Upload files (jpg, png, gif, pdf).
- Choose:

  - Date (with DatePicker)
  - Category (Major Head: Personal / Professional)
  - Subcategory (Minor Head: Names or Departments depending on category)

- Add tags (fetched dynamically or created new).
- Add remarks.
- Upload via Gallery or Camera.

### SearchScreen.js

- Search with filters:

  - Major Head
  - Minor Head
  - Tags (multi-select, dynamic search)
  - Date range

- Preview implemented, but not working fully since the file URI from the API is not behaving as intended.

### HomeScreen.js

- Navigation to Upload, Search, and Logout.

---

## Notes

- OTP login, document upload, and search API integration are fully functional.
- Search filtering and preview are partially functional. At present, the search always returns all records regardless of the filters applied. With the right guidance on how the API requests are intended to be used, this functionality can be completed as expected.
- Download functionality calls the API correctly; however, the returned file URI could not be fully utilized in the app.
- Tags are dynamic (fetched from API + new creation supported).
