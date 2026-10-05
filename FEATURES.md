# Pro Manager — Application Features

Feature overview derived from the authenticated app (`client/src/pages/auth`). Pro Manager is a project and task management application with two UI experiences: **Classic** and **Modern**.

---

## Dual UI Modes

| Mode | Layout | Highlights |
|------|--------|------------|
| **Classic** | Top navigation bar | List / Grid / Kanban views, global search, light & dark themes |
| **Modern** | Left side menu | Table-first layouts, inline popups, bulk delete |

Users can switch between modes via **Preview Modern UI** (Classic) or **Go back to Classic** (Modern). Preference is stored in `sessionStorage`.

---

## Dashboard

Central overview of work and quick actions.

### Classic Dashboard
- Recent pages (projects and tasks sorted by last update)
- Selected-page panel with status, owner/assignee, and timestamps
- Reports by status:
  - Projects: Not started, In progress, Completed
  - Tasks: To do, Doing, Done
- Quick actions: create a new project or task
- Collapsible side menu (Favorites, Projects, Tasks) with status shortcuts

### Modern Dashboard
- Reports with richer stats:
  - Projects: Close to deadline, Overdue, Not started, In progress, Completed
  - Tasks: Today, Inbox, To do, Doing, Done
- Toggle between Projects and Tasks tables
- Row click opens a detail popup (edit state, description, delete)
- Quick create forms for projects and tasks
- Side menu with Workspace links and Recents (last 5 updated items)

---

## Project Management

Full CRUD for projects owned by the signed-in user.

### Fields
| Field | Description |
|-------|-------------|
| Name | Project title |
| Description | Free-text details |
| Deadline | Due date (past dates blocked on create in Classic) |
| State | `Not started` · `In progress` · `Completed` |
| Owner / Created by / Updated by | User attribution |
| Created on / Updated on | Timestamps |

### Capabilities
- **Create** — name, deadline, description
- **Read** — list all owned projects; open a single project detail page
- **Update** — change state (Start / Complete / Reset), edit name and description
- **Delete** — remove a project (Modern supports multi-select bulk delete)

### Classic views
- **Grid** (default), **List**, and **Kanban** (columns by state)
- Filter by state; sort by state or deadline
- Local name search

### Modern views
- Table layout with column sort indicators
- Filter by state
- Sort by State, Deadline, Updated, Created (A→Z / Z→A)

### Project detail
- Edit description and state
- List linked tasks
- Link standalone tasks to the project (Classic)
- Create a new task pre-linked to the project
- Comments and activity log

---

## Task Management

Full CRUD for tasks assigned to the signed-in user.

### Fields
| Field | Description |
|-------|-------------|
| Name | Task title (required) |
| Short description | Brief summary (required) |
| Description | Full details |
| Priority | `High` · `Medium` (default) · `Low` |
| State | `To do` · `Doing` · `Done` |
| Project | Optional link to a project (or standalone) |
| Assigned to / Created by / Updated by | User attribution |
| Created on / Updated on | Timestamps |

### Capabilities
- **Create** — name, priority, optional project, short description, description
- **Read** — list assigned tasks; open a single task detail page
- **Update** — change state (Start / Done / Reset), edit descriptions, priority, and linked project
- **Delete** — remove a task (Modern supports multi-select bulk delete)

### Classic views
- **List** (default), **Grid**, and **Kanban**
- Kanban can group by **state** or **priority**
- Filter by state and priority; sort by state or priority
- Local name search

### Modern views
- Table layout with a Project column
- Filter by state and project scope (All / Belongs to a project / Standalone)

### Task detail
- Edit short description, description, priority, and linked project
- View linked project and navigate to it
- Comments and activity log

---

## Project ↔ Task Linking

- Tasks can be **standalone** or **linked** to a project
- Link at creation via project picker, or auto-link when creating from a project page
- Classic project detail includes **Link a task** to attach existing unlinked tasks
- Task detail allows changing or clearing the linked project

---

## Comments & Activity Log

Available on project and task detail pages (Classic and Modern).

- Post comments on projects and tasks
- Activity log merges comments and system audits, sorted by time
- Audits track field-level changes, for example:
  - **Projects:** Name, State, Description, Owner, Deadline
  - **Tasks:** Name, State, Priority, Short description, Description, Assigned to, Project

---

## Search, Filter & Sort

| Feature | Classic | Modern |
|---------|---------|--------|
| Global search (projects & tasks by name) | Yes | Search box present (UI only) |
| Section name search | Yes | — |
| Filter by status / priority | Yes | Yes (projects + tasks) |
| Sort options | State, Deadline / Priority | State, Deadline, Updated, Created (projects) |
| URL-driven view & filter params | Yes (`?view=`, `?filter=`) | — |

---

## Navigation & Chrome

### Classic Auth Header
- Brand link to Pro Manager
- Nav: Dashboard, Projects, Tasks (Insights placeholder)
- Global search input
- Notifications bell (UI)
- Profile menu: Profile, Settings (disabled), Themes (disabled), Log out
- Preview Modern UI button

### Modern Side Menu
- Workspace: Dashboard, Projects, Tasks
- Placeholders: Organization, Workspaces, Settings, Team, Favorites
- Recents list
- Switch back to Classic + Log out

---

## Profile & Account

Available in Classic at `/auth/{username}/classic/profile`.

| Module | Capabilities |
|--------|--------------|
| **Account** | View username; edit first name, last name, and email |
| **Sign in & Security** | Re-authentication gate; change username; optional password change (current / new / confirm) |
| **Themes** | Light / Dark theme (stored per user in a cookie) |
| **Settings** | Coming soon |

---

## Authentication & Session

- Session stored in `sessionStorage` (`authUser`: token, sessionId, userId, etc.)
- Refresh token kept in a browser cookie named by username
- Automatic access-token refresh and retry on `"Invalid access token"`
- Secure logout: API call, session cookie deletion, clear storage, redirect to sign-in
- Theme preference cookie: `userTheme-{userId}`

---

## Feature Summary Matrix

| Capability | Classic | Modern |
|------------|:-------:|:------:|
| Project CRUD | Yes | Yes (+ bulk delete) |
| Task CRUD | Yes | Yes (+ bulk delete) |
| List / Grid / Kanban | Yes | Tables only |
| Filter & sort | Yes | Partial |
| Global search | Yes | UI only |
| Link tasks to projects | Yes | Via create/edit |
| Comments & activity log | Yes | Yes |
| Light / Dark theme | Yes | — |
| Profile & security | Yes | — |
| Dashboard reports | Yes | Yes (extended) |
| Switch UI mode | Yes | Yes |

---

## Planned / Placeholder Features

Visible in the UI but not fully implemented yet:

- Insights navigation
- Team favorites and shared team projects/tasks
- Header Settings and Themes shortcuts
- Customized theme colors
- Modern side-menu Organization / Workspaces / Settings / Team sections
- Modern dashboard Recent Activities body
- Profile Settings module
- Additional classic dashboard reports (Today’s tasks, This week, Inbox, etc.)
