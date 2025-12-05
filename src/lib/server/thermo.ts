import { loadPyodide } from 'pyodide';

const pyodideReady = (async () => {
  const pyodide = await loadPyodide();

  await Promise.all([pyodide.loadPackage('micropip'), pyodide.loadPackage('sqlite3')]);
  const micropip = pyodide.pyimport('micropip');
  await micropip.install('thermo');
  return pyodide;
})();

export async function queryChemicalPyodide(name: string): Promise<[number, number]> {
  const pyodide = await pyodideReady;
  const res = await pyodide.runPython(`
    import thermo.chemical
    chem = thermo.chemical.Chemical('${name}')

    (chem.rhom, chem.Cpm)
    `);

  return res.toJs();
}
