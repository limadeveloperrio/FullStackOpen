const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config(); 

const uri = process.env.MONGO_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const db = client.db("noteApp");
        const notesCollection = db.collection("notes");

        // --- Criação da collection (só precisa rodar uma vez) ---
        const collections = await db.listCollections({ name: "notes" }).toArray();
        if (collections.length === 0) {
            await db.createCollection("notes");
            console.log("Collection 'notes' criada com sucesso!");
        } else {
            console.log("Collection 'notes' já existe.");
        }

        // --- Inserir uma nota de teste (como new Note(...).save()) ---
        const note = {
            id: "27",
            content: "Só existe uma verdade",
            important: false,
            date: new Date()
        };
        const insertResult = await notesCollection.insertOne(note);
        console.log(`Nota salva com id: ${insertResult.insertedId}`);

        // --- Buscar todas as notas (como Note.find({})) ---
        const result = await notesCollection.find({}).toArray();
        result.forEach(note => {
            console.log(note);
        });

    } catch (err) {
        console.error("Erro:", err);
    } finally {
        await client.close(); // igual ao mongoose.connection.close()
    }
}

run().catch(console.dir);
