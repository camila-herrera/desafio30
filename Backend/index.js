import express from "express";
import { writeFile, readFile } from "node:fs/promises";
import bodyParser from "body-parser";
import { nanoid } from "nanoid";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());


const getCanciones = async () => {
  try {
    const fsResponse = await readFile("canciones.json", "utf-8");
    return JSON.parse(fsResponse); } 
    catch (error) {return []; }};

app.listen(5000, () => {console.log("Servidor corriendo en http://localhost:5000");});

app.get("/canciones", async (req, res) => {
  const canciones = await getCanciones();
  res.json(canciones);});

app.get("/canciones/:id", async (req, res) => {
  const id = req.params.id;
  const canciones = await getCanciones();
  const cancion = canciones.find((c) => c.id === id);

  if (!cancion) {
    return res.status(404).json({ message: "Canción no encontrada" });}res.json(cancion);});

app.post("/canciones", async (req, res) => {
  const { titulo, artista, tono } = req.body;

  if (!titulo || !artista || !tono) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  const nuevaCancion = {
    id: nanoid(),
    titulo,
    artista,
    tono,
  };

  let canciones = await getCanciones();
  canciones.push(nuevaCancion);
  await writeFile("canciones.json", JSON.stringify(canciones, null, 2));

  res.status(201).json(nuevaCancion);
});

app.put("/canciones/:id", async (req, res) => {
  const id = req.params.id;
  const { titulo, artista, tono } = req.body;

  let canciones = await getCanciones();
  const index = canciones.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Canción no encontrada" });  }
  canciones[index] = { id, titulo, artista, tono };

  await writeFile("canciones.json", JSON.stringify(canciones, null, 2));
  res.json(canciones[index]);
});

app.delete("/canciones/:id", async (req, res) => {
  const id = req.params.id;

  let canciones = await getCanciones();
  const index = canciones.findIndex((c) => c.id === id);

  if (index === -1) {return res.status(404).json({ message: "Canción no encontrada" });}

  canciones.splice(index, 1);
  await writeFile("canciones.json", JSON.stringify(canciones, null, 2));

  res.status(204).send();});


