# README

Example query:

```grpc
{
  "q_range": {
    "min": 0.01,
    "max": 9.0,
    "step": 0.01
  },
  "sample": {
    "concentration_solute_molar": 0.005,
    "excited": {
      "type": "STRUCTURE_FILE",
      "name": "excited",
      "filename": "excited.xyz",
      "contents": "${[ fs.readFile(path=b64'L2hvbWUvcm9zY2FyL3dvcmsvZ2l0LnhmZWwuZXUvc2ltdWxhdGlvbi9kZWJ5ZS1kaWZmZXJlbmNlLXNjYXR0ZXJpbmctYXBwL2luaXRpYWwtZGV2L3N0YXRpYy9kYXRhL21vbGVjdWxlcy9BdTJMMi1UMF9FUy54eXo', encoding='base64') ]}"
    },
    "ground": {
      "type": "STRUCTURE_FILE",
      "name": "ground",
      "filename": "ground.xyz",
      "contents": "${[ fs.readFile(path=b64'L2hvbWUvcm9zY2FyL3dvcmsvZ2l0LnhmZWwuZXUvc2ltdWxhdGlvbi9kZWJ5ZS1kaWZmZXJlbmNlLXNjYXR0ZXJpbmctYXBwL2luaXRpYWwtZGV2L3N0YXRpYy9kYXRhL21vbGVjdWxlcy9BdTJMMi1TMF9HUy54eXo', encoding='base64') ]}"
    },
    "solvent": {
      "type": "SOLVENT_FILE",
      "name": "acetonitrile",
      "filename": "dsdt.txt",
      "contents": "${[ fs.readFile(path=b64'L2hvbWUvcm9zY2FyL3dvcmsvZ2l0LnhmZWwuZXUvc2ltdWxhdGlvbi9kZWJ5ZS1kaWZmZXJlbmNlLXNjYXR0ZXJpbmctYXBwL2luaXRpYWwtZGV2L3N0YXRpYy9kYXRhL3NvbHZlbnRzL01lT0gudHh0', encoding='base64') ]}"
    }
  },
  "pump": {
    "photon_energy_ev": 4.0,
    "excited_state_fraction": 0.5,
    "excited_state_energy_ev": 2.0
  }
}
```
