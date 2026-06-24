// Loads the compiled dataset JSON and validates it once so the rest of the app can trust it.
import datasetJson from './dataset.json'
import { DatasetSchema, type Dataset } from './schema'

// Parsed once at module load; throws early if the generated JSON drifts.
export const dataset: Dataset = DatasetSchema.parse(datasetJson)
