# Geo Trainer

Geo Trainer is a small geography quiz app built with **React**, **TypeScript**, **Redux Toolkit**, **Vite**, and **Leaflet**.

The app lets you choose an area on the map and then tests how well you know the cities or villages inside that selected region. A marker highlights the target settlement, and you must pick the correct name from several answer options.

App avilable at: https://coder4u.github.io/geotrainer/

## Features

- Interactive map powered by **Leaflet**
- Draw a custom rectangular area to define the quiz region
- Choice geography questions
- Score tracking during each game session
- Simple and fast frontend setup with **Vite**

## How to play

1. Open the app.
2. Start selecting a game area by dragging the map and click **Next**.
3. Draw a rectangle on the map around the region you want to use.
4. Click **Next** again to begin the quiz.
5. For each round:
   - A marker shows the target city or village on the map
   - Choose the correct name from the list of options
6. After all questions, your final score is shown.
7. Use **Play again** or **Set new area** to start another round.

## Getting started

### Install dependencies

``` 
npm install
```

### Run dev server

``` 
npm run start
```

### Build a production version

``` 
npm run build
```

## Tech stack

- **React**
- **TypeScript**
- **Redux Toolkit**
- **Vite**
- **Leaflet**
