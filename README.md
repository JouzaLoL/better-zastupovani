# better-zastupovani 📆👨‍🏫
![travis](https://api.travis-ci.org/JouzaLoL/better-zastupovani.svg)
[![Maintainability](https://api.codeclimate.com/v1/badges/b43ae628ba7680808cfc/maintainability)](https://codeclimate.com/github/JouzaLoL/better-zastupovani/maintainability)
### [Official live version](https://jouzalol.github.com/better-zastupovani)

## License notice

This work is licensed under CC-BY-NC-ND with the following additional limitations:

Contribution purposes = contributing to this project.

- You may not copy this software or its parts for other than contribution purposes.
- You may not use this software or its parts for any other purpose than reference and learning.
- If you wish to contribute to the project, you may run a development version of the project, you may not, however, use this development version for purposes other than development and contribution to this project.
- Failure to comply with the above terms will result in legal action.
- The owner of the project reserves the right to change the license terms at any moment.

## Building
```bash
npm install
npm run build
```

Output will be in `dist` folder

## Developing

Launch a webpack-dev-server
```bash
npm install
npm run dev
```

## Testing
 see package.json

## Goal
Provide a friendly and useful interface for anyone wanting to learn about the current changes in schedule, regardless of viewing environment. (mobile and desktop)

## Compatibility
Supports any modern browser - Chrome, Firefox, Safari and even IE11

Web APIs:
- Using:
	- fetch
	- ES6 Array.prototype.includes
	- Promises
- Planned
	- TextDecoder (when Edge supports it)
	- Notifications
	- WebWorkers
	- Background Sync


## Description

Better Zastupovani is an open-source attempt to enhance the current Zastupovani at [gytool](http://suplovani.gytool.cz)

The current software in use suffers from many flaws (and is horribly outdated), which Better Zastupovani tries to correct.

The data used in Better Zastupovani is pulled directly from the old system.