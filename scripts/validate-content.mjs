#!/usr/bin/env node
/**
 * Validates every JSON record under 10-content/ against its matching schema in schemas/,
 * then checks that every cross-link resolves to a record that actually exists.
 *
 * Run: npm run validate
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT_DIR = path.join(ROOT, '10-content');
const SCHEMA_DIR = path.join(ROOT, 'schemas');

/** Content directory -> schema file. */
const DIRS = [
  { dir: '10-tools', schema: 'tool.schema.json', kind: 'tool' },
  { dir: '20-plays', schema: 'play.schema.json', kind: 'play' },
  { dir: '30-experiments', schema: 'experiment.schema.json', kind: 'experiment' },
  { dir: '40-teams', schema: 'team.schema.json', kind: 'team' },
  { dir: '50-outcomes', schema: 'outcome.schema.json', kind: 'outcome' },
  { dir: '60-scorecards', schema: 'scorecard.schema.json', kind: 'scorecard' },
];

/**
 * Templates are validated against their schemas — that guarantee is worth having — but they are
 * excluded from cross-link resolution because their placeholders ("team-id", empty link arrays)
 * intentionally point at nothing.
 */
const TEMPLATE_DIR = '90-templates';
const TEMPLATE_SCHEMAS = {
  'tool.template.json': 'tool.schema.json',
  'play.template.json': 'play.schema.json',
  'experiment.template.json': 'experiment.schema.json',
  'outcome.template.json': 'outcome.schema.json',
  'scorecard.template.json': 'scorecard.schema.json',
};

const errors = [];
const warnings = [];

function rel(p) {
  return path.relative(ROOT, p);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (err) {
    errors.push(`${rel(file)}: not valid JSON — ${err.message}`);
    return null;
  }
}

function listJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(dir, f))
    .sort();
}

// --- schema setup -----------------------------------------------------------
// Schemas $ref common-defs.json by relative path, so it has to be registered under that key.
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv); // `format: "date"` comes from here
ajv.addSchema(readJson(path.join(SCHEMA_DIR, 'common-defs.json')), './common-defs.json');

const validators = {};
for (const name of new Set([...DIRS.map((d) => d.schema), ...Object.values(TEMPLATE_SCHEMAS)])) {
  const schema = readJson(path.join(SCHEMA_DIR, name));
  if (schema) validators[name] = ajv.compile(schema);
}

function validateAgainst(schemaName, file, data) {
  const validate = validators[schemaName];
  if (!validate) {
    errors.push(`${rel(file)}: no compiled schema for ${schemaName}`);
    return false;
  }
  if (validate(data)) return true;
  for (const e of validate.errors ?? []) {
    const at = e.instancePath || '/';
    const allowed = e.params?.allowedValues ? ` (allowed: ${e.params.allowedValues.join(', ')})` : '';
    const extra = e.params?.additionalProperty ? ` '${e.params.additionalProperty}'` : '';
    errors.push(`${rel(file)}: ${at} ${e.message}${extra}${allowed} [${schemaName}]`);
  }
  return false;
}

// --- load and schema-validate -----------------------------------------------
const records = {}; // kind -> Map(id -> { file, data })
for (const { dir, schema, kind } of DIRS) {
  records[kind] = new Map();
  for (const file of listJson(path.join(CONTENT_DIR, dir))) {
    const data = readJson(file);
    if (!data) continue;
    validateAgainst(schema, file, data);
    if (typeof data.id !== 'string') continue;
    if (records[kind].has(data.id)) {
      errors.push(
        `${rel(file)}: duplicate ${kind} id '${data.id}' (also in ${rel(records[kind].get(data.id).file)})`
      );
      continue;
    }
    records[kind].set(data.id, { file, data });
  }
}

for (const file of listJson(path.join(CONTENT_DIR, TEMPLATE_DIR))) {
  const schemaName = TEMPLATE_SCHEMAS[path.basename(file)];
  if (!schemaName) {
    warnings.push(`${rel(file)}: no schema mapped for this template, skipped`);
    continue;
  }
  const data = readJson(file);
  if (data) validateAgainst(schemaName, file, data);
}

// --- referential integrity ---------------------------------------------------
// A dangling cross-link is the most likely real contribution error, so it fails the build.
const LINK_FIELDS = [
  { field: 'linkedTools', target: 'tool' },
  { field: 'linkedPlays', target: 'play' },
  { field: 'linkedExperiments', target: 'experiment' },
  { field: 'linkedScorecards', target: 'scorecard' },
  { field: 'outcomeNotes', target: 'outcome' },
  { field: 'activeExperiments', target: 'experiment' },
];

for (const kind of Object.keys(records)) {
  for (const { file, data } of records[kind].values()) {
    for (const { field, target } of LINK_FIELDS) {
      for (const ref of data[field] ?? []) {
        if (!records[target].has(ref)) {
          errors.push(`${rel(file)}: ${field} references unknown ${target} '${ref}'`);
        }
      }
    }

    // A team can legitimately be named before anyone commits its 40-teams/ record, and the app
    // falls back to the bare slug, so a missing team record is a warning rather than a failure.
    if (kind !== 'team') {
      const teamRefs = [...(data.triedByTeams ?? []), ...(data.team ? [data.team] : [])];
      for (const teamRef of new Set(teamRefs)) {
        if (!records.team.has(teamRef)) {
          warnings.push(
            `${rel(file)}: references team '${teamRef}' with no record in 10-content/40-teams/`
          );
        }
      }
    }
  }
}

// --- report ------------------------------------------------------------------
const counts = Object.entries(records)
  .map(([kind, m]) => `${m.size} ${kind}${m.size === 1 ? '' : 's'}`)
  .join(', ');

if (warnings.length) {
  console.warn(`\n${warnings.length} warning${warnings.length === 1 ? '' : 's'}:`);
  for (const w of warnings) console.warn(`  ! ${w}`);
}

if (errors.length) {
  console.error(`\n${errors.length} validation error${errors.length === 1 ? '' : 's'}:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log(`\n✓ Content valid — ${counts}. All cross-links resolve.\n`);
