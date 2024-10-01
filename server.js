const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/addCompras', (req, res) => {
    const novaCompra = req.body;

    // Caminho absoluto para compras.json
    const filePath = path.join(__dirname, './public/compras.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao ler o arquivo');
        }

        let compras;
        try {
            compras = JSON.parse(data);
        } catch (parseError) {
            console.error('Erro ao processar o arquivo:', parseError);
            return res.status(500).send('Erro ao processar o arquivo');
        }

        compras.push(novaCompra);

        fs.writeFile(filePath, JSON.stringify(compras, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
                return res.status(500).send('Erro ao escrever no arquivo');
            }
            res.status(200).send('Compra adicionada com sucesso!');
        });
    });
});


app.delete('/deleteCompra', (req, res) => {
    console.log('Dados recebidos:', req.body.item);
    const item = req.body.item;

    // Caminho absoluto para compras.json
    const filePath = path.join(__dirname, './public/compras.json');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return res.status(500).send('Erro ao ler o arquivo');
        }

        let compras;
        try {
            compras = JSON.parse(data);
        } catch (parseError) {
            console.error('Erro ao processar o arquivo:', parseError);
            return res.status(500).send('Erro ao processar o arquivo');
        }

        // Encontra o índice do item a ser excluído usando "item"
        const index = compras.findIndex(p => p.item === item);
        if (index === -1) {
            return res.status(404).send('Nenhuma compra encontrada com o item: ' + item);
        }

        // Remove o item da lista
        compras.splice(index, 1);

        fs.writeFile(filePath, JSON.stringify(compras, null, 2), (err) => {
            if (err) {
                console.error('Erro ao escrever no arquivo:', err);
                return res.status(500).send('Erro ao escrever no arquivo');
            }
            res.status(200).send('Compra excluída com sucesso!');
        });
    });
});



// Rota para servir a aplicação principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
