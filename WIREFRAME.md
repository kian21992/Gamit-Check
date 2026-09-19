# Gamit Check — application wireframe reference

This prototype is a visual reference for the eventual React application. The inventory starts empty, with zero items and empty states on Dashboard and My Items. Add, edit, and delete actions illustrate the flow without changing records.

## Screen flow

```mermaid
flowchart TD
    Dashboard["01 · Dashboard"] -->|View all items| Items["02 · My Items"]
    Dashboard -->|Add Item| Add["05 · Add Item"]
    Dashboard -->|Open recent item| Details["03 · Item Details"]
    Dashboard -->|Select category| Items
    Items -->|View| Details
    Items -->|Add Item| Add
    Items -->|Edit| Edit["04 · Edit Item"]
    Details -->|Edit Item| Edit
    Details -->|Back to My Items| Items
    Add -->|Cancel| Items
    Edit -->|Cancel| Details
    Items -->|Delete| Confirm{"Delete confirmation"}
    Details -->|Delete Item| Confirm
    Confirm -->|Keep Item / Escape| Origin["Return to originating screen"]
    Confirm -->|Confirm preview| Feedback["Preview feedback · no records changed"]
    Add -->|Valid form + Add Item| Feedback
    Edit -->|Valid form + Save Changes| Feedback

    classDef screen fill:#f0f4e9,stroke:#b5c6a7,color:#35523e,rx:8,ry:8
    class Dashboard,Items,Add,Details,Edit screen
```

Dashboard, My Items, and Add Item are always reachable from the sidebar or mobile menu. Dashboard, My Items, and Add Item nodes link to their screens. Item Details and Edit Item are reference nodes until an item exists.

## Shared visual language

| Element              | Reference                                                    |
| -------------------- | ------------------------------------------------------------ |
| Page background      | Soft off-white `#f7f8f5`                                     |
| Primary action       | Forest green `#386d53`                                       |
| Primary text         | Dark green `#293b32`                                         |
| Panels               | White, subtle borders, 10–12 px rounded corners              |
| Typography           | Manrope headings; DM Sans body and controls                  |
| Spacing              | Consistent page gutters; 12–28 px component gaps             |
| Condition labels     | Text + color + a dot: New, Good, Fair, Damaged               |
| Navigation           | Persistent desktop sidebar; expandable mobile menu           |
| Forms                | Visible labels, marked required fields, optional-field hints |
| Sample illustrations | Muted vector objects, used as visual placeholders            |

## Desktop and mobile behavior

| Screen       | Desktop                                                   | Mobile                                                                         |
| ------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Dashboard    | Zero-valued summary cards and an empty-inventory panel    | Compact summary row and a responsive empty-inventory panel                     |
| My Items     | Table or card grid, search and category tools, pagination | Responsive cards with item information and explicit View, Edit, Delete actions |
| Add Item     | Form with paired fields and a contextual tip panel        | Single-column fields on narrow phones; full-width form                         |
| Item Details | Illustration beside item information                      | Illustration above information and notes                                       |
| Edit Item    | Prefilled form beside a sample-item reference             | Prefilled form with vertically arranged fields                                 |

At tablet sizes, inventory cards replace the table. At 760 px and below, navigation moves into a menu while the app name remains visible in the header. Layouts support screens as narrow as 320 px.

## Form field reference

| Field         | Required | Control                                                                          |
| ------------- | -------- | -------------------------------------------------------------------------------- |
| Item name     | Yes      | Text input                                                                       |
| Category      | Yes      | Electronics, Clothes, Sports Equipment, Gaming, School Items, Accessories, Other |
| Brand         | No       | Text input                                                                       |
| Condition     | Yes      | New, Good, Fair, Damaged                                                         |
| Location      | No       | Text input, e.g. Bedroom · Desk                                                  |
| Date acquired | No       | Date input                                                                       |
| Notes         | No       | Multiline text                                                                   |

## Scope of future implementation

The application now connects these screens to Express and PostgreSQL CRUD operations. The layouts, field labels, navigation, and responsive rules remain the visual reference, while Add, Item Details, Edit, and Delete operate on persistent records.
