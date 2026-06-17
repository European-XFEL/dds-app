import { loadPyodide } from 'pyodide';

const pyodideReady = (async () => {
  const pyodide = await loadPyodide();

  await Promise.all([
    pyodide.loadPackage('micropip'),
    pyodide.loadPackage('sqlite3'),
  ]);
  const micropip = pyodide.pyimport('micropip');
  await micropip.install('thermo');
  return pyodide;
})();

/**
 * Looks up thermodynamic properties for a chemical by name via the `thermo`
 * Python package running in Pyodide.
 *
 * @returns A tuple `[rhom, Cpm]`:
 *   - `rhom` — molar density in mol/m³
 *   - `Cpm`  — molar heat capacity in J/mol/K
 */
export async function queryChemicalPyodide(
  name: string,
): Promise<[number, number]> {
  const pyodide = await pyodideReady;
  const res = await pyodide.runPython(`
    import thermo.chemical
    chem = thermo.chemical.Chemical('${name}')

    (chem.rhom, chem.Cpm)
    `);

  return res.toJs();
}
