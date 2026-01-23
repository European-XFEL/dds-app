import solvents_data from "$data/solvents.json" with { type: "json" };
import fs from "node:fs/promises";
import Papa from "papaparse";
import * as path from "node:path";

import { molecules, solvents } from "./schema.ts";
import { type DB, db } from "./index.ts";
import process from "node:process";

/**
 * Bootstrap the database with initial molecule and solvent data from files.
 * Uses onConflictDoNothing to safely handle duplicate entries.
 */
export async function bootstrap(
  molecules_dir = "./src/data/molecules",
  solvents_dir = "./src/data/solvents",
) {
  // Run molecule and solvent seeding in parallel
  await Promise.all([
    seedMolecules(db, molecules_dir),
    seedSolvents(db, solvents_dir),
  ]);
}

/**
 * Seed molecules from .xyz files in the specified directory.
 * Each file is stored in the files table and linked to a molecule entry.
 */
async function seedMolecules(db: DB, directory: string) {
  const files = await fs.readdir(directory);
  const xyzFiles = files.filter((file) => file.endsWith(".xyz"));

  // Read all files in parallel
  const moleculeData = await Promise.all(
    xyzFiles.map(async (filename) => {
      const filePath = path.join(directory, filename);
      const contents = await fs.readFile(filePath, "utf-8");
      const name = path.basename(filename, ".xyz");
      return { name, filename, contents };
    }),
  );

  // Insert all molecules in parallel
  await Promise.all(
    moleculeData.map(async ({ name, filename, contents }) => {
      console.log(`Seeding molecule: ${name} from file: ${filename}`);
      await db
        .insert(molecules)
        .values({ name, filename, contents })
        .onConflictDoNothing({ target: molecules.name });
    }),
  );
}

type SolventDifferentials = {
  Q: number;
  dSdT: number;
  dSdRho: number;
};

const solvent_name_map: { [key: string]: string } = {
  CCl4: "carbon tetrachloride",
  CH2Cl2: "dichloromethane",
  CHCl3: "chloroform",
  Cyclohexane: "cyclohexane",
  EtOH: "ethanol",
  "KMnO4-H2O": "potassium permanganate",
  MeOH: "methanol",
  MeCN: "acetonitrile",
};

/**
 * Seed solvents from .txt files in the specified directory.
 * Only non-error files are processed (files ending in -error.txt are skipped).
 */
async function seedSolvents(db: DB, directory: string) {
  const files = await fs.readdir(directory);
  const solventFiles = files.filter(
    (file) => file.endsWith(".txt") && !file.endsWith("-error.txt"),
  );

  // Read all files and start chemical queries in parallel
  const solventDataPromises = solventFiles.map(async (filename) => {
    const filePath = path.join(directory, filename);
    const contents = await fs.readFile(filePath, "utf-8");
    const fileName = path.parse(filename).name;
    const name = solvent_name_map[fileName] || fileName;

    let rhom = undefined;
    let cpm = undefined;

    const contentsCsv = "Q\tdSdT\tdSdRho\n" + contents.replaceAll(/#.*\n/g, "");
    const parsed = Papa.parse<SolventDifferentials>(contentsCsv, {
      delimiter: "\t",
      dynamicTyping: false,
      header: true,
      skipEmptyLines: true,
    });

    const { data } = parsed;

    const q = new Float64Array(data.map((row) => row.Q));

    const qMin = Math.min(...q);
    const qMax = Math.max(...q);
    const qSteps = q.map((
      val,
      idx,
      arr,
    ) => (idx === 0 ? 0 : val - arr[idx - 1])).slice(1);
    const qStep = Math.min(...qSteps); // Check if the solvent is in the predefined solvents_data, if so, use that data directly

    const saved_solvent_data = solvents_data.find((solvent) =>
      solvent.filename === filename
    );
    if (saved_solvent_data) {
      rhom = parseFloat(saved_solvent_data.rhom);
      cpm = parseFloat(saved_solvent_data.cpm);
    } else {
      const queryChemicalPyodide = await import("../thermo.ts").then(
        (mod) => mod.queryChemicalPyodide,
      );
      const chemPromise = queryChemicalPyodide(name);
      [rhom, cpm] = await chemPromise;
    }

    return {
      name,
      filename,
      contents,
      rhom: rhom,
      cpm: cpm,
      qMin: qMin,
      qMax: qMax,
      qStep: qStep,
    };
  });

  // Wait for all file processing to complete
  const solventData = await Promise.all(solventDataPromises);

  // Insert all solvents in parallel
  await Promise.all(
    solventData.map(async (values) => {
      console.log(
        `Seeding solvent: ${values.name} with rhom: ${values.rhom}, cpm: ${values.cpm}, q: [${values.qMin}, ${values.qMax}] step: ${values.qStep}`,
      );

      await db
        .insert(solvents)
        .values(values)
        .onConflictDoUpdate({ target: solvents.name, set: values });
    }),
  );
}

// Run bootstrap when executed directly
bootstrap()
  .then(() => {
    console.log("Database seeded successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
