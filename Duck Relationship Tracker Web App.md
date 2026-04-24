**Project Title:**  
Duck Relationship Tracker Web App

**Goal:**  
Create a playful web application that visually represents the duration of a relationship or friendship by growing the number of ducks over time.

**Core Concept:**  
Each relationship is represented by ducks in a pond. The longer the relationship lasts, the more ducks appear.

---

**Core Features & Requirements:**

1. **User Input**
    - Allow users to input a **start date** (e.g., the beginning of a relationship or friendship).
2. **Duck Generation Logic**
    - When a start date is entered:
        - Generate **1 duck initially**.
        - Add **1 additional duck for every full month elapsed** since the start date.
    - Duck count updates dynamically based on the current date.
3. **Visual Design**
    - The entire interface is built on top of a **pond background image**.
    - Ducks should:
        - Move smoothly across the screen (simple left-to-right or floating animation is sufficient).
        - Be lightweight (e.g., sprite or simple image animation).
4. **Animation Behavior**
    - Ducks should:
        - Appear gradually as time increases.
        - Move in a loop to simulate swimming.
        - Avoid overlapping too much (basic spacing logic preferred but not required for MVP).
5. **Time Counter Widget**
    - Display a **live counter** showing how long the relationship has lasted:
        - In **days and months**.
        - Include a **toggle option** (Days ↔ Months).
    - Position: **Overlay in one corner of the screen**.