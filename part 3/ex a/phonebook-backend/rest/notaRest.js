const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(express.json()); // para ler JSON no body das requisições

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let notesCollection;

async function startServer() {
  console.log("🚀 Iniciando servidor...");
  try {
    await client.connect();
    const db = client.db("noteApp");
    notesCollection = db.collection("notes");
    console.log("✅ Conectado ao MongoDB noteApp.notes");

    // 📌 GET todos os notes
    app.get('/api/notes', async (req, res) => {
      try {
        const notes = await notesCollection.find({}).toArray();
        res.json(notes);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao buscar notas' });
      }
    });

    // 📌 GET um note por id
    app.get('/api/notes/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const query = ObjectId.isValid(id) ? { _id: new ObjectId(id) } : null;
        if (!query) return res.status(400).json({ error: 'ID inválido' });

        const note = await notesCollection.findOne(query);
        if (note) {
          res.json(note);
        } else {
          res.status(404).json({ error: 'Nota não encontrada' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno' });
      }
    });

    // 📌 POST criar um note
    app.post('/api/notes', async (req, res) => {
      try {
        const newNote = req.body;
        if (!newNote.content) {
          return res.status(400).json({ error: 'Campo "content" é obrigatório' });
        }
        newNote.important = newNote.important ?? false; // default
        const result = await notesCollection.insertOne(newNote);
        res.status(201).json({ _id: result.insertedId, ...newNote });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao criar nota' });
      }
    });

    // 📌 PUT atualizar um note
    app.put('/api/notes/:id', async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'ID inválido' });
        }
        const update = { $set: req.body };
        const result = await notesCollection.updateOne({ _id: new ObjectId(id) }, update);

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: 'Nota não encontrada' });
        }
        res.json({ message: 'Nota atualizada com sucesso' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao atualizar nota' });
      }
    });

    // 📌 DELETE remover um note
    app.delete('/api/notes/:id', async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'ID inválido' });
        }
        const result = await notesCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Nota não encontrada' });
        }
        res.json({ message: 'Nota removida com sucesso' });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro interno ao deletar nota' });
      }
    });

    // inicia servidor só depois da conexão
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err);
    process.exit(1);
  }
}

startServer();
