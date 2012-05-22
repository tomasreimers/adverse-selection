# About

## Title

Adverse Selection

## Summary

Adverse Selection is a review game for introductory economics students. It features questions in quiz bowl style rounds and allows two users/teams to compete.

## Features

* 17 Questions sets
* Quiz bowl style inteface allowing users to compete on touch screen or keyboard
* Autocomplete answer recognizer
* Score Keeper
* Custom team names
* Allows user to set rounds played and questions-sets used

## Implementation details

HTML, CSS <support until i.e. 8>, JS <with jQuery>

# Style Guide

**General naming**: All names will be written out, we will not sacrifice readability for brevity (with the excpetion of common accronyms: img, css, pdf, png, etc)  
**HTML ids/classes**: camelCase  
**File names**: All lowercase  
**JS Variables**: camelCase  
**JS Classes**: CamelCase with first letter capitalized  
**JS Functions**: camelCase  

**Comments**
```javascript
// 2 slashes + 1 SPACE + the actual comment text
```

**JS control flow statements**
```javascript
if (){ // one space between control flow and parens to avoid confusion with function; bracket on same line
    
    // 1 space after opening bracket and before closing bracket

}
```

**Indentation**: 4 spaces = 1 tab (DO NOT USE TABS)

# Design Doc

## Pages

* **instructions.html** - has instructions...
* **game.html** - contains actual game, see below for logic flow
* **index.html (splash)** - links to other 2 pages, also form to play (team names, rounds, question sets used) sent by get variables

## game.html logic flow

* Init data (scores, all data containers)
* Load UI (team names, scores, rounds)
* Display throbber to user while decompose question get variable and load (by ajax) those questions
    * the get variable is a binary string (17 0s and 1s), a 0 means that question set isn't going to be used a 1 means it is
* Shuffle questions into deck
* BEGIN GAME LOOP - For however many rounds there are
* New Question In 3, 2, 1...
* Show any image
* Reveal quesion 1 char per 0.2 seconds
     * Constantly listen for button press or key press, if so stop revealing
* begin countdown
* autocomplete user guess (clicking autocomplete will auto fill in field)
* If guess correct give point and begin loop again
    * Otherwise, complete question, then begin turn for other team (20 seconds); team that guessed wrong's key/button presses ignored
* END GAME LOOP
* Display "______ Wins!" or "Tie!"

## Question Sets

* **MICRO**
    * Intro to basic concepts
    * Supply and Demand
    * Elasticity, Price Controls, Taxes, Consumer Surplus
    * Consumer Choice (Marginal Utility)
    * Costs of production
    * PC and Monopolies
    * Oligopolies and Monopolistic Competition
    * Markets for Factors of Production
* **MACRO**
    * Intro, GDP, Unemployment, Inflation
    * AD, AS, LRAS, and Econ Growth
    * Financial Sector: Money, Banking, and the Fed
    * Monetary and Fiscal Policy
    * Phillips curve, loanable funds, and Exchange Rate
* **MISC**
    * Vocab
    * Nobel Prizes
    * Economists
    * Recessions

## Answer Types (For autocomplete)

* Curve shift
* Shift on curve
* Shift of variable on axis
* Directions (Horizontal, vertical)
* Vocab
* Numerical (not autocompleted)