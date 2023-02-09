const path = require('path')
const fs = require('fs-extra')
const semver = require('semver')

const baseMigrationPath = path.join(WIKI.SERVERPATH, (WIKI.config.db.type !== 'sqlite') ? 'db/migrations' : 'db/migrations-sqlite')
const deelMigrationPath = path.join(WIKI.SERVERPATH, 'db/deel-migrations')

/* global WIKI */

module.exports = {
  /**
   * Gets the migration names
   * @returns Promise<string[]>
   */
  async getMigrations() {
    const migrationFiles = await fs.readdir(baseMigrationPath)
    const versionMigrations = migrationFiles.map(m => m.replace('.js', '')).sort(semver.compare).map(m => ({
      file: m,
      directory: baseMigrationPath
    }))

    const deelMigrationFiles = await fs.readdir(deelMigrationPath)
    const deelMigrations = deelMigrationFiles.filter((m) => !m.startsWith('_dummy')).map(m => m.replace('.js', '')).sort().map(m => ({
      file: m,
      directory: deelMigrationPath
    }))

    return [...versionMigrations, ...deelMigrations]
  },

  getMigrationName(migration) {
    return migration.file.indexOf('.js') >= 0 ? migration.file : `${migration.file}.js`
  },

  getMigration(migration) {
    return require(path.join(migration.directory, migration.file))
  }
}
