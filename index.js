const express = require('express');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

// Initialize Express App
const app = express();

// Custom HTML template engine
app.engine('html', async (filePath, options, callback) => {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const rendered = content.replace(/<%-(.*?)%>/g, (_, p1) => options[p1.trim()]);
        callback(null, rendered);
    } catch (err) {
        callback(err);
    }
});
app.set('views', './views');
app.set('view engine', 'html');

// Initialize Express configurations
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'src', 'css')));
app.use('/js', express.static(path.join(__dirname, 'src', 'js')));
app.use('/templates', express.static(path.join(__dirname, 'assets', 'templates')));
app.use('/images', express.static(path.join(__dirname, 'assets', 'images')));

// Render index.html
app.get('/', async (req, res) => {
    try {
        const header = await fs.readFile(path.join(__dirname, 'assets', 'templates', 'header.html'), 'utf8');
        const footer = await fs.readFile(path.join(__dirname, 'assets', 'templates', 'footer.html'), 'utf8');
        res.render('index', { header, footer });
    } catch (err) {
        res.status(500).send('Error rendering index.html');
    }
});

// Route for zybTrackerStatisticsAction
app.get('/hybridaction/zybTrackerStatisticsAction', (req, res) => {
    res.json({ message: 'zybTrackerStatisticsAction endpoint success'});
});

// Page not found middleware
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'assets', 'templates', '404.html'));
});

// Start the Express App
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
}).on('error', (err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});

module.export = app;