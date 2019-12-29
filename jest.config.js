module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: ['js', 'ts', 'vue', 'json'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/components/**/*.vue',
    '<rootDir>/src/models/**/*.ts',
    '<rootDir>/src/pages/**/*.vue',
    '<rootDir>/src/layouts/**/*.vue',
    '<rootDir>/src/repositories/**/*.ts',
    '<rootDir>/src/store/**/*.ts'
  ],
  setupFiles: ['dotenv/config']
}
