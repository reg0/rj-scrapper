module.exports = {
  preset: 'jest-puppeteer',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	transform: {
		"^.+\\.ts?$": "ts-jest"
	},
};